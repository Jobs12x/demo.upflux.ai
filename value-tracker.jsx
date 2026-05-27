/* === value-tracker.jsx ===============================================
   RoAI Value Tracker — full configurable surface.
   Replaces the old PreviewRoAI in preview.jsx.

   Features:
   - Period selector (3m / 6m / 12m / Tudo)
   - Alert banner for overdue plans
   - 3 hero KPI cards (Pipeline Total / Realizado / Taxa de Conversão)
   - Pipeline de Valor (5 status cards)
   - Charts: Ganhos por Status horizontal bars + Composição donut
   - Summary panels: Ganhos by status / Planos by status
   - Planos de Ação Kanban with drag/drop + add/edit
   - Side panel: Assistente de Valor (chat + quick actions)
   ===================================================================== */

const VT_COLUMNS = [
    { id: 'backlog',      label: 'Backlog' },
    { id: 'planejado',    label: 'Planejado' },
    { id: 'emAndamento',  label: 'Em Andamento' },
    { id: 'concluido',    label: 'Concluído' },
    { id: 'cancelado',    label: 'Cancelado' },
];

function PreviewRoAI({ state, onSetState }) {
    const vt = state.valueTracker;
    const setVT = (patch) => onSetState({
        ...state,
        valueTracker: { ...vt, ...(typeof patch === 'function' ? patch(vt) : patch) }
    });
    /* Assistant collapsed by default — the browser-body frame is narrow */
    const [collapsedAssistant, setCollapsedAssistant] = React.useState(true);

    return (
        <div className="vt-screen">
            <div className="vt-main">
                <VTHeader state={state} setVT={setVT} />
                {vt.alert && <VTAlert alert={vt.alert} />}
                <VTHeroKPIs vt={vt} setVT={setVT} state={state} />
                <VTPipelineValor vt={vt} setVT={setVT} state={state} />
                <VTCharts vt={vt} state={state} />
                <VTSummary vt={vt} state={state} />
                <VTKanban vt={vt} setVT={setVT} state={state} />
            </div>
            {!collapsedAssistant && (
                <VTAssistant
                    vt={vt}
                    setVT={setVT}
                    onCollapse={() => setCollapsedAssistant(true)}
                />
            )}
            {collapsedAssistant && (
                <button
                    className="vt-assistant-fab"
                    onClick={() => setCollapsedAssistant(false)}
                    title="Abrir Assistente de Valor"
                >
                    <Icon name="sparkles" size={16} />
                </button>
            )}
        </div>
    );
}

/* ==================================================================
   HEADER
   ================================================================== */
function VTHeader({ state, setVT }) {
    const vt = state.valueTracker;
    const periods = [
        { id: '3m',  label: '3 meses' },
        { id: '6m',  label: '6 meses' },
        { id: '12m', label: '12 meses' },
        { id: 'all', label: 'Tudo' },
    ];
    return (
        <div className="vt-header">
            <h2 className="screen-title vt-title">RoAI - Value Tracker</h2>
            <div className="vt-period">
                <Icon name="clock" size={13} style={{ color: 'var(--text-muted)' }} />
                {periods.map(p => (
                    <button
                        key={p.id}
                        className={`vt-period-btn${vt.period === p.id ? ' active' : ''}`}
                        onClick={() => setVT({ period: p.id })}
                    >
                        {p.label}
                    </button>
                ))}
                <button className="vt-icon-btn" title="Atualizar"><Icon name="refresh-cw" size={12} /></button>
                <button className="vt-icon-btn" title="Recolher"><Icon name="chevron-down" size={12} /></button>
            </div>
        </div>
    );
}

/* ==================================================================
   ALERT BANNER
   ================================================================== */
function VTAlert({ alert }) {
    return (
        <div className="vt-alert">
            <Icon name="alert-triangle" size={14} />
            <span>{alert.message}</span>
        </div>
    );
}

/* ==================================================================
   HERO KPIs (3 cards)
   ================================================================== */
