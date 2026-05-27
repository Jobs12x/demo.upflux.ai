/* === library.jsx ====================================================
   Login screen + Demo library home page for UpFlux Studio.
   ===================================================================== */

const DEFAULT_STUDIO_PASSWORD = 'upflux2026';

/* Read the current password from localStorage; falls back to the default
   on first run. Persisted plain (no hashing) — this is a soft access
   gate for sales team, not a security boundary. */
function getStudioPassword() {
    try {
        const stored = localStorage.getItem('studio_password');
        return (stored && stored.length > 0) ? stored : DEFAULT_STUDIO_PASSWORD;
    } catch { return DEFAULT_STUDIO_PASSWORD; }
}
function setStudioPassword(next) {
    try { localStorage.setItem('studio_password', next); } catch {}
}

/* ==================================================================
   LOGIN SCREEN
   ================================================================== */
function LoginScreen({ onAuth }) {
    const [pwd, setPwd] = React.useState('');
    const [err, setErr] = React.useState(false);
    const submit = (e) => {
        e?.preventDefault();
        if (pwd === getStudioPassword()) onAuth();
        else { setErr(true); setTimeout(() => setErr(false), 1800); }
    };

    return (
        <div className="login-screen">
            <div className="login-bg">
                <div className="login-grid-blob" />
            </div>
            <form className="login-card" onSubmit={submit}>
                <div className="login-brand">
                    <span className="mark-wrap">U</span>
                    <span>UpFlux <span style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}>Studio</span></span>
                </div>
                <h1 className="login-title">Acessar o editor de demos</h1>
                <p className="login-sub">
                    Apenas AEs e Sales Engineers da UpFlux. O acesso público à demo
                    do prospect não exige senha.
                </p>
                <div className={`login-field${err ? ' shake' : ''}`}>
                    <label>Senha</label>
                    <input
                        type="password"
                        autoFocus
                        value={pwd}
                        onChange={(e) => setPwd(e.target.value)}
                        placeholder="••••••••"
                    />
                </div>
                {err && (
                    <div className="login-err">
                        <Icon name="alert-triangle" size={12} />
                        Senha incorreta — tente novamente
                    </div>
                )}
                <button type="submit" className="tbtn tbtn--primary login-submit">
                    <Icon name="arrow-right" size={12} />
                    Entrar no Studio
                </button>
                <div className="login-foot">
                    <span className="login-version">
                        Studio {window.STUDIO_DATA.STUDIO_VERSION} · build {window.STUDIO_DATA.STUDIO_BUILD_DATE}
                    </span>
                </div>
            </form>
        </div>
    );
}

/* ==================================================================
   LIBRARY SCREEN
   ================================================================== */
