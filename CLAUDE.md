# CLAUDE.md — Urbanitas

Guia para o Claude Code trabalhar neste repositório. Leia antes de gerar ou alterar código.

## 1. Visão geral

**Urbanitas** é um app mobile-first para moradores de áreas urbanas descobrirem atividades, eventos e passeios em áreas **rurais e periurbanas** próximas, a partir da localização e de um raio de distância. Faz parte do ODS 11 (Cidades e Comunidades Sustentáveis). Projeto acadêmico (UX, PUCRS, Escola Politécnica).

Diferencial: uma **autoavaliação de impacto ambiental** após cada passeio, ligada a um **mascote** (broto) que evolui conforme os hábitos sustentáveis do usuário.

Slogan: *"Fugas de fim de semana, pertinho da cidade"*.

> A interface de referência é **iOS** (Apple HIG). Aqui ela é implementada em **Nuxt** como app web mobile-first, com aparência e comportamento próximos de iOS. Largura de referência: 390 px (iPhone). Em telas maiores, centralize o app em um "frame" de celular.

## 2. Stack e convenções técnicas

Padrões abaixo são o default do projeto. Se algo já existir no repositório e divergir, siga o que existe e me avise.

- **Nuxt 3** (Vue 3, `<script setup lang="ts">`, Composition API)
- **TypeScript** estrito
- **Pinia** para estado (`stores/`)
- **Tailwind CSS** com tokens do design em `tailwind.config` (seção 5)
- **Ícones:** Lucide (traço simples, consistente). Nunca misturar famílias de ícones.
- **Dados:** mocks locais em `server/api/` ou `data/` (sem backend real por enquanto). Isole o acesso em composables (`useEvents`, `useAuth`, `useImpact`) para trocar por API depois.
- **Idioma:** UI e textos em **português do Brasil**. Código (variáveis, funções, commits) em inglês.
- Componentes em `PascalCase`, composables `useX`, páginas em `kebab-case`.
- Sem `any`. Sem CSS inline para cores: use tokens.

### Estrutura sugerida

```
app/
  pages/
    index.vue              # Splash -> redireciona para /login
    login.vue
    cadastro.vue
    explorar/
      index.vue            # Busca (tela principal)
      [id].vue             # Detalhes do evento/local
    avaliar/[id].vue       # Folha (modal) de avaliação
    autoavaliacao/[id].vue # Autoavaliação ambiental (Etapa 2 de 2)
    impactometro.vue
    perfil.vue
    criar-evento.vue       # Somente conta Organizador
  components/
    ui/        # Button, Input, Chip, Card, Sheet, TabBar, StarRating...
    event/     # EventCard, PlanTripBlock, ReviewList, PhotoCarousel
    impact/    # MascotCard, StageTrail, HabitRing, HabitBar, DidYouKnow
  composables/
  stores/
  layouts/     # default (com TabBar), blank (splash/login/cadastro)
  assets/mascot/  # seed, sprout, ... (um asset por estágio)
```

### Comandos

```bash
npm install
npm run dev        # Nuxt dev server
npm run build
npm run lint
npm run typecheck  # nuxi typecheck
```

## 3. Personas (guiam toda decisão de UI)

| Persona | Perfil | O que precisa |
|---|---|---|
| **Lucas Ferreira**, 23, estudante/estagiário | Descobridor urbano ocasional | Saber o que tem perto no fim de semana, tudo em um lugar, com distância visível. Desiste se der trabalho. |
| **Mariana Oliveira**, 28, analista administrativa | Explorador de experiências locais | Datas, horários e programação com antecedência; gastronomia, feiras, festas, vinícolas; apoiar pequenos negócios. |
| **Rafael Martins**, 37, técnico de suporte | Planejador pragmático | Preço, distância, tempo de viagem, como chegar, estacionamento e clima **antes** de decidir. Compara opções gratuitas/baratas. |

Ao criar ou alterar uma tela, indique no comentário/PR quais personas ela atende.

## 4. Telas e fluxo

```
Splash -> Login <-> Cadastro
              |
           Explorar (Busca) -> [Busca sem resultados]
              |
           Detalhes -> "+ Avaliar" (folha modal)
                          |
                  Autoavaliação ambiental ("Etapa 2 de 2")
                          |
                     Impactômetro

TabBar fixa: Explorar | Impactômetro | Perfil
Criar evento: só para conta Organizador
```

### Especificação por tela

**Splash** — Fundo verde-mata, mascote centralizado, "Urbanitas", slogan, indicador de carregamento, paisagem cidade→campo no rodapé. Avança sozinha para Login. (Diverge da HIG de launch screen; decisão consciente do grupo.)

**Login** — Cabeçalho verde com mascote, nome e paisagem. "Que bom te ver por aqui!". Campos E-mail (teclado de e-mail, autofill) e Senha (com ícone de olho). Botão **Entrar** desabilitado até os dois campos estarem preenchidos. Links: "Esqueci minha senha", "Ainda não tem conta? Cadastre-se".

