import React, { useEffect, useState } from "react";

import api from "../api";

// Admin-only view: every user's orders and the registered users.
const AdminPanel = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get("/admin/orders").then((res) => setOrders(res.data));
    api.get("/admin/users").then((res) => setUsers(res.data));
  }, []);

  return (
    <div className="orders">
      <h3 className="title">Admin · All orders ({orders.length})</h3>
      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Name</th>
              <th>Qty</th>
              <th>Mode</th>
              <th>Price</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order.user?.username ?? "Deleted user"}</td>
                <td>{order.name}</td>
                <td>{order.qty}</td>
                <td>{order.mode}</td>
                <td>{order.price}</td>
                <td>{new Date(order.OrderTime).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="title" style={{ marginTop: "40px" }}>Users ({users.length})</h3>
      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;
