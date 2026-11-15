// Web Worker para embeddings semánticos reales en el navegador (Transformers.js + IndexedDB)
const TRANSFORMERS_CDN = "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.4.1/dist/transformers.min.js";
const MODEL_ID = "Xenova/paraphrase-multilingual-MiniLM-L12-v2";
const DB_NAME = "dc-wiki-ai-vectors-v1";
const STORE_META = "meta";
const STORE_VECTORS = "vectors";

let extractor = null;
let loadingPromise = null;
let indexHash = "";
const itemsMap = new Map();
const vectorsMap = new Map(); // id -> Float32Array
let warmupRunning = false;
let latestRequestId = 0;

function post(msg) {
    self.postMessage(msg);
}

function openDb() {
    return new Promise((resolve, reject) => {
        if (typeof indexedDB === "undefined") {
            reject(new Error("IndexedDB no disponible"));
            return;
        }
        const req = indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = () => {
            const db = req.result;
            if (!db.objectStoreNames.contains(STORE_META)) db.createObjectStore(STORE_META);
            if (!db.objectStoreNames.contains(STORE_VECTORS)) db.createObjectStore(STORE_VECTORS);
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error || new Error("Error abriendo IndexedDB"));
    });
}

async function loadCache(hash) {
    try {
        const db = await openDb();
        const savedHash = await new Promise((res) => {
            const tx = db.transaction(STORE_META, "readonly");
            const r = tx.objectStore(STORE_META).get("hash");
            r.onsuccess = () => res(r.result || "");
            r.onerror = () => res("");
        });
        if (savedHash !== hash) {
            await new Promise((res) => {
                const tx = db.transaction([STORE_META, STORE_VECTORS], "readwrite");
                tx.objectStore(STORE_VECTORS).clear();
                tx.objectStore(STORE_META).put(hash, "hash");
                tx.oncomplete = () => res();
                tx.onerror = () => res();
            });
            db.close();
            return;
        }
        await new Promise((res) => {
            const tx = db.transaction(STORE_VECTORS, "readonly");
            const store = tx.objectStore(STORE_VECTORS);
            const cur = store.openCursor();
            cur.onsuccess = () => {
                const cursor = cur.result;
                if (!cursor) {
                    res();
                    return;
                }
                if (itemsMap.has(cursor.key) && cursor.value) {
                    vectorsMap.set(cursor.key, new Float32Array(cursor.value));
                }
                cursor.continue();
            };
            cur.onerror = () => res();
        });
        db.close();
    } catch {
        // Sin cache persistente: mantener vectores en RAM
    }
}

async function persistVectors(entries) {
    if (!entries.length) return;
    try {
        const db = await openDb();
        await new Promise((res) => {
            const tx = db.transaction(STORE_VECTORS, "readwrite");
            const store = tx.objectStore(STORE_VECTORS);
            for (const [id, vec] of entries) {
                store.put(vec.buffer.slice(0), id);
            }
            tx.oncomplete = () => res();
            tx.onerror = () => res();
        });
        db.close();
    } catch {
        // Ignorar fallo de cuota/IndexedDB
    }
}

async function ensureExtractor() {
    if (extractor) return extractor;
    if (loadingPromise) return loadingPromise;

    loadingPromise = (async () => {
        post({ type: "STATUS", state: "loading", progress: 5, message: "Cargando motor IA..." });
        const mod = await import(TRANSFORMERS_CDN);
        const { pipeline, env } = mod;
        env.allowLocalModels = false;
        env.useBrowserCache = true;

        let device = "wasm";
        try {
            if (self.navigator && self.navigator.gpu) {
                const adapter = await self.navigator.gpu.requestAdapter();
                if (adapter) device = "webgpu";
            }
        } catch {
            device = "wasm";
        }

        const progressFiles = new Map();
        const progressCallback = (ev) => {
            if (!ev || ev.status !== "progress") return;
            progressFiles.set(ev.file || "model", ev.progress || 0);
            let sum = 0;
            for (const val of progressFiles.values()) sum += val;
            const avg = Math.min(99, Math.round(sum / Math.max(1, progressFiles.size)));
            post({ type: "STATUS", state: "loading", progress: avg, message: `Descargando modelo IA (${avg}%)...` });
        };

        try {
            extractor = await pipeline("feature-extraction", MODEL_ID, {
                dtype: "q8",
                device,
                progress_callback: progressCallback,
            });
        } catch {
            extractor = await pipeline("feature-extraction", MODEL_ID, {
                dtype: "q8",
                device: "wasm",
                progress_callback: progressCallback,
            });
            device = "wasm";
        }

        post({
            type: "STATUS",
            state: "ready",
            device,
            cached: vectorsMap.size,
            total: itemsMap.size,
            message: `IA Neural lista (${device.toUpperCase()})`,
        });
        return extractor;
    })().catch((err) => {
        loadingPromise = null;
        post({
            type: "STATUS",
            state: "error",
            message: err && err.message ? err.message : "No se pudo inicializar el modelo IA",
        });
        throw err;
    });

    return loadingPromise;
}