**Cadastro** — Título "Criar conta" com botão voltar. Seletor **Usuário | Organizador** (Organizador também publica eventos). Foto opcional, Nome, E-mail, Senha (mínimo 8 caracteres, validação ao digitar), Confirmar senha ("As senhas coincidem"). Texto de Termos de Uso e Política de Privacidade. Botão **Criar conta** só habilita com dados válidos. Link "Já tem conta? Entrar".

**Explorar (Busca)** — Tela inicial após login.
- Topo: "Explorar perto de" + cidade com seletor (ex.: Porto Alegre, RS) e avatar.
- Campo de busca com lupa e botão limpar (×).
- Botão **Filtros** + chips rápidos: **Até 30 km**, **Este fim de semana**, **Gratuito**.
- Categorias (ícone + nome): **Natureza, Gastronomia, Festas, Feiras, Cultura**.
- Lista "Perto de você" ordenada por proximidade. **Defaults ativos:** raio 30 km e fim de semana.
- Card: imagem, categoria, nome, data/horário, distância, preço (**Gratuito** ou R$), nota média (contagem).

**Busca sem resultados** — Mascote + "Nenhum resultado para "termo"" + explicação citando termo e filtros ativos. Ações: **Ampliar para 60 km** (dobra o raio) e **Limpar filtros** (mantém o termo). Nunca mostrar lista em branco.

**Detalhes** — Carrossel de fotos com voltar, compartilhar e favoritar (coração). Categoria · cidade, nome, nota (n avaliações), horário. Bloco **"Planeje sua ida"**: distância e tempo de carro, preço, como chegar, estacionamento, dificuldade da trilha, clima. Depois descrição e lista de avaliações (avatar, estrelas, comentário, data relativa). Botão **+ Avaliar** (com texto, não só ícone). Informação prática vem **antes** da descrição.

**Avaliação (folha modal)** — Folha com alça sobre tela escurecida. "Como foi a trilha?", 5 estrelas, rótulo dinâmico (Ruim, Regular, Bom, Muito bom, Excelente), comentário opcional com contador (máx. 300). **Confirmar** só habilita após escolher estrelas; **Cancelar** fecha sem salvar. Ao confirmar, segue para a Autoavaliação.

**Autoavaliação ambiental** — "Etapa 2 de 2" / "Meu impacto ambiental". Aviso: respostas alimentam **só** o Impactômetro do usuário. Balão do mascote: "Cada hábito marcado faz o seu broto crescer!". Quatro checkboxes com texto de apoio:
1. Joguei o lixo no local correto (ou trouxe de volta quando não havia lixeira)
2. Consumi produtos locais (comida, artesanato ou serviços da região)
3. Respeitei as regras da trilha (e não alimentei animais silvestres)
4. Não deixei rastros na natureza (sem fogueira, pichação ou plantas colhidas)

Botão **Ver meu impacto** + link **Responder depois**. Item marcado: borda verde + check.

**Impactômetro** — Cartão verde com estágio atual, "Faltam N hábitos sustentáveis para virar X" e barra de progresso. Trilha de evolução com 6 estágios: **Semente → Broto → Muda → Árvore → Florida → Floresta** (concluído verde-claro, atual destacado, futuros cinza). Anel de porcentagem do hábito principal com texto "7 de 10 passeios" + barras dos outros hábitos. Cartão **"Você sabia?"** (mensagem educativa curta) e botão **Mensagens educativas**. Cada autoavaliação atualiza anel, barras e mascote.

**Criar evento** (Organizador) — Campos: nome, descrição, fotos (até 5, primeira marcada "Capa", contador "1 de 5"), categoria (chips, lista fechada), data e horário (seletores nativos), local, tipo de entrada (**gratuita** por padrão ou paga), infraestrutura em chips (estacionamento, banheiros, acessibilidade, alimentação). **Publicar evento** só habilita com nome, categoria, data, horário e local preenchidos.

**Perfil** — Presente na TabBar, ainda sem design definido. Pergunte antes de inventar.

## 5. Design system

> Valores extraídos visualmente dos protótipos. Confirme com o arquivo de design se houver e centralize tudo em tokens.

**Cores (aproximadas)**
- `forest` (verde-mata, fundos de splash/cabeçalho): ~`#1E4D35`
- `primary` (verde do botão principal/links): ~`#2D7A4B`
- `leaf` (verde claro, concluído/ilustrações): ~`#6DBE78`
- `surface` (fundo creme das telas): ~`#FAF5F0`
- `sun` (amarelo de estrelas/destaques): ~`#F0AD3E`
- `tip` (fundo creme-alaranjado do "Você sabia?"): ~`#FFEED8`
- Texto principal quase preto esverdeado; secundário cinza médio.

**Tipografia:** sans-serif arredondada e legível (visual Nunito), com pesos para hierarquia (títulos bold/extrabold, apoio regular). Priorize legibilidade em mobile.

**Componentes**
- Botão primário: preenchido, verde, largura total, cantos bem arredondados. **Único destaque por tela.**
- Botão secundário: contorno verde. Ações terciárias: link de texto verde em negrito.
- Campos: fundo branco, borda sutil, ícone à esquerda, **borda verde quando em foco**, rótulo acima.
- Chips: arredondados; ativo em verde preenchido ou tinta verde.
- Cards: fundo branco, cantos arredondados, sombra suave.
- Folhas modais: alça no topo, fundo da tela escurecido.

