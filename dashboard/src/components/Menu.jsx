import React, { useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "./AuthContext";

const Menu = () => {
  const { user, logout } = useAuth();
  const [selectMenu, setMenu] = useState(0);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const menuItems = [
    { label: "Dashboard", to: "/" },
    { label: "Orders", to: "/orders" },
    { label: "Holdings", to: "/holdings" },
    { label: "Positions", to: "/positions" },
    { label: "Funds", to: "/funds" },
    { label: "Apps", to: "/apps" },
    // Only admins see the admin page link (the backend also enforces this).
    ...(user.role === "admin" ? [{ label: "Admin", to: "/admin" }] : []),
  ];

  const initials = user.username
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const menuClass = "menu";
  const activeMenuClass = "menu selected";

  return (
    <div className="menu-container">
      <img src="logo.png" alt="Zerodha" style={{ width: "50px" }} />
      <div className="menus">
        <ul>
          {menuItems.map((item, index) => (
            <li key={item.to}>
              <Link style={{ textDecoration: "none" }} onClick={() => setMenu(index)} to={item.to}>
                <p className={selectMenu === index ? activeMenuClass : menuClass}>{item.label}</p>
              </Link>
            </li>
          ))}
        </ul>
        <hr />
        <div className="profile-wrapper">
          <button
            type="button"
            className="profile"
            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            aria-expanded={isProfileDropdownOpen}
          >
            <div className="avatar">{initials}</div>
            <p className="username">{user.username}</p>
          </button>
          {isProfileDropdownOpen && (
            <div className="profile-dropdown">
              <p className="profile-email">{user.email}</p>
              <p className="profile-role">Role: {user.role}</p>
              <button type="button" className="logout-btn" onClick={logout}>
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;
