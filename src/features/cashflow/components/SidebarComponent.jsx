import { NavLink } from "react-router-dom";

function SidebarComponent() {
  return (
    <div className="sidebar d-flex flex-column flex-shrink-0 p-3 align-items-center">
      <NavLink to="/" className="text-center text-decoration-none">
        <img src="/logo.png" alt="Logo" style={{ width: 64, height: 64 }} />
        <div className="mt-2 fw-bold">Aplikasi Cash Flow</div>
      </NavLink>
    </div>
  );
}

export default SidebarComponent;
