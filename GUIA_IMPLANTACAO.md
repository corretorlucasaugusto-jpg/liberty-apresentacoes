# Guia de Implantação — Liberty Apresentações
## Para o DeepSeek

---

## CONTEXTO DO PROJETO

Este é um sistema web para a Liberty Imóveis (Brasília) que substitui um arquivo HTML local por uma aplicação web completa.

**O que faz:**
- Corretor acessa o site com login
- Preenche um formulário com dados do imóvel (cliente, concorrentes, pontos positivos/atenção, perfil do comprador)
- O servidor chama a API da Anthropic Claude para gerar descrições estratégicas automaticamente
- O sistema monta um HTML de 16 slides (apresentação de captação) e baixa para o corretor
- Os vídeos institucionais carregam de URLs públicas no Supabase Storage (sem precisar baixar arquivos)
- Histórico de todas as apresentações salvo no banco

**Stack:**
- Frontend: React + Vite + TailwindCSS (deploy na Vercel)
- Backend: Supabase (auth, PostgreSQL, storage, edge functions em Deno/TypeScript)
- IA: Anthropic Claude Sonnet (chave segura no servidor)

---

## ESTRUTURA DO ZIP ENTREGUE

```
liberty-apresentacoes/
├── extract-slides.js          ← script de extração (roda uma vez)
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── index.html
├── .env.example
├── .gitignore
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── pages/
│   │   ├── Gerador.jsx        ← formulário principal
│   │   ├── Historico.jsx      ← apresentações salvas
│   │   └── Login.jsx
│   ├── components/
│   │   ├── Layout.jsx
│   │   └── FormFields.jsx
│   ├── hooks/
│   │   └── useAuth.js
│   └── lib/
│       ├── supabase.js
│       ├── buildHTML.js       ← monta o HTML final
│       ├── _css.js            ← CSS dos slides (auto-gerado)
│       ├── _navjs.js          ← JS de navegação (auto-gerado)
│       └── _modals.js         ← HTML dos modais G1 + vídeos (auto-gerado)
│       ← _buildSlides.js NÃO está no ZIP — gerado pelo extract-slides.js
├── supabase/
│   ├── functions/gerar-apresentacao/index.ts   ← Edge Function com IA
│   └── migrations/001_create_apresentacoes.sql
```

**IMPORTANTE:** O arquivo `src/lib/_buildSlides.js` NÃO está no ZIP porque tem ~1.9MB.
Ele é gerado automaticamente pelo script `extract-slides.js` a partir do arquivo
`liberty_gerador_v2.html` (que o cliente tem separadamente).

---

## PASSO 1 — CRIAR PROJETO NO SUPABASE

1. Acesse https://supabase.com e crie uma conta (gratuito)
2. Clique em "New Project"
3. Escolha nome: `liberty-apresentacoes`
4. Escolha região: `South America (São Paulo)`
5. Defina uma senha forte para o banco (anote)
6. Aguarde o projeto criar (~2 minutos)

**Anote estas informações (Project Settings > API):**
```
Project URL: https://XXXXXXXX.supabase.co
anon public key: eyJ...
Project Reference ID: XXXXXXXX  (só os 8 chars do subdomínio)
```

---

## PASSO 2 — CRIAR O BANCO DE DADOS

1. No painel do Supabase, clique em **SQL Editor** (ícone de banco no menu lateral)
2. Clique em **New query**
3. Cole e execute o seguinte SQL:

```sql
-- Tabela de apresentações geradas
create table if not exists public.apresentacoes (
  id          uuid         primary key default gen_random_uuid(),
  user_id     uuid         references auth.users(id) on delete cascade not null,
  cliente     text,
  residencial text,
  bairro      text,
  html        text,
  created_at  timestamptz  default now() not null
);

-- RLS: cada corretor vê só as próprias apresentações
alter table public.apresentacoes enable row level security;

create policy "Corretor vê só as próprias apresentações"
  on public.apresentacoes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index apresentacoes_user_created
  on public.apresentacoes(user_id, created_at desc);
```

4. Clique em **Run** — deve aparecer "Success. No rows returned"

---

## PASSO 3 — CRIAR BUCKET DE VÍDEOS

1. No painel Supabase, clique em **Storage** (ícone de pasta)
2. Clique em **New bucket**
3. Nome: `videos`
4. Marque **Public bucket** (sim, público — os vídeos são institucionais)
5. Clique em **Create bucket**
6. Dentro do bucket `videos`, clique em **Upload files**
7. Faça upload dos dois arquivos de vídeo:
   - `liberty_video.mp4` (vídeo Produção Cinematográfica)
   - `liberty_trafego.mov` (vídeo Tráfego Pago)