function VTHeroKPIs({ vt, setVT, state }) {
    const k = vt.kpis;
    return (
        <div className="vt-hero-grid">
            <div className="vt-hero-card">
                <div className="vt-hero-label">{k.pipelineTotal.label}</div>
                <div className="vt-hero-value">
                    <Editable id="vt.k.pipeline" defaultValue={k.pipelineTotal.value} />
                </div>
                <div className="vt-hero-bar"><span style={{ width: '5%' }} /></div>
                <div className="vt-hero-meta">
                    <Editable id="vt.k.pipeline.sub1" defaultValue={k.pipelineTotal.meta.realizado} />
                    {' · '}
                    <Editable id="vt.k.pipeline.sub2" defaultValue={k.pipelineTotal.meta.meta} />
                </div>
            </div>
            <div className="vt-hero-card">
                <div className="vt-hero-label">{k.realizado.label}</div>
                <div className="vt-hero-value vt-hero-value--success">
                    <Editable id="vt.k.realizado" defaultValue={k.realizado.value} />
                </div>
                <div className="vt-hero-meta">
                    <Editable id="vt.k.realizado.sub" defaultValue={k.realizado.meta} />
                </div>
            </div>
            <div className="vt-hero-card">
                <div className="vt-hero-label">{k.conversao.label}</div>
                <div className="vt-hero-conv-row">
                    <div className="vt-hero-value vt-hero-value--purple">
                        <Editable id="vt.k.conversao" defaultValue={k.conversao.value} />
                    </div>
                    <VTConversionDonut pct={k.conversao.donutPct} />
                </div>
                <div className="vt-hero-meta">
                    <Editable id="vt.k.conversao.sub" defaultValue={k.conversao.meta} />
                </div>
            </div>
        </div>
    );
}

function VTConversionDonut({ pct }) {
    const r = 16;
    const C = 2 * Math.PI * r;
    const dash = (pct / 100) * C;
    return (
        <svg width="48" height="48" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
            <circle cx="24" cy="24" r={r} fill="none" stroke="#F0EBFA" strokeWidth="5" />
            <circle cx="24" cy="24" r={r} fill="none" stroke="#6D4ADD" strokeWidth="5" strokeLinecap="round"
                strokeDasharray={`${dash} ${C - dash}`} transform="rotate(-90 24 24)" />
            <text x="24" y="27" textAnchor="middle" fontSize="10" fontWeight="600" fill="#6D4ADD">
                {pct}%
            </text>
        </svg>
    );
}

/* ==================================================================
   PIPELINE DE VALOR (5 status cards)
   ================================================================== */
