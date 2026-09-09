/* ---------------- window registry ---------------- */
  const WIN_TITLES = {
    pc: "Propriedades do Sistema",
    about: "Sobre Mim",
    projects: "Meus Projetos",
    skills: "Habilidades.txt",
    terminal: "Prompt de Comando"
  };
  const WIN_ICONS = { pc:"🖥️", about:"🔍", projects:"📁", skills:"📝", terminal:"⬛" };
  let zTop = 10;
  const openWindows = new Set();

  function bringFront(id){
    zTop += 1;
    document.getElementById('win-'+id).style.zIndex = zTop;
    document.querySelectorAll('.task-btn').forEach(b=>b.classList.remove('active'));
    const tb = document.getElementById('task-'+id);
    if(tb) tb.classList.add('active');
  }

  function openWin(id){
    const el = document.getElementById('win-'+id);
    el.classList.remove('hidden');
    bringFront(id);
    if(!openWindows.has(id)){
      openWindows.add(id);
      addTaskbarBtn(id);
    }
    if(id === 'terminal') startBootSequence();
  }

  function closeWin(id){
    document.getElementById('win-'+id).classList.add('hidden');
    openWindows.delete(id);
    const tb = document.getElementById('task-'+id);
    if(tb) tb.remove();
  }

  function minWin(id){
    document.getElementById('win-'+id).classList.add('hidden');
  }

  function addTaskbarBtn(id){
    const bar = document.getElementById('taskbar-items');
    const btn = document.createElement('div');
    btn.className = 'task-btn active';
    btn.id = 'task-'+id;
    btn.innerHTML = '<span>'+WIN_ICONS[id]+'</span><span>'+WIN_TITLES[id]+'</span>';
    btn.onclick = () => {
      const el = document.getElementById('win-'+id);
      if(el.classList.contains('hidden')){
        el.classList.remove('hidden');
        bringFront(id);
      } else if (parseInt(el.style.zIndex||0) === zTop){
        minWin(id);
      } else {
        bringFront(id);
      }
    };
    bar.appendChild(btn);
  }

  function selectIcon(el){
    document.querySelectorAll('.icon').forEach(i=>i.classList.remove('selected'));
    el.classList.add('selected');
  }

  /* ---------------- dragging ---------------- */
  document.querySelectorAll('.win').forEach(win=>{
    const bar = win.querySelector('[data-drag]');
    let dragging = false, ox=0, oy=0;
    bar.addEventListener('mousedown', (e)=>{
      dragging = true; ox = e.clientX - win.offsetLeft; oy = e.clientY - win.offsetTop;
      bringFront(win.id.replace('win-',''));
    });
    bar.addEventListener('touchstart', (e)=>{
      const t = e.touches[0];
      dragging = true; ox = t.clientX - win.offsetLeft; oy = t.clientY - win.offsetTop;
      bringFront(win.id.replace('win-',''));
    }, {passive:true});
    document.addEventListener('mousemove', (e)=>{
      if(!dragging) return;
      win.style.left = Math.max(0, e.clientX-ox) + 'px';
      win.style.top = Math.max(0, e.clientY-oy) + 'px';
    });
    document.addEventListener('touchmove', (e)=>{
      if(!dragging) return;
      const t = e.touches[0];
      win.style.left = Math.max(0, t.clientX-ox) + 'px';
      win.style.top = Math.max(0, t.clientY-oy) + 'px';
    }, {passive:true});
    document.addEventListener('mouseup', ()=> dragging=false);
    document.addEventListener('touchend', ()=> dragging=false);
    win.addEventListener('mousedown', ()=> bringFront(win.id.replace('win-','')));
  });

  /* ---------------- start menu ---------------- */
  function toggleStart(force){
    const m = document.getElementById('start-menu');
    if(typeof force === 'boolean'){
      m.classList.toggle('open', force);
    } else {
      m.classList.toggle('open');
    }
  }
  document.addEventListener('click', (e)=>{
    const m = document.getElementById('start-menu');
    if(!m.contains(e.target) && !e.target.closest('.start-btn')){
      m.classList.remove('open');
    }
  });

  /* ---------------- projects explorer ---------------- */
  function showFolder(which){
    document.querySelectorAll('.proj-detail').forEach(d=>d.classList.remove('active'));
    document.getElementById('proj-grid').style.display = which === 'grid' ? 'flex' : 'none';
  }
  function openProject(key){
    document.getElementById('proj-grid').style.display = 'none';
    document.querySelectorAll('.proj-detail').forEach(d=>d.classList.remove('active'));
    document.getElementById('proj-detail-'+key).classList.add('active');
  }

  /* ---------------- clock ---------------- */
  function tick(){
    const d = new Date();
    const hh = String(d.getHours()).padStart(2,'0');
    const mm = String(d.getMinutes()).padStart(2,'0');
    document.getElementById('clock').textContent = hh+':'+mm;
  }
  tick(); setInterval(tick, 15000);

  /* ---------------- terminal ---------------- */
  let bootDone = false;
  const termOutput = document.getElementById('term-output');
  const bootLines = [
    {t:"Microsoft Windows XP [Versão 5.1.2600]", c:""},
    {t:"(C) Copyright 1985-2001 Microsoft Corp.", c:"dim"},
    {t:"", c:""},
    {t:"C:\\Documents and Settings\\Matheus Marques&gt; node server.js", c:""},
    {t:"&gt; Starting development server...", c:"dim"},
    {t:"&gt; Connection successfully established with PostgreSQL.", c:"ok"},
    {t:"&gt; [Server] running fine on: http://localhost:3000", c:"ok"},
    {t:"", c:""},
    {t:"Digite 'help' para ver os comandos disponíveis.", c:"dim"}
  ];

  function addLine(html, cls){
    const row = document.getElementById('term-input-row');
    const line = document.createElement('div');
    line.className = 'terminal-line' + (cls ? ' '+cls : '');
    line.innerHTML = html;
    termOutput.insertBefore(line, row);
    termOutput.scrollTop = termOutput.scrollHeight;
  }

  function startBootSequence(){
    if(bootDone) return;
    bootDone = true;
    let i = 0;
    function next(){
      if(i < bootLines.length){
        addLine(bootLines[i].t, bootLines[i].c);
        i++;
        setTimeout(next, 220);
      } else {
        document.getElementById('term-input-row').style.display = 'flex';
        document.getElementById('term-input').focus();
      }
    }
    next();
  }

  const commands = {
    help: "Comandos: sobre, projetos, skills, contato, limpar",
    sobre: "Matheus Marques — Dev Fullstack Jr, 1 ano de experiência, Recife-PE.",
    skills: "Java, JavaScript, Python, SQL · Angular, Node.js, Express, Django · PostgreSQL, MySQL · Git, Figma, VS Code",
    projetos: "Transforme-se (Do Zero ao Mei) · API Task Manager · Blog CMS — abra a janela 'Meus Projetos' para detalhes.",
    contato: "email: contato@matheusmarques.dev · github.com/matheusmarques · linkedin.com/in/matheusmarques",
    whoami: "matheus_marques"
  };

  document.getElementById('term-input').addEventListener('keydown', function(e){
    if(e.key === 'Enter'){
      const val = this.value.trim();
      addLine('<span class="prompt">C:\\Documentos\\Matheus&gt;</span> '+ (val || ''));
      if(val.toLowerCase() === 'limpar' || val.toLowerCase() === 'cls'){
        document.querySelectorAll('.terminal-line').forEach(l=>l.remove());
      } else if(val){
        const cmd = val.toLowerCase();
        addLine(commands[cmd] || ("'"+val+"' não é reconhecido. Digite 'help'."), commands[cmd] ? 'ok' : 'dim');
      }
      this.value = '';
    }
  });

  /* ---------------- open "Sobre mim" on load, like a welcome ---------------- */
  window.addEventListener('load', ()=>{
    setTimeout(()=> openWin('about'), 500);
  });