**Mascote:** broto/semente com folhas e carinha. Aparece em Splash, Login, estado vazio, autoavaliação e Impactômetro. Um asset por estágio de evolução. Não redesenhar nem distorcer.

**Paisagem cidade→campo:** prédios escuros à esquerda, colinas e árvores à direita. Reutilizada em Splash e Login.

## 6. Princípios de UX (obrigatórios)

Aplicar e, ao entregar tela nova, listar quais foram seguidos:

1. **Correspondência com expectativas:** padrões conhecidos (lupa = buscar, @ = e-mail, cadeado = senha, olho = mostrar senha).
2. **Simplicidade:** poucas etapas e campos, coluna única.
3. **Controle e liberdade:** sempre dar voltar, cancelar, desmarcar, "Responder depois".
4. **Consistência:** mesmo componente, mesma cor, mesma posição para a mesma função.
5. **Eficiência:** atalhos (filtros rápidos, categorias, autofill, tab bar).
6. **Antecipação / defaults:** raio 30 km, fim de semana, entrada gratuita, capa = 1ª foto.
7. **Visibilidade do estado:** foco, desabilitado, progresso ("Etapa 2 de 2"), carregamento.
8. **Conteúdo relevante, linguagem simples:** textos curtos e próximos do público.
9. **Projeto para erros:** prevenir (botão desabilitado, listas fechadas) e orientar (mensagem diz o que houve e como resolver, nunca só "Erro").

**Apple HIG (referência da plataforma):** áreas de toque **≥ 44 pt**; contraste de texto **≥ 4,5:1**; tab bar inferior sempre visível com 3 seções; senha oculta por padrão; teclados e autofill corretos; coletar só dados necessários; botões com rótulo em texto.

### Padrões de design de IHC usados
Cards, Categorization, Search Filters, Carousel, Rate Content, Modal, Good Defaults, Blank Slate, Form, Action Button, Steps Left, Dashboard, Levels, Goal-Gradient, Feedback Loops, Self-Monitoring, Calendar Picker, Constraint Input, Input Feedback. Ao propor UI nova, prefira estes padrões e cite o usado.

## 7. Regras de negócio

- Raio padrão 30 km; "Ampliar" dobra o valor (30 → 60 km).
- Resultados sempre ordenados por proximidade por padrão.
- Avaliação exige nota (1–5); comentário opcional, máx. 300 caracteres.
- Avaliar → Autoavaliação é sequencial; a autoavaliação pode ser adiada.
- Respostas da autoavaliação são privadas e só alimentam o Impactômetro do próprio usuário.
- Estágios do mascote avançam por quantidade de hábitos sustentáveis registrados (regra de limiares a definir; manter configurável em um único arquivo).
- `Criar evento` visível/acessível apenas para `role === 'organizer'`.
- Categorias fixas: Natureza, Gastronomia, Festas, Feiras, Cultura.

## 8. Modelos de dados (referência)

```ts
type Category = 'natureza' | 'gastronomia' | 'festas' | 'feiras' | 'cultura'

interface EventPlace {
  id: string
  title: string
  category: Category
  city: string
  photos: string[]
  description: string
  schedule: string            // ex.: "Sáb e dom · 8h às 17h"
  price: number | 0           // 0 = Gratuito
  distanceKm: number
  travelMinutes?: number
  howToGet?: string
  parking?: string
  trailDifficulty?: string
  rating: number
  reviewsCount: number
  infrastructure: ('estacionamento' | 'banheiros' | 'acessibilidade' | 'alimentacao')[]
}

interface Review { id: string; eventId: string; author: string; stars: 1|2|3|4|5; comment?: string; createdAt: string }

interface SelfAssessment {
  eventId: string
  trashCorrect: boolean
  localProducts: boolean
  followedRules: boolean
  noTraces: boolean
}

type MascotStage = 'semente' | 'broto' | 'muda' | 'arvore' | 'florida' | 'floresta'
type UserRole = 'user' | 'organizer'
```

## 9. Como trabalhar neste projeto

- Antes de codar uma tela, releia a seção 4 e confirme persona + princípios + padrões.
- Reutilize componentes de `components/ui/` antes de criar novos.
- Cobrir sempre os estados: padrão, foco, desabilitado, carregando, vazio e erro.
- Acessibilidade: `aria-label` em botões só com ícone, foco visível, ordem de tab lógica.
- Use dados fictícios coerentes com as personas (ex.: Trilha do Morro Santana, Feira da Agricultura Familiar, Café Colonial Casa da Serra).
- Mudanças pequenas e focadas; explique decisões de UX quando divergirem deste documento.
- Se faltar definição (ex.: Perfil, limiares de evolução, filtros avançados), **pergunte** em vez de inventar.

## 10. Fora de escopo (por enquanto)

Pagamento/ingressos, backend real, mapa interativo, notificações push, moderação de conteúdo, versão nativa Swift.