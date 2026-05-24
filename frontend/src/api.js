const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8083';

function withRole(role = 'USER') {
  return {
    Role: role,
  };
}

export async function fetchProducts(role = 'USER') {
  const response = await fetch(`${API_BASE_URL}/products`, {
    headers: {
      ...withRole(role),
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status}`);
  }

  return response.json();
}

export async function addProduct(product, role = 'ADMIN') {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...withRole(role),
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    throw new Error(`Failed to add product: ${response.status}`);
  }

  return response.json();
}

export async function deleteProduct(productId, role = 'ADMIN') {
  const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
    method: 'DELETE',
    headers: {
      ...withRole(role),
    },
  });

  if (!response.ok && response.status !== 204) {
    throw new Error(`Failed to delete product: ${response.status}`);
  }
}

export async function createUser(userPayload) {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userPayload),
  });

  if (!response.ok) {
    throw new Error(`Failed to create user: ${response.status}`);
  }

  return response.json();
}

export async function getUserById(userId) {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.status}`);
  }

  return response.json();
}

export async function addToCart({ userId, productId, quantity }) {
  const response = await fetch(`${API_BASE_URL}/cart/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: Number(userId),
      productId: Number(productId),
      quantity: Number(quantity),
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to add to cart: ${response.status}`);
  }

  return response.json();
}

export async function getCart(userId) {
  const response = await fetch(`${API_BASE_URL}/cart/${userId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch cart: ${response.status}`);
  }

  return response.json();
}

export async function placeOrder(userId) {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId: Number(userId),
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to place order: ${response.status}`);
  }

  return response.json();
}

export async function fetchOrders(userId) {
  const response = await fetch(`${API_BASE_URL}/orders/${userId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch orders: ${response.status}`);
  }

  return response.json();
}

export async function deleteOrder(orderId) {
  const response = await fetch(`${API_BASE_URL}/orders/delete/${orderId}`, {
    method: 'DELETE',
  });

  if (!response.ok && response.status !== 204) {
    throw new Error(`Failed to delete order: ${response.status}`);
  }
}
