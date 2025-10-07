import { useNavigate } from "react-router-dom";

function NavbarComponent({ profile, handleLogout }) {
  const navigate = useNavigate();

  const avatarSrc = (() => {
    if (!profile) return "/user.png";
    const keys = [
      "photo",
      "avatar",
      "image",
      "picture",
      "photo_url",
      "profile_photo",
      "url",
    ];
    for (const k of keys) {
      if (profile[k]) return profile[k];
    }
    return "/user.png";
  })();

  return (
    <nav className="navbar navbar-expand-md navbar-dark app-navbar fixed-top">
      <div className="container-fluid">
        <a className="navbar-brand d-flex align-items-center gap-2" href="#">
          <img
            src="/logo.png"
            alt="Logo"
            style={{ width: "30px", height: "30px" }}
          />
          Aplikasi Cash Flow
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarCollapse"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarCollapse">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item dropdown">
              <a
                className="nav-link text-white dropdown-toggle"
                href="#"
                id="profileDropdown"
                role="button"
                data-bs-toggle="dropdown"
              >
                <img
                  src={avatarSrc}
                  alt="Profile"
                  className="profile-img me-1"
                />
                {profile.name}
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <button
                    className="dropdown-item"
                    type="button"
                    onClick={() => navigate("/profile")}
                  >
                    <i className="bi bi-user me-2"></i>Profile
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    type="button"
                    onClick={() => navigate("/settings")}
                  >
                    <i className="bi bi-cog me-2"></i>Settings
                  </button>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={handleLogout}
                  >
                    <i className="bi bi-box-arrow-right"></i> Logout
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavbarComponent;
