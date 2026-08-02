import { useEffect, useState } from "react";
import axios from "axios";

function Orders() {
  const [order, setOrder] = useState({
    customer: "",
    products: [],
    paymentStatus: "Pending",
  });

  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [quantities, setQuantities] = useState({});

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(
        "https://sales-order-management-system-e9ah.onrender.com/customers",
      );
      setCustomers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "https://sales-order-management-system-e9ah.onrender.com/products",
      );
      setProducts(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        "https://sales-order-management-system-e9ah.onrender.com/orders",
      );
      setOrders(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCustomers();
    fetchProducts();
    fetchOrders();
  }, []);

  const handleProductSelect = (productId, checked) => {
    if (checked) {
      setOrder({
        ...order,
        products: [
          ...order.products,
          {
            product: productId,
            quantity: quantities[productId] || 1,
          },
        ],
      });
    } else {
      setOrder({
        ...order,
        products: order.products.filter((item) => item.product !== productId),
      });
    }
  };

  const handleQuantityChange = (productId, quantity) => {
    setQuantities({
      ...quantities,
      [productId]: Number(quantity),
    });

    setOrder({
      ...order,
      products: order.products.map((item) =>
        item.product === productId
          ? {
              ...item,
              quantity: Number(quantity),
            }
          : item,
      ),
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (editingId) {
        await axios.put(
          `https://sales-order-management-system-e9ah.onrender.com/orders/${editingId}`,
          order,
        );

        alert("Order updated successfully");
      } else {
        await axios.post(
          "https://sales-order-management-system-e9ah.onrender.com/orders",
          order,
        );

        alert("Order placed successfully");
      }

      setOrder({
        customer: "",
        products: [],
        paymentStatus: "Pending",
      });

      setQuantities({});

      setEditingId(null);

      fetchOrders();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://sales-order-management-system-e9ah.onrender.com/orders/${id}`,
      );

      alert("Order deleted successfully");

      fetchOrders();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (order) => {
    setOrder({
      customer: order.customer._id,
      products: order.products.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      })),
      paymentStatus: order.paymentStatus,
    });

    const quantityData = {};

    order.products.forEach((item) => {
      quantityData[item.product._id] = item.quantity;
    });

    setQuantities(quantityData);

    setEditingId(order._id);
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Orders</h1>

      <form className="form" onSubmit={handleSubmit}>
        <label>Customer</label>

        <select
          name="customer"
          value={order.customer}
          onChange={(event) =>
            setOrder({
              ...order,
              customer: event.target.value,
            })
          }
        >
          <option value="">Select Customer</option>

          {customers.map((customer) => (
            <option key={customer._id} value={customer._id}>
              {customer.name}
            </option>
          ))}
        </select>

        <h2 className="list-title">Select Products</h2>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Select</th>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={order.products.some(
                        (item) => item.product === product._id,
                      )}
                      onChange={(event) =>
                        handleProductSelect(product._id, event.target.checked)
                      }
                    />
                  </td>

                  <td>{product.name}</td>

                  <td>₹ {product.price}</td>

                  <td>
                    <input
                      type="number"
                      min="1"
                      value={quantities[product._id] || 1}
                      onChange={(event) =>
                        handleQuantityChange(product._id, event.target.value)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <label>Payment Status</label>

        <select
          value={order.paymentStatus}
          onChange={(event) =>
            setOrder({
              ...order,
              paymentStatus: event.target.value,
            })
          }
        >
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
        </select>

        <button className="submit-btn" type="submit">
          {editingId ? "Update Order" : "Place Order"}
        </button>
      </form>

      <h2 className="list-title">Orders List</h2>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Products</th>
              <th>Total Amount</th>
              <th>Payment Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order.customer?.name}</td>

                <td>
                  {order.products.map((item) => (
                    <div key={item.product._id}>
                      {item.product.name} (Qty: {item.quantity})
                    </div>
                  ))}
                </td>

                <td>₹ {order.totalAmount}</td>

                <td>{order.paymentStatus}</td>

                <td>
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(order)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(order._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Orders;
