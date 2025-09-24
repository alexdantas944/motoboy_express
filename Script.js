let localizacaoMotoboy = null;

navigator.geolocation.getCurrentPosition((pos) => {
  localizacaoMotoboy = {
    latitude: pos.coords.latitude,
    longitude: pos.coords.longitude
  };
  fetch('/localizacao', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(localizacaoMotoboy)
  });
});

document.getElementById('formulario').addEventListener('submit', async (e) => {
  e.preventDefault();
  const coleta = document.getElementById('coleta').value;
  const entrega = document.getElementById('entrega').value;

  const coordsColeta = await buscarCoordenadas(coleta);
  const coordsEntrega = await buscarCoordenadas(entrega);

  const dist1 = calcularDistancia(localizacaoMotoboy, coordsColeta);
  const dist2 = calcularDistancia(coordsColeta, coordsEntrega);
  const total = dist1 + dist2;
  const valor = (total * 2.5).toFixed(2);

  document.getElementById('resultado').innerText = `Total: ${total.toFixed(2)} km | R$ ${valor}`;

  fetch('/pedido', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      coleta, entrega, pagamento: document.getElementById('pagamento').value,
      distancia: total, valor
    })
  });
});

async function buscarCoordenadas(endereco) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco)}`;
  const res = await fetch(url);
  const dados = await res.json();
  return { latitude: parseFloat(dados[0].lat), longitude: parseFloat(dados[0].lon) };
}

function calcularDistancia(a, b) {
  const R = 6371;
  const dLat = (b.latitude - a.latitude) * Math.PI / 180;
  const dLon = (b.longitude - a.longitude) * Math.PI / 180;
  const lat1 = a.latitude * Math.PI / 180;
  const lat2 = b.latitude * Math.PI / 180;

  const aVal = Math.sin(dLat/2)**2 + Math.sin(dLon/2)**2 * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(aVal), Math.sqrt(1-aVal));
  return R * c;
}