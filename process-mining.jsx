/* === process-mining.jsx =============================================
   The Process Mining screen — variant discovery map (Docol P2P).
   Stylistically matches the reference: amber dot nodes, dashed amber
   edges from a purple cloud start, red circles for end states, time
   labels on edges, donut showing variant coverage, ranked variants
   list on the right, and a primary CTA to open the full map.
   ===================================================================== */

/* ---------- Node + edge definitions for the Docol P2P process ---------- */

/* SVG canvas: 1080 × 540  */
const PM_NODES = [
    { id: 'START',  x: 540, y: 60,  kind: 'start',  label: '' },
    { id: 'REQ',    x: 220, y: 160, kind: 'step',   label: 'Criação Requisição de Compra', count: 1283022 },
    { id: 'OC',     x: 540, y: 160, kind: 'step',   label: 'Criação Pedido de Compra', count: 538836 },
    { id: 'APRV1',  x: 50,  y: 260, kind: 'step',   label: 'Aprovação Categoria · Comprador', count: 0 },
    { id: 'APRV2',  x: 130, y: 360, kind: 'step',   label: 'Aprovador Diretoria · PO > R$ 250k', count: 201177 },
    { id: 'RECEB',  x: 540, y: 260, kind: 'step',   label: 'Recebimento Concluído · Joinville', count: 538836 },
    { id: 'AGUARD', x: 540, y: 360, kind: 'step',   label: 'Aguardando Aprovação Fiscal', count: 538836 },
    { id: 'DATAD',  x: 270, y: 460, kind: 'step',   label: 'Data Recebimento Desejada', count: 1283022 },
    { id: 'DATAP',  x: 510, y: 460, kind: 'step',   label: 'Data Recebimento Planejada', count: 1763539 },
    { id: 'NF',     x: 760, y: 460, kind: 'end',    label: 'Registro NF Entrada · Joinville', count: 44823768 },
    { id: 'PAY',    x: 960, y: 460, kind: 'end',    label: 'Registro Pagamento Wieland', count: 45419672 },
    { id: 'END',    x: 540, y: 530, kind: 'finish', label: '' },
];

/* Edges — { from, to, label?, dashed?, weight (1..4) } */
const PM_EDGES = [
    { from: 'START', to: 'REQ',   label: '0,00 Segundos', dashed: true,  weight: 3 },
    { from: 'START', to: 'OC',    label: '0,00 Segundos', dashed: true,  weight: 2 },
    { from: 'START', to: 'NF',    label: '',              dashed: true,  weight: 4 },
    { from: 'START', to: 'PAY',   label: '',              dashed: true,  weight: 4 },
    { from: 'REQ',   to: 'APRV1', label: '23,98 Horas',   dashed: false, weight: 1 },
    { from: 'APRV1', to: 'APRV2', label: '',              dashed: false, weight: 1 },
    { from: 'APRV2', to: 'DATAD', label: '6,78 Dias',     dashed: false, weight: 2 },
    { from: 'REQ',   to: 'DATAD', label: '11,27 Dias',    dashed: false, weight: 3 },
    { from: 'OC',    to: 'RECEB', label: '7,35 Segundos', dashed: false, weight: 2 },
    { from: 'RECEB', to: 'AGUARD',label: '13,45 Horas',   dashed: false, weight: 2 },
    { from: 'AGUARD',to: 'DATAP', label: '',              dashed: false, weight: 2 },
    { from: 'DATAD', to: 'END',   label: '',              dashed: true,  weight: 2 },
    { from: 'DATAP', to: 'END',   label: '',              dashed: true,  weight: 2 },
    { from: 'NF',    to: 'END',   label: '',              dashed: true,  weight: 3 },
    { from: 'PAY',   to: 'END',   label: '',              dashed: true,  weight: 3 },
];

