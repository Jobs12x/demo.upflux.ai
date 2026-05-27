/* === app.jsx ========================================================
   Top-level: topbar + builder panel + canvas, plus preview mode,
   edit mode and share modal.
   ===================================================================== */

const { DEFAULT_STATE, AE, DOCOL, PERSONAS } = window.STUDIO_DATA;

/* ---------- Top bar ---------- */
function StudioTopbar({ state, setState, demo, onBackToLibrary }) {
    const screens = [
        { id: 'chat',    label: 'Chat',           icon: 'message-circle' },
        { id: 'mining',  label: 'Process Mining', icon: 'bar-chart-3' },
        { id: 'agents',  label: 'Agentes',        icon: 'briefcase' },
        { id: 'roai',    label: 'RoAI',           icon: 'trending-up' },
        { id: 'rotinas', label: 'Rotinas',        icon: 'clock' },
    ];
    return (
        <div className="studio-topbar">
            <div className="left">
                <button className="studio-brand studio-brand--btn" onClick={onBackToLibrary} title="Voltar para a biblioteca">
                    <Icon name="chevron-left" size={13} style={{ color: 'var(--text-muted)', marginRight: 2 }} />
                    <span className="mark-wrap">U</span>
                    <span className="name">
                        UpFlux <span className="dim">Studio</span>
                    </span>
                </button>
                <span className="crumb-sep">/</span>
                <button className="project-chip">
                    <span style={{ fontWeight: 500 }}>{demo?.name || `Demo · ${state.cosmetic.company}`}</span>
                    {demo?.version && <span className="industry">{demo.version}</span>}
                    <Icon name="chevron-down" size={12} style={{ color: 'var(--text-muted)' }} />
                </button>
                <span className="save-state">
                    <span className="pulse-dot" />
                    Salvo automaticamente
                </span>
            </div>
            <div className="center">
                <div className="screen-tabs">
                    {screens.map((s) => (
                        <button
                            key={s.id}
                            className={`screen-tab${state.activeScreen === s.id ? ' active' : ''}`}
                            onClick={() => setState({ ...state, activeScreen: s.id })}
                        >
                            <span className="icon"><Icon name={s.icon} size={13} /></span>
                            {s.label}
                        </button>
                    ))}
                </div>
            </div>
            <div className="right">
                <button
                    className={`tbtn${state.editMode ? ' tbtn--active' : ''}`}
                    onClick={() => setState({ ...state, editMode: !state.editMode })}
                    title="Permite clicar e editar valores direto no preview"
                >
                    <Icon name="edit-3" size={12} />
                    {state.editMode ? 'Sair da edição' : 'Modo edição'}
                </button>
                <button
                    className="tbtn tbtn--outline"
                    onClick={() => setState({ ...state, previewMode: true })}
                >
                    <Icon name="eye" size={12} />
                    Visualizar
                </button>
                <button
                    className="tbtn tbtn--primary"
                    onClick={() => setState({ ...state, showShareModal: true })}
                >
                    <Icon name="share" size={12} />
                    <span className="tbtn-label">Compartilhar</span>
                </button>
                <div className="ae-avatar" title={`${state.vars?.ae_nome || AE.name} · ${AE.role}`}>
                    {(state.vars?.ae_nome || AE.name).split(/\s+/).slice(0,2).map(s => s[0] || '').join('').toUpperCase()}
                </div>
            </div>
        </div>
    );
}

/* ---------- Canvas toolbar (above the browser frame) ---------- */
function CanvasToolbar({ state, setState }) {
    const layers = [
        { n: 1, label: 'Cosmética',  key: 'L1' },
        { n: 2, label: 'Dados',      key: 'L2' },
        { n: 3, label: 'Persona',    key: 'L3' },
        { n: 4, label: 'Variáveis',  key: 'L4' },
        { n: 5, label: 'Guiado',     key: 'L5' },
    ];
    return (
        <div className="canvas-toolbar">
            <div className="left">
                <span style={{ fontSize: 11.5, color: 'var(--text-secondary)', fontWeight: 500 }}>
                    Camadas aplicadas
                </span>
                <div className="layer-toggles">
                    {layers.map((L) => {
                        const lvlState = state.levels[L.n];
                        const on = lvlState && lvlState.enabled;
                        return (
                            <button
                                key={L.key}
                                className={`layer-pip${on ? ' on' : ''}`}
                                onClick={() => setState({
                                    ...state,
                                    levels: { ...state.levels, [L.n]: { ...lvlState, enabled: !on } },
                                    expanded: state.expanded === L.n ? state.expanded : L.n,
                                })}
                                title={`Camada ${L.n} · ${L.label}`}
                            >
                                <span className="pip-dot" />
                                {L.n}. {L.label}
                            </button>
                        );
                    })}
                </div>
            </div>
            <div className="right">
                <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                    Preview ao vivo · {state.activeScreen}
                </span>
                <div className="canvas-zoom">
                    <button title="Zoom out">−</button>
                    <span className="v">Ajustado</span>
                    <button title="Zoom in">+</button>
                </div>
            </div>
        </div>
    );
}

