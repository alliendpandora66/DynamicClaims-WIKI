const searchData = [
    {
        url: "index.html",
        title: "Inicio y Visión General",
        category: "General",
        content: "DynamicClaims documentación oficial dividida en 3 secciones: Usuario Jugador Común, Staff y Operador. Resumen de roles: ciudadano, militar activo, alcalde, líder, colíder, staff y operador."
    },
    // 1. USUARIO / JUGADOR COMÚN
    {
        url: "nations.html",
        title: "Territorios, Ciudadanía y Leyes",
        category: "1. Usuario / Jugador Común",
        content: "Regiones y naciones soberanas. Unirse a región (/dc unirse), salir (/dc salir), código de liderazgo (/dc codigo), teletransporte (/dc inicio, /dc establecer-inicio), invitar (/dc invitar). Las 7 leyes nacionales: openNation, electionsEnabled, pvpEnabled, alliesCanBuild, alliesCanInteract, neutralsCanBuild, neutralsCanInteract. 5 banderas regionales: PVP, FIRE_SPREAD, MOB_SPAWNING, EXPLOSIONS, INTERACT."
    },
    {
        url: "roles.html",
        title: "Cargos Políticos, Elecciones y Rangos",
        category: "1. Usuario / Jugador Común",
        content: "Diferencia entre Cargos Políticos (Dueño de Capital, Líder del Gobierno, Colíder, Moderador, Alcalde, Cogobernador), Elecciones democráticas (/dc candidatura, /dc elecciones, ideologías IZQUIERDA CENTRO DERECHA), Rangos Militares (/dc poblacion, cupo max-soldiers 20 plazas, requisito obligatorio para participar en guerras) y Rangos VIP del servidor (/dc rango, /dc rango reclamar)."
    },
    {
        url: "government.html",
        title: "Gobierno, Aprobación y Guerra Civil",
        category: "1. Usuario / Jugador Común",
        content: "Legitimidad política y aprobación popular en /dc gobierno. Voto a favor o en contra, postulación y votación de candidato rebelde opositor (/dc gobierno candidatos). Guerra Civil programada al alcanzar 51% de desaprobación, bajas por bando y derrocamiento del líder."
    },
    {
        url: "wars.html",
        title: "Guerras, Asedios, Misiles y Zonas de Guerra",
        category: "1. Usuario / Jugador Común",
        content: "Declaración de guerra y alianzas en /dc diplomacia. Conquista por puntos (points) o chunks (chunk), frente perimetral, dispersión por escala y balanceo de velocidad por soldados (soldier-balance). Moral de combate (-1 baja por captura o morale-recovery-per-chunk), treguas de 90 días, estados títeres y vasallaje (/dc diplomacia soberania), Zonas de Guerra (/dc zona-guerra), misiles convencionales, armas nucleares, radiación, casco NBQ, Combat Tag e Infamia."
    },
    {
        url: "economy.html",
        title: "Economía, Banco y Divisas (Patrón Oro)",
        category: "1. Usuario / Jugador Común",
        content: "Macroeconomía basada en el Patrón Oro: Valor = Reservas de Oro / Billetes Emitidos. Crear moneda nacional (/dc economia crear-moneda), cambiar modelo visual (/dc economia modelo), billetes físicos con número de serie, Banco Nacional (/dc banco depositar, /dc banco retirar) y consulta de tipos de cambio (/dc divisas)."
    },
    {
        url: "auctions.html",
        title: "Mercado Global y Tienda del Servidor",
        category: "1. Usuario / Jugador Común",
        content: "Casa de subastas entre jugadores (/dc mercado, /dc mercado vender PRECIO, /dc mercado ofertas, /dc mercado cartera) con 5 categorías y cobro en saldo bancario virtual. Tienda oficial del servidor (/dc tienda) con precios dinámicos respaldados en oro."
    },
    {
        url: "technology.html",
        title: "Tecnología e Investigación",
        category: "1. Usuario / Jugador Común",
        content: "Árbol tecnológico nacional (/dc tecnologias) con 4 ramas: Industria, Ciencia, Militar y Sociedad. Donación ciudadana de experiencia (/dc tecnologias donar CANTIDAD), prerrequisitos, fechas de desbloqueo y bonificaciones colectivas."
    },
    {
        url: "industry.html",
        title: "Industria, Edificios y Crafteos",
        category: "1. Usuario / Jugador Común",
        content: "Las 10 categorías de edificios industriales (Mina, Fábrica, Granja, Aserradero, Almacén, Casa, Ayuntamiento, Restaurante, Fuerte, Aeropuerto). Previsualización holográfica 3D, rotación cardinal, producción autónoma por ciclos y transporte aéreo."
    },
    {
        url: "pandemic.html",
        title: "Pandemias y Vacunas",
        category: "1. Usuario / Jugador Común",
        content: "Simulación epidemiológica (/dc pandemias). Contagio fronterizo, incubación asintomática, mutaciones, 5 niveles de severidad progresiva y desarrollo multinacional de vacunas con bono del +20% por nación aliada."
    },
    {
        url: "localization.html",
        title: "Chat, Mapas (Táctico y Atlas Web) y Utilidades",
        category: "1. Usuario / Jugador Común",
        content: "Canales de chat (/dc chat global, region, nacion, alianza, info), nametags relacionales, mapa en chat (/dc mapa), bordes (/dc limites), Minimapa Táctico en mano con zoom 1x 2x 4x con tecla F, Atlas Web Integrado (/dc mapa-web, contraseña permanente, editor territorial) y desplazamiento en andamios (/dc andamio)."
    },
    {
        url: "gui.html",
        title: "Menú Principal (/dc menu) y Guía Interactiva",
        category: "1. Usuario / Jugador Común",
        content: "Los 14 módulos del menú principal /dc menu, atajos directos a submenús, estándar de botones de navegación, seguridad anti-glitch y Códice de Guía interactiva (/dc guia, /dc guia recetas, /dc guia recursos)."
    },
    // 2. STAFF
    {
        url: "staff.html",
        title: "Guía de Staff: Jugadores, Territorios y Códigos",
        category: "2. Staff",
        content: "Permisos de Staff (dynamicclaims.command.admin), bypass administrativo, creación de regiones y naciones (/dc admin region crear, /dc admin nacion crear), reclamo de chunks (/dc reclamar, /dc liberar), gestión de jugadores y roles (/dc admin jugadores), códigos de liderazgo (/dc admin codigos) y modo espía (/dc chat espiar)."
    },
    {
        url: "staff-events.html",
        title: "Arbitraje de Staff: Guerras, Gobierno, Pandemias y Leyes",
        category: "2. Staff",
        content: "Control administrativo de guerras y treguas (/dc admin guerra), zonas de guerra (/dc admin zona-guerra), cupo militar por nación (/dc admin militares), estados títeres (/dc admin titeres), elecciones y partidos (/dc admin partidos, /dc admin gobierno), disponibilidad de leyes (/dc admin leyes), pandemias (/dc admin pandemia), radiación (/dc admin radiacion), tecnología y tiempo RP (/dc admin tiempo)."
    },
    {
        url: "staff-content.html",
        title: "Editores In-Game: Industria, Tienda, Recursos y Rangos",
        category: "2. Staff",
        content: "Creación de estructuras (/dc admin estructura crear), tipos de edificios industriales (/dc admin industria tipos), recetas industriales, eliminar edificios repetidos (mina_1 si/no), aeropuertos, gestión de divisas (/dc admin divisas), tienda del servidor (/dc admin tienda), drops de recursos (/dc admin recursos), crafteos custom (/dc admin crafteos), rangos (/dc admin rangos) y herramientas (/dc admin herramientas)."
    },
    {
        url: "commands.html",
        title: "Catálogo Oficial de Comandos (/dc)",
        category: "2. Staff",
        content: "Referencia completa generada de todas las rutas bajo /dc y /dynamicclaims:dc, argumentos obligatorios y opcionales, grupos con autocompletado TAB y niveles de acceso."
    },
    // 3. OPERADOR
    {
        url: "operator.html",
        title: "Instalación, Módulos (36), Base de Datos y Mantenimiento",
        category: "3. Operador",
        content: "Requisitos técnicos (Java 21, Paper 1.21.4, PlaceholderAPI). Los 36 módulos configurables en caliente (/dc admin modulos) y su grafo de dependencias. Base de datos SQLite y MySQL (/dc admin migrar-bd), auditoría (/dc admin auditar), diagnóstico, integridad, saneamiento, rollback (/dc admin revertir), purga de mapa y UUIDs territoriales (/dc admin uuid)."
    },
    {
        url: "configuration.html",
        title: "Configuración Técnica (YAML) y Migraciones",
        category: "3. Operador",
        content: "Las 24 configuraciones del ConfigurationCatalog, respaldos automáticos en backups/configurations/, convenciones kebab-case y desglose completo de config.yml, misiles.yml, vehiculos.yml, rangos.yml, tecnologias.yml, industria/config.yml y gui/*.yml."
    },
    {
        url: "dynmap.html",
        title: "Atlas Web Integrado, Dynmap y Squaremap",
        category: "3. Operador",
        content: "Configuración de web-map.yml para el servidor HTTP del Atlas Web Integrado, reverse proxy HTTPS, renderizado (/dc admin mapa render-completo), temas, fuentes personalizadas en web-map/fonts/, banderas en web-map/flags/, skins (Mojang/MineSkin) y las 14 tarjetas HTML de dynmap.yml para Squaremap y Dynmap."
    },
    {
        url: "discord.html",
        title: "Integración con Discord (Webhook y Bot JDA)",
        category: "3. Operador",
        content: "Configuración real en config.yml de discord.webhook (13 eventos geopolíticos) y discord.bot (JDA, token, prefix !set_chanel, role-channel-id, auto-update-panel, mention-roles) y comandos /dc admin discord info, panel y recargar."
    },
    {
        url: "resources.html",
        title: "Configuración de Recursos, Anti-Exploit y GeoJSON",
        category: "3. Operador",
        content: "Archivo recursos_drops.yml, protección anti-duplicación PlacedBlockTracker, reglas de vehiculos.yml e importación masiva de fronteras del mundo real con /dc admin importar geojson (proyecciones equirectangular y mercator) y /dc admin importar znodes."
    },
    {
        url: "placeholders.html",
        title: "Variables PlaceholderAPI y Nametags (TAB)",
        category: "3. Operador",
        content: "Todos los placeholders de %dynamicclaims_*%: nación, región, color, prefijo, sufijo, guerra, combate, moneda, reservas de oro, saldo bancario, cupo militar (military_count, military_max, military_available, military_rank, is_military, war_participant) y relacionales %rel_dynamicclaims_*% para TAB."
    },
    {
        url: "scripting.html",
        title: "Scripting API (GraalVM JavaScript)",
        category: "3. Operador",
        content: "Motor GraalJS con carga diferida en plugins/DynamicClaims/scripts/. Variables globales (DynamicClaimsAPI, api, Script, script, plugin, server, logger), eventos Bukkit (api.onEvent), ScriptDatabase YAML (api.getScriptDatabase), comandos vía /dc scripts ejecutar y gestión con /dc admin scripts."
    },
    {
        url: "developer.html",
        title: "Java API (DynamicClaimsAPI) y UltraAPI v2",
        category: "3. Operador",
        content: "Integración Maven (classifier ultra-api) y descubrimiento por ServicesManager. Fachada DynamicClaimsAPI (14 dominios), eventos Spigot (RegionClaimEvent, RegionUnclaimEvent, NationCreateEvent, WarStartEvent, WarEndEvent, TechnologyResearchedEvent, CustomRuleChangeEvent) y UltraAPI v2 (289 operaciones, UltraGameplay, UltraData, UUIDs persistentes, leyes/flags custom y capas vectoriales UltraLayer + AtlasDrawing con 39 iconos)."
    }
];

