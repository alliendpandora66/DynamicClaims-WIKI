/* ==========================================================================
   DynamicClaims Wiki — Buscador Híbrido Potenciado por IA + UX Engine
   ========================================================================== */

function escapeHtml(str) {
    return String(str || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

/* ---------------- Syntax Highlighting & Inline Badges ---------------- */

function detectLanguage(raw) {
    const trimmed = raw.trim();
    if (/^<\?xml|^<dependency>|^<dependencies>|^<project/m.test(trimmed)) {
        return { id: "xml", label: "XML / Maven" };
    }
    if (/\b(package|import\s+com\.|import\s+org\.|import\s+java\.|@EventHandler|@Override|UltraAPI|UltraGameplay|CompletableFuture|public\s+void|public\s+class|Bukkit\.)\b/.test(trimmed)) {
        return { id: "java", label: "Java (Paper / Spigot API)" };
    }
    if (/\b(Script\.setName|DynamicClaimsAPI\.onEvent|DynamicClaimsAPI\.registerCommand|getScriptDatabase|function\s*\(|const\s+\w+\s*=|var\s+\w+\s*=)/.test(trimmed)) {
        return { id: "js", label: "JavaScript (GraalJS)" };
    }
    if (/^[a-zA-Z0-9_.*'-]+\s*:/m.test(trimmed)) {
        return { id: "yaml", label: "Configuración YAML" };
    }
    return { id: "cmd", label: "Código / Comando" };
}

function highlightYaml(raw) {
    return raw.split("\n").map(line => {
        if (/^\s*#/.test(line)) {
            return `<span class="tok-com">${escapeHtml(line)}</span>`;
        }
        let codePart = line;
        let commentPart = "";
        let inSingle = false;
        let inDouble = false;
        for (let i = 0; i < line.length; i++) {
            const ch = line[i];
            if (ch === "'" && !inDouble) inSingle = !inSingle;
            else if (ch === '"' && !inSingle) inDouble = !inDouble;
            else if (ch === "#" && !inSingle && !inDouble && (i === 0 || /\s/.test(line[i - 1]))) {
                codePart = line.slice(0, i);
                commentPart = line.slice(i);
                break;
            }
        }
        let formatted = "";
        const keyMatch = codePart.match(/^(\s*(?:-\s+)?)([a-zA-Z0-9_.*'-]+)(\s*:\s*)(.*)$/);
        if (keyMatch) {
            const [, prefix, key, colon, val] = keyMatch;
            const isRootSection = prefix.length === 0 && val.trim() === "";
            const keyClass = isRootSection ? "tok-sec" : "tok-key";
            const prefixHtml = prefix.includes("-")
                ? escapeHtml(prefix).replace("-", '<span class="tok-op">-</span>')
                : escapeHtml(prefix);
            formatted = `${prefixHtml}<span class="${keyClass}">${escapeHtml(key)}</span><span class="tok-op">${escapeHtml(colon)}</span>${highlightYamlValue(val)}`;
        } else {
            const listMatch = codePart.match(/^(\s*-\s+)(.*)$/);
            if (listMatch) {
                const prefixHtml = escapeHtml(listMatch[1]).replace("-", '<span class="tok-op">-</span>');
                formatted = `${prefixHtml}${highlightYamlValue(listMatch[2])}`;
            } else {
                formatted = escapeHtml(codePart);
            }
        }
        if (commentPart) {
            formatted += `<span class="tok-com">${escapeHtml(commentPart)}</span>`;
        }
        return formatted;
    }).join("\n");
}

function highlightYamlValue(val) {
    const trimmed = val.trim();
    if (!trimmed) return escapeHtml(val);
    if (trimmed === "true" || trimmed === "yes" || trimmed === "on") {
        return val.replace(trimmed, `<span class="tok-bool">${escapeHtml(trimmed)}</span>`);
    }
    if (trimmed === "false" || trimmed === "no" || trimmed === "off" || trimmed === "null") {
        return val.replace(trimmed, `<span class="tok-bfal">${escapeHtml(trimmed)}</span>`);
    }
    if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
        return val.replace(trimmed, `<span class="tok-num">${escapeHtml(trimmed)}</span>`);
    }
    if (trimmed === "[]" || trimmed === "{}") {
        return val.replace(trimmed, `<span class="tok-op">${escapeHtml(trimmed)}</span>`);
    }
    if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
        return `<span class="tok-str">${escapeHtml(val)}</span>`;
    }
    if (/^[A-Z0-9_]+$/.test(trimmed)) {
        return val.replace(trimmed, `<span class="tok-const">${escapeHtml(trimmed)}</span>`);
    }
    return `<span class="tok-str">${escapeHtml(val)}</span>`;
}

function highlightXml(raw) {
    return escapeHtml(raw).replace(
        /(&lt;\/?)([a-zA-Z0-9_:-]+)(.*?)(&gt;)/g,
        (_, open, tag, attrs, close) =>
            `<span class="tok-op">${open}</span><span class="tok-key">${tag}</span>${attrs}<span class="tok-op">${close}</span>`
    );
}

function highlightJavaOrJs(raw) {
    const tokenRegex = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|@[A-Za-z_][A-Za-z0-9_]*|\b(?:package|import|public|private|protected|class|interface|record|enum|extends|implements|return|if|else|for|while|switch|case|break|continue|new|void|boolean|int|long|double|float|var|const|let|function|final|static|default|try|catch|throw|throws|instanceof|this|super)\b|\b(?:true|false|null)\b|\b(?:UltraAPI|UltraGameplay|UltraLayer|UltraData|DynamicClaimsAPI|Script|ScriptDatabase|AtlasDrawing|LayerOptions|RuleOptions|RuleScope|CustomRule|CustomRuleChangeEvent|PlayerStatus|RegionStatus|NationStatus|DiplomacyStatus|AllianceStatus|WarStatus|PvpDecision|PvpReason|Relation|ClaimPreview|ClaimResult|ClaimCell|ServerStatus|Position|ChunkPosition|Bounds|Marker|Polyline|Polygon|Circle|Label|Point|Style|Info|Icon|UUID|String|List|Set|Map|Collection|CompletableFuture|Player|OfflinePlayer|Location|World|Chunk|Block|Material|ItemStack|Entity|CommandSender|Plugin|Bukkit|Event|EventHandler|Listener|LocalDate|RegionClaimEvent|RegionUnclaimEvent|NationCreateEvent|WarStartEvent|WarEndEvent|TechnologyResearchedEvent|WarGoal)\b|\b[A-Z][A-Z0-9_]{2,}\b|\b\d+(?:\.\d+)?[Lfd]?\b|\b[a-zA-Z_][a-zA-Z0-9_]*(?=\s*\())/g;
    let result = "";
    let lastIndex = 0;
    let match;
    while ((match = tokenRegex.exec(raw)) !== null) {
        if (match.index > lastIndex) result += escapeHtml(raw.slice(lastIndex, match.index));
        const tok = match[0];
        let cls = "tok-fn";
        if (tok.startsWith("//") || tok.startsWith("/*")) cls = "tok-com";
        else if (tok.startsWith('"') || tok.startsWith("'")) cls = "tok-str";
        else if (tok.startsWith("@")) cls = "tok-ann";
        else if (tok === "true") cls = "tok-bool";
        else if (tok === "false" || tok === "null") cls = "tok-bfal";
        else if (/^\d/.test(tok)) cls = "tok-num";
        else if (/^(package|import|public|private|protected|class|interface|record|enum|extends|implements|return|if|else|for|while|switch|case|break|continue|new|void|boolean|int|long|double|float|var|const|let|function|final|static|default|try|catch|throw|throws|instanceof|this|super)$/.test(tok)) cls = "tok-kw";
        else if (/^[A-Z][A-Z0-9_]{2,}$/.test(tok) && tok !== "UUID") cls = "tok-const";
        else if (/^[A-Z]/.test(tok)) cls = "tok-type";
        result += `<span class="${cls}">${escapeHtml(tok)}</span>`;
        lastIndex = tokenRegex.lastIndex;
    }
    if (lastIndex < raw.length) result += escapeHtml(raw.slice(lastIndex));
    return result;
}

function initSyntaxHighlighting() {
    document.querySelectorAll("pre code").forEach(codeEl => {
        const preEl = codeEl.parentElement;
        if (!preEl || preEl.dataset.highlighted === "true") return;
        preEl.dataset.highlighted = "true";

        const rawText = codeEl.textContent || "";
        const lang = detectLanguage(rawText);
        if (lang.id === "yaml") codeEl.innerHTML = highlightYaml(rawText);
        else if (lang.id === "xml") codeEl.innerHTML = highlightXml(rawText);
        else codeEl.innerHTML = highlightJavaOrJs(rawText);

        const wrapper = document.createElement("div");
        wrapper.className = "code-wrapper";
        const header = document.createElement("div");
        header.className = "code-header";
        const langBadge = document.createElement("span");
        langBadge.className = `code-lang lang-${lang.id}`;
        langBadge.textContent = lang.label;

        const copyBtn = document.createElement("button");
        copyBtn.type = "button";
        copyBtn.className = "copy-btn";
        copyBtn.textContent = "📋 Copiar";
        copyBtn.addEventListener("click", () => {
            copyText(rawText.trim(), copyBtn, "✓ Copiado", "📋 Copiar");
        });

        header.append(langBadge, copyBtn);
        const targetContainer = preEl.parentElement && preEl.parentElement.classList.contains("code-block")
            ? preEl.parentElement : preEl;
        targetContainer.parentNode.insertBefore(wrapper, targetContainer);
        wrapper.append(header, preEl);
        if (targetContainer !== preEl) targetContainer.remove();
    });

    document.querySelectorAll("code").forEach(codeEl => {
        if (codeEl.closest("pre")) return;
        const txt = (codeEl.textContent || "").trim();
        if (txt.startsWith("/dc") || txt.startsWith("/dynamicclaims") || txt.startsWith("!set_chanel")) {
            codeEl.classList.add("inline-cmd");
        } else if (txt.startsWith("%") && txt.endsWith("%")) {
            codeEl.classList.add("inline-papi");
        } else if (txt === "true") {
            codeEl.classList.add("inline-bool-true");
        } else if (txt === "false" || txt === "null") {
            codeEl.classList.add("inline-bool-false");
        } else if (/\.(yml|yaml|json|geojson|js|jar|db|sql)$/i.test(txt)) {
            codeEl.classList.add("inline-file");
        } else if (/^[a-zA-Z0-9_.]+\(.*\)$/.test(txt)) {
            codeEl.classList.add("inline-method");
        }
    });
}

function copyText(text, btn, okLabel = "✓ Copiado", resetLabel = null) {
    const prev = resetLabel || btn?.textContent || "";
    const done = () => {
        if (!btn) return;
        btn.textContent = okLabel;
        btn.classList.add("copied");
        setTimeout(() => {
            btn.textContent = prev;
            btn.classList.remove("copied");
        }, 1600);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(done);
    } else {
        done();
    }
}

/* ---------------- Deterministic Slugs, Anchors, TOC & UX ---------------- */

function slugify(text) {
    const norm = String(text || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    return norm.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "seccion";
}

function initPageEnhancements() {
    const main = document.querySelector("main.main-content");
    const topNav = document.querySelector(".top-nav");
    const sidebar = document.querySelector("aside.sidebar");

    // 1. Mobile sidebar toggle + backdrop
    if (topNav && sidebar) {
        let menuBtn = topNav.querySelector(".menu-toggle");
        if (!menuBtn) {
            menuBtn = document.createElement("button");
            menuBtn.type = "button";
            menuBtn.className = "menu-toggle";
            menuBtn.setAttribute("aria-label", "Abrir menú de navegación");
            menuBtn.setAttribute("aria-expanded", "false");
            menuBtn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;
            topNav.insertBefore(menuBtn, topNav.firstChild);
        }
        const backdrop = document.createElement("div");
        backdrop.className = "sidebar-backdrop";
        document.body.appendChild(backdrop);

        const setMenuOpen = (open) => {
            sidebar.classList.toggle("open", open);
            backdrop.classList.toggle("open", open);
            menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
        };
        menuBtn.addEventListener("click", () => setMenuOpen(!sidebar.classList.contains("open")));
        backdrop.addEventListener("click", () => setMenuOpen(false));
        sidebar.querySelectorAll("a.nav-item").forEach(a => a.addEventListener("click", () => setMenuOpen(false)));
    }

    // 2. Reading progress bar
    const progressBar = document.createElement("div");
    progressBar.className = "reading-progress";
    document.body.appendChild(progressBar);
    const updateProgress = () => {
        const doc = document.documentElement;
        const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
        const pct = Math.min(100, Math.max(0, (window.scrollY / maxScroll) * 100));
        progressBar.style.width = `${pct.toFixed(1)}%`;
    };
    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();

    if (!main) return;

    // 3. Deterministic IDs & hover anchor copy on h2/h3
    const seen = new Map();
    const headings = Array.from(main.querySelectorAll("h2, h3"));
    const tocItems = [];

    headings.forEach(h => {
        const rawText = h.textContent.replace(/#$/, "").trim();
        if (!rawText) return;
        const base = slugify(rawText);
        const count = (seen.get(base) || 0) + 1;
        seen.set(base, count);
        const id = count === 1 ? base : `${base}-${count}`;
        if (!h.id) h.id = id;

        tocItems.push({ id: h.id, text: rawText, level: h.tagName === "H3" ? 3 : 2, el: h });

        if (!h.querySelector(".heading-anchor")) {
            const anchorBtn = document.createElement("a");
            anchorBtn.className = "heading-anchor";
            anchorBtn.href = `#${h.id}`;
            anchorBtn.title = "Copiar enlace a esta sección";
            anchorBtn.textContent = "#";
            anchorBtn.addEventListener("click", (e) => {
                e.preventDefault();
                history.replaceState(null, "", `#${h.id}`);
                const fullUrl = window.location.href;
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(fullUrl).catch(() => {});
                }
                anchorBtn.textContent = "✓";
                setTimeout(() => { anchorBtn.textContent = "#"; }, 1200);
            });
            h.appendChild(anchorBtn);
        }
    });

    // 4. Table of Contents ("En esta página")
    if (tocItems.length >= 2) {
        const tocAside = document.createElement("aside");
        tocAside.className = "toc-panel";
        tocAside.innerHTML = `<div class="toc-title">En esta página</div><nav class="toc-list">${
            tocItems.map(item =>
                `<a href="#${item.id}" class="toc-link level-${item.level}" data-toc-id="${item.id}">${escapeHtml(item.text)}</a>`
            ).join("")
        }</nav>`;
        document.body.appendChild(tocAside);
        document.body.classList.add("has-toc");

        const linksById = new Map();
        tocAside.querySelectorAll(".toc-link").forEach(a => linksById.set(a.dataset.tocId, a));

        let activeId = tocItems[0].id;
        const setActive = (id) => {
            if (!id || !linksById.has(id)) return;
            linksById.forEach(a => a.classList.remove("active"));
            linksById.get(id).classList.add("active");
            activeId = id;
        };
        setActive(activeId);

        if ("IntersectionObserver" in window) {
            const observer = new IntersectionObserver((entries) => {
                const visible = entries.filter(en => en.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
                if (visible.length > 0) setActive(visible[0].target.id);
            }, { rootMargin: "-78px 0px -65% 0px", threshold: 0 });
            tocItems.forEach(it => observer.observe(it.el));
        }
    }

    // 5. Prev / Next page cards derived from sidebar order
    if (sidebar) {
        const navLinks = Array.from(sidebar.querySelectorAll("a.nav-item[href]"));
        const currentPage = window.location.pathname.split("/").pop() || "index.html";
        const idx = navLinks.findIndex(a => a.getAttribute("href") === currentPage);
        if (idx !== -1 && !main.querySelector(".wiki-pager")) {
            const prev = idx > 0 ? navLinks[idx - 1] : null;
            const next = idx < navLinks.length - 1 ? navLinks[idx + 1] : null;
            if (prev || next) {
                const pager = document.createElement("nav");
                pager.className = "wiki-pager";
                pager.setAttribute("aria-label", "Navegación entre páginas");
                pager.innerHTML = `
                    ${prev ? `<a class="pager-card prev" href="${prev.getAttribute("href")}"><span class="pager-dir">&larr; Anterior</span><span class="pager-title">${escapeHtml(prev.textContent.trim())}</span></a>` : `<span></span>`}
                    ${next ? `<a class="pager-card next" href="${next.getAttribute("href")}"><span class="pager-dir">Siguiente &rarr;</span><span class="pager-title">${escapeHtml(next.textContent.trim())}</span></a>` : `<span></span>`}
                `;
                main.appendChild(pager);
            }
        }
    }

    // 6. Deep-link scroll + jump highlight for ?row=... / #anchor
    handleJumpHighlight(main);
    window.addEventListener("hashchange", () => handleJumpHighlight(main));
}

function handleJumpHighlight(main) {
    const params = new URLSearchParams(window.location.search);
    const rowTarget = params.get("row");
    let targetEl = null;

    if (rowTarget) {
        const normTarget = rowTarget.trim().toLowerCase();
        const rows = Array.from(main.querySelectorAll("table tr"));
        targetEl = rows.find(tr => {
            const firstCell = tr.querySelector("td");
            return firstCell && firstCell.textContent.trim().toLowerCase() === normTarget;
        }) || rows.find(tr => tr.textContent.toLowerCase().includes(normTarget));
    }

    if (!targetEl && window.location.hash) {
        const hashId = decodeURIComponent(window.location.hash.slice(1));
        targetEl = document.getElementById(hashId);
    }

    if (targetEl) {
        setTimeout(() => {
            targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
            targetEl.classList.remove("wiki-jump-highlight");
            void targetEl.offsetWidth;
            targetEl.classList.add("wiki-jump-highlight");
            setTimeout(() => targetEl.classList.remove("wiki-jump-highlight"), 2800);
        }, 60);
    }
}

/* ---------------- AI Hybrid Search Engine (BM25 + Fuzzy + Neural) ---------------- */

const STOP_WORDS = new Set([
    "el", "la", "los", "las", "un", "una", "unos", "unas", "de", "del", "al", "a", "en",
    "con", "por", "para", "sin", "sobre", "y", "o", "u", "e", "que", "como", "cual", "se",
    "su", "sus", "mi", "tu", "es", "son", "esta", "este", "esto", "ser", "estar", "hay",
    "the", "and", "or", "for", "with", "how", "what", "when", "from", "into", "of", "to", "in"
]);

const DOMAIN_SYNONYMS = {
    bomba: ["misil", "nuclear", "radiacion", "ojiva", "nuke"],
    nuke: ["misil", "nuclear", "radiacion", "bomba"],
    atomica: ["misil", "nuclear", "radiacion"],
    marcador: ["marcadores", "custommarkers", "pin", "icono", "imagen", "markers"],
    marcadores: ["marcador", "custommarkers", "markers", "pin"],
    pin: ["marcador", "custommarkers", "icono"],
    foto: ["imagen", "custom", "skin", "bandera", "markers"],
    imagen: ["imagenes", "custom", "markers", "bandera", "resourcepack"],
    mapa: ["atlas", "web-map", "dynmap", "squaremap", "tactico"],
    atlas: ["web-map", "mapa", "dynmap", "marcadores"],
    dinero: ["economia", "banco", "divisa", "oro", "moneda", "tienda", "mercado"],
    plata: ["economia", "banco", "divisa", "moneda"],
    moneda: ["divisa", "economia", "oro", "billete"],
    presidente: ["lider", "gobierno", "elecciones", "capital"],
    alcalde: ["dueno", "region", "establecer-inicio"],
    rebelion: ["guerra civil", "oposicion", "descontento", "aprobacion"],
    atacar: ["guerra", "asedio", "conquista", "zona-guerra", "militar"],
    guerra: ["war", "asedio", "conquista", "tregua", "zona-guerra"],
    permiso: ["dynamicclaims", "op", "luckperms", "rango", "permisos"],
    perm: ["permiso", "dynamicclaims", "op"],
    reclamar: ["claim", "chunks", "territorio", "pintar", "editor"],
    liberar: ["unclaim", "chunks", "territorio"],
    virus: ["pandemia", "vacuna", "contagio", "sintomas"],
    enfermedad: ["pandemia", "vacuna", "sintomas"],
    fabrica: ["industria", "edificio", "receta", "produccion"],
    variable: ["placeholder", "placeholderapi", "papi"],
    bandera: ["flags", "banderas", "nacion"],
    discord: ["bot", "webhook", "jda", "canal"],
    script: ["graaljs", "javascript", "scripts"],
    subasta: ["mercado", "auctions", "vender", "comprar"]
};

function normalizeStr(str) {
    return String(str || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
}

function stemToken(tok) {
    if (tok.length <= 4) return tok;
    if (tok.endsWith("ciones")) return tok.slice(0, -6) + "cion";
    if (tok.endsWith("siones")) return tok.slice(0, -6) + "sion";
    if (tok.endsWith("adores")) return tok.slice(0, -4);
    if (tok.endsWith("mente")) return tok.slice(0, -5);
    if (tok.endsWith("es") && tok.length > 5 && !tok.endsWith("iones")) return tok.slice(0, -2);
    if (tok.endsWith("s") && tok.length > 4 && !tok.endsWith("ss")) return tok.slice(0, -1);
    return tok;
}

function tokenize(str, dropStop = true) {
    const cleaned = normalizeStr(str).replace(/[^a-z0-9_.%/-]+/g, " ").trim();
    if (!cleaned) return [];
    const raw = cleaned.split(/\s+/);
    const out = [];
    for (const part of raw) {
        if (!part) continue;
        // Split symbols by dot/slash/underscore as extra tokens for precision matching
        if (part.includes(".") || part.includes("/") || part.includes("_")) {
            out.push(part);
            part.split(/[._/-]+/).forEach(sub => {
                if (sub && (!dropStop || !STOP_WORDS.has(sub))) out.push(stemToken(sub));
            });
        } else if (!dropStop || !STOP_WORDS.has(part)) {
            out.push(stemToken(part));
        }
    }
    return out;
}

function levenshteinBounded(a, b, maxDist) {
    const la = a.length;
    const lb = b.length;
    if (Math.abs(la - lb) > maxDist) return maxDist + 1;
    let prev = new Array(lb + 1);
    let curr = new Array(lb + 1);
    for (let j = 0; j <= lb; j++) prev[j] = j;
    for (let i = 1; i <= la; i++) {
        curr[0] = i;
        let rowMin = curr[0];
        for (let j = 1; j <= lb; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            const v = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
            curr[j] = v;
            if (v < rowMin) rowMin = v;
        }
        if (rowMin > maxDist) return maxDist + 1;
        [prev, curr] = [curr, prev];
    }
    return prev[lb];
}

class WikiHybridSearch {
    constructor(indexData) {
        this.hash = indexData.hash || "";
        this.items = indexData.items || [];
        this.byId = new Map();
        this.postings = new Map(); // term -> Map<docIdx, weightedFreq>
        this.docLengths = new Float32Array(this.items.length);
        this.vocab = [];
        this.avgDocLen = 1;
        this.buildIndex();
    }

    buildIndex() {
        let totalLen = 0;
        for (let i = 0; i < this.items.length; i++) {
            const it = this.items[i];
            this.byId.set(it.id, i);
            it._normTitle = normalizeStr(it.title + " " + it.section);
            it._normBody = normalizeStr(it.content);
            it._normSymbols = normalizeStr([].concat(it.cmds || [], it.perms || [], it.papis || [], it.files || []).join(" "));

            const termMap = new Map();
            const addTerms = (tokens, w) => {
                for (const t of tokens) {
                    termMap.set(t, (termMap.get(t) || 0) + w);
                }
            };
            addTerms(tokenize(it.title), 3.6);
            addTerms(tokenize(it.section), 2.0);
            addTerms(tokenize(it._normSymbols, false), 4.0);
            addTerms(tokenize(it.content), 1.0);

            let docLen = 0;
            for (const [term, tf] of termMap.entries()) {
                docLen += tf;
                let pl = this.postings.get(term);
                if (!pl) {
                    pl = new Map();
                    this.postings.set(term, pl);
                }
                pl.set(i, tf);
            }
            this.docLengths[i] = docLen || 1;
            totalLen += this.docLengths[i];
        }
        this.avgDocLen = Math.max(1, totalLen / Math.max(1, this.items.length));
        this.vocab = Array.from(this.postings.keys()).filter(t => t.length >= 3);
    }

    expandQueryTokens(rawQuery) {
        const baseTokens = tokenize(rawQuery, true);
        const fallbackTokens = baseTokens.length ? baseTokens : tokenize(rawQuery, false);
        const expanded = new Map(); // term -> weight

        for (const tok of fallbackTokens) {
            expanded.set(tok, Math.max(expanded.get(tok) || 0, 1.0));
            const syns = DOMAIN_SYNONYMS[tok];
            if (syns) {
                for (const s of syns) {
                    for (const st of tokenize(s, false)) {
                        if (!expanded.has(st)) expanded.set(st, 0.55);
                    }
                }
            }
            // Prefix & fuzzy fallback when token has >= 4 chars
            if (tok.length >= 4) {
                const maxDist = tok.length >= 7 ? 2 : 1;
                let fuzzyAdded = 0;
                for (const v of this.vocab) {
                    if (v === tok) continue;
                    if (v.startsWith(tok) && v.length <= tok.length + 6) {
                        expanded.set(v, Math.max(expanded.get(v) || 0, 0.72));
                        if (++fuzzyAdded >= 6) break;
                    } else if (Math.abs(v.length - tok.length) <= maxDist && v[0] === tok[0]) {
                        const d = levenshteinBounded(tok, v, maxDist);
                        if (d <= maxDist) {
                            expanded.set(v, Math.max(expanded.get(v) || 0, d === 1 ? 0.65 : 0.42));
                            if (++fuzzyAdded >= 6) break;
                        }
                    }
                }
            }
        }
        return { expanded, rawTokens: fallbackTokens };
    }

    search(query, filterKey = "all", limit = 35) {
        const normQ = normalizeStr(query).trim();
        if (!normQ) return [];
        const { expanded, rawTokens } = this.expandQueryTokens(query);
        const N = this.items.length;
        const k1 = 1.4;
        const b = 0.65;
        const scores = new Float64Array(N);

        for (const [term, qWeight] of expanded.entries()) {
            const pl = this.postings.get(term);
            if (!pl) continue;
            const idf = Math.log(1 + (N - pl.size + 0.5) / (pl.size + 0.5));
            for (const [docIdx, tf] of pl.entries()) {
                const dl = this.docLengths[docIdx];
                const bm = (tf * (k1 + 1)) / (tf + k1 * (1 - b + b * (dl / this.avgDocLen)));
                scores[docIdx] += qWeight * idf * bm;
            }
        }

        const results = [];
        for (let i = 0; i < N; i++) {
            const it = this.items[i];
            if (!matchesFilter(it, filterKey)) continue;
            let s = scores[i];

            // Phrase & symbol prefix boosts
            if (it._normTitle.includes(normQ)) s += 11;
            else if (it._normBody.includes(normQ)) s += 4.5;
            if (it._normSymbols && it._normSymbols.includes(normQ)) s += 13;

            if (s > 0.05) {
                results.push({ item: it, bmScore: s, neuralSim: 0, finalScore: s });
            }
        }

        results.sort((a, b) => b.finalScore - a.finalScore);
        return results.slice(0, limit).map((r, rank) => ({ ...r, bmRank: rank + 1, rawTokens }));
    }

    fuseWithNeural(bmResults, neuralScores, filterKey = "all", limit = 18) {
        const merged = new Map();
        bmResults.forEach((r, idx) => {
            merged.set(r.item.id, {
                item: r.item,
                bmScore: r.bmScore,
                bmRank: idx + 1,
                neuralSim: 0,
                neuralRank: 999,
            });
        });

        let validNeuralRank = 0;
        for (const [id, sim] of neuralScores) {
            const idx = this.byId.get(id);
            if (idx === undefined) continue;
            const item = this.items[idx];
            if (!matchesFilter(item, filterKey)) continue;
            validNeuralRank++;
            let entry = merged.get(id);
            if (!entry) {
                entry = {
                    item,
                    bmScore: 0,
                    bmRank: 999,
                    neuralSim: sim,
                    neuralRank: validNeuralRank,
                };
                merged.set(id, entry);
            } else {
                entry.neuralSim = sim;
                entry.neuralRank = validNeuralRank;
            }
        }

        const kRrf = 35;
        const list = Array.from(merged.values()).map(e => {
            const bmRrf = e.bmRank < 900 ? 1 / (kRrf + e.bmRank) : 0;
            const nnRrf = e.neuralRank < 900 && e.neuralSim >= 0.25 ? (1.25 * e.neuralSim) / (kRrf + e.neuralRank) : 0;
            const exactBonus = e.bmScore >= 14 ? 0.018 : 0;
            return {
                ...e,
                finalScore: bmRrf + nnRrf + exactBonus,
            };
        });

        list.sort((a, b) => b.finalScore - a.finalScore);
        return list.slice(0, limit);
    }
}

function matchesFilter(it, filterKey) {
    if (!filterKey || filterKey === "all") return true;
    if (filterKey === "user") return it.category.startsWith("1.");
    if (filterKey === "staff") return it.category.startsWith("2.");
    if (filterKey === "op") return it.category.startsWith("3.");
    return it.kind === filterKey;
}

/* ---------------- Modal UI + Web Worker Orchestration ---------------- */

const KIND_LABELS = {
    guia: "Guía",
    comando: "Comando",
    permiso: "Permiso",
    placeholder: "Placeholder",
    config: "Config YAML",
    api: "API / Script"
};

const QUICK_SUGGESTIONS = [
    "¿Cómo creo un marcador e imagen custom?",
    "Permisos del Atlas Web y LuckPerms",
    "Cómo declarar guerra y conquistar chunks",
    "/dc admin mapa marcador",
    "Variables PlaceholderAPI de nación",
    "Cómo crear una moneda y el banco"
];

let indexLoadPromise = null;
function ensureSearchIndexLoaded() {
    if (window.WIKI_SEARCH_INDEX) return Promise.resolve(window.WIKI_SEARCH_INDEX);
    if (indexLoadPromise) return indexLoadPromise;
    indexLoadPromise = new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = "search-index.js";
        s.async = true;
        s.onload = () => {
            if (window.WIKI_SEARCH_INDEX) resolve(window.WIKI_SEARCH_INDEX);
            else reject(new Error("Índice no inicializado"));
        };
        s.onerror = () => reject(new Error("No se pudo cargar wiki/search-index.js"));
        document.head.appendChild(s);
    });
    return indexLoadPromise;
}

function highlightSnippet(text, query) {
    const clean = text || "";
    const tokens = Array.from(new Set(tokenize(query, true))).filter(t => t.length >= 2).slice(0, 6);
    if (!tokens.length) return escapeHtml(clean);
    const esc = escapeHtml(clean);
    const pattern = new RegExp(`(${tokens.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
    return esc.replace(pattern, "<mark>$1</mark>");
}

function buildBestSnippet(item, query, maxLen = 220) {
    const body = item.content || "";
    if (body.length <= maxLen) return body;
    const normBody = normalizeStr(body);
    const tokens = tokenize(query, true);
    let bestPos = 0;
    for (const tok of tokens) {
        const pos = normBody.indexOf(tok);
        if (pos !== -1) {
            bestPos = Math.max(0, pos - 60);
            break;
        }
    }
    const slice = body.slice(bestPos, bestPos + maxLen);
    return (bestPos > 0 ? "..." : "") + slice + (bestPos + maxLen < body.length ? "..." : "");
}

function buildTargetHref(item) {
    let href = item.url;
    if (item.rowMatch) {
        href += `?row=${encodeURIComponent(item.rowMatch)}`;
    }
    if (item.anchor) {
        href += `#${item.anchor}`;
    }
    return href;
}

function saveRecentQuery(q) {
    const clean = q.trim();
    if (clean.length < 2) return;
    try {
        const prev = JSON.parse(localStorage.getItem("dc_wiki_recent_searches") || "[]");
        const next = [clean, ...prev.filter(x => x.toLowerCase() !== clean.toLowerCase())].slice(0, 5);
        localStorage.setItem("dc_wiki_recent_searches", JSON.stringify(next));
    } catch { /* ignore */ }
}

function getRecentQueries() {
    try {
        return JSON.parse(localStorage.getItem("dc_wiki_recent_searches") || "[]");
    } catch {
        return [];
    }
}

function initAiSearchModal() {
    const triggerInput = document.getElementById("search-input") || document.getElementById("wiki-search");
    if (!triggerInput) return;

    // Build Command Palette Modal once
    const modal = document.createElement("div");
    modal.id = "ai-search-modal";
    modal.className = "ai-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", "Buscador IA de la Wiki");
    modal.innerHTML = `
        <div class="ai-modal-backdrop"></div>
        <div class="ai-modal-dialog">
            <div class="ai-modal-header">
                <div class="ai-input-wrap">
                    <svg class="ai-search-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <input type="text" id="ai-modal-input" placeholder="Pregunta en lenguaje natural o busca comandos, permisos, YAML..." autocomplete="off" spellcheck="false">
                    <button type="button" id="ai-clear-btn" class="ai-clear-btn" title="Limpiar" hidden>&times;</button>
                </div>
                <div class="ai-status-pill" id="ai-status-pill" title="Motor de búsqueda semántica">
                    <span class="ai-dot"></span><span class="ai-status-text">Iniciando índice...</span>
                </div>
            </div>
            <div class="ai-filter-bar" id="ai-filter-bar">
                <button type="button" class="ai-chip active" data-filter="all">Todo</button>
                <button type="button" class="ai-chip" data-filter="user">Usuario</button>
                <button type="button" class="ai-chip" data-filter="staff">Staff</button>
                <button type="button" class="ai-chip" data-filter="op">Operador</button>
                <button type="button" class="ai-chip" data-filter="comando">Comandos</button>
                <button type="button" class="ai-chip" data-filter="permiso">Permisos</button>
                <button type="button" class="ai-chip" data-filter="placeholder">Placeholders</button>
            </div>
            <div class="ai-modal-body">
                <div class="ai-results-col" id="ai-results-col"></div>
                <div class="ai-preview-col" id="ai-preview-col"></div>
            </div>
            <div class="ai-modal-footer">
                <span><kbd>&uarr;</kbd> <kbd>&darr;</kbd> navegar</span>
                <span><kbd>Enter</kbd> abrir</span>
                <span><kbd>Esc</kbd> cerrar</span>
                <span class="ai-footer-stats" id="ai-footer-stats"></span>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const modalInput = modal.querySelector("#ai-modal-input");
    const clearBtn = modal.querySelector("#ai-clear-btn");
    const statusPill = modal.querySelector("#ai-status-pill");
    const statusText = modal.querySelector(".ai-status-text");
    const filterBar = modal.querySelector("#ai-filter-bar");
    const resultsCol = modal.querySelector("#ai-results-col");
    const previewCol = modal.querySelector("#ai-preview-col");
    const footerStats = modal.querySelector("#ai-footer-stats");

    let engine = null;
    let activeFilter = "all";
    let currentResults = [];
    let selectedIndex = 0;
    let worker = null;
    let workerReady = false;
    let searchReqSeq = 0;
    let latestBmResults = [];

    function setAiStatus(mode, text) {
        statusPill.className = `ai-status-pill mode-${mode}`;
        statusText.textContent = text;
    }

    function initWorkerOnce() {
        if (worker || !engine) return;
        const canUseWorker = window.location.protocol === "http:" || window.location.protocol === "https:";
        if (!canUseWorker || typeof Worker === "undefined") {
            setAiStatus("local", "Híbrido Local (file://)");
            return;
        }
        try {
            worker = new Worker("ai-worker.js", { type: "module" });
        } catch {
            setAiStatus("local", "Híbrido Local");
            return;
        }
        setAiStatus("loading", "Cargando IA Neural...");
        worker.onmessage = (ev) => {
            const msg = ev.data || {};
            if (msg.type === "CACHE_READY") {
                if (msg.cached > 0) {
                    footerStats.textContent = `${engine.items.length} fragmentos · ${msg.cached}/${msg.total} vectores IA`;
                }
            } else if (msg.type === "STATUS") {
                if (msg.state === "loading") setAiStatus("loading", msg.message || "Cargando IA...");
                else if (msg.state === "ready") {
                    workerReady = true;
                    setAiStatus("neural", msg.message || "IA Neural Activa");
                    if (modalInput.value.trim().length >= 2) dispatchWorkerSearch(modalInput.value.trim());
                } else if (msg.state === "error") {
                    setAiStatus("local", "Híbrido Local (sin CDN)");
                }
            } else if (msg.type === "WARMUP_PROGRESS") {
                footerStats.textContent = `${engine.items.length} fragmentos · Indexando IA ${Math.round((msg.cached / Math.max(1, msg.total)) * 100)}%`;
            } else if (msg.type === "SCORES" && msg.requestId === searchReqSeq) {
                workerReady = true;
                const fused = engine.fuseWithNeural(latestBmResults, msg.scores || [], activeFilter, 16);
                const keepId = currentResults[selectedIndex]?.item?.id;
                currentResults = fused;
                const newIdx = keepId ? currentResults.findIndex(r => r.item.id === keepId) : 0;
                selectedIndex = newIdx >= 0 ? newIdx : 0;
                renderResults(modalInput.value.trim(), true);
                if (msg.total) {
                    footerStats.textContent = `${engine.items.length} fragmentos · IA ${msg.cached}/${msg.total}`;
                }
            }
        };
        worker.onerror = () => {
            setAiStatus("local", "Híbrido Local");
        };
        worker.postMessage({
            type: "INIT",
            hash: engine.hash,
            autoWarmup: true,
            items: engine.items.map(it => ({
                id: it.id,
                text: `${it.title}. ${it.section}. ${it.content.slice(0, 650)}`
            }))
        });
    }

    function dispatchWorkerSearch(q) {
        if (!worker || q.length < 2) return;
        const reqId = ++searchReqSeq;
        worker.postMessage({
            type: "SEARCH",
            requestId: reqId,
            query: q,
            candidateIds: latestBmResults.slice(0, 32).map(r => r.item.id)
        });
    }

    function openModal(initialQuery = "") {
        modal.classList.add("open");
        document.body.classList.add("modal-open");
        if (initialQuery) modalInput.value = initialQuery;
        clearBtn.hidden = !modalInput.value;
        setTimeout(() => modalInput.focus(), 10);

        ensureSearchIndexLoaded()
            .then(data => {
                if (!engine) {
                    engine = new WikiHybridSearch(data);
                    footerStats.textContent = `${engine.items.length} fragmentos indexados`;
                    initWorkerOnce();
                }
                runQuery();
            })
            .catch(() => {
                setAiStatus("local", "Error cargando índice");
            });
    }

    function closeModal() {
        modal.classList.remove("open");
        document.body.classList.remove("modal-open");
    }

    function runQuery() {
        if (!engine) return;
        const q = modalInput.value.trim();
        clearBtn.hidden = !q;

        if (q.length < 2) {
            currentResults = [];
            latestBmResults = [];
            renderEmptyState();
            return;
        }

        const bm = engine.search(q, activeFilter, 35);
        latestBmResults = bm;
        currentResults = bm.slice(0, 16);
        selectedIndex = 0;
        renderResults(q, false);
        dispatchWorkerSearch(q);
    }

    function renderEmptyState() {
        const recent = getRecentQueries();
        resultsCol.innerHTML = `
            ${recent.length ? `
                <div class="ai-group-label">Búsquedas recientes</div>
                ${recent.map(q => `<button type="button" class="ai-suggest-item" data-q="${escapeHtml(q)}"><span>🕒 ${escapeHtml(q)}</span><span>Buscar &rarr;</span></button>`).join("")}
            ` : ""}
            <div class="ai-group-label">Consultas recomendadas (prueba preguntas naturales)</div>
            ${QUICK_SUGGESTIONS.map(q => `<button type="button" class="ai-suggest-item" data-q="${escapeHtml(q)}"><span>✨ ${escapeHtml(q)}</span><span>Explorar &rarr;</span></button>`).join("")}
        `;
        resultsCol.querySelectorAll(".ai-suggest-item").forEach(btn => {
            btn.addEventListener("click", () => {
                modalInput.value = btn.dataset.q || "";
                runQuery();
                modalInput.focus();
            });
        });
        previewCol.innerHTML = `
            <div class="ai-preview-empty">
                <div class="ai-preview-icon">🤖</div>
                <h3>Buscador Híbrido con IA</h3>
                <p>Busca por significado real en español o inglés (ej. <em>"cómo protejo mi ciudad de misiles"</em>), por comandos <code>/dc</code>, permisos <code>dynamicclaims.*</code> o placeholders <code>%...%</code>.</p>
                <ul>
                    <li>Tolera faltas ortográficas y ausencia de tildes.</li>
                    <li>Salta directo a la sección exacta y resalta comandos o permisos.</li>
                    <li>Usa <code>&uarr;</code> <code>&darr;</code> y <code>Enter</code> sin tocar el ratón.</li>
                </ul>
            </div>
        `;
    }

    function renderResults(query, withNeural) {
        if (!currentResults.length) {
            resultsCol.innerHTML = `<div class="ai-no-results">No se encontraron fragmentos para <strong>"${escapeHtml(query)}"</strong>${activeFilter !== "all" ? " en este filtro" : ""}. Prueba con otro término o quita el filtro.</div>`;
            previewCol.innerHTML = `<div class="ai-preview-empty"><p>Sin vista previa disponible.</p></div>`;
            return;
        }

        const top = currentResults[0].item;
        const primarySymbol = (top.cmds && top.cmds[0]) || (top.perms && top.perms[0]) || (top.papis && top.papis[0]) || "";
        const quickHtml = `
            <div class="ai-quick-answer">
                <div class="ai-quick-head">
                    <span class="ai-quick-badge">${withNeural && currentResults[0].neuralSim > 0.35 ? "✨ IA Semántica" : "⚡ Respuesta Rápida"}</span>
                    <span class="ai-quick-src">${escapeHtml(top.pageTitle)} &rsaquo; ${escapeHtml(top.title)}</span>
                </div>
                <p class="ai-quick-text">${highlightSnippet(buildBestSnippet(top, query, 175), query)}</p>
                <div class="ai-quick-actions">
                    ${primarySymbol ? `<button type="button" class="ai-copy-symbol" data-copy="${escapeHtml(primarySymbol)}">📋 ${escapeHtml(primarySymbol)}</button>` : ""}
                    <a class="ai-jump-link" href="${buildTargetHref(top)}">Ir directo &rarr;</a>
                </div>
            </div>
        `;

        const listHtml = currentResults.map((res, idx) => {
            const it = res.item;
            const kindLabel = KIND_LABELS[it.kind] || "Guía";
            const neuralBadge = res.neuralSim >= 0.38 ? `<span class="ai-nn-tag" title="Similitud semántica ${(res.neuralSim * 100).toFixed(0)}%">IA ${(res.neuralSim * 100).toFixed(0)}%</span>` : "";
            return `
                <div class="ai-result-row ${idx === selectedIndex ? "selected" : ""}" data-idx="${idx}">
                    <div class="ai-result-top">
                        <span class="ai-kind-pill kind-${it.kind}">${kindLabel}</span>
                        <span class="ai-result-title">${highlightSnippet(it.title, query)}</span>
                        ${neuralBadge}
                    </div>
                    <div class="ai-result-meta">${escapeHtml(it.category)} &rsaquo; ${escapeHtml(it.pageTitle)}</div>
                    <div class="ai-result-snippet">${highlightSnippet(buildBestSnippet(it, query, 130), query)}</div>
                </div>
            `;
        }).join("");

        resultsCol.innerHTML = quickHtml + listHtml;
        resultsCol.querySelectorAll(".ai-copy-symbol").forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                copyText(btn.dataset.copy || "", btn, "✓ Copiado");
            });
        });
        resultsCol.querySelectorAll(".ai-jump-link").forEach(a => {
            a.addEventListener("click", () => {
                saveRecentQuery(query);
                closeModal();
            });
        });
        resultsCol.querySelectorAll(".ai-result-row").forEach(row => {
            const idx = Number(row.dataset.idx);
            row.addEventListener("mouseenter", () => {
                if (selectedIndex !== idx) {
                    selectedIndex = idx;
                    updateSelectedRow(false);
                    renderPreview(currentResults[selectedIndex], query);
                }
            });
            row.addEventListener("click", () => {
                saveRecentQuery(query);
                closeModal();
                window.location.href = buildTargetHref(currentResults[idx].item);
            });
        });

        renderPreview(currentResults[selectedIndex], query);
    }

    function updateSelectedRow(scrollIntoView = true) {
        const rows = resultsCol.querySelectorAll(".ai-result-row");
        rows.forEach((r, idx) => {
            const active = idx === selectedIndex;
            r.classList.toggle("selected", active);
            if (active && scrollIntoView) r.scrollIntoView({ block: "nearest" });
        });
    }

    function renderPreview(entry, query) {
        if (!entry) return;
        const it = entry.item;
        const symbols = [
            ...(it.cmds || []).map(v => ({ label: "Comando", val: v, cls: "cmd" })),
            ...(it.perms || []).map(v => ({ label: "Permiso", val: v, cls: "perm" })),
            ...(it.papis || []).map(v => ({ label: "Placeholder", val: v, cls: "papi" })),
            ...(it.files || []).map(v => ({ label: "Archivo", val: v, cls: "file" }))
        ].slice(0, 8);

        previewCol.innerHTML = `
            <div class="ai-preview-card">
                <div class="ai-preview-crumb">${escapeHtml(it.category)} &rsaquo; ${escapeHtml(it.pageTitle)}</div>
                <h3 class="ai-preview-title">${highlightSnippet(it.title, query)}</h3>
                <div class="ai-preview-section">${escapeHtml(it.section)}</div>
                <div class="ai-preview-content">${highlightSnippet(it.content, query)}</div>
                ${symbols.length ? `
                    <div class="ai-preview-symbols">
                        <div class="ai-sym-heading">Referencias detectadas (clic para copiar)</div>
                        <div class="ai-sym-grid">
                            ${symbols.map(s => `<button type="button" class="ai-sym-chip sym-${s.cls}" data-copy="${escapeHtml(s.val)}">${escapeHtml(s.val)}</button>`).join("")}
                        </div>
                    </div>
                ` : ""}
                <a class="ai-open-btn" href="${buildTargetHref(it)}">Abrir en la wiki &rarr;</a>
            </div>
        `;
        previewCol.querySelectorAll(".ai-sym-chip").forEach(btn => {
            btn.addEventListener("click", () => copyText(btn.dataset.copy || "", btn, "✓ Copiado"));
        });
        previewCol.querySelector(".ai-open-btn")?.addEventListener("click", () => {
            saveRecentQuery(query);
            closeModal();
        });
    }

    // Event wiring
    triggerInput.addEventListener("focus", (e) => {
        e.preventDefault();
        triggerInput.blur();
        openModal(triggerInput.value.trim());
    });
    triggerInput.addEventListener("click", () => openModal(triggerInput.value.trim()));

    modal.querySelector(".ai-modal-backdrop").addEventListener("click", closeModal);
    clearBtn.addEventListener("click", () => {
        modalInput.value = "";
        runQuery();
        modalInput.focus();
    });

    let debounceTimer = null;
    modalInput.addEventListener("input", () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(runQuery, 70);
    });

    filterBar.querySelectorAll(".ai-chip").forEach(chip => {
        chip.addEventListener("click", () => {
            filterBar.querySelectorAll(".ai-chip").forEach(c => c.classList.remove("active"));
            chip.classList.add("active");
            activeFilter = chip.dataset.filter || "all";
            runQuery();
            modalInput.focus();
        });
    });

    modalInput.addEventListener("keydown", (e) => {
        if (e.key === "ArrowDown" && currentResults.length) {
            e.preventDefault();
            selectedIndex = (selectedIndex + 1) % currentResults.length;
            updateSelectedRow(true);
            renderPreview(currentResults[selectedIndex], modalInput.value.trim());
        } else if (e.key === "ArrowUp" && currentResults.length) {
            e.preventDefault();
            selectedIndex = (selectedIndex - 1 + currentResults.length) % currentResults.length;
            updateSelectedRow(true);
            renderPreview(currentResults[selectedIndex], modalInput.value.trim());
        } else if (e.key === "Enter" && currentResults[selectedIndex]) {
            e.preventDefault();
            saveRecentQuery(modalInput.value.trim());
            closeModal();
            window.location.href = buildTargetHref(currentResults[selectedIndex].item);
        }
    });

    document.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
            e.preventDefault();
            if (modal.classList.contains("open")) closeModal();
            else openModal();
        } else if (e.key === "/" && !modal.classList.contains("open") &&
            !/INPUT|TEXTAREA|SELECT/.test((document.activeElement && document.activeElement.tagName) || "")) {
            e.preventDefault();
            openModal();
        } else if (e.key === "Escape" && modal.classList.contains("open")) {
            closeModal();
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initSyntaxHighlighting();
    initPageEnhancements();
    initAiSearchModal();
});