/* ---------- The browser frame around the Nous preview ---------- */
function BrowserFrame({ state, setState, level4Open, onOpenFullMap, hideChrome }) {
    const personaObj = PERSONAS.find(p => p.id === state.persona.activeId) || PERSONAS[0];
    const urlPath = state.activeScreen === 'chat' ? 'chat'
                  : state.activeScreen === 'mining' ? 'process-mining'
                  : state.activeScreen === 'agents' ? 'agentes'
                  : state.activeScreen === 'rotinas' ? 'rotinas'
                  : 'roai';

    const screenHotspots = state.hotspots.filter(h => h.screen === state.activeScreen);
    /* The callout only appears when the user explicitly clicks a pin —
       and only the most recently clicked one. Default = no callout open. */
    const openCallout = state.openHotspotId
        ? screenHotspots.find(h => h.id === state.openHotspotId)
        : null;

    return (
        <div className="device-wrap">
            <div className="browser-frame">
                {!hideChrome && (
                    <div className="browser-chrome">
                        <div className="traffic"><span /><span /><span /></div>
                        <div className="browser-controls">
                            <Icon name="chevron-left" size={14} />
                            <Icon name="chevron-right" size={14} />
                            <Icon name="refresh-cw" size={12} />
                        </div>
                        <div className="browser-url">
                            <span className="lock"><Icon name="shield" size={11} /></span>
                            <span>
                                <span className="path-dim">nous.upflux.ai/</span>
                                <span className="path-em">{urlPath}</span>
                                <span className="path-dim">?demo={state.cosmetic.company.toLowerCase()}</span>
                            </span>
                        </div>
                        <Icon name="plus" size={13} />
                    </div>
                )}
                <div className="browser-body">
                    <NousPreview
                        state={state}
                        onNavigate={(id) => setState({ ...state, activeScreen: id })}
                        level4Open={level4Open}
                        onOpenFullMap={onOpenFullMap}
                        onSetState={setState}
                    />

                    {state.persona.branchEnabled && state.levels[3].enabled && (() => {
                        const displayName = (state.vars?.persona_nome && String(state.vars.persona_nome).trim()) || personaObj.name;
                        return (
                            <div className="persona-switcher">
                                <span className="label">Visualizando como</span>
                                <span style={{
                                    width: 8, height: 8, borderRadius: '50%',
                                    background: personaObj.avatar,
                                    display: 'inline-block',
                                    marginLeft: 4,
                                }} />
                                <span className="name">{displayName.split(' ')[0]} ({personaObj.role.split(' ')[0]})</span>
                                <Icon name="chevron-down" size={11} className="chev" />
                            </div>
                        );
                    })()}

                    {state.levels[5].enabled && screenHotspots.map((h, i) => {
                        const kind = window.STUDIO_DATA.HOTSPOT_KINDS[h.kind] || window.STUDIO_DATA.HOTSPOT_KINDS.tooltip;
                        return (
                            <div
                                key={h.id}
                                className="hotspot-overlay"
                                style={{ left: `${h.x * 100}%`, top: `${h.y * 100}%` }}
                                onClick={(e) => {
                                    /* Click toggles: open if closed, close if already open */
                                    e.stopPropagation();
                                    setState({
                                        ...state,
                                        openHotspotId: state.openHotspotId === h.id ? null : h.id,
                                        showHotspotPreview: h.id,
                                    });
                                }}
                                onMouseDown={(e) => {
                                    /* Drag the pin to reposition */
                                    e.preventDefault();
                                    const body = e.currentTarget.closest('.browser-body');
                                    if (!body) return;
                                    const rect = body.getBoundingClientRect();
                                    const onMove = (ev) => {
                                        const nx = Math.max(0.04, Math.min(0.96, (ev.clientX - rect.left) / rect.width));
                                        const ny = Math.max(0.04, Math.min(0.96, (ev.clientY - rect.top)  / rect.height));
                                        setState({
                                            ...state,
                                            showHotspotPreview: h.id,
                                            hotspots: state.hotspots.map(x =>
                                                x.id === h.id ? { ...x, x: nx, y: ny } : x),
                                        });
                                    };
                                    const onUp = () => {
                                        window.removeEventListener('mousemove', onMove);
                                        window.removeEventListener('mouseup', onUp);
                                    };
                                    window.addEventListener('mousemove', onMove);
                                    window.addEventListener('mouseup', onUp);
                                }}
                            >
                                <span
                                    className="hotspot-pin"
                                    style={{ pointerEvents: 'auto', background: kind.color, cursor: 'grab' }}
                                >{i + 1}</span>
                            </div>
                        );
                    })}
                    {state.levels[5].enabled && openCallout && (() => {
                        const kind = window.STUDIO_DATA.HOTSPOT_KINDS[openCallout.kind] || window.STUDIO_DATA.HOTSPOT_KINDS.tooltip;
                        return (
                        <div
                            className="hotspot-callout"
                            style={{
                                left: `calc(${openCallout.x * 100}% + 30px)`,
                                top: `calc(${openCallout.y * 100}% - 6px)`,
                            }}
                        >
                            <button
                                className="hotspot-callout-close"
                                onClick={() => setState({ ...state, openHotspotId: null })}
                                title="Fechar"
                                aria-label="Fechar"
                            >×</button>
                            <div className="head" style={{ color: kind.color }}>
                                <Icon
                                    name={kind.icon}
                                    size={10}
                                    style={{ verticalAlign: -1, marginRight: 4 }}
                                />
                                {kind.label}
                                {' · '}
                                {openCallout.title}
                                {openCallout.videoDuration && ` · ${openCallout.videoDuration}`}
                            </div>
                            <div>{openCallout.text}</div>
                            {openCallout.cta && (
                                <a
                                    href={openCallout.link || '#'}
                                    target="_blank"
                                    rel="noopener"
                                    className="cta"
                                    style={{ background: kind.color }}
                                    onClick={(e) => { if (!openCallout.link) e.preventDefault(); }}
                                >
                                    <Icon name="arrow-right" size={10} style={{ marginRight: 4, verticalAlign: -1 }} />
                                    {openCallout.cta}
                                </a>
                            )}
                            <div className="arrow" />
                        </div>
                        );
                    })()}

                    {state.editMode && (
                        <div className="edit-mode-banner">
                            <span className="em-dot" />
                            Modo edição · clique em qualquer texto ou número
                            <button onClick={() => setState({ ...state, editMode: false })}>
                                Concluir
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ---------- Full-map modal (Process Mining) ---------- */
function FullMapModal({ state, onClose }) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal modal--wide" onClick={(e) => e.stopPropagation()}>
                <div className="modal-head">
                    <div>
                        <div className="modal-title">Mapa completo · 1 — Compras ao Pagamento</div>
                        <div className="modal-sub">
                            451.756 casos · 38 variantes · janela 90 dias · {state.cosmetic.company}
                        </div>
                    </div>
                    <button className="modal-close" onClick={onClose}>
                        <Icon name="plus" size={16} style={{ transform: 'rotate(45deg)' }} />
                    </button>
                </div>
                <div className="modal-body modal-body--map">
                    <ProcessMap />
                </div>
                <div className="modal-foot">
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                        Cobertura: <strong style={{ color: 'var(--nous-purple)' }}>85,77%</strong>{' '}
                        dos casos representados nesta visão simplificada.
                    </div>
                    <button className="tbtn tbtn--primary" onClick={onClose}>
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ---------- State encoding for shareable URL ---------- */
function encodeState(state) {
    /* Strip transient fields that shouldn't be in a shareable URL */
    const payload = {
        activeScreen: state.activeScreen,
        cosmetic: state.cosmetic,
        data: state.data,
        persona: state.persona,
        vars: state.vars,
        hotspots: state.hotspots,
        levels: state.levels,
        edits: state.edits,
    };
    try {
        const json = JSON.stringify(payload);
        /* URL-safe base64 */
        return btoa(unescape(encodeURIComponent(json)))
            .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    } catch (e) { return ''; }
}
function decodeState(hash) {
    try {
        const padded = hash + '='.repeat((4 - hash.length % 4) % 4);
        const json = decodeURIComponent(escape(atob(padded.replace(/-/g, '+').replace(/_/g, '/'))));
        return JSON.parse(json);
    } catch (e) { return null; }
}
function copyToClipboard(text) {
    /* Modern API first */
    if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text).then(() => true).catch(() => fallbackCopy(text));
    }
    return Promise.resolve(fallbackCopy(text));
}
function fallbackCopy(text) {
    /* Works in sandboxed iframes where clipboard API is blocked */
    try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        ta.style.top = '0';
        ta.setAttribute('readonly', '');
        document.body.appendChild(ta);
        ta.select();
        ta.setSelectionRange(0, text.length);
        const ok = document.execCommand('copy');
        document.body.removeChild(ta);
        return ok;
    } catch (e) { return false; }
}

/* ---------- Share modal ---------- */
const PROD_DOMAIN = 'demo.upflux.ai';

function ShareModal({ state, demo, onClose }) {
    const encoded = React.useMemo(() => encodeState(state), [state]);
    /* Live URL — actually works because this HTML serves itself */
    const liveUrl = `${location.origin}${location.pathname}#demo=${encoded}`;
    /* Prod URL — what it'll look like after deploying to Hostinger */
    const prodUrl = `https://${PROD_DOMAIN}/#demo=${encoded}`;
    const shareUrl = liveUrl;
    const [copied, setCopied] = React.useState(false);
    const [downloaded, setDownloaded] = React.useState(false);
    const urlRef = React.useRef(null);

    const copy = () => {
        /* Fire copy attempts (may silently fail in sandboxed iframes), then
           always show optimistic feedback + select the text so user can Ctrl+C */
        copyToClipboard(shareUrl);
        if (urlRef.current) {
            urlRef.current.focus();
            urlRef.current.select();
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
    };

    const downloadHtml = () => {
        /* Build a small standalone HTML file that:
           1) sets the hash to the encoded state
           2) redirects to the live demo URL (or shows instructions)
           This is the lightweight version — a true single-file bundle would
           inline all assets. */
        const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<title>Demo Nous · ${state.cosmetic.company}</title>
<meta http-equiv="refresh" content="0; url=${shareUrl}" />
<style>
  body { font-family: -apple-system, sans-serif; padding: 48px; max-width: 520px; margin: 0 auto; color: #2C2C2C; }
  h1 { font-size: 22px; font-weight: 500; margin-bottom: 8px; }
  p  { color: #6B7280; line-height: 1.5; }
  a  { color: #6D4ADD; word-break: break-all; }
</style>
</head>
<body>
  <h1>Demo Nous — ${state.cosmetic.company}</h1>
  <p>Abrindo a demo personalizada... Se não redirecionar automaticamente:</p>
  <p><a href="${shareUrl}">${shareUrl}</a></p>
</body>
</html>`;
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `demo-nous-${state.cosmetic.company.toLowerCase()}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setDownloaded(true);
        setTimeout(() => setDownloaded(false), 2200);
    };

    const openInNewTab = () => window.open(shareUrl, '_blank', 'noopener');

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-head">
                    <div>
                        <div className="modal-title">Compartilhar demo · {state.cosmetic.company}</div>
                        <div className="modal-sub">
                            5 níveis aplicados · persona{' '}
                            <strong>{(PERSONAS.find(p => p.id === state.persona.activeId) || PERSONAS[0]).name.split(' ')[0]}</strong>
                            {' · '}{state.activeScreen}
                        </div>
                    </div>
                    <button className="modal-close" onClick={onClose}>
                        <Icon name="plus" size={16} style={{ transform: 'rotate(45deg)' }} />
                    </button>
                </div>
                <div className="modal-body">
                    <div className="share-section">
                        <div className="share-label">
                            Link de teste (atual)
                            <span className="share-label-hint">Funciona já — pode mandar para o prospect</span>
                        </div>
                        <div className="share-url-row">
                            <input
                                ref={urlRef}
                                className="share-url-input"
                                value={shareUrl}
                                readOnly
                                onFocus={(e) => e.target.select()}
                                onClick={(e) => e.target.select()}
                            />
                            <button className="tbtn tbtn--outline" onClick={copy}>
                                <Icon name={copied ? 'check' : 'code'} size={12} />
                                {copied ? 'Copiado!' : 'Copiar'}
                            </button>
                        </div>
                        <div className="share-actions-row">
                            <button className="tbtn" onClick={openInNewTab}>
                                <Icon name="eye" size={12} />
                                Abrir em nova aba
                            </button>
                            <span className="share-hint">
                                Estado da demo encodado no hash · {demo?.version || window.STUDIO_DATA.STUDIO_VERSION}.
                            </span>
                        </div>
                    </div>

                    <div className="share-section">
                        <div className="share-label">
                            URL de produção (após deploy)
                            <span className="share-label-hint">Como ficará quando o Hostinger estiver configurado</span>
                        </div>
                        <div className="share-url-row">
                            <input
                                className="share-url-input share-url-input--prod"
                                value={prodUrl}
                                readOnly
                                onFocus={(e) => e.target.select()}
                            />
                            <button className="tbtn" onClick={() => copyToClipboard(prodUrl)} title="Copiar URL de produção">
                                <Icon name="code" size={12} />
                            </button>
                        </div>
                    </div>

                    <div className="share-section">
                        <div className="share-label">Alternativas</div>
                        <div className="share-options">
                            <button className="share-opt" onClick={downloadHtml}>
                                <span className="share-opt-icon">
                                    <Icon name={downloaded ? 'check' : 'file-text'} size={14} />
                                </span>
                                <span>
                                    <div className="share-opt-title">
                                        {downloaded ? 'Baixado!' : 'Download HTML standalone'}
                                    </div>
                                    <div className="share-opt-sub">Arquivo .html que abre a demo · ideal para email</div>
                                </span>
                            </button>
                            <button className="share-opt" onClick={() => alert('Em breve: gravação automática do tour com a voz do AE.')}>
                                <span className="share-opt-icon"><Icon name="film" size={14} /></span>
                                <span>
                                    <div className="share-opt-title">Gravar tour de vídeo (MP4)</div>
                                    <div className="share-opt-sub">Felipe narra cada tela · até 5 min</div>
                                </span>
                            </button>
                            <button className="share-opt" onClick={() => alert('Em breve: envio direto por email + tracking de interação.')}>
                                <span className="share-opt-icon"><Icon name="users" size={14} /></span>
                                <span>
                                    <div className="share-opt-title">Convidar por email</div>
                                    <div className="share-opt-sub">Adicionar destinatários · notificar interação</div>
                                </span>
                            </button>
                        </div>
                    </div>

                    <div className="share-section share-analytics">
                        <div className="share-label">O que o prospect vai ver</div>
                        <div className="share-prev">
                            <Icon name="eye" size={12} style={{ color: 'var(--nous-purple)' }} />
                            <span>
                                Nous personalizado para <strong>{state.cosmetic.company}</strong>,
                                abrindo na tela <strong>{state.activeScreen}</strong> como{' '}
                                <strong>{(PERSONAS.find(p => p.id === state.persona.activeId) || PERSONAS[0]).role}</strong>.
                                Sem chrome do Studio.
                            </span>
                        </div>
                    </div>
                </div>
                <div className="modal-foot">
                    <button className="tbtn" onClick={onClose}>Cancelar</button>
                    <button className="tbtn tbtn--primary" onClick={copy}>
                        <Icon name="share" size={12} />
                        {copied ? 'Link copiado' : 'Copiar e enviar'}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ---------- Preview-only mode (no studio chrome) ---------- */
function PreviewMode({ state, setState, isProspect, onBackToLibrary }) {
    return (
        <div className="preview-mode">
            <div className="preview-mode-bar">
                <div className="preview-mode-left">
                    <span style={{
                        width: 22, height: 22, background: '#11161D', color: 'white',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        borderRadius: 5, fontSize: 11, fontWeight: 600,
                    }}>U</span>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                        {isProspect
                            ? <>Demo personalizada · <strong>UpFlux Nous</strong></>
                            : 'Pré-visualização · como o prospect verá'}
                    </span>
                    <span style={{
                        fontSize: 11, padding: '2px 7px', borderRadius: 4,
                        background: 'var(--nous-purple-tint)', color: 'var(--nous-purple)',
                        fontWeight: 500,
                    }}>{state.cosmetic.company}</span>
                </div>
                <div className="preview-mode-right">
                    {!isProspect && onBackToLibrary && (
                        <button className="tbtn" onClick={onBackToLibrary} title="Voltar para a biblioteca">
                            <Icon name="chevron-left" size={12} />
                            Biblioteca
                        </button>
                    )}
                    {!isProspect && (
                        <button className="tbtn tbtn--outline" onClick={() => setState({ ...state, previewMode: false })}>
                            <Icon name="edit-3" size={12} />
                            Voltar ao editor
                        </button>
                    )}
                    {!isProspect && (
                        <button className="tbtn tbtn--primary" onClick={() => setState({ ...state, showShareModal: true })}>
                            <Icon name="share" size={12} />
                            <span className="tbtn-label">Compartilhar</span>
                        </button>
                    )}
                    {isProspect && (
                        <a href="https://upflux.ai" target="_blank" rel="noopener" className="tbtn tbtn--primary">
                            <Icon name="arrow-right" size={12} />
                            Conhecer UpFlux
                        </a>
                    )}
                </div>
            </div>
            <div className="preview-mode-canvas">
                <BrowserFrame
                    state={state}
                    setState={setState}
                    level4Open={false}
                    onOpenFullMap={() => setState({ ...state, showFullMap: true })}
                    hideChrome={false}
                />
            </div>
        </div>
    );
}

/* ---------- App ---------- */
const today = () => new Date().toISOString().slice(0, 10);
const uid = () => Math.random().toString(36).slice(2, 9);
const STUDIO_PASSWORD = 'upflux2026';

function App() {
    /* --- Auth ----------------------------------------------------- */
    const [authed, setAuthed] = React.useState(() => {
        try { return sessionStorage.getItem('studio_auth') === 'ok'; } catch { return false; }
    });

    /* --- Library (localStorage with seed fallback) ---------------- */
    const [library, setLibrary] = React.useState(() => {
        try {
            const raw = localStorage.getItem('studio_library_v1');
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
        } catch {}
        return window.STUDIO_DATA.LIBRARY_SEED;
    });
    React.useEffect(() => {
        try { localStorage.setItem('studio_library_v1', JSON.stringify(library)); } catch {}
    }, [library]);

    /* --- Hash demo (prospect viewer mode, bypasses auth) ----------- */
    const hashDemoRef = React.useRef(undefined);
    if (hashDemoRef.current === undefined) {
        const m = (location.hash || '').match(/#demo=([\w-]+)/);
        hashDemoRef.current = m ? decodeState(m[1]) : null;
    }

    /* --- Currently edited demo ------------------------------------ */
    const [currentDemoId, setCurrentDemoId] = React.useState(null);
    const currentDemo = library.find(d => d.id === currentDemoId);

    /* setState that targets the current demo's state field */
    const setDemoState = (next) => {
        setLibrary(lib => lib.map(d => {
            if (d.id !== currentDemoId) return d;
            const newState = typeof next === 'function' ? next(d.state) : next;
            return {
                ...d,
                state: newState,
                updatedAt: today(),
                version: window.STUDIO_DATA.STUDIO_VERSION,
            };
        }));
    };
    /* For the EditsProvider that mutates demo.state.edits specifically */
    const onEditsChange = (newEdits) => {
        setDemoState(s => ({ ...s, edits: newEdits }));
    };

    /* --- Library actions ----------------------------------------- */
    const openDemo = (id) => {
        /* Clear transient UI flags on every open */
        setLibrary(lib => lib.map(d => d.id === id ? {
            ...d,
            state: {
                ...d.state,
                editMode: false,
                previewMode: false,
                showShareModal: false,
                showFullMap: false,
            }
        } : d));
        setCurrentDemoId(id);
    };
    const cloneDemo = (id) => {
        const src = library.find(d => d.id === id);
        if (!src) return;
        const newId = `${src.prospect.toLowerCase().replace(/\s/g, '')}-${uid()}`;
        const copy = {
            ...JSON.parse(JSON.stringify(src)),
            id: newId,
            name: `${src.name} (cópia)`,
            status: 'draft',
            version: window.STUDIO_DATA.STUDIO_VERSION,
            createdAt: today(),
            updatedAt: today(),
            views: 0,
            shareCount: 0,
        };
        setLibrary([copy, ...library]);
        openDemo(newId);
    };
    const deleteDemo = (id) => {
        setLibrary(library.filter(d => d.id !== id));
    };
    const createNewDemo = (prospectName) => {
        const newId = `${(prospectName || 'novo').toLowerCase().replace(/\s/g, '')}-${uid()}`;
        const fresh = JSON.parse(JSON.stringify(window.STUDIO_DATA.DEFAULT_STATE));
        fresh.cosmetic.company = prospectName || 'Novo prospect';
        fresh.cosmetic.logoMonogram = (prospectName || 'N').charAt(0).toUpperCase();
        fresh.vars.empresa = prospectName || 'Novo prospect';
        const entry = {
            id: newId,
            name: prospectName || 'Nova demo',
            prospect: prospectName || 'Novo prospect',
            industry: '—',
            persona: 'Marcos Silveira',
            personaRole: 'Diretor de Operações',
            owner: 'Felipe Andrade',
            ownerInitials: 'FA',
            status: 'draft',
            version: window.STUDIO_DATA.STUDIO_VERSION,
            createdAt: today(),
            updatedAt: today(),
            views: 0,
            shareCount: 0,
            accent: '#6D4ADD',
            state: fresh,
            thumbHint: 'Nova personalização',
        };
        setLibrary([entry, ...library]);
        openDemo(newId);
    };

    /* --- Routing ------------------------------------------------- */

    /* 1) Hash mode — prospect viewer */
    if (hashDemoRef.current) {
        const viewerState = {
            ...hashDemoRef.current,
            editMode: false,
            previewMode: true,
            showShareModal: false,
            showFullMap: false,
            edits: hashDemoRef.current.edits || {},
        };
        return (
            <ViewerOnly
                initial={viewerState}
            />
        );
    }

    /* 2) Login */
    if (!authed) {
        return <LoginScreen onAuth={() => {
            try { sessionStorage.setItem('studio_auth', 'ok'); } catch {}
            setAuthed(true);
        }} />;
    }

    /* 3) Library home */
    if (!currentDemo) {
        return (
            <LibraryScreen
                library={library}
                onOpen={openDemo}
                onClone={cloneDemo}
                onDelete={deleteDemo}
                onCreate={createNewDemo}
                onLogout={() => {
                    try { sessionStorage.removeItem('studio_auth'); } catch {}
                    setAuthed(false);
                }}
            />
        );
    }

    /* 4) Studio editor for currentDemo */
    const state = currentDemo.state;
    const level4Open = state.expanded === 4;
    const setState = setDemoState;
    const backToLibrary = () => setCurrentDemoId(null);

    if (state.previewMode) {
        return (
            <EditsProvider edits={state.edits || {}} editMode={false} onChange={onEditsChange}>
                <PreviewMode state={state} setState={setState} onBackToLibrary={backToLibrary} />
                {state.showShareModal && (
                    <ShareModal
                        state={state}
                        demo={currentDemo}
                        onClose={() => setState({ ...state, showShareModal: false })}
                    />
                )}
            </EditsProvider>
        );
    }

    return (
        <EditsProvider edits={state.edits || {}} editMode={state.editMode} onChange={onEditsChange}>
            <div className="studio">
                <StudioTopbar
                    state={state}
                    setState={setState}
                    demo={currentDemo}
                    onBackToLibrary={backToLibrary}
                />
                <BuilderPanel state={state} setState={setState} />
                <div className="studio-canvas">
                    <CanvasToolbar state={state} setState={setState} />
                    <div className="canvas-scroll">
                        <BrowserFrame
                            state={state}
                            setState={setState}
                            level4Open={level4Open}
                            onOpenFullMap={() => setState({ ...state, showFullMap: true })}
                        />
                    </div>
                </div>
            </div>
            {state.showShareModal && (
                <ShareModal
                    state={state}
                    demo={currentDemo}
                    onClose={() => setState({ ...state, showShareModal: false })}
                />
            )}
            {state.showFullMap && (
                <FullMapModal state={state} onClose={() => setState({ ...state, showFullMap: false })} />
            )}
        </EditsProvider>
    );
}

/* ---------- ViewerOnly (prospect view) ---------- */
function ViewerOnly({ initial }) {
    const [state, setState] = React.useState(initial);
    const onEditsChange = (e) => setState(s => ({ ...s, edits: e }));
    return (
        <EditsProvider edits={state.edits || {}} editMode={false} onChange={onEditsChange}>
            <PreviewMode state={state} setState={setState} isProspect />
        </EditsProvider>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