function LibraryScreen({ library, onOpen, onClone, onDelete, onCreate, onLogout }) {
    const [filter, setFilter] = React.useState('all');
    const [query, setQuery] = React.useState('');
    const [menuOpenId, setMenuOpenId] = React.useState(null);
    const [showNewForm, setShowNewForm] = React.useState(false);
    const [showSettings, setShowSettings] = React.useState(false);

    React.useEffect(() => {
        const close = () => setMenuOpenId(null);
        window.addEventListener('click', close);
        return () => window.removeEventListener('click', close);
    }, []);

    const filtered = library.filter(d => {
        if (filter !== 'all' && d.status !== filter) return false;
        if (query && !`${d.name} ${d.prospect} ${d.industry}`.toLowerCase().includes(query.toLowerCase())) return false;
        return true;
    });

    const counts = {
        all: library.length,
        draft: library.filter(d => d.status === 'draft').length,
        ready: library.filter(d => d.status === 'ready').length,
        shared: library.filter(d => d.status === 'shared').length,
    };

    return (
        <div className="lib-screen">
            <header className="lib-header">
                <div className="lib-header-left">
                    <div className="studio-brand">
                        <span className="mark-wrap">U</span>
                        <span className="name">UpFlux <span className="dim">Studio</span></span>
                    </div>
                    <span className="lib-version-chip">
                        {window.STUDIO_DATA.STUDIO_VERSION}
                    </span>
                </div>
                <div className="lib-header-right">
                    <a href="https://nous.upflux.ai" target="_blank" rel="noopener" className="tbtn">
                        <Icon name="arrow-right" size={12} />
                        Abrir Nous
                    </a>
                    <button className="tbtn" onClick={() => setShowSettings(true)}>
                        <Icon name="settings" size={12} />
                        Configurações
                    </button>
                    <button className="tbtn" onClick={onLogout}>
                        <Icon name="arrow-right" size={12} style={{ transform: 'rotate(180deg)' }} />
                        Sair
                    </button>
                </div>
            </header>

            <div className="lib-hero">
                <div>
                    <h1 className="lib-h1">Biblioteca de demos</h1>
                    <p className="lib-sub">
                        Crie uma demo nova, abra uma existente ou clone para começar
                        rápido a partir de um template.
                    </p>
                </div>
                <button className="lib-new-btn" onClick={() => setShowNewForm(true)}>
                    <Icon name="plus" size={14} />
                    Nova demo
                </button>
            </div>

            <div className="lib-toolbar">
                <div className="lib-filters">
                    {[
                        { id: 'all',    label: 'Todas' },
                        { id: 'draft',  label: 'Rascunho' },
                        { id: 'ready',  label: 'Prontas' },
                        { id: 'shared', label: 'Compartilhadas' },
                    ].map(f => (
                        <button
                            key={f.id}
                            className={`lib-filter${filter === f.id ? ' active' : ''}`}
                            onClick={() => setFilter(f.id)}
                        >
                            {f.label}
                            <span className="lib-filter-count">{counts[f.id]}</span>
                        </button>
                    ))}
                </div>
                <div className="lib-search">
                    <Icon name="search" size={13} style={{ color: 'var(--text-muted)' }} />
                    <input
                        placeholder="Buscar prospect, indústria…"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="lib-grid">
                {filtered.map((d) => (
                    <DemoCard
                        key={d.id}
                        demo={d}
                        menuOpen={menuOpenId === d.id}
                        onToggleMenu={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === d.id ? null : d.id); }}
                        onOpen={() => onOpen(d.id)}
                        onClone={() => { onClone(d.id); setMenuOpenId(null); }}
                        onDelete={() => {
                            if (confirm(`Excluir a demo "${d.name}"? Esta ação não pode ser desfeita.`)) {
                                onDelete(d.id);
                            }
                            setMenuOpenId(null);
                        }}
                    />
                ))}
                <button className="lib-card lib-card--add" onClick={() => setShowNewForm(true)}>
                    <span className="lib-card-add-icon">
                        <Icon name="plus" size={20} />
                    </span>
                    <span className="lib-card-add-label">Criar nova demo</span>
                    <span className="lib-card-add-sub">Em branco ou a partir de um template</span>
                </button>
            </div>

            {filtered.length === 0 && (
                <div className="lib-empty">
                    <Icon name="search" size={18} style={{ color: 'var(--text-muted)' }} />
                    <span>Nenhuma demo encontrada para esses filtros.</span>
                </div>
            )}

            {showNewForm && (
                <NewDemoModal
                    library={library}
                    onClose={() => setShowNewForm(false)}
                    onCreate={(name) => { setShowNewForm(false); onCreate(name); }}
                    onClone={(id) => { setShowNewForm(false); onClone(id); }}
                />
            )}
            {showSettings && (
                <SettingsModal onClose={() => setShowSettings(false)} />
            )}
        </div>
    );
}

/* ==================================================================
   SETTINGS MODAL — change password + studio info
   ================================================================== */
