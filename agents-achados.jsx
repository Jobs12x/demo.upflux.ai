/* === agents-achados.jsx ==============================================
   PreviewAgents (with tabs + library + video demos)
   PreviewAchados (saved analyses with filters)
   ===================================================================== */

const AGENT_TAG_COLORS = {
    alertas:     { bg: '#FEE2E2', fg: '#991B1B', label: 'Alertas' },
    priorizador: { bg: '#FEF3C7', fg: '#92400E', label: 'Priorizador' },
    insights:    { bg: '#DBEAFE', fg: '#1E40AF', label: 'Insights' },
    autonomos:   { bg: '#D1FAE5', fg: '#065F46', label: 'Autônomos' },
};

/* ==================================================================
   AGENTS — main screen with Agentes / Biblioteca tabs
   ================================================================== */
function PreviewAgents({ state, onSetState }) {
    const a = state.agents;
    const setA = (patch) => onSetState({
        ...state,
        agents: { ...a, ...(typeof patch === 'function' ? patch(a) : patch) }
    });
    const [showVideo, setShowVideo] = React.useState(null);

    return (
        <div className="screen-pad nous-scroll ag-screen">
            <div className="ag-header">
                <div>
                    <h2 className="screen-title">Agentes</h2>
                    <p className="screen-sub">Automatize análises recorrentes com agentes inteligentes</p>
                </div>
                <button className="ag-new-btn" onClick={() => setA({ showNewAgent: true })}>
                    <Icon name="plus" size={13} />
                    Novo Agente
                </button>
            </div>

            <div className="ag-tabs">
                <button
                    className={`ag-tab${a.activeTab === 'agentes' ? ' active' : ''}`}
                    onClick={() => setA({ activeTab: 'agentes' })}
                >Agentes</button>
                <button
                    className={`ag-tab${a.activeTab === 'biblioteca' ? ' active' : ''}`}
                    onClick={() => setA({ activeTab: 'biblioteca' })}
                >Biblioteca</button>
            </div>

            {a.activeTab === 'agentes'
                ? <AgentesTab state={state} setA={setA} onPlayVideo={setShowVideo} />
                : <BibliotecaTab state={state} setA={setA} />}

            {showVideo && <AgentVideoModal video={showVideo} onClose={() => setShowVideo(null)} />}
            {a.showNewTemplate && <NewTemplateForm state={state} setA={setA} />}
        </div>
    );
}

/* ============ AGENTES TAB ============ */
function AgentesTab({ state, setA, onPlayVideo }) {
    const a = state.agents;
    const filtered = a.active.filter(ag => a.filter === 'all' || ag.category === a.filter);
    return (
        <>
            <FilterChips state={state} setA={setA} />
            <div className="ag-section-title ag-section-title--first">
                Agentes Autônomos P2P ({filtered.length})
            </div>
            <div className="ag-grid">
                {filtered.map(ag => <AgentCard key={ag.id} agent={ag} state={state} setA={setA} onPlay={onPlayVideo} />)}
            </div>
        </>
    );
}

