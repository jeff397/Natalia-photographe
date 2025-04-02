import "./Navbar.css";

function Navbar() {
  return (
    <nav className="nav">
      <div className="nav-left">
        <a href="/" className="menu-link">
          Accueil
        </a>
        <a href="#" className="menu-link">
          Portfolio
        </a>
      </div>
      <h1>Mon Site</h1>
      <div className="nav-right">
        <a href="/about" className="menu-link">
          À propos
        </a>
        <a href="/contact" className="menu-link">
          Contact
        </a>
      </div>
    </nav>
  );
}

export default Navbar;
