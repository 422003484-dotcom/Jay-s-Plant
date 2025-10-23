import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { Provider, useDispatch, useSelector } from 'react-redux';

// --- Redux Slice ---
const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: {
    addToCart: (state, action) => {
      const item = state.items.find(i => i.id === action.payload.id);
      if (!item) {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    increase: (state, action) => {
      const item = state.items.find(i => i.id === action.payload);
      if (item) item.quantity += 1;
    },
    decrease: (state, action) => {
      const item = state.items.find(i => i.id === action.payload);
      if (item && item.quantity > 1) item.quantity -= 1;
    },
    remove: (state, action) => {
      state.items = state.items.filter(i => i.id !== action.payload);
    }
  }
});

const store = configureStore({ reducer: { cart: cartSlice.reducer } });
const { addToCart, increase, decrease, remove } = cartSlice.actions;

// --- Sample Plant Data ---
const plants = [
  { id: 1, name: 'Snake Plant', price: 350, category: 'Indoor', image: 'https://via.placeholder.com/100' },
  { id: 2, name: 'Peace Lily', price: 420, category: 'Indoor', image: 'https://via.placeholder.com/100' },
  { id: 3, name: 'Aloe Vera', price: 280, category: 'Succulent', image: 'https://via.placeholder.com/100' },
  { id: 4, name: 'Cactus', price: 200, category: 'Succulent', image: 'https://via.placeholder.com/100' },
  { id: 5, name: 'Spider Plant', price: 300, category: 'Hanging', image: 'https://via.placeholder.com/100' },
  { id: 6, name: 'Boston Fern', price: 390, category: 'Hanging', image: 'https://via.placeholder.com/100' }
];

// --- Header ---
function Header() {
  const cartCount = useSelector(state => state.cart.items.reduce((sum, item) => sum + item.quantity, 0));
  return (
    <header className="flex justify-between items-center p-4 shadow-md bg-green-200">
      <h1 className="text-2xl font-bold">Jay's Plants</h1>
      <nav className="flex gap-4">
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/cart">🛒 {cartCount}</Link>
      </nav>
    </header>
  );
}

// --- Landing Page ---
function LandingPage() {
  return (
    <div className="text-center p-10 bg-green-50 min-h-screen">
      <h2 className="text-4xl font-bold mb-4">Welcome to Jay's Plants 🌿</h2>
      <p className="mb-6">Discover beautiful, affordable plants to brighten your home and workspace.</p>
      <Link to="/products" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Get Started</Link>
    </div>
  );
}

// --- Product Listing ---
function ProductListing() {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);

  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      {plants.map(plant => {
        const inCart = cartItems.some(item => item.id === plant.id);
        return (
          <div key={plant.id} className="border rounded-xl p-4 shadow">
            <img src={plant.image} alt={plant.name} className="mx-auto mb-3" />
            <h3 className="text-xl font-semibold">{plant.name}</h3>
            <p className="text-green-700 font-bold">₱{plant.price}</p>
            <p className="text-sm text-gray-500">Category: {plant.category}</p>
            <button
              onClick={() => dispatch(addToCart(plant))}
              disabled={inCart}
              className={`mt-3 w-full px-3 py-2 rounded text-white ${inCart ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
            >
              {inCart ? 'Added to Cart' : 'Add to Cart'}
            </button>
          </div>
        );
      })}
    </div>
  );
}

// --- Cart Page ---
function CartPage() {
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart.items);
  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
  const totalCost = cart.reduce((sum, i) => sum + i.quantity * i.price, 0);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">Shopping Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <p>Total items: {totalItems}</p>
          <p className="mb-4">Total cost: ₱{totalCost}</p>
          {cart.map(item => (
            <div key={item.id} className="flex items-center gap-4 border-b py-2">
              <img src={item.image} alt={item.name} className="w-16 h-16" />
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p>₱{item.price}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => dispatch(decrease(item.id))} className="px-2 bg-yellow-400 rounded">-</button>
                <span>{item.quantity}</span>
                <button onClick={() => dispatch(increase(item.id))} className="px-2 bg-green-400 rounded">+</button>
                <button onClick={() => dispatch(remove(item.id))} className="px-2 bg-red-500 text-white rounded">Delete</button>
              </div>
            </div>
          ))}
          <button className="mt-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Checkout – Coming Soon</button>
        </>
      )}
    </div>
  );
}

// --- Main App ---
function App() {
  return (
    <Provider store={store}>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/products" element={<ProductListing />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
