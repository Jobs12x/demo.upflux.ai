/* === data.jsx — Docol (manufatura, dores em P2P) ====================
   All Portuguese, all realistic. Suppliers, SKUs, KPIs based on a
   plumbing/sanitary-ware manufacturer headquartered in Joinville SC.
   ===================================================================== */

const DOCOL = {
    company: 'Docol',
    industry: 'Manufatura',
    industryTag: 'Indústria · Metais sanitários',
    logoBg: '#C8102E',         /* Docol uses a strong red brand */
    logoMonogram: 'D',
    fundedHQ: 'Joinville, SC',
    sites: ['Joinville (matriz)', 'Manaus (Polo Industrial)'],
};

/* Studio version — stamped on every saved demo. Bump when you change
   shapes/behaviors so old shared demos still work via the version flag. */
const STUDIO_VERSION = 'v1.2.0';
const STUDIO_BUILD_DATE = '25 mai 2026';

/* Default brand color palette to offer in Level 1 */
const BRAND_SWATCHES = [
    { name: 'Docol Red',   value: '#C8102E' },
    { name: 'Aço azul',    value: '#1F4E8C' },
    { name: 'Cromado',     value: '#3F4A55' },
    { name: 'Cobre',       value: '#B05E1A' },
    { name: 'Esmeralda',   value: '#0D9488' },
    { name: 'Nous purple', value: '#6D4ADD' },
];

/* The AE / SDR using the studio — pre-filled. */
const AE = {
    name: 'Felipe Andrade',
    role: 'Account Executive · UpFlux',
    initials: 'FA',
};

/* Find & replace mappings that Level 1 (Cosmética) will apply */
const FR_MAP = [
    { from: 'UpFlux - Demonstração Comercial', to: 'Docol · Compras' },
    { from: 'Julia Ito',                       to: 'Marcos Silveira' },
    { from: 'JI',                              to: 'MS' },
    { from: 'Julia',                           to: 'Marcos' },
    { from: 'Nous purple',                     to: 'Docol Red' },
];

/* Realistic Docol-context suppliers (Level 2) */
const SUPPLIERS = [
    { name: 'Wieland do Brasil',         cat: 'Latão / Metais' },
    { name: 'Saint-Gobain Brasil',       cat: 'Cerâmica / Vidro' },
    { name: 'Tigre S.A.',                cat: 'Termoplásticos' },
    { name: 'Aperam Inox',               cat: 'Aço inoxidável' },
    { name: 'Gerdau',                    cat: 'Aço carbono' },
    { name: 'Mahle Metal Leve',          cat: 'Componentes usinados' },
    { name: 'Termomecânica',             cat: 'Cobre / Latão' },
    { name: 'Embraco',                   cat: 'Componentes auxiliares' },
];

/* Realistic Docol SKU categories */
const SKU_CATEGORIES = [
    { name: 'Monocomandos',     code: 'MC',   sample: 'MC.LOOP.CR.150', count: 218 },
    { name: 'Torneiras de mesa', code: 'TM',  sample: 'TM.PRES.CR.120', count: 174 },
    { name: 'Chuveiros',         code: 'CH',  sample: 'CH.LIVE.4F.230', count: 92 },
    { name: 'Válvulas de descarga', code: 'VD', sample: 'VD.DOCOLMATIC.32', count: 46 },
    { name: 'Registros',         code: 'RG',  sample: 'RG.BASE.34.CR',  count: 64 },
    { name: 'Acessórios para banho', code: 'AB', sample: 'AB.GANCHO.SLIM', count: 130 },
];

/* Personas (Level 3 — branched demo flow) */
const PERSONAS = [
    {
        id: 'ops',
        name: 'Marcos Silveira',
        role: 'Diretor de Operações',
        avatar: '#1F4E8C',
        firstScreen: 'chat',
        focus: 'Dashboard executivo + gargalos P2P',
        branchSummary: 'Greeting executivo → KPIs de ciclo → gargalo PO > R$ 250k',
        kpiTone: 'exec',
    },
    {
        id: 'analyst',
        name: 'Camila Reis',
        role: 'Analista de Compras Sr.',
        avatar: '#0D9488',
        firstScreen: 'chat',
        focus: 'Detalhamento de variantes e cotações',
        branchSummary: 'Pergunta sobre cotações abertas → drill em fornecedor Wieland',
        kpiTone: 'detail',
    },
    {
        id: 'cfo',
        name: 'Roberto Drumond',
        role: 'CFO',
        avatar: '#B05E1A',
        firstScreen: 'roai',
        focus: 'RoAI · valor desbloqueado + payback',
        branchSummary: 'Abre direto em RoAI Value Tracker → cenários ROI',
        kpiTone: 'cfo',
    },
    {
        id: 'cio',
        name: 'Patrícia Hwang',
        role: 'CIO',
        avatar: '#6D4ADD',
        firstScreen: 'rotinas',
        focus: 'Arquitetura · segurança · integrações SAP',
        branchSummary: 'Vê rotinas + Trust Center primeiro, depois o produto',
        kpiTone: 'tech',
    },
];

