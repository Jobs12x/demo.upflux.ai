/* === preview.jsx ====================================================
   Renders the personalized Nous app inside the browser frame.
   Reactive to:
   - state.cosmetic       (Level 1 → sidebar branding, user name)
   - state.data           (Level 2 → suppliers, KPI values, SKUs)
   - state.persona        (Level 3 → which screen opens + first message)
   - state.vars           (Level 4 → variable substitution in text)
   - state.hotspots       (Level 5 → overlayed callouts)
   - state.activeScreen   (which Nous surface is on screen)
   ===================================================================== */

const { DOCOL, PERSONAS, FR_MAP, DYNAMIC_VARS } = window.STUDIO_DATA;

/* ---------- helpers ---------- */
function firstName(full) { return (full || '').trim().split(' ')[0]; }
function initialsOf(full) {
    return (full || '').trim().split(/\s+/).slice(0,2).map(s => s[0] || '').join('').toUpperCase();
}
function findPersona(id) { return PERSONAS.find(p => p.id === id) || PERSONAS[0]; }
function timeGreeting() {
    const h = new Date().getHours();
    return h < 12 ? 'manhã' : h < 18 ? 'tarde' : 'noite';
}

/* Pull the canonical value for a variable. Vars override; fall back to
   the original Level 1/3 source so the preview always renders something. */
function V(state, key, fallback) {
    const raw = state.vars?.[key];
    if (raw !== undefined && String(raw).trim() !== '') return String(raw);
    return fallback ?? '';
}

/* Replace {{varname}} with state.vars[varname] (or {{varname}} if missing). */
function subVars(text, vars) {
    if (typeof text !== 'string' || !text) return text;
    return text.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k) => {
        const v = vars?.[k];
        return (v !== undefined && String(v).trim() !== '') ? String(v) : `{{${k}}}`;
    });
}

/* Render text that supports **bold** and \n as paragraphs. Used in
   question answers so AE can format the narrative simply. */
function RichText({ text, vars }) {
    const resolved = subVars(text || '', vars);
    const paragraphs = resolved.split(/\n\n+/);
    return (
        <>
            {paragraphs.map((p, pi) => (
                <p key={pi} style={{ marginBottom: pi < paragraphs.length - 1 ? 12 : 0 }}>
                    {p.split(/(\*\*[^*]+\*\*)/g).map((seg, si) =>
                        seg.startsWith('**') && seg.endsWith('**')
                            ? <strong key={si}>{seg.slice(2, -2)}</strong>
                            : <React.Fragment key={si}>{seg}</React.Fragment>
                    )}
                </p>
            ))}
        </>
    );
}

/* Render a question's answer artifact (kpi-grid or custom-html). */
function AnswerArtifact({ artifact, vars }) {
    if (!artifact) return null;
    if (artifact.type === 'custom-html') {
        const html = subVars(artifact.html || '', vars);
        return (
            <div className="answer-artifact answer-artifact--html">
                <div dangerouslySetInnerHTML={{ __html: html }} />
            </div>
        );
    }
    /* default: kpi-grid */
    return (
        <Card className="answer-artifact" style={{ marginTop: 18 }}>
            <div className="artifact-head">
                <div className="artifact-title">{subVars(artifact.title || 'Resposta', vars)}</div>
                <div className="artifact-toolbar">
                    {['bookmark', 'arrow-up', 'file-text', 'share', 'eye'].map((i, k) => (
                        <span key={k} className="artifact-tool"><Icon name={i === 'arrow-up' ? 'arrow-up' : 'file-text'} size={12} /></span>
                    ))}
                </div>
            </div>
            {Array.isArray(artifact.meta) && artifact.meta.length > 0 && (
                <div className="artifact-meta">
                    {artifact.meta.map((m, i) => (
                        <span key={i} className={i === 0 ? 'artifact-meta-active' : 'artifact-meta-item'}>
                            {subVars(m, vars)}
                        </span>
                    ))}
                </div>
            )}
            <div className="artifact-kpi-grid">
                {(artifact.kpis || []).map((k, i) => (
                    <div key={i} className={`artifact-kpi${k.highlight ? ' artifact-kpi--hl' : ''}`}>
                        <div className="artifact-kpi-label">{subVars(k.label, vars)}</div>
                        <div className="artifact-kpi-value">{subVars(k.value, vars)}</div>
                        {k.sub && <div className="artifact-kpi-sub">{subVars(k.sub, vars)}</div>}
                    </div>
                ))}
            </div>
        </Card>
    );
}

