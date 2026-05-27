/* === editable.jsx ===================================================
   Inline edit infrastructure: any text/number in the preview can be
   click-to-edited when state.editMode is on. Edits are stored in
   state.edits keyed by a stable id, so they persist across renders
   and screen switches.
   ===================================================================== */

/* Context exposes the edits map + mode toggle to descendants. */
const EditsContext = React.createContext({
    edits: {},
    editMode: false,
    setEdit: () => {},
});

function EditsProvider({ edits, editMode, onChange, children }) {
    const value = React.useMemo(() => ({
        edits,
        editMode,
        setEdit: (id, val) => onChange({ ...edits, [id]: val }),
    }), [edits, editMode, onChange]);
    return <EditsContext.Provider value={value}>{children}</EditsContext.Provider>;
}
const useEdits = () => React.useContext(EditsContext);

/* ----- Editable text/number ----------------------------------------
   Clickable when editMode is on. Renders as a styled <span> normally,
   swaps to <input>/<textarea> while editing. */
function Editable({ id, defaultValue, multiline = false, className, style, prefix, suffix }) {
    const { edits, editMode, setEdit } = useEdits();
    const [editing, setEditing] = React.useState(false);
    const inputRef = React.useRef(null);
    const stored = edits[id];
    const value = (stored !== undefined ? stored : defaultValue) ?? '';

    React.useEffect(() => {
        if (editing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select?.();
        }
    }, [editing]);

    const cls = `editable${editMode ? ' editable--on' : ''}${editing ? ' editable--editing' : ''} ${className || ''}`.trim();

    if (editing) {
        const Tag = multiline ? 'textarea' : 'input';
        const widthCh = Math.max(String(value).length + 1, 3);
        return (
            <Tag
                ref={inputRef}
                className={cls + ' editable--input'}
                defaultValue={value}
                rows={multiline ? Math.max(2, String(value).split('\n').length) : undefined}
                onBlur={(e) => { setEdit(id, e.target.value); setEditing(false); }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !multiline) { e.preventDefault(); e.target.blur(); }
                    if (e.key === 'Escape') { setEditing(false); }
                }}
                style={{
                    ...style,
                    ...(multiline ? {} : { width: `${widthCh}ch`, minWidth: 40 }),
                }}
            />
        );
    }

    return (
        <span
            className={cls}
            style={style}
            onClick={(e) => {
                if (editMode) {
                    e.stopPropagation();
                    setEditing(true);
                }
            }}
            title={editMode ? 'Clique para editar' : undefined}
        >
            {prefix}{value}{suffix}
        </span>
    );
}

Object.assign(window, { EditsContext, EditsProvider, useEdits, Editable });