function VTPipelineValor({ vt, setVT, state }) {
    return (
        <div>
            <div className="vt-section-title">Pipeline de Valor</div>
            <div className="vt-pipeline-grid">
                {vt.pipelineValor.map((p, i) => (
                    <div key={p.id} className="vt-pipeline-card" style={{ borderTopColor: p.color }}>
                        <div className="vt-pipeline-row">
                            <div className="vt-pipeline-label" style={{ color: p.color }}>
                                <Editable id={`vt.pv.${i}.label`} defaultValue={p.label} />
                            </div>
                            <span className="vt-pipeline-count">
                                <Editable id={`vt.pv.${i}.count`} defaultValue={String(p.count)} />
                            </span>
                        </div>
                        <div className="vt-pipeline-value">
                            <Editable id={`vt.pv.${i}.value`} defaultValue={p.value} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ==================================================================
   CHARTS: Ganhos por Status (horizontal) + Composição (donut)
   ================================================================== */
function VTCharts({ vt, state }) {
    const STATUS_COLOR = {
        realizado:    { color: '#10B981', label: 'Realizado' },
        bloqueado:    { color: '#EF4444', label: 'Bloqueado (vencido)' },
        emAndamento:  { color: '#F59E0B', label: 'Em andamento' },
        semPlano:     { color: '#9CA3AF', label: 'Sem plano' },
    };
    const maxValor = Math.max(...vt.ganhos.map(g => g.valor));

    return (
        <div className="vt-charts-grid">
            <Card>
                <div className="vt-card-head">
                    <span className="vt-card-title">Ganhos Identificados por Status</span>
                </div>
                <div className="vt-bars">
                    {vt.ganhos.map((g, i) => {
                        const stat = STATUS_COLOR[g.status] || STATUS_COLOR.semPlano;
                        const pct = (g.valor / maxValor) * 100;
                        return (
                            <div key={i} className="vt-bar-row">
                                <div className="vt-bar-label">{g.label}</div>
                                <div className="vt-bar-wrap">
                                    <span className="vt-bar" style={{ width: pct + '%', background: stat.color }} />
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="vt-legend">
                    {Object.values(STATUS_COLOR).map((s, i) => (
                        <span key={i} className="vt-legend-item">
                            <span className="vt-legend-dot" style={{ background: s.color }} />
                            {s.label}
                        </span>
                    ))}
                </div>
            </Card>

            <Card>
                <div className="vt-card-head">
                    <span className="vt-card-title">Composição do Pipeline</span>
                </div>
                <div className="vt-donut-wrap">
                    <VTDonut data={vt.composicao} />
                </div>
                <div className="vt-legend">
                    {vt.composicao.map((c, i) => (
                        <span key={i} className="vt-legend-item">
                            <span className="vt-legend-dot" style={{ background: c.color }} />
                            {c.label}
                        </span>
                    ))}
                </div>
            </Card>
        </div>
    );
}

function VTDonut({ data }) {
    const size = 160;
    const r = 60;
    const cx = size / 2, cy = size / 2;
    const total = data.reduce((s, d) => s + d.pct, 0);
    let acc = 0;
    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {data.map((d, i) => {
                const startAngle = (acc / total) * 2 * Math.PI - Math.PI / 2;
                const endAngle = ((acc + d.pct) / total) * 2 * Math.PI - Math.PI / 2;
                acc += d.pct;
                const x1 = cx + r * Math.cos(startAngle);
                const y1 = cy + r * Math.sin(startAngle);
                const x2 = cx + r * Math.cos(endAngle);
                const y2 = cy + r * Math.sin(endAngle);
                const largeArc = (endAngle - startAngle) > Math.PI ? 1 : 0;
                const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
                return <path key={i} d={path} fill={d.color} />;
            })}
            <circle cx={cx} cy={cy} r={r * 0.55} fill="#FFFFFF" />
        </svg>
    );
}

/* ==================================================================
   SUMMARY by status (Ganhos / Planos)
   ================================================================== */
function VTSummary({ vt, state }) {
    return (
        <div className="vt-charts-grid">
            <SummaryPanel
                title="Resumo por Status — Ganhos"
                items={vt.resumoGanhos}
                idPrefix="vt.rg"
            />
            <SummaryPanel
                title="Resumo por Status — Planos"
                items={vt.resumoPlanos}
                idPrefix="vt.rp"
            />
        </div>
    );
}

function SummaryPanel({ title, items, idPrefix }) {
    const total = items.reduce((s, x) => s + x.count, 0);
    const max = Math.max(...items.map(x => x.count));
    return (
        <Card>
            <div className="vt-card-head">
                <span className="vt-card-title">{title}</span>
                <span className="vt-card-total">Total: {total}</span>
            </div>
            <div className="vt-bars">
                {items.map((it, i) => (
                    <div key={i} className="vt-bar-row vt-bar-row--summary">
                        <div className="vt-bar-label">
                            <Editable id={`${idPrefix}.${i}.label`} defaultValue={it.label} />
                        </div>
                        <div className="vt-bar-wrap">
                            <span className="vt-bar" style={{ width: ((it.count / max) * 100) + '%', background: it.color }} />
                        </div>
                        <span className="vt-bar-count">
                            <Editable id={`${idPrefix}.${i}.count`} defaultValue={String(it.count)} />
                        </span>
                    </div>
                ))}
            </div>
        </Card>
    );
}

Object.assign(window, { PreviewRoAI, VT_COLUMNS });