/* ---------- inline variable pill (level 4 preview mode) ---------- */
function Var({ k, vars, level4Open }) {
    const value = vars[k] ?? '';
    if (level4Open) {
        return <span className="var-pill">{`{{${k}}}`}</span>;
    }
    return <span className="var-resolved">{value}</span>;
}

/* ==================================================================
   PERSONALIZED SIDEBAR
   ================================================================== */
function PreviewSidebar({ state, onNavigate }) {
    const { cosmetic, persona, activeScreen } = state;
    const personaObj = findPersona(persona.activeId);
    const personaName = V(state, 'persona_nome', personaObj.name);
    const empresa = V(state, 'empresa', cosmetic.company);
    const recents = state.recentsByPersona?.[persona.activeId] || state.recentsByPersona?.ops || [];
    const primary = [
        { id: 'chat',    label: 'Chats',                icon: 'message-circle' },
        { id: 'mining',  label: 'Process Mining',       icon: 'bar-chart-3' },
        { id: 'agents',  label: 'Agentes',              icon: 'briefcase' },
        { id: 'roai',    label: 'RoAI - Value Tracker', icon: 'trending-up' },
        { id: 'rotinas', label: 'Rotinas',              icon: 'clock' },
        { id: 'achados', label: 'Achados',              icon: 'file-text' },
    ];
    const secondary = [
        { id: 'brain',     label: 'Nous Brain',  icon: 'brain' },
        { id: 'playground',label: 'Playground',  icon: 'flask' },
        { id: 'admin',     label: 'Admin Center',icon: 'settings' },
    ];

    return (
        <aside className="nous-sidebar">
            <div className="logo-row">
                <div className="lockup">
                    <NousMark size={26} />
                    <span className="lockup-text">
                        <strong>UpFlux</strong> <span className="regular">Nous</span>
                    </span>
                </div>
                <div className="sidebar-actions">
                    <button className="sidebar-bell" title="Notificações">
                        <Icon name="bell" size={14} />
                        <span className="bell-badge">22</span>
                        <span className="bell-dot" />
                    </button>
                    <button className="sidebar-collapse" title="Recolher menu">
                        <Icon name="panel-left-close" size={14} />
                    </button>
                </div>
            </div>
            <nav>
                {primary.map((n) => (
                    <NavItem
                        key={n.id}
                        icon={<Icon name={n.icon} size={16} />}
                        label={n.label}
                        active={activeScreen === n.id}
                        onClick={() => onNavigate(n.id)}
                    />
                ))}
            </nav>
            <Button
                variant="primary"
                icon={<Icon name="sparkles" size={14} />}
                full
                style={{ marginBottom: 12 }}
            >
                Pergunte ao Nous
            </Button>
            <div className="search-input" style={{ marginBottom: 16 }}>
                <Icon name="search" size={14} style={{ color: 'var(--text-muted)' }} />
                <input placeholder="Buscar..." />
            </div>
            <div style={{ marginBottom: 12 }}>
                <div className="section-label">{(empresa || '').toUpperCase()}</div>
                <button className="org-chip">
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        <Icon name="workflow" size={14} style={{ color: 'var(--nous-purple)' }} />
                        <span>1 - Compras ao Pagamento</span>
                    </span>
                    <Icon name="chevron-down" size={12} style={{ color: 'var(--text-muted)' }} />
                </button>
            </div>
            <div className="recents">
                <div className="section-label">Recentes</div>
                <div className="recents-list">
                    {recents.map((c) => (
                        <button key={c} className="recent-item" onClick={() => onNavigate('chat')}>{c}</button>
                    ))}
                </div>
            </div>
            <nav className="secondary-nav">
                {secondary.map((n) => (
                    <NavItem
                        key={n.id}
                        icon={<Icon name={n.icon} size={16} />}
                        label={n.label}
                    />
                ))}
            </nav>
            <div className="footer">
                <div className="user-row">
                    <div className="avatar">
                        {initialsOf(personaName)}
                    </div>
                    <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{personaName}</span>
                </div>
                <button className="trust">
                    <Icon name="shield" size={12} />Trust Center
                </button>
            </div>
        </aside>
    );
}