function SettingsModal({ onClose }) {
    const [current, setCurrent] = React.useState('');
    const [next, setNext] = React.useState('');
    const [confirm, setConfirm] = React.useState('');
    const [feedback, setFeedback] = React.useState(null);  /* { kind: 'ok'|'err', msg } */
    const [show, setShow] = React.useState(false);

    const submit = (e) => {
        e?.preventDefault();
        const stored = getStudioPassword();
        if (current !== stored) {
            setFeedback({ kind: 'err', msg: 'Senha atual incorreta.' });
            return;
        }
        if (!next || next.length < 4) {
            setFeedback({ kind: 'err', msg: 'A nova senha precisa ter ao menos 4 caracteres.' });
            return;
        }
        if (next !== confirm) {
            setFeedback({ kind: 'err', msg: 'A confirmação não bate com a nova senha.' });
            return;
        }
        setStudioPassword(next);
        setFeedback({ kind: 'ok', msg: 'Senha atualizada. Use a nova senha na próxima vez que entrar.' });
        setCurrent(''); setNext(''); setConfirm('');
    };

    const reset = () => {
        if (confirm('Restaurar a senha padrão "upflux2026"?')) {
            try { localStorage.removeItem('studio_password'); } catch {}
            setFeedback({ kind: 'ok', msg: 'Senha restaurada para o padrão "upflux2026".' });
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-head">
                    <div>
                        <div className="modal-title">Configurações do Studio</div>
                        <div className="modal-sub">
                            Acesso interno · {window.STUDIO_DATA.STUDIO_VERSION} · build {window.STUDIO_DATA.STUDIO_BUILD_DATE}
                        </div>
                    </div>
                    <button className="modal-close" onClick={onClose}>
                        <Icon name="plus" size={16} style={{ transform: 'rotate(45deg)' }} />
                    </button>
                </div>
                <form className="modal-body" onSubmit={submit}>
                    <div className="share-section">
                        <div className="share-label">
                            Senha do editor
                            <span className="share-label-hint">
                                Quem precisa entrar em <strong>{location.host || 'demo.upflux.ai'}</strong> usa esta senha.
                                Persiste no navegador — cada AE precisa configurar a sua vez ou compartilhar.
                            </span>
                        </div>
                        <div className="settings-fields">
                            <label className="settings-row">
                                <span>Senha atual</span>
                                <input
                                    type={show ? 'text' : 'password'}
                                    className="f-input"
                                    value={current}
                                    onChange={(e) => setCurrent(e.target.value)}
                                    placeholder="A senha que você usa hoje"
                                    autoFocus
                                />
                            </label>
                            <label className="settings-row">
                                <span>Nova senha</span>
                                <input
                                    type={show ? 'text' : 'password'}
                                    className="f-input"
                                    value={next}
                                    onChange={(e) => setNext(e.target.value)}
                                    placeholder="Mín. 4 caracteres"
                                />
                            </label>
                            <label className="settings-row">
                                <span>Confirmar nova senha</span>
                                <input
                                    type={show ? 'text' : 'password'}
                                    className="f-input"
                                    value={confirm}
                                    onChange={(e) => setConfirm(e.target.value)}
                                    placeholder="Repita a nova senha"
                                />
                            </label>
                            <label className="settings-show">
                                <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} />
                                <span>Mostrar senhas</span>
                            </label>
                        </div>
                        {feedback && (
                            <div className={`settings-feedback ${feedback.kind}`}>
                                <Icon name={feedback.kind === 'ok' ? 'check-circle' : 'alert-triangle'} size={12} />
                                {feedback.msg}
                            </div>
                        )}
                    </div>

                    <div className="share-section">
                        <div className="share-label">Resetar senha</div>
                        <div className="share-hint" style={{ marginBottom: 8 }}>
                            Esqueceu a senha? Restaure para a padrão de fábrica (qualquer pessoa no
                            time pode entrar com <code>upflux2026</code> e configurar a nova).
                        </div>
                        <button type="button" className="tbtn tbtn--outline" onClick={reset}>
                            <Icon name="refresh-cw" size={12} />
                            Restaurar senha padrão
                        </button>
                    </div>

                    <div className="share-section">
                        <div className="share-label">Sobre o Studio</div>
                        <ul className="settings-about">
                            <li><strong>Versão:</strong> {window.STUDIO_DATA.STUDIO_VERSION}</li>
                            <li><strong>Build:</strong> {window.STUDIO_DATA.STUDIO_BUILD_DATE}</li>
                            <li><strong>Demos no navegador:</strong> {JSON.parse(localStorage.getItem('studio_library_v1') || '[]').length}</li>
                            <li>
                                <strong>URL pública (após deploy):</strong>{' '}
                                <code>demo.upflux.ai</code>
                            </li>
                        </ul>
                    </div>
                </form>
                <div className="modal-foot">
                    <button type="button" className="tbtn" onClick={onClose}>Fechar</button>
                    <button type="submit" className="tbtn tbtn--primary" onClick={submit}>
                        <Icon name="check" size={12} />
                        Salvar nova senha
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ==================================================================
   DEMO CARD
   ================================================================== */
function DemoCard({ demo, menuOpen, onToggleMenu, onOpen, onClone, onDelete }) {
    const STATUS_LABEL = {
        draft:  { label: 'Rascunho',     cls: 'st-draft' },
        ready:  { label: 'Pronta',       cls: 'st-ready' },
        shared: { label: 'Compartilhada', cls: 'st-shared' },
    };
    const st = STATUS_LABEL[demo.status] || STATUS_LABEL.draft;
    const versionMismatch = demo.version !== window.STUDIO_DATA.STUDIO_VERSION;

    return (
        <article className="lib-card" onClick={onOpen}>
            <div className="lib-card-cover" style={{ background: `linear-gradient(135deg, ${demo.accent}18, ${demo.accent}06)` }}>
                <div className="lib-card-cover-mono" style={{ color: demo.accent }}>
                    {demo.prospect.charAt(0).toUpperCase()}
                </div>
                <div className="lib-card-cover-pattern">
                    {/* Subtle decorative shapes */}
                    <svg width="180" height="64" viewBox="0 0 180 64" style={{ opacity: 0.35 }}>
                        <circle cx="20" cy="32" r="3" fill={demo.accent} />
                        <circle cx="40" cy="14" r="2" fill={demo.accent} opacity="0.6" />
                        <line x1="23" y1="32" x2="40" y2="16" stroke={demo.accent} strokeWidth="1.5" opacity="0.5" />
                        <circle cx="70" cy="32" r="2.5" fill={demo.accent} opacity="0.7" />
                        <line x1="42" y1="14" x2="68" y2="30" stroke={demo.accent} strokeWidth="1.5" opacity="0.5" />
                        <circle cx="110" cy="20" r="3" fill={demo.accent} />
                        <line x1="72" y1="32" x2="108" y2="22" stroke={demo.accent} strokeWidth="1.5" opacity="0.5" />
                        <circle cx="150" cy="44" r="2.5" fill={demo.accent} opacity="0.7" />
                        <line x1="112" y1="22" x2="148" y2="42" stroke={demo.accent} strokeWidth="1.5" opacity="0.5" />
                    </svg>
                </div>
            </div>
            <button
                className="lib-card-kebab"
                onClick={onToggleMenu}
                aria-label="Mais ações"
            >
                <span /><span /><span />
            </button>
            {menuOpen && (
                <div className="lib-card-menu" onClick={(e) => e.stopPropagation()}>
                    <button onClick={(e) => { e.stopPropagation(); onOpen(); }}>
                        <Icon name="edit-3" size={11} /> Abrir
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); onClone(); }}>
                        <Icon name="layers" size={11} /> Clonar
                    </button>
                    <div className="lib-card-menu-divider" />
                    <button className="danger" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
                        <Icon name="trash" size={11} /> Excluir
                    </button>
                </div>
            )}
            <div className="lib-card-body">
                <div className="lib-card-titlerow">
                    <h3 className="lib-card-title">{demo.name}</h3>
                    <span className={`lib-card-status ${st.cls}`}>{st.label}</span>
                </div>
                <div className="lib-card-meta">
                    <span className="lib-card-meta-row">
                        <Icon name="briefcase" size={11} />
                        {demo.industry}
                    </span>
                    <span className="lib-card-meta-row">
                        <Icon name="users" size={11} />
                        {demo.persona}
                    </span>
                </div>
                <div className="lib-card-hint">{demo.thumbHint}</div>
                <div className="lib-card-foot">
                    <span className="lib-card-avatar" title={demo.owner}>{demo.ownerInitials}</span>
                    <span className="lib-card-foot-text">
                        Editada em <strong>{demo.updatedAt}</strong>
                    </span>
                    {versionMismatch && (
                        <span className="lib-card-version-warn" title={`Esta demo foi criada na ${demo.version}, o Studio está em ${window.STUDIO_DATA.STUDIO_VERSION}`}>
                            <Icon name="alert-triangle" size={10} />
                            {demo.version}
                        </span>
                    )}
                    {demo.views > 0 && (
                        <span className="lib-card-views">
                            <Icon name="eye" size={11} />
                            {demo.views}
                        </span>
                    )}
                </div>
            </div>
        </article>
    );
}