async function embedBatch(texts) {
    const model = await ensureExtractor();
    const out = await model(texts, { pooling: "mean", normalize: true });
    const dim = out.dims[out.dims.length - 1];
    const data = out.data;
    const result = [];
    for (let i = 0; i < texts.length; i++) {
        result.push(new Float32Array(data.slice(i * dim, (i + 1) * dim)));
    }
    return result;
}

function dot(a, b) {
    let s = 0;
    const len = a.length;
    for (let i = 0; i < len; i++) s += a[i] * b[i];
    return s;
}

async function embedMissingIds(ids) {
    const missing = ids.filter((id) => itemsMap.has(id) && !vectorsMap.has(id));
    if (!missing.length) return;
    const batchSize = 12;
    const toPersist = [];
    for (let i = 0; i < missing.length; i += batchSize) {
        const chunkIds = missing.slice(i, i + batchSize);
        const texts = chunkIds.map((id) => itemsMap.get(id));
        const vecs = await embedBatch(texts);
        for (let j = 0; j < chunkIds.length; j++) {
            vectorsMap.set(chunkIds[j], vecs[j]);
            toPersist.push([chunkIds[j], vecs[j]]);
        }
    }
    await persistVectors(toPersist);
}

async function runWarmup() {
    if (warmupRunning) return;
    warmupRunning = true;
    try {
        await ensureExtractor();
        const allIds = Array.from(itemsMap.keys());
        const batchSize = 10;
        for (let i = 0; i < allIds.length; i += batchSize) {
            const pending = [];
            for (let j = i; j < Math.min(allIds.length, i + batchSize); j++) {
                const id = allIds[j];
                if (!vectorsMap.has(id)) pending.push(id);
            }
            if (pending.length) {
                const texts = pending.map((id) => itemsMap.get(id));
                const vecs = await embedBatch(texts);
                const toPersist = [];
                for (let k = 0; k < pending.length; k++) {
                    vectorsMap.set(pending[k], vecs[k]);
                    toPersist.push([pending[k], vecs[k]]);
                }
                await persistVectors(toPersist);
                post({
                    type: "WARMUP_PROGRESS",
                    cached: vectorsMap.size,
                    total: itemsMap.size,
                });
                await new Promise((r) => setTimeout(r, 15));
            }
        }
        post({
            type: "STATUS",
            state: "ready",
            cached: vectorsMap.size,
            total: itemsMap.size,
            message: "IA Neural completa (100% indexado)",
        });
    } catch {
        // Silencioso: fallback híbrido local ya cubre la búsqueda
    } finally {
        warmupRunning = false;
    }
}

self.onmessage = async (event) => {
    const msg = event.data || {};

    if (msg.type === "INIT") {
        indexHash = msg.hash || "";
        itemsMap.clear();
        vectorsMap.clear();
        for (const it of msg.items || []) {
            itemsMap.set(it.id, it.text);
        }
        await loadCache(indexHash);
        post({
            type: "CACHE_READY",
            cached: vectorsMap.size,
            total: itemsMap.size,
        });
        if (msg.autoWarmup) {
            runWarmup();
        }
        return;
    }

    if (msg.type === "WARMUP") {
        runWarmup();
        return;
    }

    if (msg.type === "SEARCH") {
        const { requestId, query, candidateIds } = msg;
        latestRequestId = requestId;
        try {
            await ensureExtractor();
            if (requestId !== latestRequestId) return;

            const [qVec] = await embedBatch([query]);
            if (requestId !== latestRequestId) return;

            const topIds = Array.isArray(candidateIds) ? candidateIds.slice(0, 32) : [];
            await embedMissingIds(topIds);
            if (requestId !== latestRequestId) return;

            const scores = [];
            for (const [id, vec] of vectorsMap.entries()) {
                const sim = dot(qVec, vec);
                if (sim > 0.18) {
                    scores.push([id, sim]);
                }
            }
            scores.sort((a, b) => b[1] - a[1]);

            post({
                type: "SCORES",
                requestId,
                scores: scores.slice(0, 40),
                cached: vectorsMap.size,
                total: itemsMap.size,
            });
        } catch (err) {
            post({
                type: "SEARCH_ERROR",
                requestId,
                message: err && err.message ? err.message : "Error de inferencia IA",
            });
        }
    }
};
