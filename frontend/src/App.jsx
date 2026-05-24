import React, { useMemo, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Products from './pages/Products.jsx';
import Cart from './pages/Cart.jsx';
import Orders from './pages/Orders.jsx';
import SignIn from './pages/SignIn.jsx';
import SignUp from './pages/SignUp.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { addToCart, getCart } from './api';

const USER_STORAGE_KEY = 'shopcart-current-user';

function AppInner() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [cartCount, setCartCount] = useState(0);
  const [cartRefreshKey, setCartRefreshKey] = useState(0);

  const onAuthSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    // Refresh cart count after login
    if (user?.id) {
      getCart(user.id)
        .then((cart) => setCartCount(cart?.items?.length || 0))
        .catch(() => { });
    }
  };

  const onLogout = () => {
    setCurrentUser(null);
    setCartCount(0);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  const onAddToCart = async (productId, quantity = 1) => {
    if (!currentUser?.id) {
      return {
        ok: false,
        message: 'Please login first to add items to your bag.',
      };
    }

    await addToCart({
      userId: currentUser.id,
      productId,
      quantity,
    });
    setCartRefreshKey((prev) => prev + 1);

    // Refresh cart count
    getCart(currentUser.id)
      .then((cart) => setCartCount(cart?.items?.length || 0))
      .catch(() => { });

    return {
      ok: true,
      message: 'Item added to your bag! 🛍️',
    };
  };

  const onOrderPlaced = () => {
    if (!currentUser?.id) {
      return;
    }
    setCartRefreshKey((prev) => prev + 1);
    getCart(currentUser.id)
      .then((cart) => setCartCount(cart?.items?.length || 0))
      .catch(() => { });
  };

  const role = useMemo(
    () => (currentUser?.role || 'USER').toUpperCase(),
    [currentUser],
  );

  return (
    <div className="app-root">
      <Navbar currentUser={currentUser} onLogout={onLogout} cartCount={cartCount} />
      <main className="page-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/products"
            element={
              <Products currentUser={currentUser} role={role} onAddToCart={onAddToCart} />
            }
          />
          <Route
            path="/cart"
            element={
              <Cart currentUser={currentUser} role={role} cartRefreshKey={cartRefreshKey} />
            }
          />
          <Route
            path="/orders"
            element={<Orders currentUser={currentUser} cartCount={cartCount} onOrderPlaced={onOrderPlaced} />}
          />
          <Route
            path="/signin"
            element={<SignIn onSignedIn={onAuthSuccess} />}
          />
          <Route
            path="/signup"
            element={<SignUp onSignedUp={onAuthSuccess} />}
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <AppInner />
    </ToastProvider>
  );
}

export default App;