/* Variants list — 29 entries + "Outros" */
const PM_VARIANTS = [
    { n: 1,  count: 187200, time: '0,00 Segundos' },
    { n: 2,  count: 142340, time: '0,00 Segundos' },
    { n: 3,  count: 96450,  time: '11,27 Dias' },
    { n: 4,  count: 82120,  time: '13,45 Horas' },
    { n: 5,  count: 71390,  time: '0,00 Segundos' },
    { n: 6,  count: 58460,  time: '7,78 Dias' },
    { n: 7,  count: 31200,  time: '11,70 Horas' },
    { n: 8,  count: 27800,  time: '12,89 Horas' },
    { n: 9,  count: 24100,  time: '2,31 Dias' },
    { n: 10, count: 21450,  time: '16,42 Horas' },
    { n: 11, count: 19200,  time: '14,96 Horas' },
    { n: 12, count: 17800,  time: '18,46 Dias' },
    { n: 13, count: 16300,  time: '0,00 Segundos' },
    { n: 14, count: 14900,  time: '0,00 Segundos' },
    { n: 15, count: 13500,  time: '11,83 Dias' },
    { n: 16, count: 12200,  time: '2,78 Dias' },
    { n: 17, count: 11000,  time: '14,73 Horas' },
    { n: 18, count: 9800,   time: '20,36 Horas' },
    { n: 19, count: 8650,   time: '3,76 Dias' },
    { n: 20, count: 7600,   time: '10,33 Dias' },
    { n: 21, count: 6700,   time: '11,52 Dias' },
    { n: 22, count: 5900,   time: '36,65 Dias' },
    { n: 23, count: 5100,   time: '1,29 Dias' },
    { n: 24, count: 4400,   time: '4,90 Dias' },
    { n: 25, count: 3800,   time: '92,20 Dias' },
    { n: 26, count: 3200,   time: '19,24 Dias' },
    { n: 27, count: 2700,   time: '6,36 Dias' },
    { n: 28, count: 2300,   time: '6,57 Dias' },
    { n: 29, count: 1950,   time: '1,01 Dias' },
];

/* Compute a curved cubic-bezier path between two nodes that bends
   slightly to avoid straight cross-hatching. */
function bezierPath(a, b, bend = 0.25) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    /* Perpendicular offset to create gentle bend */
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len, ny = dx / len;
    const cx = mx + nx * bend * len;
    const cy = my + ny * bend * len;
    return `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`;
}

