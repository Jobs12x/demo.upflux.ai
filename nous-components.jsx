/* === nous-components.jsx ============================================
   The Nous UI primitives (Icon, NousMark, Button, Card, KPICard,
   StatusPill, Sidebar, Header, ChatInput, ChatMessage, etc).
   Lifted from the Nous design-system reference and adapted so the
   sidebar/Header are PARAMETERIZED by current builder state.
   ===================================================================== */

/* ----- Lucide-style icons ---------------------------------------- */
const ICON_PATHS = {
    'message-circle': ['M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'],
    'bar-chart-3':    ['M3 3v18h18', 'M7 16l5-5 4 4 5-6'],
    'briefcase':      ['M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16', 'M2 7h20v14H2z'],
    'trending-up':    ['M23 6l-9.5 9.5-5-5L1 18', 'M17 6h6v6'],
    'clock':          ['M12 6v6l4 2', 'M12 12m-10 0a10 10 0 1 0 20 0 10 10 0 1 0 -20 0'],
    'file-text':      ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z', 'M14 2v6h6', 'M16 13H8', 'M16 17H8', 'M10 9H8'],
    'sparkles':       ['M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z', 'M19 13l1 2 2 1-2 1-1 2-1-2-2-1 2-1z', 'M5 16l.7 1.4L7 18l-1.3.6L5 20l-.7-1.4L3 18l1.3-.6z'],
    'search':         ['M11 11m-8 0a8 8 0 1 0 16 0 8 8 0 1 0-16 0', 'm21 21-4.3-4.3'],
    'brain':          ['M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 1 1-5 0V8', 'M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 5 0V8'],
    'flask':          ['M10 2v3', 'M14 2v3', 'M8.5 2h7l-1 8h-5z', 'M6 22h12l-1-12H7z'],
    'settings':       ['M12 12m-3 0a3 3 0 1 0 6 0 3 3 0 1 0 -6 0', 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.36.16.66.42.87.74'],
    'gauge':          ['M12 14l4-4', 'M12 12m-10 0a10 10 0 1 0 20 0 10 10 0 1 0 -20 0'],
    'shield':         ['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'],
    'arrow-up':       ['M12 19V5', 'M5 12l7-7 7 7'],
    'arrow-right':    ['M5 12h14', 'M12 5l7 7-7 7'],
    'bell':           ['M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9', 'M13.73 21a2 2 0 0 1-3.46 0'],
    'chevron-down':   ['M6 9l6 6 6-6'],
    'chevron-right':  ['M9 6l6 6-6 6'],
    'chevron-left':   ['M15 6l-6 6 6 6'],
    'plus':           ['M12 5v14', 'M5 12h14'],
    'check':          ['M20 6L9 17l-5-5'],
    'check-circle':   ['M9 12l2 2 4-4', 'M12 12m-10 0a10 10 0 1 0 20 0 10 10 0 1 0 -20 0'],
    'alert-triangle': ['M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z', 'M12 9v4', 'M12 17h.01'],
    'workflow':       ['M5 12V3h6v6H5', 'M13 21v-9h6v6h-6', 'M5 12h8', 'M13 18h-8'],
    'play':           ['M5 3l14 9-14 9V3z'],
    'pause':          ['M6 4h4v16H6z', 'M14 4h4v16h-4z'],
    'send':           ['M22 2 11 13', 'm22 2-7 20-4-9-9-4z'],
    'zap':            ['M13 2 3 14h9l-1 8 10-12h-9z'],
    'share':          ['M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8', 'm16 6-4-4-4 4', 'M12 2v13'],
    'eye':            ['M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z', 'M12 12m-3 0a3 3 0 1 0 6 0 3 3 0 1 0 -6 0'],
    'palette':        ['M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20', 'M12 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4z', 'M7 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z', 'M7 16a2 2 0 1 0 0-4 2 2 0 0 0 0 4z', 'M16 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4z'],
    'database':       ['M12 8a8 4 0 1 0 0-8 8 4 0 0 0 0 8z', 'M4 4v12a8 4 0 0 0 16 0V4', 'M4 12a8 4 0 0 0 16 0'],
    'users':          ['M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M23 21v-2a4 4 0 0 0-3-3.87', 'M16 3.13a4 4 0 0 1 0 7.75'],
    'code':           ['M16 18l6-6-6-6', 'M8 6l-6 6 6 6'],
    'film':           ['M2 5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z', 'M7 3v18', 'M17 3v18', 'M2 9h5', 'M2 15h5', 'M17 9h5', 'M17 15h5'],
    'edit-3':         ['M12 20h9', 'M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z'],
    'trash':          ['M3 6h18', 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6', 'M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'],
    'refresh-cw':     ['M23 4v6h-6', 'M1 20v-6h6', 'M3.51 9a9 9 0 0 1 14.85-3.36L23 10', 'M20.49 15A9 9 0 0 1 5.64 18.36L1 14'],
    'grip':           ['M9 6h.01', 'M9 12h.01', 'M9 18h.01', 'M15 6h.01', 'M15 12h.01', 'M15 18h.01'],
    'sliders':        ['M4 21v-7', 'M4 10V3', 'M12 21v-9', 'M12 8V3', 'M20 21v-5', 'M20 12V3', 'M1 14h6', 'M9 8h6', 'M17 16h6'],
    'layers':         ['M12 2 2 7l10 5 10-5z', 'M2 17l10 5 10-5', 'M2 12l10 5 10-5'],
};
function Icon({ name, size = 16, stroke = 2, style }) {
    const paths = ICON_PATHS[name] || [];
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth={stroke}
             strokeLinecap="round" strokeLinejoin="round" style={style}>
            {paths.map((d, i) => <path key={i} d={d} />)}
        </svg>
    );
}

/* ----- Nous mark (PNG) ------------------------------------------- */
function NousMark({ size = 26 }) {
    return (
        <img
            src="assets/nous-mark.png"
            alt=""
            width={size}
            height={size}
            style={{ display: 'block', flexShrink: 0 }}
        />
    );
}

/* ----- Button --------------------------------------------------- */
function Button({ variant = 'primary', size = 'md', icon, full, onClick, children, style }) {
    const cls = `btn btn--${size} btn--${variant}${full ? ' btn--full' : ''}`;
    return (
        <button className={cls} onClick={onClick} style={style}>
            {icon && <span style={{ display: 'inline-flex', flexShrink: 0 }}>{icon}</span>}
            <span>{children}</span>
        </button>
    );
}

/* ----- StatusPill ----------------------------------------------- */
function StatusPill({ status, children, dot = false }) {
    const dotClass = { live: 'dot--live', paused: 'dot--paused', danger: 'dot--danger' }[status];
    return (
        <span className={`pill pill--${status}`}>
            {dot && dotClass && <span className={`dot ${dotClass}`} />}
            {children}
        </span>
    );
}

/* ----- Card ----------------------------------------------------- */
function Card({ children, padded = true, style, className }) {
    return (
        <div className={`card-surface${padded ? '' : ' unpadded'}${className ? ' ' + className : ''}`} style={style}>
            {children}
        </div>
    );
}

/* ----- KPICard -------------------------------------------------- */
function KPICard({ label, value, subtitle, delta, sentiment = 'neutral', edited }) {
    return (
        <div className={`card-surface kpi-card${edited ? ' show-edit-flag' : ''}`}>
            <div className="label">{label}</div>
            <div className={`value kpi-color-${sentiment}`}>{value}</div>
            {delta && (
                <div className={`delta ${delta.positive ? 'up' : 'down'}`}>
                    {delta.positive ? '↑' : '↓'} {delta.value}
                </div>
            )}
            {subtitle && <div className="subtitle">{subtitle}</div>}
        </div>
    );
}

/* ----- NavItem --------------------------------------------------- */
function NavItem({ icon, label, active, onClick }) {
    return (
        <button className={`nav-item${active ? ' active' : ''}`} onClick={onClick}>
            <span className="icon">{icon}</span>
            <span>{label}</span>
        </button>
    );
}

/* ----- ChatInput ------------------------------------------------- */
function ChatInput({ placeholder = 'Pergunte qualquer coisa sobre o processo...', value, onChange, onSubmit }) {
    const [internal, setInternal] = React.useState('');
    const controlled = value !== undefined;
    const v = controlled ? value : internal;
    const setV = controlled ? onChange : setInternal;
    const isActive = (v || '').trim().length > 0;
    const handle = () => {
        if (!isActive) return;
        onSubmit?.(v);
        if (!controlled) setInternal('');
    };
    return (
        <div className="composer">
            <input
                type="text"
                value={v || ''}
                onChange={(e) => setV(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handle()}
                placeholder={placeholder}
            />
            <button
                className={`composer-submit ${isActive ? 'active' : 'idle'}`}
                onClick={handle}
                aria-label="Enviar pergunta"
                disabled={!isActive}
            >
                <Icon name="arrow-up" size={16} />
            </button>
        </div>
    );
}

/* ----- ChatMessage ----------------------------------------------- */
function ChatMessage({ role, children }) {
    if (role === 'user') {
        return (
            <div className="msg-user-wrap">
                <div className="msg-user">{children}</div>
            </div>
        );
    }
    return (
        <div className="msg-assistant-wrap">
            <div className="msg-assistant">{children}</div>
        </div>
    );
}

function StreamingIndicator({ status, elapsed }) {
    return (
        <div className="streaming">
            <span className="dots"><span /><span /><span /></span>
            <span>{status}</span>
            {elapsed !== undefined && <span className="elapsed">{elapsed}s</span>}
        </div>
    );
}

/* ----- Bottleneck row chart ------------------------------------- */
function Bottleneck({ step, pct, value, tone }) {
    return (
        <div className="bottleneck-row">
            <span className="step">{step}</span>
            <span className="bar-wrap"><span className={`bar${tone ? ' ' + tone : ''}`} style={{ width: pct + '%' }} /></span>
            <span className="val">{value}</span>
        </div>
    );
}

Object.assign(window, {
    Icon, NousMark, Button, StatusPill, Card, KPICard,
    NavItem, ChatInput, ChatMessage, StreamingIndicator, Bottleneck,
});
