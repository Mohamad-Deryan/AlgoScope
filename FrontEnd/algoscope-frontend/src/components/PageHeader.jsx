import { Link } from "react-router-dom";

function PageHeader({ title, subtitle, backTo = "/library", backLabel = "Back to Library" }) {
  return (
    <div className="page-header">
      <div>
        <h1>{title}</h1>
        <p className="page-subtitle">{subtitle}</p>
      </div>

      <Link to={backTo}>
        <button>{backLabel}</button>
      </Link>
    </div>
  );
}

export default PageHeader;