import React, { useEffect, useState } from 'react';
import { firestore } from './firebaseConfig';
import { collection, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import './index.css';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      setLoading(true);
      setError(null);
  
      try {
        const ordersCollection = collection(firestore, 'orders');
        const usersCollection = collection(firestore, 'users');
  
        const unsubscribeOrders = onSnapshot(ordersCollection, (ordersSnapshot) => {
          const ordersList = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
          const unsubscribeUsers = onSnapshot(usersCollection, (usersSnapshot) => {
            const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
            const enrichedOrders = ordersList.map(order => {
              const user = usersList.find(user => user.id === order.userId);
              const createdAt = order.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleDateString() : 'Date not available';
  
              // Calculate total price for each order
              const totalPrice = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
              return {
                id: order.id,
                ...order,
                username: user ? user.email : 'Unknown User',
                userAddress: order.address || 'Unknown Address',
                date: createdAt,
                description: order.items[0]?.description || 'No description available',
                totalPrice, // Add total price to each order
                createdAt: order.createdAt, // Preserve the createdAt field for sorting
              };
            });
  
            // Sort orders by createdAt in descending order
            enrichedOrders.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
  
            setOrders(enrichedOrders);
            setLoading(false);
          });
  
          return () => {
            unsubscribeUsers();
          };
        });
  
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  

  const markAsDelivered = async (orderId) => {
    const confirm = window.confirm("Are you sure you want to mark this order as delivered?");
    if (confirm) {
      try {
        const orderRef = doc(firestore, 'orders', orderId);
        await updateDoc(orderRef, { status: 'Delivered' });

        // Update local state to move the order from pending to delivered
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.id === orderId ? { ...order, status: 'Delivered' } : order
          )
        );
      } catch (error) {
        console.error("Error updating order:", error);
        alert(`Error: ${error.message}`);
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  const pendingOrders = orders.filter(order => order.status === 'Pending') || [];
  const deliveredOrders = orders.filter(order => order.status === 'Delivered') || [];

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      {/* Navigation link to the Post Product page */}
      <Link to="/post-product">
        <button className="post-product-btn">Post New Product</button>
      </Link>

      {/* Pending Orders Table */}
      <h2>Pending Orders</h2>
      <table className="order-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Date</th>
            <th>Username</th>
            <th>Address</th>
            <th>Items</th>
            <th>Payment Method</th>
            <th>Total Price</th> {/* Add Total Price column */}
            <th>Status</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {pendingOrders.length > 0 ? pendingOrders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.date}</td>
              <td>{order.username}</td>
              {/* Add Google Maps link for the address */}
              <td>
                <a 
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(order.userAddress)}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {order.userAddress}
                </a>
              </td>
              <td>{order.items.map(item => item.name).join(', ')}</td>
              <td>{order.paymentMethod}</td>
              <td>
                {order.items.reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0).toFixed(2)}
              </td>
              <td>{order.status}</td>
              <td>{order.description}</td>
              <td>
                <button onClick={() => markAsDelivered(order.id)}>Mark as Delivered</button>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="10">No pending orders</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Delivered Orders Table */}
      <h2>Delivered Orders</h2>
      <table className="order-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Date</th>
            <th>Username</th>
            <th>Address</th>
            <th>Items</th>
            <th>Payment Method</th>
            <th>Total Price</th> {/* Add Total Price column */}
            <th>Status</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {deliveredOrders.length > 0 ? deliveredOrders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.date}</td>
              <td>{order.username}</td>
              {/* Add Google Maps link for the address */}
              <td>
                <a 
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(order.userAddress)}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {order.userAddress}
                </a>
              </td>
              <td>{order.items.map(item => item.name).join(', ')}</td>
              <td>{order.paymentMethod}</td>
              <td>
                {order.items.reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0).toFixed(2)}
              </td>
              <td>{order.status}</td>
              <td>{order.description}</td>
              <td><button disabled>Delivered</button></td>
            </tr>
          )) : (
            <tr>
              <td colSpan="10">No delivered orders</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
