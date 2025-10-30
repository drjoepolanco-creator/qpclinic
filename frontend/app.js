
const $ = sel => document.querySelector(sel);
const api = {
  get base(){ return localStorage.getItem('apiBase') || ''; },
  set base(v){ localStorage.setItem('apiBase', v); updateBadge(); },
  async ping(){
    const r = await fetch(this.base.replace(/\/$/,'') + '/health');
    return r.ok ? await r.json() : Promise.reject(await r.text());
  },
  async login(username,password){
    const r = await fetch(this.base.replace(/\/$/,'') + '/auth/login',{
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({username,password})
    });
    if(!r.ok) throw new Error((await r.json()).error||'Login error');
    return r.json();
  },
  async patients(q=''){
    const r = await fetch(this.base.replace(/\/$/,'') + '/patients?q='+encodeURIComponent(q),{
      headers:{'Authorization':'Bearer '+state.token}
    });
    if(!r.ok) throw new Error('Error patients');
    return r.json();
  }
};

const state = { token:null, user:null };

function toast(msg){ const t=$('#toast'); t.textContent=msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),2200); }
function updateBadge(){ const b=$('#envBadge'); b.textContent = api.base ? new URL(api.base).host : 'API no configurada'; }

function show(id){
  for(const v of ['#view-login','#view-home','#view-patients']) $(v).style.display='none';
  $(id).style.display='block';
}

function renderPatients(rows){
  const tbl = $('#tbl');
  tbl.innerHTML = '<tr><th>Nombre</th><th>Paterno</th><th>Materno</th><th>Contacto</th></tr>'
    + rows.map(p=>`<tr><td>${p.nombre||''}</td><td>${p.paterno||''}</td><td>${p.materno||''}</td><td>${(p.contacto&&p.contacto.telefono)||''}</td></tr>`).join('');
}

async function loadPatients(){
  try{
    const q = $('#q').value.trim();
    const rows = await api.patients(q);
    renderPatients(rows);
  }catch(e){ toast('No se pudo cargar pacientes'); console.error(e); }
}

function init(){
  // Modal API
  $('#btnApi').onclick = ()=>{ $('#apiBase').value = api.base || ''; $('#modalApi').classList.add('show'); };
  $('#btnApiCancel').onclick = ()=> $('#modalApi').classList.remove('show');
  $('#btnApiSave').onclick = ()=>{
    const v = $('#apiBase').value.trim();
    try{ new URL(v); api.base=v; $('#modalApi').classList.remove('show'); toast('API configurada'); }catch{ toast('URL inválida'); }
  };
  updateBadge();

  // Ping
  $('#btnPing').onclick = async ()=>{
    try{ const r = await api.ping(); toast('API OK'); console.log(r); }
    catch(e){ toast('No conecta'); console.error(e); }
  };

  // Login
  $('#btnLogin').onclick = async ()=>{
    try{
      const u=$('#username').value.trim(); const p=$('#password').value;
      if(!api.base){ toast('Configura la API (⚙︎)'); return; }
      const {token, user} = await api.login(u,p);
      state.token = token; state.user = user; localStorage.setItem('token', token); localStorage.setItem('user', JSON.stringify(user));
      $('#hello').textContent = `Hola, ${user.name} (${user.role})`;
      $('#btnLogout').style.display='inline-block';
      show('#view-home');
      toast('Sesión iniciada');
    }catch(e){ toast(e.message||'Error de inicio de sesión'); }
  };

  $('#btnLogout').onclick = ()=>{
    state.token = null; state.user=null; localStorage.removeItem('token'); localStorage.removeItem('user');
    $('#btnLogout').style.display='none'; show('#view-login'); toast('Sesión cerrada');
  };

  // Navigation
  $('#goPatients').onclick = ()=>{ show('#view-patients'); loadPatients(); };
  $('#btnReload').onclick = loadPatients;
  $('#btnSearch').onclick = loadPatients;

  // Restore session
  const t = localStorage.getItem('token'); const u = localStorage.getItem('user');
  if(api.base && t && u){
    state.token = t; state.user = JSON.parse(u); $('#hello').textContent = `Hola, ${state.user.name} (${state.user.role})`; $('#btnLogout').style.display='inline-block'; show('#view-home');
  } else {
    show('#view-login');
  }
}

document.addEventListener('DOMContentLoaded', init);
