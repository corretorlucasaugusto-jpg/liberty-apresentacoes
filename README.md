# Liberty Apresentações

Gerador de apresentações de captação para a equipe Liberty Imóveis.
Substituição do arquivo HTML local por uma aplicação web completa.

---

## Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend/Auth**: Supabase (auth, banco, storage, edge functions)
- **IA**: Anthropic Claude (roda no servidor — sem chave exposta no cliente)
- **Deploy**: Vercel (frontend) + Supabase (backend)

---

## Setup local

### 1. Pré-requisitos

- Node.js 18+
- Conta no [Supabase](https://supabase.com) (gratuita)
- Conta na [Vercel](https://vercel.com) (gratuita)
- Chave da API Anthropic: [console.anthropic.com](https://console.anthropic.com)

### 2. Clone e instale

```bash
npm install
```

### 3. Configure o Supabase

1. Crie um novo projeto em supabase.com
2. Vá em **SQL Editor** e execute o conteúdo de:
   `supabase/migrations/001_create_apresentacoes.sql`
3. Em **Authentication > Users**, crie os usuários dos corretores
4. Em **Project Settings > API**, copie a URL e a anon key

### 4. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite `.env`:
```
VITE_SUPABASE_URL=https://SEU_PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=sua_anon_key_aqui

# URLs dos vídeos no Supabase Storage (ver passo 6)
VITE_VIDEO_PRODUCAO_URL=https://SEU_PROJETO.supabase.co/storage/v1/object/public/videos/liberty_video.mp4
VITE_VIDEO_TRAFEGO_URL=https://SEU_PROJETO.supabase.co/storage/v1/object/public/videos/liberty_trafego.mov
```

### 5. Configure a Edge Function

Instale o Supabase CLI:
```bash
npm install -g supabase
supabase login
```

Linke ao seu projeto:
```bash
supabase link --project-ref SEU_PROJECT_REF
```

Configure o secret da API Anthropic:
```bash
supabase secrets set ANTHROPIC_API_KEY=sk-ant-sua_chave_aqui
```

Deploy da Edge Function:
```bash
supabase functions deploy gerar-apresentacao
```

### 6. Suba os vídeos no Supabase Storage

1. Acesse o dashboard do Supabase > **Storage**
2. Crie um bucket chamado `videos` (marque como **público**)
3. Faça upload de:
   - `liberty_video.mp4` → vídeo Produção Cinematográfica
   - `liberty_trafego.mov` → vídeo Tráfego Pago
4. Copie as URLs públicas e coloque no `.env` (passo 4)

### 7. Rode localmente

```bash
npm run dev
```

Acesse: http://localhost:5174

---

## Deploy na Vercel

1. Conecte o repositório GitHub ao Vercel
2. Configure as variáveis de ambiente no painel da Vercel
   (mesmas do `.env`, exceto prefixo `VITE_` — a Vercel lê automaticamente)
3. Deploy automático a cada push na branch `main`

---

## Adicionando corretores

No Supabase Dashboard > Authentication > Users > **Invite user**

O corretor recebe um e-mail de convite e cria a própria senha.

---

## Estrutura do projeto

```
liberty-apresentacoes/
├── src/
│   ├── pages/
│   │   ├── Gerador.jsx      # Formulário principal
│   │   ├── Historico.jsx    # Apresentações salvas
│   │   └── Login.jsx        # Autenticação
│   ├── components/
│   │   ├── Layout.jsx       # Header + nav
│   │   └── FormFields.jsx   # Componentes do formulário
│   ├── hooks/
│   │   └── useAuth.js       # Hook de autenticação
│   └── lib/
│       ├── supabase.js      # Cliente Supabase
│       ├── buildHTML.js     # Monta o HTML final da apresentação
│       ├── _css.js          # CSS extraído do gerador original
│       ├── _navjs.js        # JS de navegação extraído
│       ├── _modals.js       # HTML dos modais (G1, vídeos)
│       └── _slides_code.js  # Templates dos 16 slides
├── supabase/
│   ├── functions/
│   │   └── gerar-apresentacao/
│   │       └── index.ts     # Edge Function — chamada à IA
│   └── migrations/
│       └── 001_create_apresentacoes.sql
├── .env.example
├── package.json
└── README.md
```

---

## Como funciona o fluxo

```
Corretor preenche formulário
         ↓
POST /functions/v1/gerar-apresentacao
         ↓
Edge Function chama Anthropic API (chave no servidor)
         ↓
IA retorna JSON com descrições de pontos, perfis e NVs
         ↓
buildHTML() monta os 16 slides com os dados enriquecidos
         ↓
HTML salvo no banco (Supabase) + download automático
         ↓
Vídeos carregam da URL pública do Supabase Storage
```

---

## Diferenças em relação ao arquivo local

| | Arquivo local | Aplicação web |
|---|---|---|
| Vídeos | Precisam estar na mesma pasta | URL pública no servidor |
| Chave IA | Visível no navegador | Segura no servidor |
| Acesso | Qualquer pessoa com o arquivo | Login obrigatório |
| Histórico | Sem histórico | Todas as apresentações salvas |
| Atualização | Reenviar arquivo | Push no GitHub |
