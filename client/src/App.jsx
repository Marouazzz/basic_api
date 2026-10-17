
import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:3000";

function App() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [productOrders, setProductOrders] = useState([]);
  const [message, setMessage] = useState("");

  async function request(url, options = {}) {
    const response = await fetch(`${API}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || data.error || "Request failed");
    }

    return data;
  }

  async function loadData() {
    try {
      const [productData, orderData] = await Promise.all([
        request("/products"),
        request("/orders"),
      ]);

      setProducts(productData);
      setOrders(orderData);
      setMessage("");
    } catch (error) {
      setMessage(error.message);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleProductSubmit(e) {
    e.preventDefault();

    const product = {
      name: name.trim(),
      price: Number(price),
    };

    if (!product.name || price === "" ||
        !Number.isFinite(product.price) || product.price < 0) {
      setMessage("Enter a valid name and price.");
      return;
    }

    try {
      if (editingId !== null) {
        await request(`/products/${editingId}`, {
          method: "PATCH",
          body: JSON.stringify(product),
        });
        setMessage("Product updated.");
      } else {
        await request("/products", {
          method: "POST",
          body: JSON.stringify(product),
        });
        setMessage("Product added.");
      }

      setName("");
      setPrice("");
      setEditingId(null);
      await loadData();
    } catch (error) {
      setMessage(error.message);
    }
  }

  function editProduct(product) {
    setEditingId(product.id);
    setName(product.name);
    setPrice(String(product.price));
  }

  async function deleteProduct(id) {
    if (!window.confirm("Delete this product?")) return;

    try {
      await request(`/products/${id}`, { method: "DELETE" });
      setMessage("Product deleted.");
      await loadData();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function viewProductOrders(id) {
    try {
      const data = await request(`/products/${id}/orders`);
      setProductOrders(data);
      setMessage(`Orders for product #${id}`);
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function createOrder(e) {
    e.preventDefault();

    const selectedProductId = Number(productId);
    const selectedQuantity = Number(quantity);

    if (!products.some((p) => p.id === selectedProductId)) {
      setMessage("Select a valid product.");
      return;
    }

    if (!Number.isInteger(selectedQuantity) || selectedQuantity < 1) {
      setMessage("Quantity must be a positive integer.");
      return;
    }

    try {
      await request("/orders", {
        method: "POST",
        body: JSON.stringify({
          productId: selectedProductId,
          quantity: selectedQuantity,
        }),
      });

      setProductId("");
      setQuantity(1);
      setMessage("Order created.");
      await loadData();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function deleteOrder(id) {
    if (!window.confirm("Delete this order?")) return;

    try {
      await request(`/orders/${id}`, { method: "DELETE" });
      setMessage("Order deleted.");
      await loadData();
    } catch (error) {
      setMessage(error.message);
    }
  }

  function productName(id) {
    return products.find((p) => p.id === id)?.name || `Product #${id}`;
  }

  return (
    <main>
      <h1>Shop Management</h1>

      {message && <p>{message}</p>}

      <hr />

      <h2>Products</h2>

      <form onSubmit={handleProductSubmit}>
        <input
          type="text"
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Price"
          min="0"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <button type="submit">
          {editingId !== null ? "Update product" : "Add product"}
        </button>

        {editingId !== null && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setName("");
              setPrice("");
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>${Number(product.price).toFixed(2)}</td>
              <td>
                <button onClick={() => editProduct(product)}>Edit</button>{" "}
                <button onClick={() => deleteProduct(product.id)}>
                  Delete
                </button>{" "}
                <button onClick={() => viewProductOrders(product.id)}>
                  View orders
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {productOrders.length > 0 && (
        <>
          <h3>Product orders</h3>
          <ul>
            {productOrders.map((order) => (
              <li key={order.id}>
                Order #{order.id} — Quantity: {order.quantity}
              </li>
            ))}
          </ul>
        </>
      )}

      <hr />

      <h2>Create an Order</h2>

      <form onSubmit={createOrder}>
        <select
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          required
        >
          <option value="">Select a product</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          min="1"
          step="1"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
        />

        <button type="submit">Create order</button>
      </form>

      <h2>Orders</h2>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Product</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{productName(order.productId)}</td>
              <td>{order.quantity}</td>
              <td>
                <button onClick={() => deleteOrder(order.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

export default App;
