import api from "../api";
import React,{useState,useEffect} from "react";
import { Link } from "react-router-dom";

const Orders = () => {

  const [orders,setOrders]=useState([]);
  useEffect(()=>{
    api.get("/Orders").then((res)=>{
      setOrders(res.data);
    })
  },[]);

  return (
    <div className="orders">
      {orders.length===0?<div className="no-orders">
        <p>You haven't placed any orders today</p>

        <Link to={"/"} className="btn">
          Get started
        </Link>
      </div> :
      <div><h3 className="title">Orders ({orders.length})</h3>

      <div className="order-table">
        <table>
          <thead>
          <tr>
            <th>Name</th>
            <th>Qty</th>
            <th>Mode</th>
            <th>Price</th>
            
          </tr>
          </thead>
          <tbody>
          {orders.map((order, index) => {
            

            return (
              <tr key={index}>
                <td>{order.name}</td>
                <td>{order.qty}</td>
                <td>{order.mode}</td>
                <td >{order.price}</td>
              </tr>
            );
          })}
          </tbody>
        </table>
      </div>
      </div>}
    </div>
  );
};

export default Orders;