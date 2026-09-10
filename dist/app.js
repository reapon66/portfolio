/* Vue é carregado por CDN em index.html. Nenhum bundler é necessário. */
(() => {
  if (!window.Vue) return;
  const { createApp, ref, computed, onMounted, nextTick } = Vue;
  const iconPaths = {
    home: 'm3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z',
    folder: 'M3 7V5a1 1 0 0 1 1-1h5l2 3h9a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Z',
    code: 'm8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18',
    arrow: 'M5 12h14m-6-6 6 6-6 6',
    external: 'M14 3h7v7m0-7L10 14m-1-9H4a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-5',
    mail: 'M3 5h18v14H3Zm0 1 9 7 9-7',
    user: 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-2a8 8 0 0 1 16 0v2',
    pin: 'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0ZM15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
    briefcase: 'M3 7h18v14H3Zm5 0V3h8v4M3 12c6 3 12 3 18 0m-9 0v4',
    camera: 'M7 3h10l4 4v14H3V7ZM16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
    terminal: 'm5 7 5 5-5 5m8 0h6',
    star: 'm12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z',
    copy: 'M8 8h13v13H8ZM16 8V3H3v13h5',
    close: 'm6 6 12 12M6 18 18 6',
    globe: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM3 12h18M12 3c5 5 5 13 0 18-5-5-5-13 0-18Z',
    check: 'm4 12 5 5L20 6',
    clock: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM12 7v5l3 2'
  };

  const UiIcon = {
    props: { name: { type: String, default: 'code' } },
    computed: { path() { return iconPaths[this.name] || iconPaths.code; } },
    template: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true"><path :d="path"/></svg>'
  };

  const RetroWindow = {
    components: { UiIcon },
    props: { title: String, icon: { type: String, default: 'folder' }, blue: Boolean },
    template: `<section class="retro-window" :class="{ 'window-blue': blue }">
      <div class="window-bar"><span class="window-label"><ui-icon :name="icon"/>{{ title }}</span><span class="window-decoration" aria-hidden="true"><i>_</i><i>□</i><i>×</i></span></div>
      <div class="window-body"><slot/></div><slot name="footer"/>
    </section>`
  };

  const SocialLink = {
    components: { UiIcon },
    props: { social: Object },
    methods: { safeUrl(url) { return /^https?:\/\//i.test(url || '') ? url : '#contato'; } },
    template: `<a class="social-link" :href="safeUrl(social.url)" target="_blank" rel="noopener noreferrer" :title="social.example ? 'Link de exemplo: abre a página inicial da rede' : social.name">
      <span class="social-icon"><ui-icon :name="social.icon"/></span><span><strong>{{ social.name }}</strong><small>{{ social.handle }}</small></span><ui-icon name="external"/>
    </a>`
  };

  const ProjectPreview = {
    props: { post: Object },
    template: `<div class="project-preview" :class="'tone-' + (post.accent || 'blue')" aria-hidden="true">
      <div v-if="post.preview === 'notes'" class="mini-notes">
        <div class="mini-bar"><span>◧ fragmento</span><span>− &nbsp; ×</span></div>
        <div class="mini-notes-body"><div class="mini-sidebar"><span>Meu espaço</span><b>▤ Todas as notas</b><span>☆ Favoritos</span><span>▱ Ideias</span></div>
          <div class="mini-note"><span class="mini-kicker">RASCUNHO Nº 08</span><strong>Pequenas ideias,<br>grandes começos.</strong><div class="fake-line"></div><div class="fake-line short"></div><span class="note-tag"># tirar-do-papel</span></div>
        </div>
      </div>
      <div v-else-if="post.preview === 'radio'" class="mini-radio">
        <div class="mini-bar"><span>frequência.fm</span><span>STEREO</span></div>
        <div class="radio-display"><div class="radio-track"><small>NO AR AGORA</small><strong>late night coding</strong><span>lo-fi / beats / café</span></div><div class="equalizer"><i v-for="n in 12" :key="n" :style="{ height: (12 + ((n * 17) % 40)) + 'px' }"></i></div></div>
        <div class="radio-controls"><span>↶ &nbsp; ◀ &nbsp; ▶ &nbsp; ■ &nbsp; ↷</span><span>VOL. ▰▰▰▱▱</span></div>
      </div>
      <div v-else class="mini-terminal"><div class="mini-bar"><span>reapon@web: ~</span><span>_ □ ×</span></div><div class="terminal-code"><span><b>➜</b> ~/meu-cantinho</span><span>$ npm run dev</span><span class="terminal-success">✓ ideias ganhando vida</span><span>hello, world<span class="terminal-cursor">_</span></span></div></div>
      <span class="preview-corner">{{ post.preview === 'terminal' ? 'FEITO POR AQUI' : 'EM CONSTRUÇÃO' }}</span>
    </div>`
  };

  const PostCard = {
    components: { UiIcon, ProjectPreview },
    props: { post: Object },
    emits: ['open'],
    template: `<article class="post-card" :class="{ 'post-wide': post.preview === 'terminal' }">
      <project-preview :post="post"/>
      <div class="post-content"><div class="post-meta"><span class="status-label" :class="post.status === 'No ar' ? 'status-live' : 'status-progress'"><span aria-hidden="true">{{ post.status === 'No ar' ? '●' : '◷' }}</span>{{ post.status || 'Em desenvolvimento' }}</span><span v-if="post.example" class="example-label">DEMO</span></div>
        <h3><button type="button" @click="$emit('open', post)" :aria-label="'Abrir projeto ' + post.title">{{ post.title }}<ui-icon name="external"/></button></h3><p>{{ post.summary }}</p>
        <div class="post-bottom"><div class="tags"><span v-for="tag in post.tags" :key="tag">{{ tag }}</span></div><button class="card-arrow" type="button" @click="$emit('open', post)" :aria-label="'Ver detalhes de ' + post.title"><ui-icon name="arrow"/></button></div>
      </div>
    </article>`
  };

  const SkillItem = {
    components: { UiIcon },
    props: { skill: Object },
    emits: ['open'],
    template: `<button type="button" class="skill-item" @click="$emit('open', skill)" :aria-label="'Ver habilidade: ' + skill.title"><span class="skill-symbol" :class="'tone-' + (skill.accent || 'blue')">{{ skill.symbol || '&lt;/&gt;' }}</span><span class="skill-text"><strong>{{ skill.title }}</strong><small>{{ skill.level || 'Aprendendo' }}</small></span><span class="skill-plus" aria-hidden="true">+</span></button>`
  };

  createApp({
    components: { UiIcon, RetroWindow, SocialLink, PostCard, SkillItem },
    setup() {
      const profile = ref(null), projects = ref([]), skills = ref([]);
      const loading = ref(true), error = ref(''), partialError = ref('');
      const selected = ref(null), dialog = ref(null), copied = ref(false), copyError = ref('');
      const activeSection = ref('inicio');
      const progressCount = computed(() => projects.value.filter(p => p.status !== 'No ar').length);
      const year = new Date().getFullYear();

      async function fetchJson(url) {
        const response = await fetch(url, { cache: 'no-cache' });
        if (!response.ok) throw new Error(`Não foi possível ler ${url} (HTTP ${response.status}).`);
        return response.json();
      }

      async function load() {
        loading.value = true; error.value = ''; partialError.value = '';
        try {
          const [person, manifest] = await Promise.all([fetchJson('./profile.json'), fetchJson('./content/index.json')]);
          if (!person.name || !person.nickname || !Array.isArray(manifest.projects) || !Array.isArray(manifest.skills)) throw new Error('Confira o perfil e gere novamente o índice de conteúdo.');
          profile.value = person;
          document.title = `${person.nickname} — meu cantinho na web`;
          document.querySelector('meta[name="description"]').content = `${person.name} — ${person.intro || person.role || 'Meu cantinho na internet.'}`;
          const groups = await Promise.all(['projects', 'skills'].map(async kind => {
            const results = await Promise.allSettled(manifest[kind].map(async file => {
              if (typeof file !== 'string' || !file.startsWith(`content/${kind}/`) || file.includes('..')) throw new Error('Caminho de post inválido.');
              return { ...await fetchJson('./' + file), id: file, kind };
            }));
            if (results.some(r => r.status === 'rejected')) partialError.value = 'Alguns posts não carregaram. Tente atualizar a página.';
            return results.filter(r => r.status === 'fulfilled' && !r.value.draft).map(r => r.value).sort((a, b) => (a.order ?? 999) - (b.order ?? 999) || a.title.localeCompare(b.title, 'pt-BR'));
          }));
          [projects.value, skills.value] = groups;
        } catch (err) {
          error.value = location.protocol === 'file:' ? 'Abra o portfólio pelo servidor local: execute npm run dev na pasta do projeto.' : 'Não consegui carregar o conteúdo. Confira os arquivos JSON e tente novamente.';
          console.error(err);
        } finally { loading.value = false; }
      }

      async function openPost(post) {
        selected.value = post;
        await nextTick();
        dialog.value.showModal();
        document.body.classList.add('modal-open');
      }
      function closeDialog() { dialog.value?.close(); }
      function onDialogClosed() { selected.value = null; document.body.classList.remove('modal-open'); }
      function onBackdrop(event) { if (event.target === dialog.value) closeDialog(); }
      function safeUrl(url) { return /^https?:\/\//i.test(url || '') ? url : '#'; }
      async function copyEmail() {
        copyError.value = '';
        try { await navigator.clipboard.writeText(profile.value.email); copied.value = true; setTimeout(() => copied.value = false, 2500); }
        catch { copyError.value = 'Selecione e copie o endereço acima.'; }
      }

      onMounted(async () => {
        document.getElementById('boot-message').remove();
        await load();
        await nextTick();
        if ('IntersectionObserver' in window) {
          const observer = new IntersectionObserver(entries => {
            for (const entry of entries) if (entry.isIntersecting) activeSection.value = entry.target.id;
          }, { rootMargin: '-15% 0px -55% 0px' });
          document.querySelectorAll('[data-nav-section]').forEach(section => observer.observe(section));
        }
      });

      return { profile, projects, skills, loading, error, partialError, selected, dialog, activeSection, progressCount, year, copied, copyError, load, openPost, closeDialog, onDialogClosed, onBackdrop, safeUrl, copyEmail };
    },
    template: `
      <div class="site-shell">
        <header class="site-header" id="topo">
          <a class="wordmark" href="#inicio" aria-label="Reapon, início"><span class="logo-mark">r<span>_</span></span><span>{{ profile?.nickname?.toLowerCase() || 'reapon' }}<span class="domain">.dev</span></span></a>
          <nav aria-label="Navegação principal"><a href="#inicio" :class="{ active: activeSection === 'inicio' }"><ui-icon name="home"/>Início</a><a href="#projetos" :class="{ active: activeSection === 'projetos' }"><ui-icon name="folder"/>Projetos</a><a href="#sobre" :class="{ active: activeSection === 'sobre' }"><ui-icon name="user"/>Sobre</a><a href="#contato" :class="{ active: activeSection === 'contato' }"><ui-icon name="mail"/>Contato</a></nav>
          <span class="header-note">um site pessoal, de verdade.</span>
        </header>

        <div v-if="loading" class="page-message" role="status"><span class="loading-cursor">▰</span> Abrindo arquivos do portfólio…</div>
        <div v-else-if="error" class="page-message" role="alert"><h1>Ops, a conexão caiu.</h1><p>{{ error }}</p><button class="button button-primary" @click="load">Tentar novamente</button></div>

        <template v-else-if="profile">
          <div class="address-bar"><span><ui-icon name="globe"/><span class="address-label">Você está em:</span><b>internet</b><span class="crumb">/</span><b>{{ profile.nickname.toLowerCase() }}</b><span class="crumb">/</span><span>home</span></span><span class="address-right"><span class="tiny-star">✳</span> bem-vindo ao meu espaço</span></div>
          <main id="conteudo" class="desktop-layout">
            <aside class="sidebar" aria-label="Perfil e habilidades">
              <retro-window title="quem-sou-eu.txt" icon="user" class="profile-window">
                <div class="profile-cover"><span class="cover-cross" aria-hidden="true">+</span><div class="avatar" aria-hidden="true">r<span>_</span></div><span class="profile-sticker">hello,<br>world!</span></div>
                <div class="profile-info"><span class="eyebrow">PODE ME CHAMAR DE</span><h2>{{ profile.nickname }}<span class="profile-asterisk" aria-hidden="true">✳</span></h2><p class="real-name">{{ profile.name }}</p><p class="profile-role">{{ profile.role }}</p><p class="location"><ui-icon name="pin"/>{{ profile.location }}</p><span class="availability"><span class="status-dot"></span>{{ profile.status }}</span></div>
                <div class="social-list"><social-link v-for="social in profile.socials" :key="social.name" :social="social"/></div>
                <div class="profile-footer"><span class="pixel-heart" aria-hidden="true">♥</span> pessoa real do outro lado da tela</div>
              </retro-window>

              <retro-window title="minha-caixa-de-ferramentas" icon="code" class="skills-window" id="habilidades">
                <div class="sidebar-heading"><h2>O que eu uso<span>_</span></h2><p>Algumas peças do meu repertório.</p></div>
                <div class="skill-list"><skill-item v-for="skill in skills" :key="skill.id" :skill="skill" @open="openPost"/></div>
                <p v-if="!skills.length" class="empty-message">Novas ferramentas chegando em breve.</p>
                <div class="learning-note"><ui-icon name="star"/><span>Sempre tem algo novo<br>para aprender.</span></div>
              </retro-window>

              <div class="sticky-note"><span class="note-pin" aria-hidden="true">+</span><span class="eyebrow">LEMBRETE PRA MIM</span><p>Feito é melhor<br>que perfeito.<br><span>Mas capricha. :)</span></p><span class="note-signature">— eu, toda segunda</span></div>
            </aside>

            <div class="main-column">
              <retro-window title="bem-vindo.exe" icon="globe" blue class="hero-window" id="inicio" data-nav-section>
                <div class="hero-content"><div class="hero-copy"><span class="eyebrow hero-eyebrow"><span class="small-spark">✳</span> MEU PEQUENO UNIVERSO DIGITAL</span><h1>Gente boa.<br>Boas ideias.<br><span>Um tanto de código.</span></h1><p>{{ profile.intro }}</p><div class="hero-actions"><a href="#projetos" class="button button-primary"><ui-icon name="folder"/>Explorar projetos<ui-icon name="arrow"/></a><a href="#sobre" class="text-link">Mais sobre mim</a></div></div>
                <figure class="hero-art"><img src="./assets/retro-computer.png" width="1254" height="1254" alt="Computador retrô em pixel art com um sorriso verde na tela"><figcaption>100% curiosidade<br><span>desde o primeiro “hello world”</span></figcaption><span class="art-label">WEB COM<br>PERSONALIDADE ★</span></figure></div>
                <template #footer><div class="hero-status"><span><ui-icon name="terminal"/>{{ profile.now }}</span><span class="hero-status-right">work in progress<span class="blinking-cursor">_</span></span></div></template>
              </retro-window>

              <section class="projects-section" id="projetos" data-nav-section aria-labelledby="projects-title">
                <div class="section-heading"><div><span class="eyebrow">IDEIAS SAINDO DO PAPEL</span><h2 id="projects-title"><ui-icon name="folder"/>Na minha bancada<span class="heading-count">{{ projects.length.toString().padStart(2, '0') }}</span></h2></div><span class="section-note">{{ progressCount }} em construção <span aria-hidden="true">↙</span></span></div>
                <p v-if="partialError" class="inline-warning" role="status">{{ partialError }}</p>
                <div class="project-grid"><post-card v-for="post in projects" :key="post.id" :post="post" @open="openPost"/></div>
                <div v-if="!projects.length" class="empty-message">A bancada está livre. O próximo projeto aparece por aqui em breve.</div>
              </section>

              <retro-window title="alem-do-codigo.txt" icon="user" class="about-window" id="sobre" data-nav-section>
                <div class="about-content"><div class="about-heading"><span class="eyebrow">UM POUCO MAIS DE MIM</span><h2>Nem só de<br>código vive<br>o dev<span> :)</span></h2><span class="about-mini">pessoa &gt; currículo</span></div><div class="about-text"><p v-for="paragraph in profile.about" :key="paragraph">{{ paragraph }}</p><div class="interest-list"><span v-for="interest in profile.interests" :key="interest"># {{ interest }}</span></div></div></div>
              </retro-window>

              <section class="contact-section" id="contato" data-nav-section aria-labelledby="contact-title"><div><span class="eyebrow">A INTERNET É MELHOR COM GENTE</span><h2 id="contact-title">Bora trocar uma ideia?<span>↗</span></h2><p>Um projeto, uma oportunidade ou só um “oi”.</p></div><a class="button button-cream" :href="'mailto:' + profile.email"><ui-icon name="mail"/>Manda um alô<ui-icon name="arrow"/></a><div class="contact-email"><a :href="'mailto:' + profile.email">{{ profile.email }}</a><button type="button" @click="copyEmail" :aria-label="copied ? 'E-mail copiado' : 'Copiar e-mail'"><ui-icon :name="copied ? 'check' : 'copy'"/></button><span role="status">{{ copied ? 'Copiado!' : copyError }}</span></div></section>
            </div>
          </main>

          <footer class="site-footer"><div class="footer-top"><a class="footer-wordmark" href="#inicio">{{ profile.nickname.toLowerCase() }}<span>_</span></a><p>Feito com código, café e um pouco de nostalgia.<br><span>© {{ year }} {{ profile.name }}. Este cantinho está sempre em construção.</span></p><div class="web-badges" aria-label="Feito com HTML e Vue"><span class="badge-html"><b>HTML</b><small>feito à mão</small></span><span class="badge-vue"><b>VUE</b><small>powered</small></span><span class="badge-web"><b>I ♥</b><small>the web</small></span></div></div><div class="footer-bottom"><span v-if="profile.exampleContent">Versão demonstrativa · biografia, habilidades, projetos e contatos de exemplo.</span><span v-else>Obrigado pela visita. Volte sempre.</span><a href="#topo">Voltar ao topo ↑</a></div></footer>
        </template>
      </div>

      <dialog ref="dialog" class="post-dialog" aria-labelledby="dialog-title" @close="onDialogClosed" @click="onBackdrop"><template v-if="selected"><div class="dialog-bar"><span><ui-icon :name="selected.kind === 'skills' ? 'code' : 'folder'"/>{{ selected.kind === 'skills' ? 'habilidade' : 'projeto' }} / {{ selected.title }}</span><button type="button" class="dialog-close" @click="closeDialog" aria-label="Fechar detalhes" autofocus><ui-icon name="close"/></button></div><div class="dialog-content"><span class="eyebrow">{{ selected.status || selected.level || 'DO MEU REPERTÓRIO' }}</span><h2 id="dialog-title">{{ selected.title }}</h2><p class="dialog-summary">{{ selected.summary }}</p><div class="tags"><span v-for="tag in selected.tags" :key="tag">{{ tag }}</span></div><div class="dialog-details"><p v-for="paragraph in selected.details" :key="paragraph">{{ paragraph }}</p></div><template v-if="selected.nextSteps?.length"><h3>Próximos passos</h3><ul class="next-steps"><li v-for="step in selected.nextSteps" :key="step"><span aria-hidden="true">□</span>{{ step }}</li></ul></template><div v-if="selected.links?.length" class="dialog-links"><a v-for="link in selected.links" :key="link.url" class="button button-primary" :href="safeUrl(link.url)" target="_blank" rel="noopener noreferrer">{{ link.label }}<ui-icon name="external"/></a></div><p v-if="selected.example" class="demo-notice">Este é um conteúdo de exemplo do portfólio.</p></div></template></dialog>
    `
  }).mount('#app');
})();