function AgentCard({ agent, state, setA, onPlay }) {
    const tag = AGENT_TAG_COLORS[agent.category] || AGENT_TAG_COLORS.insights;
    const [editingVideo, setEditingVideo] = React.useState(false);
    const updateAgent = (patch) => {
        setA(curr => ({
            ...curr,
            active: curr.active.map(a => a.id === agent.id ? { ...a, ...patch } : a),
        }));
    };
    return (
        <div className="ag-card">
            <div className="ag-card-head">
                <span className="ag-card-name">
                    <Editable id={`ag.${agent.id}.name`} defaultValue={agent.name} />
                </span>
                <StatusPill status={agent.status} dot>
                    {agent.status === 'live' ? 'Ao vivo' : agent.status === 'paused' ? 'Pausada' : 'Rascunho'}
                </StatusPill>
            </div>
            <p className="ag-card-desc">
                <Editable id={`ag.${agent.id}.desc`} defaultValue={agent.desc} multiline />
            </p>
            <div className="ag-card-tagrow">
                <span className="ag-tag-pill" style={{ background: tag.bg, color: tag.fg }}>
                    {tag.label}
                </span>
                {(agent.tags || []).map(t => (
                    <span key={t} className="ag-tag-pill ag-tag-pill--ghost">{t}</span>
                ))}
            </div>
            <div className="ag-card-foot">
                {agent.demoVideo ? (
                    <button className="ag-video-btn" onClick={() => onPlay(agent)}>
                        <span className="ag-play-circle"><Icon name="play" size={10} /></span>
                        Ver vídeo demo
                    </button>
                ) : (
                    <span className="ag-no-video">Sem vídeo demo</span>
                )}
                <span className="ag-card-meta">
                    <Editable id={`ag.${agent.id}.lastrun`} defaultValue={agent.lastRun} />
                    {' · '}
                    <Editable id={`ag.${agent.id}.actions`} defaultValue={String(agent.actions)} />
                    {' ações'}
                </span>
            </div>
            <button
                className="ag-edit-video-btn"
                onClick={() => setEditingVideo(!editingVideo)}
            >
                <Icon name="edit-3" size={10} />
                {editingVideo ? 'Fechar' : (agent.demoVideo ? 'Editar vídeo & prompt' : 'Adicionar vídeo & prompt')}
            </button>
            {editingVideo && (
                <div className="ag-video-editor">
                    <label className="ag-form-row">
                        <span>URL do vídeo <em style={{ color: 'var(--text-muted)', fontWeight: 400, fontStyle: 'normal' }}>(deixe vazio para não ter vídeo)</em></span>
                        <input
                            className="f-input f-input--mono"
                            placeholder="assets/meu-video.mp4 ou https://loom.com/share/..."
                            value={agent.demoVideo || ''}
                            onChange={(e) => updateAgent({ demoVideo: e.target.value })}
                        />
                    </label>
                    <label className="ag-form-row">
                        <span>Prompt do agente</span>
                        <textarea
                            className="f-input f-input--mono"
                            rows={4}
                            placeholder="Descreva o que o agente analisa..."
                            value={agent.prompt || ''}
                            onChange={(e) => updateAgent({ prompt: e.target.value })}
                        />
                    </label>
                    <div className="ag-video-editor-actions">
                        {agent.demoVideo && (
                            <button className="ag-video-remove" onClick={() => { updateAgent({ demoVideo: '' }); }}>
                                <Icon name="trash" size={10} />
                                Remover vídeo
                            </button>
                        )}
                        <span className="ag-video-hint">
                            Suporta MP4 local, Loom, Vimeo, YouTube. Não é obrigatório.
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}

function AgentVideoModal({ video, onClose }) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal modal--wide ag-video-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-head">
                    <div>
                        <div className="modal-title">{video.name}</div>
                        <div className="modal-sub">Demo gravado · {video.lastRun} · {video.actions} ações</div>
                    </div>
                    <button className="modal-close" onClick={onClose}>
                        <Icon name="plus" size={16} style={{ transform: 'rotate(45deg)' }} />
                    </button>
                </div>
                <div className="ag-video-body">
                    {video.demoVideo && (
                        <video
                            src={video.demoVideo}
                            controls
                            autoPlay
                            playsInline
                            style={{ width: '100%', display: 'block', borderRadius: 8, background: '#000' }}
                        />
                    )}
                    {video.prompt && (
                        <div className="ag-video-prompt">
                            <div className="ag-video-prompt-label">Prompt do agente</div>
                            <pre className="ag-video-prompt-text">{video.prompt}</pre>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ============ BIBLIOTECA TAB ============ */
function BibliotecaTab({ state, setA }) {
    const a = state.agents;
    return (
        <>
            <div className="ag-bib-toolbar">
                <FilterChips state={state} setA={setA} />
                <button className="ag-new-btn ag-new-btn--ghost" onClick={() => setA({ showNewTemplate: true })}>
                    <Icon name="plus" size={13} />
                    Novo Template
                </button>
            </div>
            {a.library.map(group => (
                <React.Fragment key={group.category}>
                    <div className="ag-section-title">{group.category.toUpperCase()} ({group.items.length})</div>
                    <div className="ag-grid">
                        {group.items.map(item => <TemplateCard key={item.id} item={item} />)}
                    </div>
                </React.Fragment>
            ))}
        </>
    );
}

function TemplateCard({ item }) {
    const tag = AGENT_TAG_COLORS[item.tag] || AGENT_TAG_COLORS.insights;
    return (
        <div className="ag-card ag-card--template">
            <div className="ag-card-name">
                <Editable id={`ag.lib.${item.id}.name`} defaultValue={item.name} />
            </div>
            <p className="ag-card-desc">
                <Editable id={`ag.lib.${item.id}.desc`} defaultValue={item.desc} multiline />
            </p>
            <span className="ag-tag-pill" style={{ background: tag.bg, color: tag.fg, alignSelf: 'flex-start' }}>
                {tag.label}
            </span>
        </div>
    );
}

function FilterChips({ state, setA }) {
    const a = state.agents;
    return (
        <div className="ag-filters">
            {a.availableTags.map(t => (
                <button
                    key={t.id}
                    className={`ag-filter-chip${a.filter === t.id ? ' active' : ''}`}
                    onClick={() => setA({ filter: t.id })}
                >{t.label}</button>
            ))}
        </div>
    );
}

function NewTemplateForm({ state, setA }) {
    const [form, setForm] = React.useState({ name: '', desc: '', category: 'autonomos', tags: 'p2p', prompt: '' });
    const close = () => setA({ showNewTemplate: false });
    const publish = () => {
        if (!form.name.trim()) return;
        const id = 'tpl-' + Date.now().toString(36);
        const cat = state.agents.library.find(g => g.category === 'P2P') || state.agents.library[0];
        setA(curr => ({
            ...curr,
            showNewTemplate: false,
            library: curr.library.map(g => g === cat
                ? { ...g, items: [{ id, name: form.name, desc: form.desc, tag: form.category }, ...g.items] }
                : g),
        }));
    };
    return (
        <div className="modal-overlay" onClick={close}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-head">
                    <div>
                        <div className="modal-title">Novo Template para Biblioteca</div>
                        <div className="modal-sub">Cria um agente reutilizável para qualquer prospect.</div>
                    </div>
                    <button className="modal-close" onClick={close}>
                        <Icon name="plus" size={16} style={{ transform: 'rotate(45deg)' }} />
                    </button>
                </div>
                <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <label className="ag-form-row">
                        <span>Nome</span>
                        <input className="f-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ex: Weekly Value Summary" />
                    </label>
                    <label className="ag-form-row">
                        <span>Descrição</span>
                        <textarea className="f-input" rows={3} value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} placeholder="O que esse agente analisa..." />
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <label className="ag-form-row">
                            <span>Categoria</span>
                            <select className="f-input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                                <option value="autonomos">Autônomos</option>
                                <option value="alertas">Alertas</option>
                                <option value="priorizador">Priorizador</option>
                                <option value="insights">Insights</option>
                            </select>
                        </label>
                        <label className="ag-form-row">
                            <span>Tags <em style={{ color: 'var(--text-muted)', fontStyle: 'normal' }}>(separadas por vírgula)</em></span>
                            <input className="f-input" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="lead-time, kpi, p2p" />
                        </label>
                    </div>
                    <label className="ag-form-row">
                        <span>Prompt do agente</span>
                        <textarea className="f-input f-input--mono" rows={4} value={form.prompt} onChange={e => setForm({ ...form, prompt: e.target.value })} placeholder="Descreva o que o agente deve analisar..." />
                    </label>
                </div>
                <div className="modal-foot">
                    <button className="tbtn" onClick={close}>Cancelar</button>
                    <button className="tbtn tbtn--primary" onClick={publish}>
                        <Icon name="send" size={11} />
                        Publicar
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ==================================================================
   ACHADOS — saved analyses
   ================================================================== */
function PreviewAchados({ state, onSetState }) {
    const ach = state.achados;
    const setAch = (patch) => onSetState({
        ...state,
        achados: { ...ach, ...(typeof patch === 'function' ? patch(ach) : patch) }
    });
    const [search, setSearch] = React.useState('');
    const filtered = ach.items.filter(it => {
        if (ach.filter !== 'all' && ach.filter !== 'Todos' && it.category !== ach.filter) return false;
        if (search && !it.title.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    const removeItem = (id) => setAch(curr => ({ ...curr, items: curr.items.filter(i => i.id !== id) }));

    return (
        <div className="screen-pad nous-scroll ach-screen">
            <h2 className="screen-title">Achados</h2>
            <p className="screen-sub">Salve análises importantes direto do chat para encontrá-las aqui.</p>

            <div className="ach-toolbar">
                <div className="ach-search">
                    <Icon name="search" size={13} style={{ color: 'var(--text-muted)' }} />
                    <input
                        placeholder="Buscar..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <div className="ach-filters">
                    {ach.categories.map(cat => (
                        <button
                            key={cat}
                            className={`ach-filter-chip${(ach.filter === cat || (cat === 'Todos' && ach.filter === 'all')) ? ' active' : ''}`}
                            onClick={() => setAch({ filter: cat === 'Todos' ? 'all' : cat })}
                        >{cat}</button>
                    ))}
                </div>
            </div>

            <div className="ach-list">
                {filtered.map(item => (
                    <div className="ach-item" key={item.id}>
                        <span className="ach-icon"><Icon name="file-text" size={15} /></span>
                        <div className="ach-info">
                            <div className="ach-title">
                                <Editable id={`ach.${item.id}.title`} defaultValue={item.title} />
                            </div>
                            <div className="ach-meta">
                                <span className="ach-type">{item.type}</span>
                                <span> · </span>
                                <Editable id={`ach.${item.id}.date`} defaultValue={item.date} />
                                {item.preview && (
                                    <span className="ach-preview">
                                        {' · '}
                                        <Editable id={`ach.${item.id}.preview`} defaultValue={item.preview} />
                                    </span>
                                )}
                            </div>
                        </div>
                        {item.category && (
                            <span className="ach-category-pill">{item.category}</span>
                        )}
                        <div className="ach-actions">
                            <button className="ach-act-btn" title="Download"><Icon name="arrow-up" size={11} style={{ transform: 'rotate(180deg)' }} /></button>
                            <button className="ach-act-btn" title="Compartilhar"><Icon name="share" size={11} /></button>
                            <button className="ach-act-btn ach-act-btn--danger" onClick={() => removeItem(item.id)} title="Excluir">
                                <Icon name="trash" size={11} />
                            </button>
                        </div>
                    </div>
                ))}
                {filtered.length === 0 && (
                    <div className="ach-empty">
                        Nenhum achado para esse filtro.
                    </div>
                )}
            </div>
        </div>
    );
}

Object.assign(window, { PreviewAgents, PreviewAchados });
