import { Link } from "react-router-dom";
import "./navbar.css";

function Navbar() {
  return (
    <div className="navbar-container">
      <h1 className="navbar-title">Sales Order Management System</h1>

      <div className="navbar-links">
        <Link to="/customers" className="nav-button">
          Customers
        </Link>

        <Link to="/products" className="nav-button">
          Products
        </Link>

        <Link to="/orders" className="nav-button">
          Orders
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
