const form = document.getElementById('kundenForm');
const tabelle = document.getElementById('kundenTabelle');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  await fetch('/api/kunden', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  form.reset();
  ladeKunden();
});

async function ladeKunden() {
  const suchbegriff = document.getElementById('sucheInput').value;
  const res = await fetch(`/api/kunden?search=${encodeURIComponent(suchbegriff)}`);
  const kunden = await res.json();
  console.log(kunden);
  tabelle.innerHTML = kunden.map(k => `
    <tr>
      <td>${k.nachname}</td>
      <td>${k.vorname}</td>
      <td>${k.strasse}</td>
      <td>${k.hausnummer}</td>
      <td>${k.plz}</td>
      <td>${k.ort}</td>
      <td>${k.alter}</td>
      <td>${k.telefon}</td>
      <td>${k.email}</td>
    </tr>
  `).join('');
}

function showEntireList() {
  document.getElementById('sucheInput').value = '';
  ladeKunden();
}

ladeKunden();
