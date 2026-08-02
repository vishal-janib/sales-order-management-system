import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/pages.css";

function Customers() {
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [customers, setCustomers] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setCustomer({
      ...customer,
      [name]: value,
    });
  };

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

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (editingId) {
        await axios.put(
          `https://sales-order-management-system-e9ah.onrender.com/customers/${editingId}`,
          customer,
        );

        alert("Customer updated successfully");
      } else {
        await axios.post(
          "https://sales-order-management-system-e9ah.onrender.com/customers",
          customer,
        );

        alert("Customer added successfully");
      }

      setCustomer({
        name: "",
        email: "",
        phone: "",
        address: "",
      });

      setEditingId(null);

      fetchCustomers();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://sales-order-management-system-e9ah.onrender.com/customers/${id}`,
      );

      alert("Customer deleted successfully");

      fetchCustomers();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (customer) => {
    setCustomer({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
    });

    setEditingId(customer._id);
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Customers</h1>

      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Enter customer name"
          value={customer.name}
          onChange={handleChange}
        />

        <input
          type="email"
          name="email"
          placeholder="Enter customer email"
          value={customer.email}
          onChange={handleChange}
        />

        <input
          type="text"
          name="phone"
          placeholder="Enter customer phone"
          value={customer.phone}
          onChange={handleChange}
        />

        <input
          type="text"
          name="address"
          placeholder="Enter customer address"
          value={customer.address}
          onChange={handleChange}
        />

        <button className="submit-btn" type="submit">
          {editingId ? "Update Customer" : "Add Customer"}
        </button>
      </form>

      <h2 className="list-title">Customer List</h2>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((customer) => (
              <tr key={customer._id}>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>
                <td>{customer.address}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(customer)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(customer._id)}
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

export default Customers;
