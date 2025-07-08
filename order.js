// Helper to get URL query params
function getQueryParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

const product = getQueryParam('product');
if (product) {
  document.getElementById('items').style.display = 'none';
  document.querySelector('label[for="items"]').style.display = 'none';
  const readonlyDiv = document.getElementById('product-readonly');
  readonlyDiv.style.display = 'block';
  readonlyDiv.textContent = 'Product: ' + product;
}

document.getElementById('order-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const customerName = document.getElementById('customerName').value.trim();
  let items;
  if (product) {
    items = [product];
  } else {
    items = document.getElementById('items').value.split(',').map(x => x.trim()).filter(x => x);
  }
  const total = parseFloat(document.getElementById('total').value);
  const successMsg = document.getElementById('order-success');
  const errorMsg = document.getElementById('order-error');
  successMsg.style.display = 'none';
  errorMsg.style.display = 'none';
  try {
    const res = await fetch('http://localhost:3001/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerName, items, total })
    });
    if (!res.ok) {
      const data = await res.json();
      errorMsg.textContent = data.error || 'Failed to place order.';
      errorMsg.style.display = 'block';
      return;
    }
    successMsg.style.display = 'block';
    document.getElementById('order-form').reset();
  } catch (err) {
    errorMsg.textContent = 'Could not connect to server.';
    errorMsg.style.display = 'block';
  }
});