/* ---------- The Process Mining screen ---------- */
function PreviewProcessMining({ state, onOpenFullMap }) {
    const { cosmetic } = state;
    const empresa = (state.vars?.empresa && String(state.vars.empresa).trim()) || cosmetic.company;
    const totalCases = 451756;
    const coveredCases = 387451;
    const coveragePct = (coveredCases / totalCases) * 100;

    return (
        <div className="screen-pad nous-scroll pm-screen">
            <div className="pm-header">
                <div>
                    <h2 className="screen-title">Process Mining</h2>
                    <p className="screen-sub">
                        Descoberta de variantes · processo <strong>1 — Compras ao Pagamento</strong>{' '}
                        da <Editable id="pm.company" defaultValue={empresa} />.
                        {' '}<span style={{ color: 'var(--nous-purple)' }}>
                            <Editable id="pm.totalCases" defaultValue="451.756" />
                            {' '}casos
                        </span>
                        {' · '}<Editable id="pm.totalVariants" defaultValue="38" /> variantes únicas
                        {' · '}janela de <Editable id="pm.window" defaultValue="90 dias" />.
                    </p>
                </div>
                <button
                    className="pm-cta"
                    onClick={onOpenFullMap}
                >
                    <Icon name="workflow" size={14} />
                    Ver meu mapa de processo completo
                    <Icon name="arrow-right" size={14} />
                </button>
            </div>

            <div className="pm-filters">
                <Icon name="sliders" size={13} style={{ color: 'var(--text-secondary)' }} />
                <span className="pm-filter">
                    <Editable id="pm.filter.requisicao" defaultValue="Número Requisição de Compra" />
                    <button className="pm-filter-x">×</button>
                </span>
                <span className="pm-filter">
                    <Editable id="pm.filter.variantes" defaultValue="Variantes" />
                    <button className="pm-filter-x">×</button>
                </span>
                <button className="pm-filter-add">
                    <Icon name="plus" size={11} />
                    Adicionar filtro
                </button>
            </div>

            <div className="pm-grid">
                <div className="pm-map-wrap">
                    <ProcessMap />
                    <div className="pm-donut">
                        <DonutChart pct={coveragePct} />
                        <div className="pm-donut-cap">
                            <Editable id="pm.cases" defaultValue="387.451" /> /{' '}
                            <Editable id="pm.casesTotal" defaultValue="451.756" />
                            <span className="pm-donut-sub">Casos cobertos</span>
                        </div>
                    </div>
                </div>

                <aside className="pm-side">
                    <div className="pm-side-head">
                        <select className="pm-select" defaultValue="freq">
                            <option value="freq">Mais frequente</option>
                            <option value="dur">Maior duração</option>
                            <option value="cost">Maior custo</option>
                        </select>
                        <div className="pm-side-axis">
                            <span>1k</span>
                            <span>10k</span>
                            <span>100k</span>
                        </div>
                    </div>
                    <div className="pm-side-body">
                        {PM_VARIANTS.map((v) => {
                            const maxC = PM_VARIANTS[0].count;
                            const w = Math.max(8, (Math.log10(v.count) / Math.log10(maxC)) * 100);
                            return (
                                <div key={v.n} className="pm-var-row">
                                    <span className="pm-var-n">#{v.n}</span>
                                    <span className="pm-var-bar-wrap">
                                        <span
                                            className={`pm-var-bar${v.n <= 6 ? ' strong' : ''}`}
                                            style={{ width: w + '%', background: v.n <= 6 ? 'var(--nous-purple)' : '#CFC5F8' }}
                                        />
                                    </span>
                                    <span className="pm-var-time">{v.time}</span>
                                </div>
                            );
                        })}
                        <div className="pm-var-row pm-var-other">
                            <span className="pm-var-n">Outros</span>
                            <span className="pm-var-bar-wrap">
                                <span className="pm-var-bar" style={{ width: 14 + '%', background: '#CFC5F8' }} />
                            </span>
                            <span className="pm-var-time">10,18 Dias</span>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}

/* ---------- The SVG process map ---------- */
function ProcessMap() {
    const nodeById = Object.fromEntries(PM_NODES.map(n => [n.id, n]));
    const amber = '#F59E0B';

    return (
        <svg viewBox="0 0 1080 580" className="pm-map-svg" preserveAspectRatio="xMidYMid meet">
            {/* Definitions */}
            <defs>
                <marker id="arrow-amber" viewBox="0 0 10 10" refX="9" refY="5"
                        markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill={amber} />
                </marker>
                <marker id="arrow-amber-solid" viewBox="0 0 10 10" refX="9" refY="5"
                        markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill={amber} />
                </marker>
                <filter id="node-shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000" floodOpacity="0.08" />
                </filter>
            </defs>

            {/* Edges */}
            {PM_EDGES.map((e, i) => {
                const a = nodeById[e.from];
                const b = nodeById[e.to];
                if (!a || !b) return null;
                const bendDir = (i % 2 === 0 ? 0.15 : -0.15);
                const path = bezierPath(a, b, bendDir);
                const sw = 0.8 + e.weight * 0.8;
                return (
                    <g key={i}>
                        <path
                            d={path}
                            fill="none"
                            stroke={amber}
                            strokeWidth={sw}
                            strokeDasharray={e.dashed ? `${sw * 3} ${sw * 2}` : 'none'}
                            opacity={e.dashed ? 0.75 : 0.95}
                            markerEnd="url(#arrow-amber)"
                        />
                        {e.label && (
                            <PathLabel
                                a={a} b={b} bend={bendDir} label={e.label}
                            />
                        )}
                    </g>
                );
            })}

            {/* Nodes */}
            {PM_NODES.map((n) => <Node key={n.id} node={n} amber={amber} />)}
        </svg>
    );
}

function PathLabel({ a, b, bend, label }) {
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len, ny = dx / len;
    const cx = mx + nx * bend * len;
    const cy = my + ny * bend * len;
    return (
        <g transform={`translate(${cx}, ${cy})`}>
            <rect x={-label.length * 3.5 - 5} y={-9} width={label.length * 7 + 10} height={18} rx={4}
                  fill="#FFFFFF" opacity={0.95} stroke="#F3F4F6" />
            <text x={0} y={4} textAnchor="middle" fontSize="10.5" fill="#6B7280" fontFamily="var(--font-mono)">
                {label}
            </text>
        </g>
    );
}

function Node({ node, amber }) {
    if (node.kind === 'start') {
        return (
            <g transform={`translate(${node.x}, ${node.y})`}>
                <circle r="18" fill="#311E76" filter="url(#node-shadow)" />
                <g transform="translate(-8, -8)" stroke="#FFFFFF" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    {/* simple cloud-with-spark */}
                    <path d="M3 11a3 3 0 0 1 0-6 4 4 0 0 1 7-1 3 3 0 0 1 4 6H4 z" />
                </g>
            </g>
        );
    }
    if (node.kind === 'finish') {
        return (
            <g transform={`translate(${node.x}, ${node.y})`}>
                <rect x="-13" y="-13" width="26" height="26" rx="4" fill="#311E76" filter="url(#node-shadow)" />
                <rect x="-5" y="-5" width="10" height="10" fill="#FFFFFF" />
            </g>
        );
    }
    if (node.kind === 'end') {
        return (
            <g transform={`translate(${node.x}, ${node.y})`}>
                <NodePill node={node} fill="#FEE2E2" stroke="#EF4444" dotFill="#EF4444" />
            </g>
        );
    }
    /* step */
    return (
        <g transform={`translate(${node.x}, ${node.y})`}>
            <NodePill node={node} fill="#FFFFFF" stroke="#F3F4F6" dotFill={amber} />
        </g>
    );
}

function NodePill({ node, fill, stroke, dotFill }) {
    const fmt = (n) => n.toLocaleString('pt-BR');
    return (
        <g>
            <rect x="-105" y="-22" width="210" height="44" rx="22"
                  fill={fill} stroke={stroke} strokeWidth="1" filter="url(#node-shadow)" />
            <circle cx="-87" cy="0" r="11" fill={dotFill} />
            <text x="-72" y="-3" fontSize="11" fill="#1F2937" fontFamily="var(--font-sans)" fontWeight="500">
                {node.label.length > 26 ? node.label.slice(0, 25) + '…' : node.label}
            </text>
            <text x="-72" y="12" fontSize="10" fill="#6B7280" fontFamily="var(--font-mono)">
                {fmt(node.count ?? 0)}
            </text>
        </g>
    );
}

/* ---------- Donut for case coverage ---------- */
function DonutChart({ pct }) {
    const r = 28;
    const C = 2 * Math.PI * r;
    const dash = (pct / 100) * C;
    return (
        <svg width="76" height="76" viewBox="0 0 80 80">
            <defs>
                <linearGradient id="donutGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%"   stopColor="#A595F5" />
                    <stop offset="100%" stopColor="#6D4ADD" />
                </linearGradient>
            </defs>
            <circle cx="40" cy="40" r={r} fill="none" stroke="#F0EBFA" strokeWidth="8" />
            <circle cx="40" cy="40" r={r} fill="none"
                    stroke="url(#donutGrad)" strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${dash} ${C - dash}`}
                    transform="rotate(-90 40 40)" />
            <text x="40" y="44" textAnchor="middle" fontSize="13" fontWeight="500" fill="#2C2C2C"
                  fontFamily="var(--font-sans)">
                {pct.toFixed(2)}%
            </text>
        </svg>
    );
}

Object.assign(window, { PreviewProcessMining });
