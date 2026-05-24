import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { placeOrder, fetchOrders } from '../api';
import { useToast } from '../context/ToastContext';

function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  }).format(amount);
}

function Orders({ currentUser, cartCount = 0, onOrderPlaced }) {
  const [orderResult, setOrderResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (!currentUser?.id) {
      setOrders([]);
      return;
    }

    const load = async () => {
      try {
        const data = await fetchOrders(currentUser.id);
        setOrders(Array.isArray(data) ? data : []);
      } catch {
        setOrders([]);
      }
    };

    load();
  }, [currentUser?.id, orderResult]);

  const handlePlaceOrder = async () => {
    if (!currentUser?.id) {
      toast('Please login before placing an order.', 'error');
      return;
    }
    try {
      setLoading(true);
      const createdOrder = await placeOrder(currentUser.id);
      setOrderResult(createdOrder);
      toast('Order placed successfully! 🎉', 'success');
      if (onOrderPlaced) {
        onOrderPlaced();
      }
    } catch (err) {
      toast(err.message || 'Unable to place order.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser?.id) {
    return (
      <div className="orders-page">
        <h1 className="page-title">My Orders</h1>
        <div className="empty-state">
          <div className="empty-icon">🔐</div>
          <h3>Login to view your orders</h3>
          <p>Sign in to view your order history and track deliveries across India.</p>
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button className="btn primary" onClick={() => navigate('/signin')}>Sign In</button>
            <button className="btn ghost" onClick={() => navigate('/signup')}>Create Account</button>
          </div>
        </div>
      </div>
    );
  }

  const canPlaceOrder = cartCount > 0;

  return (
    <div className="orders-page">
      <h1 className="page-title">My Orders</h1>
      <p className="page-subtitle">Track your active and previous orders, including delivery updates across India.</p>

      {/* Place order card */}
      {!orderResult && (
        <div className="order-checkout-card">
          <div className="order-checkout-info">
            <h2>🛍️ Quick Checkout</h2>
            {canPlaceOrder ? (
              <p>
                Create an order instantly from your current bag. Free delivery on all orders.
                Estimated delivery: 2–5 business days.
              </p>
            ) : (
              <p>
                Your bag is currently empty. Add items to your cart from the Products page to place a new order.
              </p>
            )}
            <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, color: 'var(--brand-green)', background: '#e8f5f0', border: '1px solid #a7dfc8', borderRadius: 999, padding: '3px 10px', fontWeight: 700 }}>
                ✓ Free Delivery
              </span>
              <span style={{ fontSize: 12, color: '#7a380f', background: 'var(--brand-orange-light)', border: '1px solid #f5cfb0', borderRadius: 999, padding: '3px 10px', fontWeight: 700 }}>
                🔒 Secure Payment
              </span>
              <span style={{ fontSize: 12, color: '#1d242f', background: '#f5f5f5', border: '1px solid #e5e5e5', borderRadius: 999, padding: '3px 10px', fontWeight: 700 }}>
                ↩️ Easy Returns
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }}>
            <button
              className="btn primary lg"
              onClick={handlePlaceOrder}
              disabled={loading || !canPlaceOrder}
            >
              {loading ? (
                <>
                  <span className="spinner spinner-sm" style={{ borderTopColor: '#fff', borderColor: 'rgba(255,255,255,0.3)' }} />
                  Placing…
                </>
              ) : (canPlaceOrder ? '🎉 Place Order' : 'Add items to cart')}
            </button>
            <button className="btn ghost sm" onClick={() => navigate('/cart')}>
              ← Back to Cart
            </button>
          </div>
        </div>
      )}

      {/* Order success */}
      {orderResult && (
        <div className="order-success-card">
          <div className="success-icon-wrap">
            <span className="success-icon">✓</span>
          </div>
          <h2>Order Placed Successfully!</h2>
          <p>
            Thank you, <strong>{currentUser.name}</strong>! Your order has been confirmed and will be delivered
            within 2–5 business days.
          </p>
          <div className="order-id-chip">
            Order ID: #{orderResult.oId || orderResult.id}
          </div>
          {orderResult.totalAmount > 0 && (
            <div className="order-total-big">{formatINR(orderResult.totalAmount)}</div>
          )}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn primary" onClick={() => { setOrderResult(null); navigate('/products'); }}>
              Continue Shopping
            </button>
            <button className="btn ghost" onClick={() => setOrderResult(null)}>
              Place Another Order
            </button>
          </div>
        </div>
      )}

      {/* Placed orders list */}
      <div className="orders-list" style={{ marginTop: 32 }}>
        <h2 style={{ marginBottom: 12 }}>Placed Orders</h2>
        {orders.length === 0 ? (
          <p style={{ fontSize: 14, color: 'var(--text-light)' }}>
            You have not placed any orders yet.
          </p>
        ) : (
          <div>
            {orders.map((order) => (
              <div
                key={order.oId || order.id}
                className="order-row"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 14px',
                  borderRadius: 10,
                  border: '1px solid #eceff4',
                  background: '#fff',
                  marginBottom: 8,
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>
                    Order #{order.oId || order.id}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-light)' }}>
                    Thank you for shopping with Shopcart India.
                  </div>
                </div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>
                  {order.totalAmount != null ? formatINR(order.totalAmount) : '--'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
