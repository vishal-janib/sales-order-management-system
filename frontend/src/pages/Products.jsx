import { useEffect, useState } from "react";
import axios from "axios";

function Products() {
  const [product, setProduct] = useState({
    name: "",
    category: "",
    price: "",
    gst: 18,
  });

  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setProduct({
      ...product,
      [name]: value,
    });
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/products");
      setProducts(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/products/${editingId}`, product);

        alert("Product updated successfully");
      } else {
        await axios.post("http://localhost:5000/products", product);

        alert("Product added successfully");
      }

      setProduct({
        name: "",
        category: "",
        price: "",
        gst: 18,
      });

      setEditingId(null);

      fetchProducts();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (product) => {
    setProduct({
      name: product.name,
      category: product.category,
      price: product.price,
      gst: product.gst,
    });

    setEditingId(product._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/products/${id}`);

      alert("Product deleted successfully");

      fetchProducts();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Products</h1>

      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Enter product name"
          value={product.name}
          onChange={handleChange}
        />

        <select
          name="category"
          value={product.category}
          onChange={handleChange}
        >
          <option value="">Select Category</option>
          <option value="Electronics">Electronics</option>
          <option value="Furniture">Furniture</option>
          <option value="Clothing">Clothing</option>
          <option value="Books">Books</option>
          <option value="Accessories">Accessories</option>
        </select>

        <input
          type="number"
          name="price"
          placeholder="Enter price"
          value={product.price}
          onChange={handleChange}
        />

        <button className="submit-btn" type="submit">
          {editingId ? "Update Product" : "Add Product"}
        </button>
      </form>

      <h2 className="list-title">Product List</h2>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>GST (%)</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>₹ {product.price}</td>
                <td>{product.gst}%</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(product)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(product._id)}
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

export default Products;
