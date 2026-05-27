/* === builder.jsx ====================================================
   Left panel — the 5-level personalization accordion + footer.
   ===================================================================== */

const { BRAND_SWATCHES, FR_MAP, SUPPLIERS, SKU_CATEGORIES, PERSONAS,
        DYNAMIC_VARS, HOTSPOT_KINDS } = window.STUDIO_DATA;

/* ==================================================================
   Level header (each accordion row)
   ================================================================== */
function LevelHead({ num, name, blurb, status, open, applied, partial, onToggle }) {
    const cls = `lvl${open ? ' open' : ''}${applied ? ' applied' : ''}${partial ? ' partial' : ''}`;
    return (
        <div className={cls.trim()}>
            <button className="lvl-head" onClick={onToggle}>
                <span className="lvl-num">{applied ? <Icon name="check" size={12} stroke={2.5} /> : num}</span>
                <span className="lvl-info">
                    <span className="lvl-name">
                        {name}
                        {num === 4 && <span className="lvl-tag">Template</span>}
                        {num === 5 && <span className="lvl-tag">Beta</span>}
                    </span>
                    <span className="lvl-blurb">{blurb}</span>
                </span>
                <span className="lvl-status">{status}</span>
                <span className="lvl-chevron">
                    <Icon name="chevron-down" size={14} />
                </span>
            </button>
        </div>
    );
}

/* ==================================================================
   LEVEL 1 — COSMÉTICA
   ================================================================== */
