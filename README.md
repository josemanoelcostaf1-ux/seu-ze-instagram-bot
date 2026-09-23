# Seu Zé · Bot de publicação no Instagram

Publica automaticamente, no Instagram do Seu Zé Mini Market, os posts de `calendar.json`
(30 posts de feed + story) na data e hora marcadas — sem servidor, sem banco de dados,
rodando de graça no GitHub Actions. Mesmo padrão do projeto irmão `eletroposto-whatsapp`.

## Como funciona

- `calendar.json` — os 30 posts: data/hora de publicação, imagem (já exportada do Canva,
  em `images/`) e legenda.
- `poster.py` — a cada execução, olha o relógio, publica no Instagram todo post cuja data
  já chegou e ainda não foi publicado, e grava o resultado em `state.json`.
- `.github/workflows/post.yml` — roda `poster.py` a cada hora (e pode ser disparado manualmente
  na aba **Actions** do repositório, botão "Run workflow").
- `state.json` — controla o que já foi publicado, pra nunca postar duas vezes; é atualizado
  pelo próprio workflow a cada execução.

## O que você precisa preparar (uma vez só)

1. **Conta do Instagram em modo Profissional** (Empresa ou Criador de conteúdo) — em
   Configurações → Conta → Mudar para conta profissional.
2. **Vincular a conta a uma Página do Facebook** (pode ser uma página nova, só para isso) —
   em Configurações → Contas vinculadas → Facebook.
3. **Criar um app no Meta for Developers**: [developers.facebook.com/apps](https://developers.facebook.com/apps)
   → "Criar app" → tipo "Empresa" → adicionar o produto **Instagram Graph API**.
4. No app, gerar um **token de acesso de usuário** com as permissões:
   `instagram_basic`, `instagram_content_publish`, `pages_show_list`, `pages_read_engagement`.
   O [Explorador da API Graph](https://developers.facebook.com/tools/explorer/) facilita isso.
5. Trocar esse token de curta duração por um **token de longa duração** (dura ~60 dias, precisa
   ser renovado periodicamente — dá pra automatizar isso depois se fizer sentido).
6. Descobrir o **IG_USER_ID** (o ID da conta do Instagram, não o @usuário): chame
   `GET /me/accounts` para achar o ID da Página, depois
   `GET /{page-id}?fields=instagram_business_account` para pegar o ID do Instagram.

Isso tudo é feito com o login do Meta/Facebook de vocês — eu não tenho como fazer essa parte
por vocês, só te guiar. Se travar em algum passo, me chama que ajudo a resolver o erro.

## Configurar o repositório

No repositório do GitHub, em **Settings → Secrets and variables → Actions**, criar dois secrets:

| Nome | Valor |
|---|---|
| `IG_USER_ID` | o ID numérico da conta do Instagram (passo 6 acima) |
| `IG_ACCESS_TOKEN` | o token de longa duração (passo 5 acima) |

Pronto — a partir daí o workflow roda sozinho, todo dia, sem precisar mexer em nada.

Até você cadastrar os dois secrets, o workflow fica pulando a execução silenciosamente
(sem erro, sem e-mail) — ele só começa a valer quando `IG_USER_ID` e `IG_ACCESS_TOKEN`
existirem.

## Testar antes de deixar automático

```bash
pip install -r requirements.txt
export IG_USER_ID=xxxxx
export IG_ACCESS_TOKEN=xxxxx
export GITHUB_REPOSITORY=SEU_USUARIO/seu-ze-instagram-bot
python poster.py
```

Ele só publica o que já venceu pela data em `calendar.json` — pra testar sem esperar a data
chegar, edite a `date` de um post para o passado e rode de novo.

## Ajustar o calendário

- Trocar texto, imagem ou data: editar `calendar.json` direto (é uma lista simples).
- Trocar a arte: reexportar a página do Canva
  ([Seu Zé · Modelos de Posts](https://www.canva.com/d/qApq7nompLGN_V-)) e substituir o PNG em
  `images/feed/` ou `images/story/`.
- Adicionar mais posts: seguir o mesmo formato de `calendar.json`.

## Limitações conhecidas

- A Instagram Graph API exige que a imagem esteja num link público — por isso as imagens
  ficam neste repositório e são servidas por `raw.githubusercontent.com`. O repositório
  precisa continuar público para isso funcionar.
- O token de acesso expira (~60 dias); quando expirar, é só gerar um novo e atualizar o
  secret `IG_ACCESS_TOKEN`.
- Publicação em Stories via API funciona só com imagem (sem sticker interativo, sem música).