8. Após upload, clique em cada arquivo e copie a **Public URL**:
   ```
   https://XXXXXXXX.supabase.co/storage/v1/object/public/videos/liberty_video.mp4
   https://XXXXXXXX.supabase.co/storage/v1/object/public/videos/liberty_trafego.mov
   ```
   Anote essas URLs — serão usadas no `.env`.

---

## PASSO 4 — CRIAR USUÁRIOS (CORRETORES)

1. No painel Supabase, clique em **Authentication** > **Users**
2. Clique em **Invite user**
3. Digite o e-mail do corretor e clique em **Send invite**
4. O corretor recebe um e-mail para definir a senha
5. Repita para cada corretor da equipe

Se quiser criar com senha imediata (sem e-mail):
- Clique em **Add user** > **Create new user**
- Preencha e-mail e senha diretamente

---

## PASSO 5 — INSTALAR O SUPABASE CLI

No terminal do seu computador (Mac/Linux/Windows com WSL):

```bash
# Mac
brew install supabase/tap/supabase

# Windows (com npm)
npm install -g supabase

# Verificar instalação
supabase --version
```

---

## PASSO 6 — CONFIGURAR O PROJETO LOCALMENTE

1. Descompacte o ZIP recebido
2. Entre na pasta:
   ```bash
   cd liberty-apresentacoes
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Copie o arquivo de variáveis:
   ```bash
   cp .env.example .env
   ```
5. Edite o `.env` com os dados do Supabase (passo 1) e URLs dos vídeos (passo 3):
   ```
   VITE_SUPABASE_URL=https://XXXXXXXX.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...sua_anon_key...
   VITE_VIDEO_PRODUCAO_URL=https://XXXXXXXX.supabase.co/storage/v1/object/public/videos/liberty_video.mp4
   VITE_VIDEO_TRAFEGO_URL=https://XXXXXXXX.supabase.co/storage/v1/object/public/videos/liberty_trafego.mov
   ```

---

## PASSO 7 — GERAR O ARQUIVO _buildSlides.js

Este passo extrai os templates dos 16 slides do arquivo `liberty_gerador_v2.html`:

1. Coloque o arquivo `liberty_gerador_v2.html` na pasta `liberty-apresentacoes/`
2. Execute:
   ```bash
   node extract-slides.js liberty_gerador_v2.html
   ```
3. Deve aparecer:
   ```
   ✓ Extracted to src/lib/_buildSlides.js
     buildSlides: 1,910,831 chars
     buildS5:     338,033 chars
   ```
4. O arquivo `src/lib/_buildSlides.js` foi criado. Não precisa mais do HTML na pasta.

---

## PASSO 8 — DEPLOY DA EDGE FUNCTION (IA no servidor)

1. Faça login no Supabase CLI:
   ```bash
   supabase login
   ```
   (abre o browser para autenticar)

2. Linke ao seu projeto (use o Project Reference ID do passo 1):
   ```bash
   supabase link --project-ref XXXXXXXX
   ```
   (pedirá a senha do banco que você definiu no passo 1)

3. Configure a chave da Anthropic como secret seguro:
   ```bash
   supabase secrets set ANTHROPIC_API_KEY=sk-ant-sua_chave_aqui
   ```
   A chave fica segura no servidor — nunca exposta no frontend.

4. Faça deploy da Edge Function:
   ```bash
   supabase functions deploy gerar-apresentacao
   ```
   Deve aparecer: `✓ Done`

5. Verifique no painel: **Edge Functions** > `gerar-apresentacao` deve estar listada

---

## PASSO 9 — TESTAR LOCALMENTE

```bash
npm run dev
```

Acesse http://localhost:5174

- Faça login com um dos usuários criados no passo 4
- Preencha um formulário de teste
- Clique em "✦ Gerar Apresentação"
- O HTML deve ser baixado automaticamente

Se aparecer erro na geração:
- Abra o DevTools (F12) > Console — o erro aparecerá lá
- Verifique se a Edge Function está deployada (passo 8)
- Verifique se o ANTHROPIC_API_KEY está correto

---

## PASSO 10 — CRIAR REPOSITÓRIO NO GITHUB

1. Crie uma conta em https://github.com (se não tiver)
2. Clique em **New repository**
3. Nome: `liberty-apresentacoes`
4. Deixe **Private** (recomendado)
5. NÃO inicialize com README (já temos um)
6. Clique em **Create repository**

Na pasta do projeto:
```bash
git init
git add .
git commit -m "feat: initial Liberty Apresentações"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/liberty-apresentacoes.git
git push -u origin main
```

**ATENÇÃO:** Confirme que `.env` está no `.gitignore` antes do push!
```bash
cat .gitignore  # deve incluir .env
```

---

## PASSO 11 — DEPLOY NA VERCEL

1. Acesse https://vercel.com e crie conta (gratuito, login com GitHub)
2. Clique em **Add New... > Project**
3. Importe o repositório `liberty-apresentacoes`
4. Framework Preset: **Vite** (deve detectar automaticamente)
5. Clique em **Environment Variables** e adicione:

   | Key | Value |
   |-----|-------|
   | `VITE_SUPABASE_URL` | https://XXXXXXXX.supabase.co |
   | `VITE_SUPABASE_ANON_KEY` | eyJ...sua_anon_key... |
   | `VITE_VIDEO_PRODUCAO_URL` | https://XXXXXXXX.supabase.co/storage/v1/object/public/videos/liberty_video.mp4 |
   | `VITE_VIDEO_TRAFEGO_URL` | https://XXXXXXXX.supabase.co/storage/v1/object/public/videos/liberty_trafego.mov |

6. Clique em **Deploy**
7. Aguarde (~1 minuto)
8. A Vercel vai gerar uma URL como `liberty-apresentacoes.vercel.app`

---

## PASSO 12 — CONFIGURAR DOMÍNIO PERSONALIZADO (OPCIONAL)

Se quiser usar `apresentacoes.libertyimoveis.com.br`:

1. Na Vercel > seu projeto > **Settings > Domains**
2. Adicione o domínio
3. A Vercel mostrará os DNS records para configurar no seu provedor de domínio
4. Após configurar DNS, a Vercel emite o certificado SSL automaticamente

---

## PASSO 13 — CONFIGURAR CORS NA EDGE FUNCTION (SE NECESSÁRIO)

Se o site na Vercel apresentar erro de CORS ao chamar a Edge Function:

1. No painel Supabase > **Edge Functions** > `gerar-apresentacao`
2. Clique em **Settings**
3. Em **Allowed Origins**, adicione a URL da Vercel:
   ```
   https://liberty-apresentacoes.vercel.app
   ```
   (ou o domínio personalizado se configurou um)

---

## CHECKLIST FINAL

Antes de passar para os corretores, verifique:

- [ ] Login funciona com e-mail e senha
- [ ] Formulário carrega corretamente
- [ ] Botão "Gerar Apresentação" funciona e baixa o HTML
- [ ] No HTML baixado: slides 1-16 aparecem todos
- [ ] No HTML baixado: vídeos abrem ao clicar (precisam estar na mesma pasta ou em URL)
- [ ] No HTML baixado: G1 abre e fecha corretamente
- [ ] No HTML baixado: links dos concorrentes abrem no modal
- [ ] Histórico lista as apresentações geradas
- [ ] Botão "Baixar" no histórico funciona

---

## TROUBLESHOOTING

### "Error: supabase not found"
```bash
npm install -g supabase
# ou no Mac:
brew install supabase/tap/supabase
```

### "Error: Project not linked"
```bash
supabase link --project-ref XXXXXXXX
```

### Edge Function retorna 500
Verifique o secret da API:
```bash
supabase secrets list
# Deve mostrar ANTHROPIC_API_KEY
```
Se não estiver:
```bash
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
supabase functions deploy gerar-apresentacao  # re-deploy após setar secret
```

### "Invalid API Key" da Anthropic
- Acesse https://console.anthropic.com/api-keys
- Verifique se a chave está ativa e com créditos
- Crie uma nova chave se necessário

### Vídeos não carregam na apresentação
- Verifique se o bucket `videos` é público
- Clique no vídeo no Storage > copie a URL pública > cole no browser — deve abrir
- Verifique as variáveis `VITE_VIDEO_*` na Vercel

### Build falha na Vercel: "Cannot find module '_buildSlides.js'"
O `_buildSlides.js` não foi commitado. Execute localmente:
```bash
node extract-slides.js liberty_gerador_v2.html
git add src/lib/_buildSlides.js
git commit -m "chore: add extracted buildSlides"
git push
```

### Erro de autenticação no login
- Verifique se o usuário foi criado no Supabase Authentication
- Verifique se `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` estão corretos na Vercel

---

## ATUALIZAÇÕES FUTURAS

Para atualizar o sistema após mudanças:

```bash
# 1. Fazer a mudança no código
# 2. Commit e push
git add .
git commit -m "fix: descrição da mudança"
git push

# A Vercel faz o deploy automaticamente em ~1 minuto
```

Para atualizar os templates dos slides (quando o liberty_gerador_v2.html mudar):
```bash
node extract-slides.js liberty_gerador_v2.html
git add src/lib/_buildSlides.js
git commit -m "chore: update slide templates"
git push
```

---

## CONTATO / DÚVIDAS

Em caso de dúvidas durante a implantação, as informações do projeto estão disponíveis
em conversa com o Claude (Anthropic) que gerou este sistema.