function Level1Body({ state, setState }) {
    const c = state.cosmetic;
    /* When user changes Level 1 cosmetic values, also sync the matching
       Level 4 variables so the demo stays consistent end-to-end. */
    const setC = (patch) => {
        const next = { ...c, ...patch };
        const varsPatch = { ...state.vars };
        if ('company' in patch) varsPatch.empresa = patch.company;
        setState({ ...state, cosmetic: next, vars: varsPatch });
    };

    return (
        <div className="lvl-body">
            <div className="field">
                <div className="field-label">Logo do prospect</div>
                <div className="logo-drop">
                    <div className="logo-preview">
                        {c.logoMonogram}
                    </div>
                    <div className="info">
                        <div className="name">docol-logo-2024.svg</div>
                        <div className="sub">PNG · 280×64 · capturado de docol.com.br</div>
                    </div>
                    <button className="replace">Trocar</button>
                </div>
                <div className="field-hint">
                    O Nous mantém sua marca — cor, font e botoes. Logo do prospect aparece como{' '}
                    contexto (no header, na assinatura de hotspots), não substitui o Nous.
                </div>
            </div>

            <div className="field">
                <div className="field-label">Nome da empresa</div>
                <input
                    className="f-input"
                    value={c.company}
                    onChange={(e) => setC({ company: e.target.value })}
                />
                <div className="field-hint">Aparece no sidebar, em saudações e no header. Auto-preenche <code>{'{{empresa}}'}</code>.</div>
            </div>

            <div className="field">
                <div className="field-label">Find &amp; replace global (5 mapeamentos)</div>
                <div className="fr-list">
                    {FR_MAP.map((m, i) => (
                        <div className="fr-row" key={i}>
                            <span className="fr-from" title={m.from}>{m.from}</span>
                            <span className="fr-arrow">→</span>
                            <span className="fr-to" title={m.to}>{m.to}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ==================================================================
   LEVEL 2 — DADOS REALISTAS (Docol manufatura/P2P)
   ================================================================== */
function Level2Body({ state, setState }) {
    const d = state.data;
    const setD = (patch) => setState({ ...state, data: { ...d, ...patch } });
    const toggleArr = (key, val) => {
        const arr = d[key] || [];
        const next = arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];
        setD({ [key]: next });
    };
    const fmtBRL = (n) => 'R$ ' + n.toLocaleString('pt-BR');

    return (
        <div className="lvl-body">
            <div className="field">
                <div className="field-label">Fornecedores reais ({d.suppliers.length} ativos)</div>
                <div className="chips">
                    {SUPPLIERS.map((s) => {
                        const on = d.suppliers.includes(s.name);
                        return (
                            <button
                                key={s.name}
                                className={`chip${on ? ' on' : ''}`}
                                onClick={() => toggleArr('suppliers', s.name)}
                            >
                                {on && <span className="chip-check"><Icon name="check" size={8} stroke={3} /></span>}
                                {s.name}
                            </button>
                        );
                    })}
                </div>
                <div className="field-hint">
                    Substitui mock por fornecedores reais do catálogo Docol. Aparecem em
                    cotações, gargalos, listas de POs.
                </div>
            </div>

            <div className="field">
                <div className="field-label">Categorias de SKU</div>
                <div className="chips">
                    {SKU_CATEGORIES.map((s) => {
                        const on = d.skuCategories.includes(s.name);
                        return (
                            <button
                                key={s.name}
                                className={`chip${on ? ' on' : ''}`}
                                onClick={() => toggleArr('skuCategories', s.name)}
                            >
                                {on && <span className="chip-check"><Icon name="check" size={8} stroke={3} /></span>}
                                {s.name}
                                <span style={{ color: 'var(--text-muted)', fontSize: 10, marginLeft: 2 }}>·{s.count}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="field">
                <div className="field-label">Unidades fabris</div>
                <div className="chips">
                    {['Joinville (matriz)', 'Manaus (Polo Industrial)'].map((site) => {
                        const on = d.sites.includes(site);
                        return (
                            <button
                                key={site}
                                className={`chip${on ? ' on' : ''}`}
                                onClick={() => toggleArr('sites', site)}
                            >
                                {on && <span className="chip-check"><Icon name="check" size={8} stroke={3} /></span>}
                                {site}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="field">
                <div className="field-label">Faixa de valor de PO (BRL)</div>
                <div className="range-row">
                    <input
                        type="range"
                        min="10000" max="2000000" step="10000"
                        value={d.valueRange[1]}
                        onChange={(e) => setD({ valueRange: [d.valueRange[0], Number(e.target.value)] })}
                    />
                    <span className="v">{fmtBRL(d.valueRange[0])} – {fmtBRL(d.valueRange[1])}</span>
                </div>
                <div className="field-hint">
                    Calibra os exemplos: POs &gt; <strong>R$ 250k</strong> entram em "alçada"
                    nos KPIs e agentes.
                </div>
            </div>

            <div className="toggle-row">
                <span className="label">Aplicar formatação BR (R$ · 1.234,56 · 4d 12h)</span>
                <span className="toggle on" />
            </div>
        </div>
    );
}

/* ==================================================================
   LEVEL 3 — PERSONA / BRANCHING
   ================================================================== */
function Level3Body({ state, setState }) {
    const setPersona = (id) => {
        const p = PERSONAS.find(x => x.id === id);
        setState({
            ...state,
            persona: { ...state.persona, activeId: id },
            activeScreen: p.firstScreen,
            /* Sync vars.persona_nome so Level 4 reflects the choice. */
            vars: { ...state.vars, persona_nome: p.name },
        });
    };
    return (
        <div className="lvl-body">
            <div className="field">
                <div className="field-label">Persona principal (entra primeiro)</div>
                <div className="personas">
                    {PERSONAS.map((p) => (
                        <button
                            key={p.id}
                            className={`persona-row${state.persona.activeId === p.id ? ' active' : ''}`}
                            onClick={() => setPersona(p.id)}
                        >
                            <span className="persona-avatar" style={{ background: p.avatar }}>
                                {(p.name.split(' ').map(s => s[0])).slice(0,2).join('')}
                            </span>
                            <span className="persona-info">
                                <span className="persona-name">{p.name}</span>
                                <span className="persona-role">{p.role}</span>
                            </span>
                            <span className="branch-tag">{p.firstScreen}</span>
                        </button>
                    ))}
                </div>
                <div className="field-hint">
                    Cada persona abre em uma tela diferente. O preview reflete a escolha
                    em tempo real.
                </div>
            </div>

            <div className="field">
                <div className="field-label">Ramificação da demo</div>
                <div style={{
                    background: '#FAFAFB',
                    border: '1px solid #ECECEE',
                    borderRadius: 8,
                    padding: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                }}>
                    {PERSONAS.map((p) => (
                        <div key={p.id} style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            fontSize: 11.5,
                            color: state.persona.activeId === p.id ? 'var(--text-primary)' : 'var(--text-muted)',
                            fontWeight: state.persona.activeId === p.id ? 500 : 400,
                        }}>
                            <span style={{
                                width: 6, height: 6, borderRadius: '50%',
                                background: state.persona.activeId === p.id ? p.avatar : '#D5D5D9',
                            }} />
                            <span style={{ fontFamily: 'var(--font-mono)', minWidth: 60, fontSize: 10.5 }}>
                                {p.role.split(' ')[0]}
                            </span>
                            <Icon name="chevron-right" size={11} style={{ color: 'var(--text-muted)' }} />
                            <span style={{ flex: 1 }}>{p.branchSummary}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="toggle-row">
                <span className="label">Permitir prospect alternar entre personas</span>
                <span className="toggle on" />
            </div>
        </div>
    );
}

/* ==================================================================
   LEVEL 4 — VARIÁVEIS DINÂMICAS
   ================================================================== */
function Level4Body({ state, setState }) {
    const setVar = (k, v) => setState({ ...state, vars: { ...state.vars, [k]: v } });
    const removeVar = (k) => {
        const next = { ...state.vars };
        delete next[k];
        setState({ ...state, vars: next });
    };

    /* Map of where each var is used — displayed inline so the AE knows
       what changes when they edit a value. */
    const USAGE = {
        empresa:        ['Sidebar', 'Chat', 'Agentes', 'RoAI', 'Process Mining'],
        setor:          ['Header da demo'],
        pain_point:     ['Pergunta inicial', 'Hotspot vídeo do AE'],
        ae_nome:        ['Topbar do Studio', 'Hotspots de vídeo'],
        persona_nome:   ['Sidebar (avatar)', 'Greeting do chat', 'Persona switcher'],
        volume_mensal:  ['Process Mining (subtítulo)'],
        fornec_top:     ['Chat (cotações Wieland)', 'Agentes (Cotação)'],
        meta_lead_time: ['Chat (próximo passo)'],
    };

    /* User-added vars (any key not in the default set) */
    const knownKeys = new Set(DYNAMIC_VARS.map(v => v.key));
    const customKeys = Object.keys(state.vars).filter(k => !knownKeys.has(k));

    const addCustomVar = () => {
        /* Find a unique name like custom_1, custom_2... */
        let i = 1;
        while (state.vars[`custom_${i}`] !== undefined) i++;
        setVar(`custom_${i}`, 'novo valor');
    };

    return (
        <div className="lvl-body">
            <div className="field-hint" style={{ marginBottom: 12 }}>
                Estes valores são injetados em textos, KPIs e títulos do preview.
                Edite uma vez, aplique em <strong>todas</strong> as superfícies.
            </div>
            <div className="vars-list">
                {DYNAMIC_VARS.map((v) => {
                    const usage = USAGE[v.key] || [];
                    return (
                        <div className="var-item" key={v.key}>
                            <div className="var-item-row">
                                <span className="var-name">{`{{${v.key}}}`}</span>
                                <input
                                    className="f-input"
                                    value={state.vars[v.key] ?? ''}
                                    onChange={(e) => setVar(v.key, e.target.value)}
                                />
                            </div>
                            {usage.length > 0 && (
                                <div className="var-usage">
                                    <span className="var-usage-label">Usado em:</span>
                                    {usage.map((u, i) => (
                                        <span key={i} className="var-usage-chip">{u}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
                {customKeys.map((k) => (
                    <div className="var-item var-item--custom" key={k}>
                        <div className="var-item-row">
                            <span className="var-name">{`{{${k}}}`}</span>
                            <input
                                className="f-input"
                                value={state.vars[k] ?? ''}
                                onChange={(e) => setVar(k, e.target.value)}
                            />
                            <button
                                className="var-remove"
                                onClick={() => removeVar(k)}
                                title="Remover variável"
                            >
                                <Icon name="trash" size={11} />
                            </button>
                        </div>
                        <div className="var-usage">
                            <span className="var-usage-label">Personalizada</span>
                            <span className="var-usage-chip">
                                Referencie como <code>{`{{${k}}}`}</code> em qualquer texto editável
                            </span>
                        </div>
                    </div>
                ))}
                <button className="hotspot-add" onClick={addCustomVar}>
                    <Icon name="plus" size={12} />
                    Adicionar variável
                </button>
            </div>
            <div style={{
                marginTop: 14,
                padding: '8px 10px',
                background: 'var(--nous-purple-tint)',
                border: '1px solid var(--nous-purple-border)',
                borderRadius: 6,
                fontSize: 11.5,
                color: 'var(--nous-purple)',
                display: 'flex', gap: 8, alignItems: 'flex-start',
            }}>
                <Icon name="sparkles" size={12} style={{ marginTop: 1, flexShrink: 0 }} />
                <span>
                    Editando aqui? O preview destaca onde cada variável aparece como{' '}
                    <code style={{ background: 'rgba(255,255,255,0.5)', padding: '0 4px', borderRadius: 3 }}>
                        {'{{var}}'}
                    </code>.
                </span>
            </div>
        </div>
    );
}

/* ==================================================================
   LEVEL 5 — CONTEÚDO GUIADO (HOTSPOTS)
   ================================================================== */
function Level5Body({ state, setState }) {
    const screenHotspots = state.hotspots.filter(h => h.screen === state.activeScreen);
    const setShow = (id) => setState({ ...state, showHotspotPreview: id });

    /* Discovery questions editor */
    const updateQuestion = (cat, qid, patch) => {
        const next = (state.discovery?.[cat] || []).map(q => q.id === qid ? { ...q, ...patch } : q);
        setState({ ...state, discovery: { ...state.discovery, [cat]: next } });
    };
    const reorderQuestion = (cat, qid, dir) => {
        const list = state.discovery?.[cat] || [];
        const idx = list.findIndex(q => q.id === qid);
        const swap = dir === 'up' ? idx - 1 : idx + 1;
        if (swap < 0 || swap >= list.length) return;
        const next = [...list];
        [next[idx], next[swap]] = [next[swap], next[idx]];
        setState({ ...state, discovery: { ...state.discovery, [cat]: next } });
    };
    const updateAnswer = (cat, qid, patch) => {
        const next = (state.discovery?.[cat] || []).map(q =>
            q.id === qid ? { ...q, answer: { ...(q.answer || {}), ...patch } } : q
        );
        setState({ ...state, discovery: { ...state.discovery, [cat]: next } });
    };
    const updateArtifact = (cat, qid, patch) => {
        const next = (state.discovery?.[cat] || []).map(q => {
            if (q.id !== qid) return q;
            const a = q.answer || {};
            const art = a.artifact || { type: 'kpi-grid', kpis: [] };
            return { ...q, answer: { ...a, artifact: { ...art, ...patch } } };
        });
        setState({ ...state, discovery: { ...state.discovery, [cat]: next } });
    };
    const updateKpi = (cat, qid, kIdx, patch) => {
        const list = state.discovery?.[cat] || [];
        const q = list.find(x => x.id === qid);
        if (!q) return;
        const a = q.answer || {};
        const art = a.artifact || { type: 'kpi-grid', kpis: [] };
        const kpis = [...(art.kpis || [])];
        kpis[kIdx] = { ...kpis[kIdx], ...patch };
        updateArtifact(cat, qid, { kpis });
    };
    const addKpi = (cat, qid) => {
        const list = state.discovery?.[cat] || [];
        const q = list.find(x => x.id === qid);
        const art = q?.answer?.artifact || { type: 'kpi-grid', kpis: [] };
        updateArtifact(cat, qid, { kpis: [...(art.kpis || []), { label: 'NOVO KPI', value: '0', sub: 'descrição' }] });
    };
    const removeKpi = (cat, qid, kIdx) => {
        const list = state.discovery?.[cat] || [];
        const q = list.find(x => x.id === qid);
        const art = q?.answer?.artifact;
        if (!art?.kpis) return;
        updateArtifact(cat, qid, { kpis: art.kpis.filter((_, i) => i !== kIdx) });
    };
    const removeQuestion = (cat, qid) => {
        const next = (state.discovery?.[cat] || []).filter(q => q.id !== qid);
        setState({ ...state, discovery: { ...state.discovery, [cat]: next } });
    };
    const addQuestion = (cat) => {
        const list = state.discovery?.[cat] || [];
        const nextId = String(list.length + 1);
        const next = [...list, { id: nextId, label: 'Nova pergunta…' }];
        setState({ ...state, discovery: { ...state.discovery, [cat]: next } });
    };
    const toggleExpanded = (key) => {
        setState({ ...state, expandedDiscovery: state.expandedDiscovery === key ? null : key });
    };
    const CATS = [
        { id: 'estrategico', label: 'Estratégico' },
        { id: 'gestao',      label: 'Gestão' },
        { id: 'operacional', label: 'Operacional' },
    ];

    return (
        <div className="lvl-body">
            {/* ===== Discovery questions ===== */}
            <div className="field">
                <div className="field-label">Perguntas do discovery — chat home</div>
                <div className="field-hint" style={{ marginBottom: 8 }}>
                    Quando o prospect clica numa categoria no chat, vê estas perguntas.
                    Edite com base no que capturou no discovery comercial.
                </div>
                {CATS.map((cat) => {
                    const list = state.discovery?.[cat.id] || [];
                    return (
                        <div className="discovery-cat" key={cat.id}>
                            <div className="discovery-cat-head">
                                <span><Icon name="sparkles" size={11} style={{ color: 'var(--nous-purple)', marginRight: 5, verticalAlign: -1 }} />{cat.label}</span>
                                <span className="discovery-count">{list.length} perguntas</span>
                            </div>
                            <div className="discovery-list">
                                {list.map((q) => {
                                    const key = `${cat.id}.${q.id}`;
                                    const isOpen = state.expandedDiscovery === key;
                                    const hasAnswer = !!q.answer?.text;
                                    return (
                                        <div className={`discovery-q-card${isOpen ? ' open' : ''}`} key={q.id}>
                                            <div className="discovery-q">
                                                <input
                                                    className="f-input discovery-qid-input"
                                                    value={q.id}
                                                    onChange={(e) => updateQuestion(cat.id, q.id, { id: e.target.value })}
                                                    title="Número da pergunta"
                                                />
                                                <input
                                                    className="f-input"
                                                    value={q.label}
                                                    onChange={(e) => updateQuestion(cat.id, q.id, { label: e.target.value })}
                                                />
                                                <button
                                                    className="hr-btn"
                                                    onClick={() => reorderQuestion(cat.id, q.id, 'up')}
                                                    title="Subir"
                                                    disabled={list.findIndex(x => x.id === q.id) === 0}
                                                >
                                                    <Icon name="arrow-up" size={11} />
                                                </button>
                                                <button
                                                    className="hr-btn"
                                                    onClick={() => reorderQuestion(cat.id, q.id, 'down')}
                                                    title="Descer"
                                                    disabled={list.findIndex(x => x.id === q.id) === list.length - 1}
                                                >
                                                    <Icon name="arrow-up" size={11} style={{ transform: 'rotate(180deg)' }} />
                                                </button>
                                                <button
                                                    className={`hr-btn${hasAnswer ? ' hr-btn--has' : ''}`}
                                                    onClick={() => toggleExpanded(key)}
                                                    title={hasAnswer ? 'Editar resposta' : 'Adicionar resposta'}
                                                >
                                                    <Icon name={isOpen ? 'chevron-down' : 'plus'} size={11} />
                                                </button>
                                                <button
                                                    className="var-remove"
                                                    onClick={() => removeQuestion(cat.id, q.id)}
                                                    title="Remover pergunta"
                                                >
                                                    <Icon name="trash" size={11} />
                                                </button>
                                            </div>
                                            {isOpen && (
                                                <QuestionAnswerEditor
                                                    question={q}
                                                    onUpdateAnswer={(patch) => updateAnswer(cat.id, q.id, patch)}
                                                    onUpdateArtifact={(patch) => updateArtifact(cat.id, q.id, patch)}
                                                    onUpdateKpi={(idx, patch) => updateKpi(cat.id, q.id, idx, patch)}
                                                    onAddKpi={() => addKpi(cat.id, q.id)}
                                                    onRemoveKpi={(idx) => removeKpi(cat.id, q.id, idx)}
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                                <button className="hotspot-add" onClick={() => addQuestion(cat.id)}>
                                    <Icon name="plus" size={11} />
                                    Adicionar pergunta
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ===== Hotspots (existing) ===== */}
            <div className="field">
                <div className="field-label">Hotspots e callouts</div>
                <div className="field-hint" style={{ marginBottom: 8 }}>
                    Hotspots na tela <strong>{state.activeScreen}</strong> · {screenHotspots.length} ativos.
                    Clique numa linha para editar; arraste o pin no preview para posicionar.
                </div>
                <HotspotEditor state={state} setState={setState} screenHotspots={screenHotspots} />
            </div>
        </div>
    );
}

/* ==================================================================
   Hotspot CRUD editor — used inside Level 5
   ================================================================== */
function HotspotEditor({ state, setState, screenHotspots }) {
    const sel = state.showHotspotPreview;
    const setShow = (id) => setState({ ...state, showHotspotPreview: id });

    const updateHotspot = (id, patch) => {
        const next = state.hotspots.map(h => h.id === id ? { ...h, ...patch } : h);
        setState({ ...state, hotspots: next });
    };
    const removeHotspot = (id) => {
        const next = state.hotspots.filter(h => h.id !== id);
        setState({ ...state, hotspots: next, showHotspotPreview: next[0]?.id });
    };
    const addHotspot = () => {
        const id = 'h' + Date.now().toString(36);
        const next = [...state.hotspots, {
            id,
            screen: state.activeScreen,
            x: 0.45, y: 0.40,
            kind: 'tooltip',
            title: 'Novo hotspot',
            text: 'Descreva o que esse callout destaca para o prospect.',
            link: '',
            cta: '',
            videoUrl: '',
            videoDuration: '',
        }];
        setState({ ...state, hotspots: next, showHotspotPreview: id });
    };
    const reorder = (id, dir) => {
        const allOnScreen = state.hotspots.filter(h => h.screen === state.activeScreen);
        const idx = allOnScreen.findIndex(h => h.id === id);
        const swap = dir === 'up' ? idx - 1 : idx + 1;
        if (swap < 0 || swap >= allOnScreen.length) return;
        /* Swap their positions in the master array */
        const newArr = [...state.hotspots];
        const aIdx = newArr.findIndex(h => h.id === allOnScreen[idx].id);
        const bIdx = newArr.findIndex(h => h.id === allOnScreen[swap].id);
        [newArr[aIdx], newArr[bIdx]] = [newArr[bIdx], newArr[aIdx]];
        setState({ ...state, hotspots: newArr });
    };

    return (
        <div className="hotspots">
            {screenHotspots.map((h, i) => {
                const kind = HOTSPOT_KINDS[h.kind];
                const selected = sel === h.id;
                return (
                    <div key={h.id} className={`hotspot-card${selected ? ' selected' : ''}`}>
                        <div className="hotspot-row" onClick={() => setShow(selected ? null : h.id)}>
                            <span className="hotspot-num" style={{ background: kind.color }}>{i + 1}</span>
                            <span className="hotspot-info">
                                <span className="hotspot-text">{h.title}</span>
                                <span className="hotspot-meta">
                                    <span className="hotspot-type-pill">
                                        <Icon name={kind.icon} size={9} style={{ marginRight: 3, verticalAlign: -1 }} />
                                        {kind.label}
                                    </span>
                                    {h.cta && <span>· "{h.cta}"</span>}
                                    {h.videoDuration && <span>· {h.videoDuration}</span>}
                                </span>
                            </span>
                            <div className="hotspot-row-actions" onClick={(e) => e.stopPropagation()}>
                                <button className="hr-btn" onClick={() => reorder(h.id, 'up')} title="Subir"
                                        disabled={i === 0}>
                                    <Icon name="arrow-up" size={11} />
                                </button>
                                <button className="hr-btn" onClick={() => reorder(h.id, 'down')} title="Descer"
                                        disabled={i === screenHotspots.length - 1}>
                                    <Icon name="arrow-up" size={11} style={{ transform: 'rotate(180deg)' }} />
                                </button>
                                <button className="hr-btn hr-btn--danger" onClick={() => removeHotspot(h.id)} title="Excluir">
                                    <Icon name="trash" size={11} />
                                </button>
                            </div>
                        </div>
                        {selected && (
                            <div className="hotspot-edit">
                                <div className="field-label" style={{ marginBottom: 6 }}>Tipo</div>
                                <div className="hotspot-types">
                                    {Object.entries(HOTSPOT_KINDS).map(([k, v]) => (
                                        <button
                                            key={k}
                                            className={`hotspot-type-btn${h.kind === k ? ' active' : ''}`}
                                            onClick={() => updateHotspot(h.id, { kind: k })}
                                            style={h.kind === k ? { borderColor: v.color, color: v.color } : null}
                                        >
                                            <Icon name={v.icon} size={11} />
                                            {v.label}
                                        </button>
                                    ))}
                                </div>

                                <div className="field-label" style={{ marginTop: 12, marginBottom: 6 }}>Título</div>
                                <input
                                    className="f-input"
                                    value={h.title}
                                    onChange={(e) => updateHotspot(h.id, { title: e.target.value })}
                                />

                                <div className="field-label" style={{ marginTop: 10, marginBottom: 6 }}>Texto / descrição</div>
                                <textarea
                                    className="f-input"
                                    rows={3}
                                    style={{ resize: 'vertical', minHeight: 60 }}
                                    value={h.text}
                                    onChange={(e) => updateHotspot(h.id, { text: e.target.value })}
                                />

                                {/* Type-specific fields */}
                                {h.kind === 'video' && (
                                    <>
                                        <div className="field-row-2">
                                            <div>
                                                <div className="field-label" style={{ marginBottom: 6 }}>URL do vídeo</div>
                                                <input
                                                    className="f-input"
                                                    placeholder="https://loom.com/share/..."
                                                    value={h.videoUrl || ''}
                                                    onChange={(e) => updateHotspot(h.id, { videoUrl: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <div className="field-label" style={{ marginBottom: 6 }}>Duração</div>
                                                <input
                                                    className="f-input"
                                                    placeholder="0:42"
                                                    value={h.videoDuration || ''}
                                                    onChange={(e) => updateHotspot(h.id, { videoDuration: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}
                                {(h.kind === 'cta' || h.kind === 'hyperlink') && (
                                    <>
                                        <div className="field-label" style={{ marginTop: 10, marginBottom: 6 }}>
                                            Label do botão
                                        </div>
                                        <input
                                            className="f-input"
                                            placeholder={h.kind === 'cta' ? 'Agendar próxima call' : 'Ver case completo'}
                                            value={h.cta || ''}
                                            onChange={(e) => updateHotspot(h.id, { cta: e.target.value })}
                                        />
                                        <div className="field-label" style={{ marginTop: 10, marginBottom: 6 }}>
                                            Link de destino
                                        </div>
                                        <input
                                            className="f-input f-input--mono"
                                            placeholder="https://..."
                                            value={h.link || ''}
                                            onChange={(e) => updateHotspot(h.id, { link: e.target.value })}
                                        />
                                    </>
                                )}

                                <div className="field-label" style={{ marginTop: 12, marginBottom: 6 }}>
                                    Posição na tela
                                </div>
                                <div className="position-row">
                                    <span>X</span>
                                    <input
                                        type="range" min="0.05" max="0.95" step="0.01"
                                        value={h.x}
                                        onChange={(e) => updateHotspot(h.id, { x: Number(e.target.value) })}
                                    />
                                    <span className="position-val">{Math.round(h.x * 100)}%</span>
                                    <span>Y</span>
                                    <input
                                        type="range" min="0.05" max="0.95" step="0.01"
                                        value={h.y}
                                        onChange={(e) => updateHotspot(h.id, { y: Number(e.target.value) })}
                                    />
                                    <span className="position-val">{Math.round(h.y * 100)}%</span>
                                </div>
                                <div className="field-hint" style={{ marginTop: 6 }}>
                                    Ou arraste o pin direto no preview.
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
            <button className="hotspot-add" onClick={addHotspot}>
                <Icon name="plus" size={12} />
                Adicionar hotspot na tela <strong style={{ marginLeft: 4 }}>{state.activeScreen}</strong>
            </button>
        </div>
    );
}

/* ==================================================================
   The full panel
   ================================================================== */
function BuilderPanel({ state, setState }) {
    const setExpanded = (n) => setState({ ...state, expanded: state.expanded === n ? null : n });

    const LEVELS = [
        {
            num: 1,
            name: 'Cosmética',
            blurb: 'Logo, nome, cores e usuário logado.',
            status: 'Aplicado',
            applied: true,
            Body: Level1Body,
        },
        {
            num: 2,
            name: 'Dados realistas do segmento',
            blurb: 'Fornecedores, SKUs, KPIs do setor do prospect.',
            status: 'Aplicado',
            applied: true,
            Body: Level2Body,
        },
        {
            num: 3,
            name: 'Fluxo personalizado por persona',
            blurb: 'Ramificações por audiência: Ops, CFO, CIO, Analista.',
            status: 'Aplicado',
            applied: true,
            Body: Level3Body,
        },
        {
            num: 4,
            name: 'Variáveis dinâmicas (template)',
            blurb: 'Preencha um form, gere a demo.',
            status: 'Aplicado',
            applied: true,
            Body: Level4Body,
        },
        {
            num: 5,
            name: 'Conteúdo guiado contextual',
            blurb: 'Tooltips, vídeos do AE e CTAs no fluxo.',
            status: '3 de 4 hotspots',
            applied: false,
            partial: true,
            Body: Level5Body,
        },
    ];

    const totalApplied = LEVELS.filter(l => l.applied).length;
    const progressPct = (totalApplied / LEVELS.length) * 100;

    return (
        <div className="studio-panel">
            <div className="panel-head">
                <div className="title">Personalização da demo</div>
                <div className="sub">
                    5 níveis em camadas. Comece pelo básico (cosmética), pare quando a
                    demo estiver convincente para o prospect.
                </div>
                <div className="progress-row">
                    <div className="progress-bar">
                        <span style={{ width: progressPct + '%' }} />
                    </div>
                    <span className="progress-label">{totalApplied} de 5</span>
                </div>
            </div>

            <div className="levels-list">
                {LEVELS.map((L) => {
                    const open = state.expanded === L.num;
                    return (
                        <div key={L.num} className={`lvl${open ? ' open' : ''}${L.applied ? ' applied' : ''}${L.partial ? ' partial' : ''}`}>
                            <button className="lvl-head" onClick={() => setExpanded(L.num)}>
                                <span className="lvl-num">
                                    {L.applied ? <Icon name="check" size={12} stroke={2.5} /> : L.num}
                                </span>
                                <span className="lvl-info">
                                    <span className="lvl-name">
                                        {L.name}
                                        {L.num === 4 && <span className="lvl-tag">Template</span>}
                                        {L.num === 5 && <span className="lvl-tag">Beta</span>}
                                    </span>
                                    <span className="lvl-blurb">{L.blurb}</span>
                                </span>
                                <span className="lvl-status">{L.status}</span>
                                <span className="lvl-chevron">
                                    <Icon name="chevron-down" size={14} />
                                </span>
                            </button>
                            {open && <L.Body state={state} setState={setState} />}
                        </div>
                    );
                })}
            </div>

            <div className="panel-foot">
                <div className="left-text">
                    <div className="em">Pronto para a call</div>
                    <div>Última edição há 2 min · backup automático</div>
                </div>
                <button className="tbtn tbtn--primary">
                    <Icon name="share" size={13} />
                    Compartilhar
                </button>
            </div>
        </div>
    );
}

Object.assign(window, { BuilderPanel });

/* ==================================================================
   QuestionAnswerEditor — expanded form to edit a question's response
   (narrative text + KPI grid or custom HTML), used inside Level 5.
   ================================================================== */
function QuestionAnswerEditor({ question, onUpdateAnswer, onUpdateArtifact, onUpdateKpi, onAddKpi, onRemoveKpi }) {
    const answer = question.answer || {};
    const artifact = answer.artifact || { type: 'kpi-grid', kpis: [] };

    const switchType = (newType) => {
        if (newType === 'kpi-grid') {
            onUpdateArtifact({
                type: 'kpi-grid',
                title: artifact.title || 'Resumo',
                meta: artifact.meta || ['Período', 'Escopo'],
                kpis: artifact.kpis && artifact.kpis.length ? artifact.kpis : [
                    { label: 'KPI PRINCIPAL', value: '0', sub: 'descrição', highlight: true },
                ],
            });
        } else {
            onUpdateArtifact({
                type: 'custom-html',
                html: artifact.html || '<div style="padding:16px;border-radius:8px;background:#F4F1FE;color:#42289E">\n  <h3 style="margin:0 0 4px;font-size:14px;font-weight:500">Resposta para {{empresa}}</h3>\n  <p style="margin:0;font-size:12px">Substitua este HTML pelo template do prospect. Use {{variaveis}} onde quiser injetar dados.</p>\n</div>',
            });
        }
    };

    /* Trigger an upload-then-read for custom HTML */
    const fileRef = React.useRef(null);
    const uploadHTML = (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        const r = new FileReader();
        r.onload = () => onUpdateArtifact({ type: 'custom-html', html: String(r.result || '') });
        r.readAsText(f);
        e.target.value = '';
    };

    return (
        <div className="answer-editor">
            <div className="ae-section">
                <div className="ae-label">
                    Resposta narrativa
                    <span className="ae-hint">use **negrito** e <code>{'{{var}}'}</code></span>
                </div>
                <textarea
                    className="f-input"
                    rows={5}
                    style={{ resize: 'vertical', minHeight: 80 }}
                    placeholder="Identifiquei 3 gargalos principais no fluxo P2P da {{empresa}}..."
                    value={answer.text || ''}
                    onChange={(e) => onUpdateAnswer({ text: e.target.value })}
                />
            </div>

            <div className="ae-section">
                <div className="ae-label">Tipo de artefato</div>
                <div className="ae-type-tabs">
                    <button
                        className={`ae-type-tab${artifact.type !== 'custom-html' ? ' active' : ''}`}
                        onClick={() => switchType('kpi-grid')}
                    >
                        <Icon name="bar-chart-3" size={11} /> KPI grid
                    </button>
                    <button
                        className={`ae-type-tab${artifact.type === 'custom-html' ? ' active' : ''}`}
                        onClick={() => switchType('custom-html')}
                    >
                        <Icon name="code" size={11} /> HTML custom
                    </button>
                </div>
            </div>

            {artifact.type !== 'custom-html' ? (
                <>
                    <div className="ae-section">
                        <div className="ae-label">Título do artefato</div>
                        <input
                            className="f-input"
                            value={artifact.title || ''}
                            placeholder="Tendências de Spend por Categoria"
                            onChange={(e) => onUpdateArtifact({ title: e.target.value })}
                        />
                    </div>
                    <div className="ae-section">
                        <div className="ae-label">
                            Meta-info (chips abaixo do título)
                            <span className="ae-hint">separe por vírgula</span>
                        </div>
                        <input
                            className="f-input"
                            value={(artifact.meta || []).join(', ')}
                            placeholder="Últimos 12 meses, 11 categorias ativas, Spend total: R$ 417,1 Mi"
                            onChange={(e) => onUpdateArtifact({ meta: e.target.value.split(',').map(s => s.trim()) })}
                        />
                    </div>
                    <div className="ae-section">
                        <div className="ae-label">KPIs</div>
                        <div className="ae-kpis">
                            {(artifact.kpis || []).map((k, i) => (
                                <div key={i} className={`ae-kpi${k.highlight ? ' highlight' : ''}`}>
                                    <div className="ae-kpi-row">
                                        <input
                                            className="f-input"
                                            placeholder="LABEL EM CAIXA ALTA"
                                            value={k.label || ''}
                                            onChange={(e) => onUpdateKpi(i, { label: e.target.value })}
                                        />
                                        <button
                                            className={`hr-btn${k.highlight ? ' hr-btn--has' : ''}`}
                                            onClick={() => onUpdateKpi(i, { highlight: !k.highlight })}
                                            title="Destaque (cor roxa)"
                                        >
                                            <Icon name="sparkles" size={10} />
                                        </button>
                                        <button className="hr-btn hr-btn--danger" onClick={() => onRemoveKpi(i)} title="Remover">
                                            <Icon name="trash" size={10} />
                                        </button>
                                    </div>
                                    <input
                                        className="f-input ae-kpi-value"
                                        placeholder="R$ {{spend_total}}"
                                        value={k.value || ''}
                                        onChange={(e) => onUpdateKpi(i, { value: e.target.value })}
                                    />
                                    <input
                                        className="f-input"
                                        placeholder="subtítulo · período"
                                        value={k.sub || ''}
                                        onChange={(e) => onUpdateKpi(i, { sub: e.target.value })}
                                    />
                                </div>
                            ))}
                            <button className="hotspot-add" onClick={onAddKpi}>
                                <Icon name="plus" size={11} /> Adicionar KPI
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <div className="ae-section">
                    <div className="ae-label">
                        HTML personalizado
                        <span className="ae-hint">
                            <button className="ae-mini-btn" onClick={() => fileRef.current?.click()}>
                                <Icon name="file-text" size={10} /> Upload .html
                            </button>
                        </span>
                    </div>
                    <input
                        ref={fileRef}
                        type="file"
                        accept=".html,.htm"
                        style={{ display: 'none' }}
                        onChange={uploadHTML}
                    />
                    <textarea
                        className="f-input f-input--mono"
                        rows={10}
                        style={{ resize: 'vertical', minHeight: 160 }}
                        placeholder='<div class="card"><h3>{{empresa}}</h3><p>R$ {{spend_total}}</p></div>'
                        value={artifact.html || ''}
                        onChange={(e) => onUpdateArtifact({ html: e.target.value })}
                    />
                    <div className="field-hint" style={{ marginTop: 6 }}>
                        Renderizado diretamente no chat. Use <code>{'{{variavel}}'}</code> em qualquer ponto — será
                        substituído por <code>state.vars.variavel</code> em tempo real.
                    </div>
                </div>
            )}
        </div>
    );
}

Object.assign(window, { QuestionAnswerEditor });