/* ==================================================================
   CHAT — landing + thread depending on persona
   ================================================================== */
function PreviewChat({ state, level4Open, onSetState }) {
    const { persona, vars, discovery, activeCategory } = state;
    const personaObj = findPersona(persona.activeId);
    const personaName = V(state, 'persona_nome', personaObj.name);
    const fn = firstName(personaName);

    /* threadActive opens an example reply thread when set */
    const threadActive = state.threadActive;
    const isAnalyst = personaObj.id === 'analyst';

    if (threadActive) {
        /* Look up the answer from the discovery library when available */
        const ref = state.threadQuestionRef;
        const question = ref && state.discovery?.[ref.category]?.find(q => q.id === ref.id);
        const answer = question?.answer;
        const questionLabel = question?.label || state.threadQuestion || 'Quais são os principais gargalos do nosso processo P2P no último trimestre?';

        return (
            <div className="nous-scroll" style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="chat-thread-bar">
                    <button className="chat-back-btn" onClick={() => onSetState({ ...state, threadActive: false, threadQuestionRef: null })}>
                        <Icon name="chevron-left" size={13} />
                        Nova conversa
                    </button>
                </div>
                <div className="chat-stream">
                    <ChatMessage role="user">{questionLabel}</ChatMessage>
                    {answer ? (
                        <ChatMessage role="assistant">
                            <div className="msg-assistant" style={{ marginBottom: 0 }}>
                                <RichText text={answer.text} vars={state.vars} />
                            </div>
                            {answer.artifact && <AnswerArtifact artifact={answer.artifact} vars={state.vars} />}
                        </ChatMessage>
                    ) : (isAnalyst ? <AnalystAnswer state={state} level4Open={level4Open} /> : <OpsAnswer state={state} level4Open={level4Open} />)}
                </div>
                <div className="composer-dock">
                    <ChatInput />
                </div>
            </div>
        );
    }

    return <ChatLanding state={state} firstName={fn} level4Open={level4Open} onSetState={onSetState} />;
}

/* Chat-home landing — greeting, composer, categorias (clickable) + expanded
   discovery questions when a category is open. Mirrors the real
   nous.upflux.ai/chat empty state. */
