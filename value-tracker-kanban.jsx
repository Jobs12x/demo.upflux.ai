/* === value-tracker-kanban.jsx ========================================
   Kanban board + Assistant panel for the Value Tracker.
   ===================================================================== */

const VT_COLS = window.VT_COLUMNS;

/* ==================================================================
   KANBAN
   ================================================================== */
function VTKanban({ vt, setVT, state }) {
    const [dragId, setDragId] = React.useState(null);
    const [dropOn, setDropOn] = React.useState(null);
    const [editingId, setEditingId] = React.useState(null);

    const planosByCol = Object.fromEntries(VT_COLS.map(c => [c.id, vt.planos.filter(p => p.column === c.id)]));

    const updatePlano = (id, patch) => {
        setVT(curr => ({ ...curr, planos: curr.planos.map(p => p.id === id ? { ...p, ...patch } : p) }));
    };
    const removePlano = (id) => {
        setVT(curr => ({ ...curr, planos: curr.planos.filter(p => p.id !== id) }));
    };
    const addPlano = (column) => {
        const id = 'p' + Date.now().toString(36);
        const newPlan = {
            id,
            title: 'Novo plano',
            priority: 'media',
            dueDate: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
            owner: 'Responsável',
            column,
        };
        setVT(curr => ({ ...curr, planos: [...curr.planos, newPlan] }));
        setEditingId(id);
    };

    return (
        <div className="vt-kanban-section">
            <div className="vt-card-head">
                <span className="vt-card-title">Planos de Ação</span>
                <span className="vt-card-total">{vt.planos.length} planos</span>
            </div>
            <div className="vt-kanban">
                {VT_COLS.map(col => {
                    const items = planosByCol[col.id] || [];
                    return (
                        <div
                            key={col.id}
                            className={`vt-kcol${dropOn === col.id ? ' drop' : ''}`}
                            onDragOver={(e) => { e.preventDefault(); setDropOn(col.id); }}
                            onDragLeave={() => setDropOn(null)}
                            onDrop={(e) => {
                                e.preventDefault();
                                if (dragId) updatePlano(dragId, { column: col.id });
                                setDragId(null);
                                setDropOn(null);
                            }}
                        >
                            <div className="vt-kcol-head">
                                <span className="vt-kcol-title">{col.label}</span>
                                <span className="vt-kcol-count">{items.length}</span>
                            </div>
                            <div className="vt-kcol-body">
                                {items.map(plan => (
                                    <PlanCard
                                        key={plan.id}
                                        plan={plan}
                                        editing={editingId === plan.id}
                                        onStartEdit={() => setEditingId(plan.id)}
                                        onFinishEdit={() => setEditingId(null)}
                                        onChange={(patch) => updatePlano(plan.id, patch)}
                                        onRemove={() => removePlano(plan.id)}
                                        onDragStart={() => setDragId(plan.id)}
                                        onDragEnd={() => setDragId(null)}
                                    />
                                ))}
                                <button className="vt-kcol-add" onClick={() => addPlano(col.id)}>
                                    <Icon name="plus" size={11} />
                                    Novo plano
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

function PlanCard({ plan, editing, onStartEdit, onFinishEdit, onChange, onRemove, onDragStart, onDragEnd }) {
    const priColor = { alta: '#EF4444', media: '#F59E0B', baixa: '#9CA3AF' }[plan.priority] || '#9CA3AF';
    const priLabel = { alta: 'Alta', media: 'Média', baixa: 'Baixa' }[plan.priority] || plan.priority;

    if (editing) {
        return (
            <div className="vt-plan-card editing" onClick={(e) => e.stopPropagation()}>
                <input
                    autoFocus
                    className="f-input"
                    value={plan.title}
                    onChange={(e) => onChange({ title: e.target.value })}
                    onKeyDown={(e) => { if (e.key === 'Enter') onFinishEdit(); }}
                    placeholder="Título do plano"
                />
                <div className="vt-plan-edit-row">
                    <select
                        className="f-input vt-plan-pri-sel"
                        value={plan.priority}
                        onChange={(e) => onChange({ priority: e.target.value })}
                    >
                        <option value="alta">Alta</option>
                        <option value="media">Média</option>
                        <option value="baixa">Baixa</option>
                    </select>
                    <input
                        className="f-input"
                        value={plan.dueDate}
                        onChange={(e) => onChange({ dueDate: e.target.value })}
                        placeholder="DD mes 2026"
                    />
                </div>
                <input
                    className="f-input"
                    value={plan.owner}
                    onChange={(e) => onChange({ owner: e.target.value })}
                    placeholder="Responsável"
                />
                <div className="vt-plan-edit-actions">
                    <button className="vt-plan-del" onClick={onRemove}>
                        <Icon name="trash" size={11} /> Excluir
                    </button>
                    <button className="tbtn tbtn--primary" style={{ padding: '4px 10px' }} onClick={onFinishEdit}>
                        <Icon name="check" size={11} /> Salvar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            className="vt-plan-card"
            draggable
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onClick={onStartEdit}
        >
            <div className="vt-plan-title">
                <Editable id={`vt.plan.${plan.id}.title`} defaultValue={plan.title} />
            </div>
            <div className="vt-plan-meta">
                <span className="vt-plan-pri" style={{ background: priColor + '20', color: priColor }}>
                    {priLabel}
                </span>
                <span className="vt-plan-date">
                    <Editable id={`vt.plan.${plan.id}.date`} defaultValue={plan.dueDate} />
                </span>
            </div>
            <div className="vt-plan-owner">
                <Editable id={`vt.plan.${plan.id}.owner`} defaultValue={plan.owner} />
            </div>
        </div>
    );
}

/* ==================================================================
   ASSISTANT PANEL
   ================================================================== */
function VTAssistant({ vt, setVT, onCollapse }) {
    const [input, setInput] = React.useState('');
    const messages = vt.assistantMessages || [];
    const bottomRef = React.useRef(null);

    React.useEffect(() => {
        bottomRef.current?.scrollIntoView({ block: 'end' });
    }, [messages.length]);

    const send = (text, opts) => {
        if (!text.trim() && !opts) return;
        const userMsg = { role: 'user', text, ts: Date.now() };
        let botMsg = null;

        if (opts?.action === 'criar-plano') {
            botMsg = {
                role: 'assistant',
                kind: 'plano-wizard',
                text: 'Perfeito! Vou te guiar para criar um plano estruturado. Responda estas 5 perguntas:',
                fields: [
                    { key: 'titulo',    label: 'Título',          hint: 'O que você quer fazer? (ex: "Reduzir tempo de processamento de pedidos")' },
                    { key: 'onde',      label: 'Onde será aplicado', hint: 'Em qual área/processo? (ex: "Departamento de Logística", "Sistema de Vendas")' },
                    { key: 'como',      label: 'Como será executado', hint: 'Qual é a estratégia/método? (ex: "Implementar automação", "Treinar equipe", "Revisar processos")' },
                    { key: 'responsavel', label: 'Responsável',    hint: 'Quem vai liderar? (nome da pessoa)' },
                    { key: 'prazo',     label: 'Prazo',            hint: 'Quando termina? (data no formato: DD/MM/YYYY ou mês/ano, ex: "31/03/2026")' },
                ],
            };
        } else if (opts?.action === 'registrar') {
            botMsg = {
                role: 'assistant',
                text: 'Vamos registrar um ganho! Para começar: qual o **título do ganho** (ex: "Consolidação de Compras Spot em Contrato") e o **valor estimado** (em R$)?',
            };
        } else if (opts?.action === 'potencial') {
            botMsg = {
                role: 'assistant',
                text: 'Analisando os 17 ganhos em **Identificado** (R$ 7,5M), os 3 com maior potencial de conversão rápida são:\n\n1. **Consolidação de Compras Spot em Contrato** — saving de ~12% em latão (Wieland), maturidade alta no fornecedor.\n2. **Automação de aprovação de POs < R$ 50k** — 380 POs/mês, redução de 4h por PO.\n3. **DPO estendido em MRO para 90 dias** — R$ 1,2M em capital de giro liberado, requer apenas renegociação contratual.',
            };
        } else if (opts?.action === 'comparar') {
            botMsg = {
                role: 'assistant',
                text: '**vs. trimestre anterior**:\n\n• Pipeline cresceu de R$ 38,4M → **R$ 50,2M** (+30,7%)\n• Conversão caiu de 12% → **5%** — execução tem sido o gargalo, não a identificação\n• Planos em backlog dobraram (4 → 11). Vale priorizar uma sprint de execução vs. seguir identificando.',
            };
        } else if (opts?.action === 'oportunidades') {
            botMsg = {
                role: 'assistant',
                text: 'Encontrei **3 novas oportunidades** que ainda não estão no pipeline:\n\n1. **Compras parceladas em capex (~R$ 8M)** — fragmentação alta, oportunidade de bundling.\n2. **Frete inbound · região Sul** — 14% acima do benchmark do setor.\n3. **MRO recorrente sem contrato** — 240 SKUs comprados spot 6+ vezes/ano.\n\nQuer que eu transforme alguma destas em plano de ação?',
            };
        } else {
            botMsg = {
                role: 'assistant',
                text: 'Bom ponto. Para responder com precisão, preciso aprofundar nos dados do pipeline. Posso sugerir começar criando um plano estruturado, ou analisar uma categoria específica do dashboard.',
            };
        }

        setVT(curr => ({ ...curr, assistantMessages: [...(curr.assistantMessages || []), userMsg, botMsg] }));
        setInput('');
    };

    const submitWizard = (fields) => {
        const id = 'p' + Date.now().toString(36);
        const today = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
        const newPlan = {
            id,
            title: fields.titulo || 'Novo plano (sem título)',
            priority: 'media',
            dueDate: fields.prazo || today,
            owner: fields.responsavel || 'Responsável',
            column: 'backlog',
        };
        setVT(curr => ({
            ...curr,
            planos: [...curr.planos, newPlan],
            assistantMessages: [...(curr.assistantMessages || []), {
                role: 'assistant',
                text: `✓ Plano **"${newPlan.title}"** criado no Backlog. Responsável: ${newPlan.owner}, prazo ${newPlan.dueDate}. Você pode arrastá-lo para "Em Andamento" quando começar a executar.`,
            }],
        }));
    };

    return (
        <aside className="vt-assistant">
            <div className="vt-assistant-head">
                <div className="vt-assistant-titlewrap">
                    <span className="vt-assistant-icon"><Icon name="sparkles" size={14} /></span>
                    <div>
                        <div className="vt-assistant-title">Assistente de Valor</div>
                        <div className="vt-assistant-sub">Explore ações e oportunidades</div>
                    </div>
                </div>
                <button className="vt-assistant-close" onClick={onCollapse} title="Recolher">
                    <Icon name="plus" size={14} style={{ transform: 'rotate(45deg)' }} />
                </button>
            </div>

            <div className="vt-assistant-body">
                {messages.length === 0 && (
                    <div className="vt-assistant-welcome">
                        Clique em qualquer item do dashboard para aprofundar, ou me pergunte
                        diretamente sobre oportunidades de valor.
                    </div>
                )}
                {messages.map((m, i) => (
                    <AssistantMessage
                        key={i}
                        msg={m}
                        onSubmitWizard={submitWizard}
                    />
                ))}
                <div ref={bottomRef} />
            </div>

            <div className="vt-assistant-actions">
                {(vt.quickActions || []).map((a) => (
                    <button
                        key={a.id}
                        className={`vt-quickaction vt-quickaction--${a.variant || 'default'}`}
                        onClick={() => send(a.label, { action: a.id })}
                    >
                        <Icon name={a.icon} size={11} />
                        {a.label}
                    </button>
                ))}
            </div>

            <form className="vt-assistant-composer" onSubmit={(e) => { e.preventDefault(); send(input); }}>
                <input
                    className="f-input"
                    placeholder="Pergunte sobre oportunidades de valor"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button type="submit" className="vt-assistant-send">
                    <Icon name="send" size={13} />
                </button>
            </form>
        </aside>
    );
}

function AssistantMessage({ msg, onSubmitWizard }) {
    if (msg.role === 'user') {
        return (
            <div className="vt-msg vt-msg--user">
                <div className="vt-msg-bubble vt-msg-bubble--user">{msg.text}</div>
            </div>
        );
    }
    if (msg.kind === 'plano-wizard') {
        return <WizardMessage msg={msg} onSubmit={onSubmitWizard} />;
    }
    return (
        <div className="vt-msg vt-msg--bot">
            <div className="vt-msg-bubble">
                <RichText text={msg.text} vars={{}} />
            </div>
        </div>
    );
}

function WizardMessage({ msg, onSubmit }) {
    const [fields, setFields] = React.useState({});
    const [submitted, setSubmitted] = React.useState(false);

    const handle = (e) => {
        e.preventDefault();
        onSubmit(fields);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="vt-msg vt-msg--bot">
                <div className="vt-msg-bubble">
                    ✓ Plano criado. Olhe o Kanban à esquerda.
                </div>
            </div>
        );
    }

    return (
        <div className="vt-msg vt-msg--bot">
            <div className="vt-msg-bubble">
                <RichText text={msg.text} vars={{}} />
                <form className="vt-wizard" onSubmit={handle}>
                    {msg.fields.map((f, i) => (
                        <label key={f.key} className="vt-wizard-field">
                            <span><strong>{i + 1}. {f.label}</strong></span>
                            <span className="vt-wizard-hint">{f.hint}</span>
                            <input
                                className="f-input"
                                value={fields[f.key] || ''}
                                onChange={(e) => setFields({ ...fields, [f.key]: e.target.value })}
                            />
                        </label>
                    ))}
                    <button type="submit" className="tbtn tbtn--primary" style={{ width: '100%', justifyContent: 'center' }}>
                        <Icon name="check" size={11} />
                        Criar plano
                    </button>
                </form>
            </div>
        </div>
    );
}

Object.assign(window, { VTKanban, VTAssistant, PlanCard });
