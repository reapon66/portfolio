# Reapon — meu cantinho na web

Portfólio de **Carlos Do Ó (Reapon)**, inspirado nas homepages e janelas de desktop de 2004. HTML, CSS e JavaScript, com **Vue 3.5.13 via CDN**. Sem bundler, sem instalação de dependências. O Node é usado apenas nas ferramentas locais; a versão publicada é estática.

## Abrir localmente

Requer Node.js 20 ou superior. Na pasta do projeto:

```sh
npm run dev
```

Abra http://127.0.0.1:4173. Para usar outra porta no PowerShell: `$env:PORT=4200`, seguido de `npm run dev`.

O Vue e as fontes são carregados pela internet. As fontes têm alternativas locais. Se o CDN do Vue não estiver acessível, a página informa o erro. Não abra `index.html` com duplo clique: o navegador bloqueia a leitura dos arquivos JSON por `file://`.

## Onde editar

```text
dist/                         ← site estático, com fontes editáveis
├── index.html                ← entrada, metadados e CDN do Vue
├── styles.css                ← identidade visual e responsividade
├── app.js                    ← componentes Vue e carregamento
├── profile.json              ← nome, bio, contatos e redes
├── assets/                   ← favicon e ilustração
└── content/
    ├── projects/*.json        ← um arquivo por projeto
    ├── skills/*.json          ← um arquivo por habilidade
    └── index.json            ← índice gerado, não editar à mão
templates/                    ← modelos prontos para copiar
scripts/                      ← servidor e indexador sem dependências
tests/                        ← verificações do fluxo de publicação dos posts
```

`dist` contém o próprio site editável. Nenhum comando apaga ou recria essa pasta.

## Personalizar o perfil

Edite `dist/profile.json`. Nome e apelido já estão preenchidos. Biografia, tecnologias e projetos são exemplos autorizados para você substituir.

- `name`, `nickname`, `role`, `intro` e `about`: apresentação e biografia.
- `location`, `status`, `now` e `interests`: localização, disponibilidade, atividade atual e interesses.
- `email`: substitua `reapon@example.com` pelo endereço real.
- `socials`: troque `url` pelo endereço do seu perfil. Os links iniciais abrem apenas a página inicial de cada rede, sem apontar para contas de outras pessoas. Depois defina `example: false` em cada rede.
- `exampleContent`: mude para `false` quando tiver substituído os exemplos; isso remove o aviso demonstrativo no rodapé.

Ao alterar seu nome ou a apresentação, ajuste também o título e a descrição em `dist/index.html` para mecanismos de busca que não executam JavaScript.

## Adicionar um projeto ou habilidade

1. Copie `templates/project.json` para `dist/content/projects/meu-projeto.json`, ou `templates/skill.json` para `dist/content/skills/minha-habilidade.json`.
2. Edite o arquivo copiado. Não é preciso cadastrar imports, IDs ou componentes.
3. Com `npm run dev` aberto, **atualize a página**: o servidor encontra a cópia automaticamente, sem reiniciar.

Também funciona copiar um post existente. Cada caminho de arquivo vira uma identidade única, portanto títulos repetidos não fazem um cartão substituir outro. Subpastas são descobertas recursivamente. Use nomes `.json` em minúsculas para a extensão.

Um projeto mínimo:

```json
{
  "title": "Meu novo projeto",
  "summary": "O que ele faz, em poucas palavras.",
  "status": "Em desenvolvimento",
  "tags": ["Vue.js", "CSS"],
  "details": ["Uma explicação mais completa, exibida ao abrir o cartão."],
  "links": [{ "label": "Ver código", "url": "https://github.com/seu-usuario/seu-repositorio" }]
}
```

Campos comuns:

| Campo | Uso |
| --- | --- |
| `title`, `summary` | Obrigatórios. Título e resumo do post. |
| `details` | Lista de parágrafos no painel de detalhes. Texto simples, sem HTML. |
| `tags` | Lista de tecnologias ou temas. |
| `order` | Ordem crescente; se ausente, aparece depois dos que têm ordem. |
| `accent` | `blue`, `lavender`, `peach`, `mint`, `yellow` ou `pink`. |
| `links` | Lista de objetos com `label` e `url` HTTP/HTTPS, exibidos nos detalhes. |
| `draft` | `true` oculta o post do índice. |
| `example` | `true` identifica conteúdo demonstrativo. |

Nos projetos: `status` pode ser `No ar`, `Em desenvolvimento` ou outro texto. `No ar` usa o indicador verde; os outros contam como em construção. `preview` aceita `notes`, `radio` ou `terminal`. O terminal usa um cartão horizontal no desktop; os demais usam duas colunas. As prévias são capas ilustrativas do projeto, sem controles de áudio reais. `nextSteps` é uma lista de próximas tarefas. `subtitle` e `date` ficam disponíveis nos arquivos para extensões futuras.

Nas habilidades: `symbol` define o pequeno rótulo (ex.: `JS`), e `level` informa sua relação com a tecnologia (`No dia a dia`, `Explorando`, etc.).

Arquivos e pastas cujo nome começa com `_` ou `.` são ignorados. Isso permite guardar modelos e rascunhos sem exibi-los.

## Publicar como site estático

```sh
npm run build
```

O comando valida os JSON e atualiza `dist/content/index.json`. Publique **o conteúdo completo de `dist`** em qualquer hospedagem estática (inclusive em subpastas). Os caminhos do site são relativos.

**Limite da web estática:** o navegador não consegue listar uma pasta do servidor. Na prévia local, o servidor descobre os arquivos a cada atualização. Na hospedagem estática, execute `npm run build` após copiar, excluir ou renomear posts e publique novamente a pasta `dist`. Você nunca precisa editar o índice à mão. Configure esse comando como etapa de build se sua hospedagem publicar automaticamente a partir de um repositório.

Você também pode usar `npm run index` para atualizar apenas o índice antes de abrir com outro servidor, como o Live Server.

## Componentes reutilizáveis

`dist/app.js` define `RetroWindow` (janela com slots), `UiIcon`, `SocialLink`, `SkillItem`, `PostCard` e `ProjectPreview`. O conteúdo é interpolado como texto, sem `v-html`. Links externos usam `noopener noreferrer`; detalhes usam `<dialog>` nativo, com foco, fechamento por Escape e clique no fundo.

As cores e fontes ficam em `:root` no início de `styles.css`. Os layouts respondem a telas pequenas e respeitam a preferência por movimento reduzido. Na versão móvel, o conteúdo aparece na ordem: apresentação, perfil, projetos, habilidades, sobre e contato.

## Verificação

```sh
npm test
```

Os testes verificam cópias sem cadastro manual, subpastas, nomes acentuados, rascunhos, diagnóstico de JSON inválido, rejeição de links executáveis e consistência do índice estático. Um arquivo inválido faz o build falhar antes de substituir o índice anterior.

## Arte

A ilustração original está em `dist/assets/retro-computer.png`, criada com a ferramenta integrada ImageGen. O prompt e a origem estão registrados em `ASSETS.md`.