/* ==================================================================
   NEW DEMO MODAL — blank or clone-from-template
   ================================================================== */
function NewDemoModal({ library, onClose, onCreate, onClone }) {
    const [name, setName] = React.useState('');
    const [mode, setMode] = React.useState('blank');  /* 'blank' | 'clone' */
    const [pickedId, setPickedId] = React.useState(library[0]?.id);
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-head">
                    <div>
                        <div className="modal-title">Nova demo</div>
                        <div className="modal-sub">
                            Comece em branco ou clone uma existente como ponto de partida.
                        </div>
                    </div>
                    <button className="modal-close" onClick={onClose}>
                        <Icon name="plus" size={16} style={{ transform: 'rotate(45deg)' }} />
                    </button>
                </div>
                <div className="modal-body">
                    <div className="newdemo-modes">
                        <button
                            className={`newdemo-mode${mode === 'blank' ? ' active' : ''}`}
                            onClick={() => setMode('blank')}
                        >
                            <span className="newdemo-mode-icon"><Icon name="plus" size={14} /></span>
                            <span>
                                <div className="newdemo-mode-title">Em branco</div>
                                <div className="newdemo-mode-sub">Começa do template Docol e personaliza tudo</div>
                            </span>
                        </button>
                        <button
                            className={`newdemo-mode${mode === 'clone' ? ' active' : ''}`}
                            onClick={() => setMode('clone')}
                        >
                            <span className="newdemo-mode-icon"><Icon name="layers" size={14} /></span>
                            <span>
                                <div className="newdemo-mode-title">Clonar existente</div>
                                <div className="newdemo-mode-sub">Mais rápido: parte de uma demo já feita</div>
                            </span>
                        </button>
                    </div>

                    {mode === 'blank' && (
                        <div className="share-section" style={{ marginTop: 14 }}>
                            <div className="share-label">Nome do prospect</div>
                            <input
                                autoFocus
                                className="f-input"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Ex: Unimed BH, Magazine Luiza..."
                            />
                            <div className="share-hint">
                                Aparece no sidebar do Nous, nas saudações e no header da demo.
                            </div>
                        </div>
                    )}

                    {mode === 'clone' && (
                        <div className="share-section" style={{ marginTop: 14 }}>
                            <div className="share-label">Escolha a base</div>
                            <div className="newdemo-clone-list">
                                {library.map(d => (
                                    <button
                                        key={d.id}
                                        className={`newdemo-clone-item${pickedId === d.id ? ' active' : ''}`}
                                        onClick={() => setPickedId(d.id)}
                                    >
                                        <span className="newdemo-clone-mono" style={{ background: `${d.accent}18`, color: d.accent }}>
                                            {d.prospect.charAt(0).toUpperCase()}
                                        </span>
                                        <span className="newdemo-clone-info">
                                            <span className="newdemo-clone-name">{d.name}</span>
                                            <span className="newdemo-clone-meta">{d.industry} · {d.persona}</span>
                                        </span>
                                        {pickedId === d.id && <Icon name="check" size={13} style={{ color: 'var(--nous-purple)' }} />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className="modal-foot">
                    <button className="tbtn" onClick={onClose}>Cancelar</button>
                    <button
                        className="tbtn tbtn--primary"
                        onClick={() => mode === 'blank' ? onCreate(name || 'Novo prospect') : onClone(pickedId)}
                    >
                        <Icon name="arrow-right" size={12} />
                        {mode === 'blank' ? 'Criar demo' : 'Clonar e abrir'}
                    </button>
                </div>
            </div>
        </div>
    );
}

Object.assign(window, { LoginScreen, LibraryScreen, DemoCard, NewDemoModal, SettingsModal, getStudioPassword, setStudioPassword });