function ChatLanding({ state, firstName, level4Open, onSetState }) {
    const { discovery, activeCategory } = state;
    const setCategory = (cat) => onSetState({
        ...state,
        activeCategory: state.activeCategory === cat ? null : cat,
    });
    const CATS = [
        { id: 'estrategico', label: 'Estratégico' },
        { id: 'gestao',      label: 'Gestão' },
        { id: 'operacional', label: 'Operacional' },
    ];
    return (
        <div className="chat-home">
            <div className="mark"><NousMark size={56} /></div>
            <h1 className="greeting">
                Como posso ajudar nesta {timeGreeting()},{' '}
                {level4Open
                    ? <Var k="persona_nome" vars={state.vars} level4Open={true} />
                    : firstName}?
            </h1>
            <div className="composer-wrap"><ChatInput /></div>
            <div className="shortcuts">
                <span className="label">Ou explore por categoria:</span>
                {CATS.map((c) => (
                    <button
                        key={c.id}
                        className={`category-chip${activeCategory === c.id ? ' active' : ''}`}
                        onClick={() => setCategory(c.id)}
                    >
                        <span className="icon"><Icon name="sparkles" size={14} /></span>
                        {c.label}
                    </button>
                ))}
            </div>
            {activeCategory && (
                <div className="category-panel">
                    <div className="category-panel-head">
                        <span className="category-panel-title">
                            <Icon name="sparkles" size={13} style={{ color: 'var(--nous-purple)', marginRight: 6, verticalAlign: -1 }} />
                            {CATS.find(c => c.id === activeCategory).label}
                        </span>
                        <button className="category-panel-close" onClick={() => setCategory(null)}>×</button>
                    </div>
                    <ul className="category-questions">
                        {(discovery?.[activeCategory] || []).map((q) => (
                            <li
                                key={q.id}
                                className="category-question"
                                onClick={() => onSetState({
                                    ...state,
                                    threadActive: true,
                                    threadQuestion: q.label,
                                    threadQuestionRef: { category: activeCategory, id: q.id },
                                })}
                            >
                                <span className="qid">{q.id}</span>
                                <span className="qlabel">
                                    <Editable id={`discovery.${activeCategory}.${q.id}`} defaultValue={q.label} />
                                </span>
                                <Icon name="chevron-right" size={12} style={{ color: 'var(--text-muted)' }} />
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

/* Ops director answer — gargalos P2P, KPIs executivos */
function OpsAnswer({ state, level4Open }) {
    const { vars, cosmetic, data } = state;
    const empresa = V(state, 'empresa', cosmetic.company);
    const meta = V(state, 'meta_lead_time', '25 dias');
    return (
        <ChatMessage role="assistant">
            <p>
                Identifiquei <strong><Editable id="ops.gargalosCount" defaultValue="3" /> gargalos principais</strong> no fluxo P2P da{' '}
                {level4Open
                    ? <Var k="empresa" vars={vars} level4Open={true} />
                    : <span className="var-resolved">{empresa}</span>}
                {' '}no último trimestre. O maior impacto está na etapa de{' '}
                <strong>aprovação de PO acima de <Editable id="ops.aprovLimit" defaultValue="R$ 250k" /></strong>, com lead-time médio
                de <strong><Editable id="ops.leadTime" defaultValue="11d 6h" /></strong> — <Editable id="ops.vsMeta" defaultValue="2,4×" /> a meta do setor.
            </p>
            <div className="grid-3" style={{ marginTop: 16 }}>
                <KPICard
                    label={<Editable id="kpi.lt.label" defaultValue="LEAD TIME PO > 250K" />}
                    value={<Editable id="kpi.lt.value" defaultValue="11d 6h" />}
                    sentiment="danger"
                    delta={{ value: <><Editable id="kpi.lt.delta" defaultValue="38%" /> vs meta</>, positive: false }}
                    subtitle="último trimestre"
                />
                <KPICard
                    label={<Editable id="kpi.fora.label" defaultValue="POs FORA DO FLUXO" />}
                    value={<Editable id="kpi.fora.value" defaultValue="142" />}
                    sentiment="warning"
                    delta={{ value: <Editable id="kpi.fora.delta" defaultValue="12%" />, positive: false }}
                    subtitle={<><Editable id="kpi.fora.sub" defaultValue="11%" /> do total aprovado</>}
                />
                <KPICard
                    label={<Editable id="kpi.alc.label" defaultValue="VALOR EM ALÇADA" />}
                    value={<Editable id="kpi.alc.value" defaultValue="R$ 4,2M" />}
                    sentiment="info"
                    subtitle={<><Editable id="kpi.alc.sub" defaultValue={String(data.suppliers.length)} /> fornecedores impactados</>}
                />
            </div>
            <Card style={{ marginTop: 16 }}>
                <div className="kpi-label" style={{ marginBottom: 14 }}>
                    Etapas com maior lead-time · {empresa}
                </div>
                <Bottleneck step="Aprovação PO > R$ 250k" pct={92} value="11d 6h" tone="danger" />
                <Bottleneck step="Cotação multipla (≥3 fornecedores)" pct={68} value="6d 18h" tone="warning" />
                <Bottleneck step="Recebimento físico · Joinville" pct={42} value="2d 22h" tone="warning" />
                <Bottleneck step="Conferência fiscal" pct={22} value="0d 18h" />
                <Bottleneck step="Pagamento" pct={15} value="0d 06h" />
            </Card>
            <p style={{ marginTop: 16, color: 'var(--text-tertiary)', fontSize: 14 }}>
                <strong style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                    Próximo passo recomendado:
                </strong>{' '}
                automatizar o roteamento para aprovadores secundários quando o lead-time
                exceder 3 dias — estimativa de ganho de{' '}
                {level4Open
                    ? <Var k="meta_lead_time" vars={vars} level4Open={true} />
                    : <span className="var-resolved">{meta}</span>}{' '}
                no ciclo total.
            </p>
        </ChatMessage>
    );
}

/* Analyst answer — drill em cotações Wieland */
function AnalystAnswer({ state }) {
    const fornec = V(state, 'fornec_top', 'Wieland do Brasil');
    return (
        <ChatMessage role="assistant">
            <p>
                Encontrei <strong>7 cotações abertas</strong> com a <strong>{fornec}</strong>, todas
                acima de 5 dias sem retorno. Total previsto: <strong>R$ 1,82M</strong>.
            </p>
            <Card style={{ marginTop: 16 }}>
                <div className="kpi-label" style={{ marginBottom: 12 }}>
                    Cotações {fornec} · abertas
                </div>
                <table style={{ width: '100%', fontSize: 12.5, borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ color: 'var(--text-secondary)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            <th style={{ textAlign: 'left',  padding: '6px 8px', borderBottom: '1px solid var(--surface-elevated)' }}>RFQ</th>
                            <th style={{ textAlign: 'left',  padding: '6px 8px', borderBottom: '1px solid var(--surface-elevated)' }}>Material</th>
                            <th style={{ textAlign: 'right', padding: '6px 8px', borderBottom: '1px solid var(--surface-elevated)' }}>Valor previsto</th>
                            <th style={{ textAlign: 'right', padding: '6px 8px', borderBottom: '1px solid var(--surface-elevated)' }}>Aberta há</th>
                        </tr>
                    </thead>
                    <tbody style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>
                        {[
                            ['RFQ-2026-0489', 'Latão CW617N · 40kg/lote',      'R$ 482.300', '11 dias'],
                            ['RFQ-2026-0492', 'Latão CW602N · 25kg/lote',      'R$ 318.900', '9 dias'],
                            ['RFQ-2026-0501', 'Cobre eletrolítico C11000',      'R$ 264.500', '8 dias'],
                            ['RFQ-2026-0507', 'Latão CW724R · 18kg/lote',      'R$ 198.200', '7 dias'],
                            ['RFQ-2026-0513', 'Bronze SAE 660 · usinagem',     'R$ 184.700', '7 dias'],
                            ['RFQ-2026-0519', 'Vergalhão latão · diam. 25mm',  'R$ 218.400', '6 dias'],
                            ['RFQ-2026-0522', 'Tarugos latão · fund. semi',    'R$ 156.000', '5 dias'],
                        ].map((r, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                <td style={{ padding: '7px 8px', color: 'var(--nous-purple)' }}>{r[0]}</td>
                                <td style={{ padding: '7px 8px', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)' }}>{r[1]}</td>
                                <td style={{ padding: '7px 8px', textAlign: 'right' }}>{r[2]}</td>
                                <td style={{ padding: '7px 8px', textAlign: 'right', color: 'var(--danger)' }}>{r[3]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
            <p style={{ marginTop: 16, color: 'var(--text-tertiary)', fontSize: 14 }}>
                <strong style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                    Sugestão:
                </strong>{' '}
                escalar para o gestor de categoria — todas estas RFQs envolvem o mesmo
                comprador (Renato F.) e o histórico mostra resposta em 48h após escalação.
            </p>
        </ChatMessage>
    );
}

/* ==================================================================
   AGENTES — Docol-specific automations
   ================================================================== */
/* ==================================================================
   AGENTES — delegates to window.PreviewAgents (in agents-achados.jsx)
   ================================================================== */
/* Replaced by the version in agents-achados.jsx via window.PreviewAgents */

/* ==================================================================
   ROTINAS
   ================================================================== */
function PreviewRotinas({ state }) {
    const { cosmetic } = state;
    const empresa = V(state, 'empresa', cosmetic.company);
    const routines = [
        { name: 'Sync SAP MM · POs do dia',           when: 'A cada 30 min', last: 'há 12 min',  status: 'live',    desc: 'Importa POs criadas no SAP MM e atualiza o grafo de eventos do Process Mining.' },
        { name: 'Cálculo de KPIs · ciclo P2P',         when: 'Diário · 06:00', last: 'hoje 06:01', status: 'live',    desc: 'Recalcula lead-time, % aprovado fora do fluxo, glosa de NF e populariza o RoAI Value Tracker.' },
        { name: 'Notificação WhatsApp · gestores',     when: 'Diário · 08:30', last: 'hoje 08:30', status: 'live',    desc: 'Envia para Marcos Silveira + Camila Reis um snapshot do dia anterior com 3 KPIs.' },
        { name: 'Backup de eventos · Joinville',       when: 'Diário · 23:00', last: 'ontem 23:01',status: 'live',    desc: 'Snapshot dos eventos do polo de Joinville · 30 dias de retenção em S3.' },
        { name: 'Reindex semântico · base de dados',   when: 'Semanal · sábado',last: '17 mai',    status: 'paused',  desc: 'Reconstrói o índice semântico das descrições de material para melhorar a busca em pt-BR.' },
        { name: 'Sync Coupa · cotações abertas',       when: 'A cada 1h',      last: 'há 7 min',  status: 'live',    desc: 'Importa cotações abertas no Coupa para o pipeline de Achados.' },
    ];
    return (
        <div className="screen-pad nous-scroll">
            <h2 className="screen-title">Rotinas</h2>
            <p className="screen-sub">
                Tarefas agendadas que mantém o Nous em sincronia com SAP MM, Coupa e fontes
                de dados da {empresa}.
            </p>
            <Card padded={false}>
                <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ color: 'var(--text-secondary)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            <th style={{ textAlign: 'left',  padding: '12px 16px', borderBottom: '1px solid var(--surface-elevated)' }}>Rotina</th>
                            <th style={{ textAlign: 'left',  padding: '12px 16px', borderBottom: '1px solid var(--surface-elevated)' }}>Recorrência</th>
                            <th style={{ textAlign: 'left',  padding: '12px 16px', borderBottom: '1px solid var(--surface-elevated)' }}>Última execução</th>
                            <th style={{ textAlign: 'left',  padding: '12px 16px', borderBottom: '1px solid var(--surface-elevated)' }}>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {routines.map((r) => (
                            <tr key={r.name} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                <td style={{ padding: '14px 16px' }}>
                                    <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{r.name}</div>
                                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{r.desc}</div>
                                </td>
                                <td style={{ padding: '14px 16px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>{r.when}</td>
                                <td style={{ padding: '14px 16px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>{r.last}</td>
                                <td style={{ padding: '14px 16px' }}>
                                    <StatusPill status={r.status} dot={r.status !== 'draft'}>
                                        {r.status === 'live' ? 'Ao vivo' : r.status === 'paused' ? 'Pausada' : 'Rascunho'}
                                    </StatusPill>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
}

/* ==================================================================
   Top-level preview — picks the screen + overlays hotspots
   ================================================================== */
function NousPreview({ state, onNavigate, level4Open, onOpenFullMap, onSetState }) {
    let body;
    switch (state.activeScreen) {
        case 'mining':   body = <PreviewProcessMining state={state} onOpenFullMap={onOpenFullMap} />; break;
        case 'agents':   body = React.createElement(window.PreviewAgents, { state, onSetState }); break;
        case 'achados':  body = React.createElement(window.PreviewAchados, { state, onSetState }); break;
        case 'rotinas':  body = <PreviewRotinas state={state} />; break;
        case 'roai':     body = React.createElement(window.PreviewRoAI, { state, onSetState }); break;
        case 'chat':
        default:         body = <PreviewChat    state={state} level4Open={level4Open} onSetState={onSetState} />; break;
    }

    return (
        <div className="nous-app">
            <PreviewSidebar state={state} onNavigate={onNavigate} />
            <div className="nous-main">{body}</div>
        </div>
    );
}

Object.assign(window, { NousPreview });
