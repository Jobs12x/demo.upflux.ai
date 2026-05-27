# UpFlux Studio · Pacote para Hostinger

Este zip contém o **UpFlux Studio** completo, pronto para subir no
Hostinger e servir tanto o editor (para AEs) quanto as demos personalizadas
(para prospects).

---

## Subir para o subdomínio `demo.upflux.ai`

### 1. Criar o subdomínio no painel Hostinger
1. Entre no [painel Hostinger](https://hpanel.hostinger.com).
2. Em **Domínios → upflux.ai → Subdomínios**, crie `demo`.
3. Aponte para uma pasta nova, por ex. `public_html/demo`.

### 2. Subir os arquivos
1. No painel, abra **File Manager**.
2. Entre na pasta `public_html/demo`.
3. Faça upload de **TODOS os arquivos deste zip** (mantenha a estrutura):
   - `index.html`
   - `*.jsx` (data, app, builder, library, preview, process-mining, editable, nous-components)
   - `styles.css`
   - `assets/` (logo + tokens)
   - `.htaccess`

### 3. Forçar HTTPS (opcional mas recomendado)
- No painel Hostinger, em **Hospedagem → SSL**, ative o certificado gratuito.
- O `.htaccess` já redireciona HTTP → HTTPS automaticamente.

### 4. Pronto
- **Editor (AE):** `https://demo.upflux.ai/`
  Login: a senha que você definiu nas Configurações (padrão: `upflux2026`).
- **Demos compartilhadas (prospect):** `https://demo.upflux.ai/#demo=<estado-encodado>`
  Não exige senha — abre direto em modo visualização.

---

## Atualizar uma versão

Quando uma nova versão do Studio for liberada (`STUDIO_VERSION` muda no
código), basta sobrescrever os arquivos no File Manager.

**As demos antigas continuam funcionando** porque o estado vive no hash da
URL — qualquer link compartilhado pelos AEs antes do upgrade abre na nova
versão do Studio. Se houver mudança de schema, a versão da demo aparece na
biblioteca com badge ⚠️ para o AE revisar.

---

## Customizar a senha

A senha padrão `upflux2026` é só para o primeiro acesso. **Cada AE deve:**

1. Entrar no Studio (`/`).
2. Clicar em **Configurações** no canto superior direito.
3. Definir uma senha forte.

A senha fica no `localStorage` do navegador — significa que cada máquina/
browser precisa ser configurado uma vez. Não é uma senha compartilhada
entre AEs no servidor.

> **Atenção:** se você quiser uma senha realmente compartilhada e segura
> entre o time, ou quiser bloqueio por IP/usuário, vai precisar de um
> backend. Por enquanto isso é um "gate suave" para uso interno.

---

## Estrutura de arquivos

```
demo.upflux.ai/
├── index.html              ← entry point (ambos editor e viewer)
├── .htaccess               ← reescritas + HTTPS
├── styles.css
├── assets/
│   ├── nous-mark.png
│   ├── logo-nous-horizontal.png
│   └── nous-tokens.css
├── data.jsx                ← seeds, vars, library starter
├── nous-components.jsx     ← Icon, Button, Card, KPI, Chat primitives
├── editable.jsx            ← inline-edit infrastructure
├── process-mining.jsx      ← Process Mining screen + map SVG
├── preview.jsx             ← Nous app rendering inside browser frame
├── builder.jsx             ← 5-level personalization panel
├── library.jsx             ← Login + Library + Settings
└── app.jsx                 ← top-level routing
```

---

## Backup / migração da biblioteca

A biblioteca de demos do AE fica em `localStorage` do navegador
(`studio_library_v1`). Para migrar entre máquinas:

```js
// No navegador de origem (DevTools console):
copy(localStorage.getItem('studio_library_v1'));

// No navegador de destino:
localStorage.setItem('studio_library_v1', '<paste-aqui>');
location.reload();
```

Quando você quiser uma biblioteca compartilhada entre AEs ou tracking de
visualizações pelo prospect, vai precisar de um backend mínimo. Estimativa:
1-2 dias de dev (Supabase ou Firestore).
