/* Scripts clássicos: funcionam tanto em file:// quanto em hospedagem estática. */
(() => {
  const accents = ['lavender', 'peach', 'mint', 'yellow', 'pink', 'blue'];
  const content = window.PortfolioContent = { profile: null, projects: [], skills: [], errors: [] };

  window.addEventListener('error', event => {
    const file = event.target?.src || event.filename;
    if (file && /\/(?:content\/|profile\.js)/.test(file)) content.errors.push(file);
  }, true);

  content.register = (kind, post) => {
    const file = document.currentScript?.getAttribute('src') || 'post';
    try {
      if (!['projects', 'skills'].includes(kind)) throw new Error('Tipo de conteúdo inválido.');
      if (!post || typeof post !== 'object' || Array.isArray(post)) throw new Error('Use um objeto para o post.');
      for (const key of ['title', 'summary']) {
        if (typeof post[key] !== 'string' || !post[key].trim()) throw new Error(`O campo ${key} é obrigatório.`);
      }
      for (const key of ['details', 'tags', 'nextSteps']) {
        if (post[key] !== undefined && (!Array.isArray(post[key]) || post[key].some(value => typeof value !== 'string'))) throw new Error(`${key} deve ser uma lista de textos.`);
      }
      if (post.order !== undefined && !Number.isFinite(post.order)) throw new Error('order deve ser um número.');
      if (post.accent && !accents.includes(post.accent)) throw new Error('Cor desconhecida em accent.');
      if (post.links !== undefined && (!Array.isArray(post.links) || post.links.some(link => !link || typeof link.label !== 'string' || typeof link.url !== 'string' || !/^https?:\/\//i.test(link.url)))) throw new Error('Links precisam de label e url HTTP/HTTPS.');
      if (post.draft === true) return;
      content[kind].push({ ...post, id: file, kind });
    } catch (error) {
      content.errors.push(file);
      console.error(`${file}: ${error.message}`);
    }
  };
})();
