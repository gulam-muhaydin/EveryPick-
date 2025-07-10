// orders-api.js
// Handles status update and delete for orders on orders.html
async function updateOrderStatus(orderId, newStatus) {
  try {
    // Always update status, never delete
    const res = await fetch(`http://localhost:3001/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    if (res.ok) {
      document.getElementById(`status-${orderId}`).textContent = newStatus;
    }
  } catch (err) {
    alert('Failed to update order status.');
  }
}

function removeOrderRow(orderId) {
  const row = document.getElementById(`order-row-${orderId}`);
  if (row) row.remove();
}

window.updateOrderStatus = updateOrderStatus;
