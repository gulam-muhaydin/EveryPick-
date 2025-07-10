// mobile-checkout.js
class MobileCheckout {
    constructor() {
      this.isMobile = this.checkMobile();
    }
  
    checkMobile() {
      return /Mobi|Android|iPhone/i.test(navigator.userAgent);
    }
  
    async placeOrder(orderData) {
      const endpoint = this.isMobile ? 
        'https://everypick.online/api/mobile/orders' : 
        'https://everypick.online/api/orders';
      
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData)
        });
        return await response.json();
      } catch (error) {
        console.error('Order failed:', error);
        return { error: 'connection_failed' };
      }
    }
  }
  
  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    const checkout = new MobileCheckout();
    document.getElementById('checkout-form').addEventListener('submit', handleSubmit);
    
    async function handleSubmit(e) {
      e.preventDefault();
      const formData = new FormData(e.target);
      const result = await checkout.placeOrder(Object.fromEntries(formData));
      
      if (result.error) {
        alert('Order failed. Please try again.');
      } else {
        window.location.href = '/order-success.html';
      }
    }
  });