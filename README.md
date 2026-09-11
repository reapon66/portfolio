# Portfólio — Carlos Do Ó

[Acessar o portfólio](https://reapon66.github.io/portfolio/).

Portfólio pessoal de **Carlos Do Ó (Reapon)**, com estética de desktop de 2004, HTML, CSS e **Vue 3.5.13 via CDN**.

## Abrir localmente

Abra **`index.html` com duplo clique**. Ele leva à página completa em `dist/index.html`, que também pode ser aberta diretamente.

Não precisa de Node.js, npm, instalação, servidor local ou build. Mantenha os arquivos e pastas juntos. É necessário acesso à internet para carregar o Vue via CDN e as fontes do Google Fonts; as fontes têm alternativas locais.

## Onde editar

```text
index.html                    ← atalho para abrir o site
 dist/                        ← site completo, pronto para hospedar
 ├── index.html               ← página, metadados e lista de scripts
 ├── styles.css               ← visual e responsividade
 ├── app.js                   ← componentes e interações Vue
 ├── content.js               ← registro e validação dos posts
 ├── profile.js               ← nome, bio, contatos e redes
 ├── assets/                  ← favicon e ilustração
 └── content/
     ├── projects/*.js        ← um arquivo por projeto
     └── skills/*.js          ← um arquivo por habilidade
 templates/                   ← modelos para novos posts
 .github/workflows/pages.yml  ← publicação estática no GitHub Pages
```

Os arquivos em `dist` são os próprios fontes editáveis. Não são arquivos gerados.

## Personalizar o perfil

Edite os valores em `dist/profile.js`, preservando `window.PortfolioContent.profile =` no início e `;` no final.

- `name`, `nickname`, `role`, `intro` e `about`: apresentação e biografia.
- `location`, `status`, `now` e `interests`: localização, disponibilidade e interesses.
- `email`: substitua `reapon@example.com` pelo endereço real.
- `socials`: substitua as URLs de exemplo pelos seus perfis e defina `example: false`.
- `exampleContent`: defina `false` quando substituir os exemplos para remover o aviso demonstrativo do rodapé.

Nome e apelido estão preenchidos. Biografia, contatos, habilidades e parte dos projetos ainda são demonstrativos. Ajuste também o título e a descrição em `dist/index.html` ao mudar sua apresentação.

## Adicionar um projeto ou habilidade

1. Copie `templates/project.js` para `dist/content/projects/meu-projeto.js`, ou `templates/skill.js` para `dist/content/skills/minha-habilidade.js`.
2. Edite os dados, preservando a chamada `window.PortfolioContent.register(...)`.
3. Inclua o arquivo na lista de scripts de `dist/index.html`, antes do Vue e de `app.js`:

```html
<script defer src="./content/projects/meu-projeto.js"></script>
```

4. Salve e atualize a página. Nenhum comando é necessário.

Exemplo de projeto:

```js
window.PortfolioContent.register('projects', {
  title: 'Meu novo projeto',
  summary: 'O que ele faz, em poucas palavras.',
  status: 'Em desenvolvimento',
  tags: ['Vue.js', 'CSS'],
  details: ['Uma explicação mais completa, exibida ao abrir o cartão.'],
  links: [{ label: 'Ver código', url: 'https://github.com/seu-usuario/seu-repositorio' }]
});
```

| Campo | Uso |
| --- | --- |
| `title`, `summary` | Obrigatórios; título e resumo. |
| `details`, `tags`, `nextSteps` | Listas de textos; detalhes, tecnologias e próximas tarefas. |
| `order` | Ordem crescente; sem ordem, aparece depois dos demais. |
| `accent` | `blue`, `lavender`, `peach`, `mint`, `yellow` ou `pink`. |
| `links` | Lista de objetos com `label` e `url` HTTP/HTTPS. |
| `draft` | `true` oculta o post da interface. |
| `example` | `true` identifica conteúdo demonstrativo. |

Projetos aceitam `status` e `preview` (`notes`, `radio` ou `terminal`). Habilidades aceitam `symbol` e `level`. O caminho do script identifica cada post, permitindo títulos repetidos.

O navegador não lista pastas automaticamente: cada novo arquivo precisa de uma linha no HTML. Para excluir um post, remova também essa linha. Arquivos não listados não são carregados. `draft` apenas oculta o cartão: não coloque conteúdo privado nos arquivos publicados.

## Publicar

Publique o conteúdo completo de **`dist/`** em uma hospedagem estática. Todos os caminhos são relativos e funcionam em subpastas. Não existe etapa de build.

Após habilitar GitHub Pages, o workflow `Publicar portfólio` publica somente `dist/` no GitHub Pages ao receber um push na branch `main`, ou quando executado manualmente. Em **Settings → Pages**, selecione **GitHub Actions** como origem.

Para manter o repositório privado e publicar com GitHub Pages, a conta precisa de um plano compatível, como GitHub Pro. O site publicado é acessível aos visitantes, mesmo com o repositório privado. [Disponibilidade do GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages).

## Componentes e arte

`app.js` contém `RetroWindow`, `UiIcon`, `SocialLink`, `SkillItem`, `PostCard` e `ProjectPreview`. Detalhes abrem em `<dialog>` nativo, com fechamento por botão, Escape e clique no fundo. Textos usam interpolação Vue; links externos usam `noopener noreferrer`.

A identidade visual e a responsividade estão em `styles.css`. A ilustração original está em `dist/assets/retro-computer.png`; sua origem e seu prompt constam em `ASSETS.md`.