function escapeHtml(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

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
        // Línea entera de comentario
        if (/^\s*#/.test(line)) {
            return `<span class="tok-com">${escapeHtml(line)}</span>`;
        }

        // Separar comentario al final de la línea (fuera de comillas)
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
        // Coincidir elemento de lista con clave (- id: "1x") o clave normal (key: val)
        const keyMatch = codePart.match(/^(\s*(?:-\s+)?)([a-zA-Z0-9_.*'-]+)(\s*:\s*)(.*)$/);
        if (keyMatch) {
            const prefix = keyMatch[1];
            const key = keyMatch[2];
            const colon = keyMatch[3];
            const val = keyMatch[4];
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
        (_, open, tag, attrs, close) => {
            return `<span class="tok-op">${open}</span><span class="tok-key">${tag}</span>${attrs}<span class="tok-op">${close}</span>`;
        }
    );
}

function highlightJavaOrJs(raw) {
    const tokenRegex = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|@[A-Za-z_][A-Za-z0-9_]*|\b(?:package|import|public|private|protected|class|interface|record|enum|extends|implements|return|if|else|for|while|switch|case|break|continue|new|void|boolean|int|long|double|float|var|const|let|function|final|static|default|try|catch|throw|throws|instanceof|this|super)\b|\b(?:true|false|null)\b|\b(?:UltraAPI|UltraGameplay|UltraLayer|UltraData|DynamicClaimsAPI|Script|ScriptDatabase|AtlasDrawing|LayerOptions|RuleOptions|RuleScope|CustomRule|CustomRuleChangeEvent|PlayerStatus|RegionStatus|NationStatus|DiplomacyStatus|AllianceStatus|WarStatus|PvpDecision|PvpReason|Relation|ClaimPreview|ClaimResult|ClaimCell|ServerStatus|Position|ChunkPosition|Bounds|Marker|Polyline|Polygon|Circle|Label|Point|Style|Info|Icon|UUID|String|List|Set|Map|Collection|CompletableFuture|Player|OfflinePlayer|Location|World|Chunk|Block|Material|ItemStack|Entity|CommandSender|Plugin|Bukkit|Event|EventHandler|Listener|LocalDate|RegionClaimEvent|RegionUnclaimEvent|NationCreateEvent|WarStartEvent|WarEndEvent|TechnologyResearchedEvent|WarGoal)\b|\b[A-Z][A-Z0-9_]{2,}\b|\b\d+(?:\.\d+)?[Lfd]?\b|\b[a-zA-Z_][a-zA-Z0-9_]*(?=\s*\())/g;

    let result = "";
    let lastIndex = 0;
    let match;

    while ((match = tokenRegex.exec(raw)) !== null) {
        if (match.index > lastIndex) {
            result += escapeHtml(raw.slice(lastIndex, match.index));
        }
        const tok = match[0];
        let cls = "tok-fn";

        if (tok.startsWith("//") || tok.startsWith("/*")) {
            cls = "tok-com";
        } else if (tok.startsWith('"') || tok.startsWith("'")) {
            cls = "tok-str";
        } else if (tok.startsWith("@")) {
            cls = "tok-ann";
        } else if (tok === "true") {
            cls = "tok-bool";
        } else if (tok === "false" || tok === "null") {
            cls = "tok-bfal";
        } else if (/^\d/.test(tok)) {
            cls = "tok-num";
        } else if (/^(package|import|public|private|protected|class|interface|record|enum|extends|implements|return|if|else|for|while|switch|case|break|continue|new|void|boolean|int|long|double|float|var|const|let|function|final|static|default|try|catch|throw|throws|instanceof|this|super)$/.test(tok)) {
            cls = "tok-kw";
        } else if (/^[A-Z][A-Z0-9_]{2,}$/.test(tok) && tok !== "UUID") {
            cls = "tok-const";
        } else if (/^[A-Z]/.test(tok)) {
            cls = "tok-type";
        } else {
            cls = "tok-fn";
        }

        result += `<span class="${cls}">${escapeHtml(tok)}</span>`;
        lastIndex = tokenRegex.lastIndex;
    }

    if (lastIndex < raw.length) {
        result += escapeHtml(raw.slice(lastIndex));
    }
    return result;
}

function initSyntaxHighlighting() {
    // 1. Bloques <pre><code>
    const codeBlocks = document.querySelectorAll("pre code");
    codeBlocks.forEach(codeEl => {
        const preEl = codeEl.parentElement;
        if (!preEl || preEl.dataset.highlighted === "true") return;
        preEl.dataset.highlighted = "true";

        const rawText = codeEl.textContent || "";
        const lang = detectLanguage(rawText);

        if (lang.id === "yaml") {
            codeEl.innerHTML = highlightYaml(rawText);
        } else if (lang.id === "xml") {
            codeEl.innerHTML = highlightXml(rawText);
        } else {
            codeEl.innerHTML = highlightJavaOrJs(rawText);
        }

        // Envolver en .code-wrapper con cabecera y botón Copiar
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
            navigator.clipboard.writeText(rawText.trim()).then(() => {
                copyBtn.textContent = "✓ Copiado";
                copyBtn.classList.add("copied");
                setTimeout(() => {
                    copyBtn.textContent = "📋 Copiar";
                    copyBtn.classList.remove("copied");
                }, 1800);
            });
        });

        header.appendChild(langBadge);
        header.appendChild(copyBtn);

        const targetContainer = preEl.parentElement && preEl.parentElement.classList.contains("code-block")
            ? preEl.parentElement
            : preEl;

        targetContainer.parentNode.insertBefore(wrapper, targetContainer);
        wrapper.appendChild(header);
        wrapper.appendChild(preEl);
        if (targetContainer !== preEl) {
            targetContainer.remove();
        }
    });

    // 2. Etiquetas inline <code> fuera de <pre>
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

document.addEventListener("DOMContentLoaded", () => {
    initSyntaxHighlighting();

    const searchInput = document.getElementById("search-input") || document.getElementById("wiki-search");
    const searchResults = document.getElementById("search-results");

    if (!searchInput || !searchResults) return;

    const cachedData = searchData.map(item => ({
        ...item,
        searchableText: (item.title + " " + item.category + " " + item.content).toLowerCase()
    }));

    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.trim().toLowerCase();

        if (query.length < 2) {
            searchResults.classList.remove("active");
            searchResults.innerHTML = "";
            return;
        }

        const matches = cachedData.filter(item => item.searchableText.includes(query)).slice(0, 8);

        if (matches.length > 0) {
            searchResults.innerHTML = matches.map(item => `
                <div class="search-result-item" onclick="window.location.href='${item.url}'">
                    <div class="search-result-title">${item.title} <span style="font-size:0.74rem; color:#64748b; font-weight:normal;">(${item.category})</span></div>
                    <div class="search-result-desc">${item.content.substring(0, 125)}...</div>
                </div>
            `).join("");
            searchResults.classList.add("active");
        } else {
            searchResults.innerHTML = `
                <div class="search-result-item" style="cursor: default;">
                    <div class="search-result-desc" style="color: #64748b;">No se encontraron resultados para "${query}"</div>
                </div>
            `;
            searchResults.classList.add("active");
        }
    });

    document.addEventListener("click", (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.remove("active");
        }
    });

    document.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "k") {
            e.preventDefault();
            searchInput.focus();
        }
    });
});