/* Level 4 — dynamic variables that get filled by the AE form */
const DYNAMIC_VARS = [
    { key: 'empresa',         label: 'Empresa',           value: 'Docol' },
    { key: 'setor',           label: 'Setor',             value: 'Manufatura — metais sanitários' },
    { key: 'pain_point',      label: 'Dor principal',     value: 'PO > R$ 250k preso na alçada' },
    { key: 'ae_nome',         label: 'AE responsável',    value: 'Felipe Andrade' },
    { key: 'persona_nome',    label: 'Persona principal', value: 'Marcos Silveira' },
    { key: 'volume_mensal',   label: 'Volume mensal POs', value: '1.840' },
    { key: 'fornec_top',      label: 'Top fornecedor',    value: 'Wieland do Brasil' },
    { key: 'meta_lead_time',  label: 'Meta lead-time P2P', value: '25 dias' },
    { key: 'spend_total',     label: 'Spend total (12M)', value: '417,1 Mi' },
    { key: 'categorias_ativas', label: 'Categorias ativas', value: '11' },
    { key: 'roi_valor',       label: 'ROI desbloqueado',  value: '2,4M' },
    { key: 'roi_payback',     label: 'Payback do programa', value: '8 meses' },
    { key: 'pedido_id',       label: 'ID de pedido (exemplo)', value: '4500427209' },
];

/* Level 5 — guided content (hotspots/tooltips/CTAs) on the preview */
const HOTSPOT_KINDS = {
    tooltip:   { label: 'Tooltip',   icon: 'message-circle', color: '#3B82F6' },
    video:     { label: 'Vídeo do AE', icon: 'play',         color: '#EF4444' },
    cta:       { label: 'CTA',       icon: 'zap',            color: '#F59E0B' },
    hyperlink: { label: 'Hyperlink', icon: 'arrow-right',    color: '#0D9488' },
};

const DEFAULT_HOTSPOTS = [
    {
        id: 'h1',
        screen: 'chat',
        x: 0.20, y: 0.66,
        kind: 'tooltip',
        title: 'Saudação contextual',
        text: 'Note o cumprimento por nome — o Nous reconhece a persona e o horário automaticamente.',
        link: '',
        cta: '',
        videoUrl: '',
        videoDuration: '',
    },
    {
        id: 'h2',
        screen: 'chat',
        x: 0.50, y: 0.32,
        kind: 'video',
        title: 'Felipe explica',
        text: '"Aqui o time da Docol pergunta em pt-BR e o Nous responde com KPIs do SAP em segundos."',
        link: '',
        cta: '',
        videoUrl: 'https://loom.com/share/docol-explica-chat',
        videoDuration: '0:42',
    },
    {
        id: 'h3',
        screen: 'agents',
        x: 0.30, y: 0.45,
        kind: 'cta',
        title: 'Próximo passo',
        text: 'Agente "Aprovação P2P > R$ 250k" — clique para ver como sua regra atual viraria automação no Nous.',
        link: 'https://calendly.com/felipe-upflux/docol',
        cta: 'Agendar próxima call',
        videoUrl: '',
        videoDuration: '',
    },
    {
        id: 'h4',
        screen: 'roai',
        x: 0.65, y: 0.40,
        kind: 'hyperlink',
        title: 'Cálculo de ROI',
        text: 'R$ 2,4M baseado no volume da Docol × redução média de glosa observada em peers do setor.',
        link: 'https://upflux.ai/cases/manufatura',
        cta: 'Ver case completo',
        videoUrl: '',
        videoDuration: '',
    },
];

