import "./portraitHeader.css";

function PortraitHeader() {
  return (
    <header
      className="portrait-header"
      style={{ backgroundImage: `url(/assets/images/portraitHeader.webp)` }}
    >
      <div className="portrait-header-content">
        <h1 className="portrait-header-title">
          {" "}
          Portraits <span className="amp">&</span> sessions privées
        </h1>
        <p className="portrait-header-subtitle">
          Un moment authentique, rien qu’à vous, pour célébrer vos proches… ou
          vous-même.
        </p>
      </div>
    </header>
  );
}

export default PortraitHeader;
