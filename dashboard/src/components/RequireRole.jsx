import React from "react";

import { useAuth } from "./AuthContext";

// Front-end route guard. The backend enforces the same rule with requireRole().
const RequireRole = ({ role, children }) => {
  const { user } = useAuth();

  if (user.role !== role) {
    return (
      <div className="no-orders">
        <p>You don't have access to this page.</p>
      </div>
    );
  }
  return children;
};

export default RequireRole;
