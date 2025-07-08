async function fetchOrders() {
  const res = await fetch('http://localhost:3001/api/orders');
  return res.json();
}

function renderOrders(orders) {
  const container = document.getElementById('orders-container');
  if (!orders.length) {
    container.innerHTML = '<p>No orders received yet.</p>';
    return;
  }
  let html = `<table class="admin-table">
    <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Phone</th>
        <th>Address</th>
        <th>Items</th>
        <th>Total</th>
        <th>Status</th>
        <th>Created At</th>
        <th>Update Status</th>
      </tr>
    </thead>
    <tbody>`;
  for (const order of orders) {
    html += `<tr>
      <td>${order.id}</td>
      <td>${order.customerName}</td>
      <td>${order.customerPhone ? order.customerPhone : '<span style=\"color:#aaa;\">N/A</span>'}</td>
      <td>${order.customerAddress ? order.customerAddress : '<span style=\"color:#aaa;\">N/A</span>'}</td>
      <td>${order.items.join(', ')}</td>
      <td>Rs.${order.total}</td>
      <td id="status-${order.id}">${order.status}</td>
      <td>${order.createdAt ? new Date(order.createdAt).toLocaleString() : ''}</td>
      <td><select onchange="updateStatus(${order.id}, this.value)">
        <option value="pending" ${order.status==='pending'?'selected':''}>Pending</option>
        <option value="processing" ${order.status==='processing'?'selected':''}>Processing</option>
        <option value="shipped" ${order.status==='shipped'?'selected':''}>Shipped</option>
        <option value="delivered" ${order.status==='delivered'?'selected':''}>Delivered</option>
        <option value="cancelled" ${order.status==='cancelled'?'selected':''}>Cancelled</option>
      </select></td>
    </tr>`;
  }
  html += '</tbody></table>';
  container.innerHTML = html;

  // Add some modern styling
  const style = document.createElement('style');
  style.textContent = `
    .admin-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 24px;
      background: #fff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 12px #0001;
    }
    .admin-table th, .admin-table td {
      padding: 12px 10px;
      text-align: left;
      border-bottom: 1px solid #eee;
    }
    .admin-table th {
      background: #007bff;
      color: #fff;
      font-weight: 600;
    }
    .admin-table tr:last-child td {
      border-bottom: none;
    }
    .admin-table tr:hover {
      background: #f6f7fa;
    }
    .admin-table select {
      padding: 4px 8px;
      border-radius: 4px;
      border: 1px solid #bbb;
    }
  `;
  document.head.appendChild(style);
}

window.updateStatus = async function(orderId, status) {
  await fetch(`http://localhost:3001/api/orders/${orderId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  document.getElementById(`status-${orderId}`).textContent = status;
};

(async function() {
  const orders = await fetchOrders();
  renderOrders(orders);
})();