/* Default builder state */
const DEFAULT_STATE = {
    activeScreen: 'chat',
    expanded: 1,                    /* which level accordion is open */
    levels: {
        1: { enabled: true,  applied: true,  progress: 100 },
        2: { enabled: true,  applied: true,  progress: 100 },
        3: { enabled: true,  applied: true,  progress: 100 },
        4: { enabled: true,  applied: true,  progress: 100 },
        5: { enabled: true,  applied: false, progress: 60  },
    },
    cosmetic: {
        company:     DOCOL.company,
        industry:    DOCOL.industry,
        logoBg:      DOCOL.logoBg,
        logoMonogram: DOCOL.logoMonogram,
        brandColor:  '#C8102E',
        prospectContact: 'Marcos Silveira',
        prospectContactInitials: 'MS',
        applied: true,
    },
    data: {
        suppliers: ['Wieland do Brasil', 'Saint-Gobain Brasil', 'Tigre S.A.', 'Aperam Inox', 'Mahle Metal Leve'],
        skuCategories: ['Monocomandos', 'Torneiras de mesa', 'Chuveiros', 'Válvulas de descarga'],
        sites: ['Joinville (matriz)'],
        valueRange: [50000, 750000],
        currency: 'BRL',
    },
    persona: {
        activeId: 'ops',
        branchEnabled: true,
    },
    vars: Object.fromEntries(DYNAMIC_VARS.map(v => [v.key, v.value])),
    hotspots: DEFAULT_HOTSPOTS,
    showHotspotPreview: null,         /* which hotspot is selected in the editor */
    openHotspotId: null,              /* which callout is open on the preview (click-to-open) */
    /* Categorized example questions captured during commercial discovery.
       Editable per prospect. Used in chat home + sidebar Recentes. */
    discovery: {
        estrategico: [
            {
                id: 'E1',
                label: 'Considerando os spends de cada categoria, quais tendências da operação para os próximos meses?',
                answer: {
                    text: 'O spend total dos últimos 12 meses somou **R$ {{spend_total}}** distribuídos em **{{categorias_ativas}} categorias ativas**, com forte concentração: Outros, Serviço e Manutenção respondem por **87,5%** do volume (64,14%, 16,82% e 6,54% respectivamente), padrão típico de Pareto em compras industriais.\n\nEm **abril 2026**, apenas **2** das 10 categorias analisadas apresentam tendência de crescimento — **Manutenção** com desvio de **+120,1%** vs. média dos 3 meses anteriores (R$ 9,8 Mi vs. média de R$ 4,5 Mi) e **Consumo** com **+75,41%** (R$ 5,0 Mi vs. R$ 2,8 Mi), enquanto as demais 8 categorias estão em queda, com destaque negativo para **Epi (-87,04%)**, **Marketing (-83,14%)** e **Químico (-71,24%)**.\n\nA projeção para o próximo trimestre aponta R$ 116,6 Mi para Outros, R$ 33,8 Mi para Serviço e R$ 12,0 Mi para Manutenção, totalizando **~R$ 186,9 Mi**. Ação prioritária: investigar o pico de Manutenção em abril (possível corretiva não planejada) e acionar fornecedores de Epi e Químico para entender se a queda reflete cancelamento real ou atraso de faturamento.',
                    artifact: {
                        type: 'kpi-grid',
                        title: 'Tendências de Spend por Categoria',
                        meta: ['Últimos 12 meses', '{{categorias_ativas}} categorias ativas', 'Spend total: R$ {{spend_total}}'],
                        kpis: [
                            { label: 'SPEND TOTAL (12M)', value: 'R$ {{spend_total}}', sub: 'Período: Nov 2025 - Abr 2026', highlight: true },
                            { label: 'CATEGORIAS ATIVAS',  value: '{{categorias_ativas}}', sub: 'Grupos de material' },
                            { label: 'TICKET MÉDIO',       value: 'R$ 6.799', sub: 'Por item' },
                            { label: 'CATEGORIAS EM CRESCIMENTO', value: '2', sub: '+120% (Manutenção) vs média 3m anterior' },
                        ],
                    },
                },
            },
            {
                id: 'E2',
                label: 'Qual o ROI do nosso investimento em supply chain digital?',
                answer: {
                    text: 'O programa gerou **R$ {{roi_valor}}** em valor desbloqueado nos últimos 12 meses, principalmente em redução de glosa de NF (R$ 980k) e aceleração de pagamentos a fornecedores (R$ 720k). O payback estimado é de **{{roi_payback}}**.',
                    artifact: {
                        type: 'kpi-grid',
                        title: 'RoAI · Programa Supply Chain Digital',
                        meta: ['12M', 'vs. baseline 2025'],
                        kpis: [
                            { label: 'VALOR DESBLOQUEADO', value: 'R$ {{roi_valor}}', sub: 'Acumulado 12M', highlight: true },
                            { label: 'PAYBACK',             value: '{{roi_payback}}', sub: 'do investimento total' },
                            { label: 'AUTOMAÇÕES ATIVAS',   value: '14', sub: 'rodando em produção' },
                        ],
                    },
                },
            },
            { id: 'E3', label: 'Estamos batendo a meta de lead-time P2P estabelecida no PE?' },
            { id: 'E4', label: 'Quais fornecedores estratégicos têm risco de ruptura?' },
        ],
        gestao: [
            {
                id: 'G1',
                label: 'Performance dos fornecedores no último trimestre',
                answer: {
                    text: '**{{fornec_top}}** lidera o ranking com OTIF de 94% e lead-time médio de 6,2 dias. Saint-Gobain Brasil entrega em prazo em 87% dos casos. Os maiores ofensores são Tigre S.A. (OTIF 71%) e um fornecedor secundário de aço inox com 8 lotes recusados no trimestre.',
                    artifact: {
                        type: 'kpi-grid',
                        title: 'Performance · {{empresa}} · Q1 2026',
                        meta: ['Janeiro–Março', '5 fornecedores principais'],
                        kpis: [
                            { label: 'OTIF MÉDIO',        value: '83%', sub: 'On-time in-full agregado', highlight: true },
                            { label: 'LEAD-TIME MÉDIO',   value: '8,4 dias', sub: 'pondrado por volume' },
                            { label: 'TOP FORNECEDOR',    value: '{{fornec_top}}', sub: 'OTIF 94% · LT 6,2d' },
                        ],
                    },
                },
            },
            { id: 'G2', label: 'Quais gargalos do meu processo P2P por unidade fabril?' },
            { id: 'G3', label: 'Variação de lead-time entre Joinville e Manaus' },
            { id: 'G4', label: 'Top 10 categorias com maior desvio de prazo' },
        ],
        operacional: [
            {
                id: '1.1',
                label: 'Requisição: O que eu preciso comprar hoje?',
                answer: {
                    text: 'Hoje **{{empresa}}** tem **23 requisições novas** aguardando aprovação, totalizando **R$ 1,84 Mi**. As 3 categorias com maior pressão: **Lubrificantes industriais** (R$ 482k), **Componentes de manutenção** (R$ 318k) e **EPI** (R$ 264k). Cinco delas estão fora do SLA de 24h e devem ser priorizadas.',
                    artifact: {
                        type: 'kpi-grid',
                        title: 'Requisições do dia · {{empresa}}',
                        meta: ['Hoje', '23 novas', 'R$ 1,84 Mi'],
                        kpis: [
                            { label: 'NOVAS HOJE',     value: '23', sub: 'Aguardando aprovação', highlight: true },
                            { label: 'CRÍTICAS',       value: '5', sub: 'SLA > 24h' },
                            { label: 'VALOR TOTAL',    value: 'R$ 1,84 Mi', sub: 'Soma do dia' },
                            { label: 'FORNECEDORES',   value: '14', sub: 'distintos' },
                        ],
                    },
                },
            },
            {
                id: '1.2',
                label: 'Requisição: Tenho requisições duplicadas abertas hoje?',
                answer: {
                    text: 'Identifiquei **4 pares de requisições duplicadas** abertas nos últimos 7 dias — mesmo CNPJ, mesmo valor (±5%), janela < 7 dias. Total potencialmente bloqueado: **R$ 312k**. Recomendação: revisar com o comprador antes de aprovar.',
                    artifact: {
                        type: 'kpi-grid',
                        title: 'Detecção de duplicidade · {{empresa}}',
                        meta: ['Últimos 7 dias', '4 pares identificados'],
                        kpis: [
                            { label: 'PARES DUPLICADOS', value: '4', sub: 'a revisar', highlight: true },
                            { label: 'VALOR BLOQUEADO',  value: 'R$ 312k', sub: 'pendente de revisão' },
                            { label: 'CNPJs ENVOLVIDOS', value: '3', sub: 'fornecedores distintos' },
                        ],
                    },
                },
            },
            { id: '3.1', label: 'Pedido: Quais POs estão com divergência?' },
            { id: '3.2', label: 'Pedido: Quais POs foram aprovados fora do fluxo padrão?' },
            { id: '4.1', label: 'Diligenciamento: Quais entregas estão pendentes?' },
            { id: '5.1', label: 'Pagamento: Quais faturas estão paradas?' },
            { id: '2.1', label: 'Cotação: Quais as cotações abertas há mais de 5 dias úteis sem retorno?' },
            {
                id: '7.1',
                label: 'Analise o histórico do item do pedido 4500427209, traga os valores e a dispersão',
                answer: {
                    text: 'O pedido **4500427209** contém **1 item** com preço unitário de **USD 1.587.136,18** e valor total de **USD 3.505.918,50**, operado pelo fornecedor **9998586277 Fornecedor 1151**. Como há apenas 1 item na amostra, a dispersão é **0,0%** e o desvio padrão é **indisponível** — não existe base histórica comparativa suficiente para afirmar se o preço está dentro ou fora do padrão de mercado, e qualquer conclusão estatística deve ser tratada com cautela.\n\nA timeline de eventos registra **500 ocorrências** distribuídas entre Criação Item da Ordem de Compra (81 eventos), Envio Ordem de Compra (75), Recebimento Concluído (79) e Aguardando Aprovação (28), com atividade concentrada em **2022-10-25** (29 eventos) e **2024-02-22** (25 eventos), sugerindo um ciclo de vida longo com múltiplos recebimentos parciais — recomenda-se auditar se o valor unitário permaneceu estável ao longo dessas revisões ou se houve reprecificação entre os eventos de aprovação.\n\n⚠️ Esta análise pode não ter sido realizada de forma completa.',
                    artifact: {
                        type: 'kpi-grid',
                        title: 'Análise de Histórico - Pedido {{pedido_id}}',
                        meta: ['Pedido: {{pedido_id}}', '1 item', 'USD 3.505.918,50'],
                        kpis: [
                            { label: 'VALOR UNITÁRIO',        value: 'USD 1.587.136,18', sub: 'Preço praticado', highlight: true },
                            { label: 'VALOR TOTAL DO PEDIDO',  value: 'USD 3.505.918,50', sub: '8.000.000 UN' },
                            { label: 'DISPERSÃO',              value: '0,0%',             sub: 'amostra insuficiente' },
                            { label: 'EVENTOS NO HISTÓRICO',   value: '500',              sub: 'distribuídos em 4 status' },
                        ],
                    },
                },
            },
        ],
    },
    /* Recent-chat shortcuts shown in sidebar — change per persona */
    recentsByPersona: {
        ops:     [
            'Quais gargalos do meu processo P2P no último trimestre?',
            'POs > R$ 250k pendentes de aprovação',
            'Lead-time médio Joinville vs Manaus',
            'Variação de glosa de NF últimos 6 meses',
        ],
        analyst: [
            'Cotações Wieland abertas há mais de 5 dias',
            'POs aprovados fora do fluxo padrão',
            'Requisições duplicadas abertas hoje',
            'Faturas paradas há mais de 7 dias',
        ],
        cfo: [
            'Valor desbloqueado pelas automações neste trimestre',
            'Cenários de ROI · projeção 12 meses',
            'Impacto fiscal das divergências de NF',
            'Custo de aprovação manual por PO',
        ],
        cio: [
            'Volume diário Sync SAP MM',
            'Latência média das integrações',
            'Trust Center · status de conformidade',
            'Logs de Reindex semântico · janela 7d',
        ],
    },
    activeCategory: null,            /* which chat category is expanded */
    achados: {
        filter: 'all',
        items: [
            { id: 'ach1', title: 'Gestão de Leitos - Desocupações e Riscos (19/05/2026)', date: '20/05/2026', type: 'html', category: '2 - Internacao e Desospitalizacao' },
            { id: 'ach2', title: 'Painel de Turno - UpFlux',                              date: '19/05/2026', type: 'html', category: '2 - Internacao e Desospitalizacao' },
            { id: 'ach3', title: 'Dúvida: Aprovações P2P',                                date: '14/05/2026', type: 'html', category: '1 - Compras ao Pagamento', preview: 'Qual o percentual de requisições que estouraram o SLA de aprovação?' },
            { id: 'ach4', title: 'Auditoria forense',                                     date: '14/05/2026', type: 'html', category: '1 - Compras ao Pagamento' },
            { id: 'ach5', title: 'Faturas Bloqueadas para Pagamento',                     date: '14/05/2026', type: 'html', category: '1 - Compras ao Pagamento' },
            { id: 'ach6', title: 'Visualização',                                          date: '14/05/2026', type: 'html', category: '1 - Compras ao Pagamento' },
            { id: 'ach7', title: 'MIGOs com Divergência de Quantidade > 2%',              date: '14/05/2026', type: 'html', category: '1 - Compras ao Pagamento' },
            { id: 'ach8', title: 'Inspeções de Qualidade Pendentes',                      date: '14/05/2026', type: 'html', category: '1 - Compras ao Pagamento' },
            { id: 'ach9', title: 'Top 10 fornecedores · concentração Wieland',            date: '12/05/2026', type: 'html', category: '1 - Inteligencia de Suprimentos' },
        ],
        categories: [
            'Todos',
            '2 - Internacao e Desospitalizacao',
            '1 - Compras ao Pagamento',
            '1 - Inteligencia de Suprimentos',
        ],
    },
    agents: {
        activeTab: 'agentes',          /* 'agentes' | 'biblioteca' */
        filter: 'all',                 /* 'all' | 'alertas' | 'priorizador' | 'insights' | 'autonomos' */
        categoryFilter: null,
        showNewTemplate: false,
        showNewAgent: false,
        active: [
            {
                id: 'p2p-priorizador',
                name: 'Priorizador Operacional',
                desc: 'Agente autônomo para priorização do dia a dia da operação P2P. Analisa filas, SLAs e impacto financeiro para sugerir o que atacar primeiro.',
                category: 'autonomos',
                tags: ['p2p', 'priorizacao'],
                status: 'live',
                lastRun: 'há 12 min',
                actions: 47,
                demoVideo: 'assets/agente-priorizador.mp4',
                prompt: 'Analise as requisições, pedidos e cotações abertas. Priorize as atividades do dia ordenadas por: 1) impacto financeiro (valor envolvido), 2) urgência (SLA), 3) dependências críticas. Gere a lista de ações para Marcos Silveira na manhã.',
            },
            {
                id: 'p2p-aprovador',
                name: 'Aprovador Inteligente',
                desc: 'Aprova POs de baixo risco automaticamente seguindo a matriz de alçada Docol. Encaminha para humanos só quando há divergência de pelo menos 1 critério.',
                category: 'autonomos',
                tags: ['p2p', 'aprovacao'],
                status: 'live',
                lastRun: 'há 23 min',
                actions: 184,
                demoVideo: 'assets/agente-priorizador.mp4',
                prompt: 'Para cada PO criada, avalie: valor, fornecedor histórico, categoria, conformidade com contrato. Aprove se TODOS os critérios estão dentro do esperado. Encaminhe para humano se houver qualquer divergência.',
            },
            {
                id: 'p2p-conciliador',
                name: 'Conciliador 3 Vias',
                desc: 'Cruza PO + NF + entrada física. Identifica e bloqueia divergências antes do pagamento. Reduz risco fiscal e re-trabalho contábil.',
                category: 'autonomos',
                tags: ['p2p', 'fiscal'],
                status: 'live',
                lastRun: 'há 1h',
                actions: 92,
                demoVideo: 'assets/agente-priorizador.mp4',
                prompt: 'A cada nota fiscal recebida, valide: (a) PO autorizada existe? (b) recebimento físico bate? (c) valores conferem? Se sim, libere para pagamento. Se não, bloqueie e crie achado.',
            },
            {
                id: 'p2p-negociador',
                name: 'Negociador de Cotação',
                desc: 'Conduz cotações multi-fornecedor automaticamente. Solicita propostas, compara, sugere ganhador baseado em histórico e preço-target.',
                category: 'autonomos',
                tags: ['p2p', 'cotacao'],
                status: 'live',
                lastRun: 'há 2h',
                actions: 31,
                demoVideo: 'assets/agente-priorizador.mp4',
                prompt: 'Para requisições > R$ 50k sem contrato vigente, dispare cotação para top-3 fornecedores da categoria. Aguarde 5 dias úteis. Compare propostas. Sugira vencedor com justificativa econômica.',
            },
            {
                id: 'p2p-monitor',
                name: 'Monitor de Compliance',
                desc: 'Vigia o processo P2P em tempo real procurando desvios: aprovação fora do fluxo, fornecedor sem cadastro, valor acima de alçada delegada.',
                category: 'autonomos',
                tags: ['p2p', 'compliance', 'risco'],
                status: 'live',
                lastRun: 'há 5 min',
                actions: 8,
                demoVideo: 'assets/agente-priorizador.mp4',
                prompt: 'Monitore o stream de eventos do SAP MM. Para cada PO ou pagamento, valide políticas: alçada, dual-control, fornecedor homologado, segregação de função. Levante achado se algum item falhar.',
            },
        ],
        library: [
            {
                category: 'P2P',
                items: [
                    { id: 'lib-rel-p2p',      name: 'Relatório Mensal Executivo P2P',      desc: 'Economias totais, conformidade, fornecedores e capital de giro para a diretoria financeira.', tag: 'insights' },
                    { id: 'lib-cap-giro',     name: 'Análise Semanal de Capital de Giro e Impacto Financeiro', desc: 'Impacto em capital de giro: pagamentos antecipados, descontos perdidos, prazo de pagamento e fluxo de caixa.', tag: 'priorizador' },
                    { id: 'lib-gastos',       name: 'Análise Semanal de Gastos e Concentração', desc: 'Análise de gastos: concentração por fornecedor, categoria, empresa e riscos de dependência.', tag: 'insights' },
                    { id: 'lib-compliance',   name: 'Análise Semanal de Eficiência e Compliance P2P', desc: 'Prazos internos, variantes de processo, compras fora do padrão, pagamentos antecipados e segregação de função.', tag: 'insights' },
                    { id: 'lib-fornec',       name: 'Painel Semanal de Desempenho de Fornecedores', desc: 'Desempenho de fornecedores: pontualidade, qualidade, prazo de entrega, conferência 3 vias e disputas.', tag: 'priorizador' },
                    { id: 'lib-bloqueios',    name: 'Resumo Diário de Compras e Bloqueios', desc: 'Entregas atrasadas, bloqueios de pagamento, maverick buying e volume de POs.', tag: 'insights' },
                    { id: 'lib-atraso',       name: 'Alerta de Entregas Atrasadas', desc: 'Alertar sobre POs com entrega pendente atrasada em risco de ruptura de estoque ou parada de linha.', tag: 'alertas' },
                ],
            },
            {
                category: 'O2C',
                items: [
                    { id: 'lib-o2c-rel',  name: 'Relatório Semanal de Aging de Recebíveis',  desc: 'AR aging, DSO e top clientes em atraso. Visão para a tesouraria.', tag: 'insights' },
                    { id: 'lib-o2c-risco', name: 'Alerta de Risco de Crédito',                desc: 'Cliente com pagamentos em atraso recorrentes ou acima do limite de crédito autorizado.', tag: 'alertas' },
                ],
            },
            {
                category: 'Estoque & WIP',
                items: [
                    { id: 'lib-est-rupt', name: 'Monitor de Ruptura', desc: 'SKUs em risco de ruptura nas próximas 72h baseado em consumo médio e lead time.', tag: 'alertas' },
                    { id: 'lib-est-giro', name: 'Análise de Giro de Estoque', desc: 'Curva ABC, slow movers e capital imobilizado por categoria.', tag: 'insights' },
                ],
            },
        ],
        availableTags: [
            { id: 'all',         label: 'Todas' },
            { id: 'alertas',     label: 'Alertas' },
            { id: 'priorizador', label: 'Priorizador' },
            { id: 'insights',    label: 'Insights' },
            { id: 'autonomos',   label: 'Autônomos' },
        ],
    },
    valueTracker: {
        period: '12m',                 /* '3m' | '6m' | '12m' | 'all' */
        alert: {
            message: 'Plano "Realizar Análise de Fornecedores com Custo de Aquisição" vencido com R$ 518.790 bloqueados',
            value: 518790,
            severity: 'danger',
        },
        kpis: {
            pipelineTotal: { value: 'R$ 50,2M', label: 'PIPELINE TOTAL', meta: { realizado: 'R$ 2,4M realizado', meta: 'Meta: R$ 50,2M' } },
            realizado: { value: 'R$ 2,4M', label: 'REALIZADO', meta: 'R$ 47,8M pendentes · 95% para capturar' },
            conversao: { value: '5%', label: 'TAXA DE CONVERSÃO', meta: '3 de 25 ganhos convertidos', donutPct: 5 },
        },
        pipelineValor: [
            { id: 'identificado',   label: 'IDENTIFICADO',   count: 17, value: 'R$ 7,5M',  color: '#6B7280' },
            { id: 'emRealizacao',   label: 'EM REALIZAÇÃO',  count: 3,  value: 'R$ 747k',  color: '#3B82F6' },
            { id: 'realizado',      label: 'REALIZADO',      count: 3,  value: 'R$ 41,3M', color: '#10B981' },
            { id: 'naoRealizado',   label: 'NÃO REALIZADO',  count: 1,  value: 'R$ 319k',  color: '#9CA3AF' },
            { id: 'contestado',     label: 'CONTESTADO',     count: 1,  value: 'R$ 311k',  color: '#EF4444' },
        ],
        ganhos: [
            { label: 'Consolidação de Compras Spot em Contrato',                                      status: 'realizado', valor: 0.42 },
            { label: 'Volume significativo em movimentação com lead time elevado',                    status: 'realizado', valor: 0.30 },
            { label: 'Saving Real - Custo Evitado',                                                   status: 'realizado', valor: 0.04 },
            { label: 'Volume significativo de pedidos elegíveis para automação de aprovação',         status: 'emAndamento', valor: 0.05 },
            { label: 'Volume elevado de retrabalho identificado em sistema. Custo de retrabalho.',    status: 'emAndamento', valor: 0.06 },
            { label: 'Saving de 5% sobre volume de spend elegível identificado',                      status: 'emAndamento', valor: 0.04 },
        ],
        composicao: [
            { id: 'realizado',  label: 'Realizado',          pct: 82, color: '#10B981' },
            { id: 'bloqueado',  label: 'Bloqueado (vencido)', pct: 4,  color: '#EF4444' },
            { id: 'progresso',  label: 'Em progresso',       pct: 14, color: '#8E76E7' },
        ],
        resumoGanhos: [
            { label: 'Identificado',  count: 17, color: '#9CA3AF' },
            { label: 'Realizado',     count: 3,  color: '#10B981' },
            { label: 'Contestado',    count: 1,  color: '#EF4444' },
            { label: 'Em Realização', count: 3,  color: '#3B82F6' },
            { label: 'Não Realizado', count: 1,  color: '#6B7280' },
        ],
        resumoPlanos: [
            { label: 'Backlog',      count: 11, color: '#9CA3AF' },
            { label: 'Planejado',    count: 2,  color: '#3B82F6' },
            { label: 'Concluído',    count: 3,  color: '#10B981' },
            { label: 'Em Andamento', count: 1,  color: '#F59E0B' },
        ],
        planos: [
            { id: 'p1',  title: 'Elevar DPO de MRO para 90 dias',                              priority: 'alta',  dueDate: '15 ago 2026', owner: 'Responsável de Compras', column: 'backlog' },
            { id: 'p2',  title: 'Reduzir tempo de processamento de pedidos',                    priority: 'media', dueDate: '30 mai 2025', owner: 'Rafael',                  column: 'backlog' },
            { id: 'p3',  title: 'Realizar Atividade de Definição de Padrões de Conformidade',  priority: 'media', dueDate: '14 mai 2026', owner: 'Responsável 2',           column: 'backlog' },
            { id: 'p4',  title: 'Revisão de Padrão de Integração de Dados',                    priority: 'alta',  dueDate: '7 mai 2026',  owner: 'Responsável 3',           column: 'backlog' },
            { id: 'p5',  title: 'Validação e Refinamento de Painel 5.1',                       priority: 'media', dueDate: '30 abr 2026', owner: 'Responsável 1',           column: 'backlog' },
            { id: 'p6',  title: 'Realizar Análise de Fornecedores com Custo de Aquisição',     priority: 'alta',  dueDate: '20 abr 2026', owner: 'Responsável 1',           column: 'backlog' },
            { id: 'p7',  title: 'Implementar Política de DPO Estendido',                       priority: 'media', dueDate: '12 abr 2026', owner: 'Responsável 4',           column: 'backlog' },
            { id: 'p8',  title: 'Mapear oportunidades de consolidação Spot',                   priority: 'alta',  dueDate: '5 mai 2026',  owner: 'Rafael',                  column: 'backlog' },
            { id: 'p9',  title: 'Padronizar SLA de aprovação por categoria',                   priority: 'media', dueDate: '22 mai 2026', owner: 'Responsável 2',           column: 'backlog' },
            { id: 'p10', title: 'Auditoria de fluxo de pagamento crítico',                     priority: 'alta',  dueDate: '28 mai 2026', owner: 'Responsável 3',           column: 'backlog' },
            { id: 'p11', title: 'Treinamento equipe Coupa · módulo aprovação',                 priority: 'baixa', dueDate: '10 jun 2026', owner: 'Responsável 1',           column: 'backlog' },
            { id: 'p12', title: 'Validação de Faturamento e Receita',                          priority: 'alta',  dueDate: '9 abr 2026',  owner: 'Responsável 3',           column: 'planejado' },
            { id: 'p13', title: 'Maximizar PMP em Indiretos',                                  priority: 'alta',  dueDate: '26 mar 2026', owner: 'Responsável 4',           column: 'planejado' },
            { id: 'p14', title: 'Análise comparativa de preços por região',                    priority: 'alta',  dueDate: '15 jun 2026', owner: 'Rafael',                  column: 'emAndamento' },
            { id: 'p15', title: 'Migração Wieland para contrato bilateral',                    priority: 'alta',  dueDate: '5 mar 2026',  owner: 'Responsável 3',           column: 'concluido' },
            { id: 'p16', title: 'Catálogo de fornecedores secundários · latão',                priority: 'media', dueDate: '12 fev 2026', owner: 'Responsável 1',           column: 'concluido' },
            { id: 'p17', title: 'Workshop de boas práticas P2P · diretoria',                   priority: 'baixa', dueDate: '20 jan 2026', owner: 'Rafael',                  column: 'concluido' },
        ],
        quickActions: [
            { id: 'criar-plano',  label: 'Criar Plano de Ação',    icon: 'edit-3',  variant: 'primary' },
            { id: 'registrar',    label: 'Registrar Ganho',         icon: 'trending-up', variant: 'warn' },
            { id: 'potencial',    label: 'Quais ganhos têm maior potencial de conversão rápida?',  icon: 'sparkles' },
            { id: 'comparar',     label: 'Comparar performance vs. trimestre anterior',            icon: 'bar-chart-3' },
            { id: 'oportunidades',label: 'Identificar novas oportunidades no processo',            icon: 'search' },
        ],
        assistantMessages: [],
    },
};

