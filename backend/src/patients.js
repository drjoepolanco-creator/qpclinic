// backend/src/patients.js
export async function listPatients(q = '') {
  const base = [
    { id: '1', nombre: 'Alan', paterno: 'Polanco', materno: 'Fierro', contacto: { telefono: '555-123-4567' } },
    { id: '2', nombre: 'Paola', paterno: 'Ramírez', materno: 'García', contacto: { telefono: '555-987-6543' } },
  ];
  const k = q.trim().toLowerCase();
  return k
    ? base.filter(p =>
        `${p.nombre} ${p.paterno} ${p.materno}`.toLowerCase().includes(k)
      )
    : base;
}
