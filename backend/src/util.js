export function randomId(){ return 'id-' + Math.random().toString(36).slice(2, 12); }
export function nowISO(){ return new Date().toISOString(); }
export function isExpired24h(createdAt){ return (Date.now() - Date.parse(createdAt)) > 86400000; }
export function fingerprintNote(data){ const payload = {subj:data.subjetivo||'', ale:data.alergias||'', sig:data.signos||'', efs:data.efSegmentaria||'', efg:data.efGeneral||'', dx:data.analisisDx||'', tx:data.analisisTx||'', lab:data.laboratorios||'', gab:data.gabinete||''}; const str=JSON.stringify(payload); let h=2166136261>>>0; for(let i=0;i<str.length;i++){ h^=str.charCodeAt(i); h=(h+((h<<1)+(h<<4)+(h<<7)+(h<<8)+(h<<24)))>>>0; } return h.toString(36); }