window.STUDIO_DATA = {
    DOCOL, BRAND_SWATCHES, AE, FR_MAP, SUPPLIERS, SKU_CATEGORIES,
    PERSONAS, DYNAMIC_VARS, HOTSPOT_KINDS, DEFAULT_HOTSPOTS, DEFAULT_STATE,
    STUDIO_VERSION, STUDIO_BUILD_DATE,
};

/* ==================================================================
   LIBRARY SEED — 4 starter demos shown on Studio home page.
   The current Docol is the "master" with everything filled.
   The others are template stubs the AE clones and customizes.
   ================================================================== */
function buildTemplateState(overrides) {
    const base = JSON.parse(JSON.stringify(DEFAULT_STATE));
    return {
        ...base,
        ...overrides,
        cosmetic: { ...base.cosmetic, ...(overrides.cosmetic || {}) },
        persona:  { ...base.persona,  ...(overrides.persona  || {}) },
        vars:     { ...base.vars,     ...(overrides.vars     || {}) },
    };
}

const LIBRARY_SEED = [
    {
        id: 'docol-p2p-v1',
        name: 'Docol · P2P',
        prospect: 'Docol',
        industry: 'Manufatura',
        persona: 'Marcos Silveira',
        personaRole: 'Diretor de Operações',
        owner: 'Felipe Andrade',
        ownerInitials: 'FA',
        status: 'ready',                /* 'draft' | 'ready' | 'shared' */
        version: STUDIO_VERSION,
        createdAt: '2026-05-12',
        updatedAt: '2026-05-25',
        views: 3,
        shareCount: 1,
        accent: '#6D4ADD',
        state: DEFAULT_STATE,
        thumbHint: 'P2P · 11d 6h · R$ 2,4M desbloqueado',
    },
    {
        id: 'magalu-varejo',
        name: 'Magazine Luiza · Supply',
        prospect: 'Magazine Luiza',
        industry: 'Varejo',
        persona: 'Diretor de Supply Chain',
        personaRole: 'Diretor de Supply Chain',
        owner: 'Felipe Andrade',
        ownerInitials: 'FA',
        status: 'draft',
        version: STUDIO_VERSION,
        createdAt: '2026-05-22',
        updatedAt: '2026-05-22',
        views: 0,
        shareCount: 0,
        accent: '#0066FF',
        state: buildTemplateState({
            cosmetic: { company: 'Magazine Luiza', industry: 'Varejo', logoMonogram: 'M' },
            vars: {
                empresa: 'Magazine Luiza',
                setor: 'Varejo · Multicanal',
                pain_point: 'Lead time de reposição vs. sazonalidade',
                volume_mensal: '8.420',
                fornec_top: 'Whirlpool',
                meta_lead_time: '14 dias',
            },
        }),
        thumbHint: 'Reposição · stockout · Black Friday',
    },
    {
        id: 'ambev-mro',
        name: 'Ambev · Compras indiretas',
        prospect: 'Ambev',
        industry: 'Bens de consumo',
        persona: 'Gerente de Compras Indiretas',
        personaRole: 'Gerente de Compras Indiretas',
        owner: 'Patrícia Hwang',
        ownerInitials: 'PH',
        status: 'shared',
        version: 'v1.1.0',              /* older version — stays compatible */
        createdAt: '2026-04-28',
        updatedAt: '2026-05-14',
        views: 7,
        shareCount: 3,
        accent: '#F59E0B',
        state: buildTemplateState({
            cosmetic: { company: 'Ambev', industry: 'Bens de consumo', logoMonogram: 'A' },
            vars: {
                empresa: 'Ambev',
                setor: 'Bens de consumo · Bebidas',
                pain_point: 'Aprovação MRO acima de R$ 500k',
                volume_mensal: '4.180',
                fornec_top: 'Aurora',
                meta_lead_time: '21 dias',
            },
        }),
        thumbHint: 'MRO · alçada R$ 500k · 7 plantas',
    },
    {
        id: 'unimed-saude',
        name: 'Unimed BH · Glosa',
        prospect: 'Unimed BH',
        industry: 'Saúde',
        persona: 'Diretor Financeiro',
        personaRole: 'Diretor Financeiro',
        owner: 'Felipe Andrade',
        ownerInitials: 'FA',
        status: 'draft',
        version: STUDIO_VERSION,
        createdAt: '2026-05-19',
        updatedAt: '2026-05-21',
        views: 0,
        shareCount: 0,
        accent: '#0D9488',
        state: buildTemplateState({
            cosmetic: { company: 'Unimed BH', industry: 'Saúde', logoMonogram: 'U' },
            vars: {
                empresa: 'Unimed BH',
                setor: 'Saúde suplementar',
                pain_point: 'Glosa de honorários médicos',
                volume_mensal: '12.300',
                fornec_top: 'CBHPM Cooperados',
                meta_lead_time: '15 dias',
            },
        }),
        thumbHint: 'Glosa por especialidade · auditoria',
    },
];

window.STUDIO_DATA.LIBRARY_SEED = LIBRARY_SEED;
