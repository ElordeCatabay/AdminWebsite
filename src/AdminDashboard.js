// src/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import { firestore } from './firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Added for error handling

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading to true at the start
      setError(null); // Reset error state

      try {
        const usersCollection = collection(firestore, 'users');
        const ordersCollection = collection(firestore, 'orders');
        const addressesCollection = collection(firestore, 'addresses');

        const [usersSnapshot, ordersSnapshot, addressesSnapshot] = await Promise.all([
          getDocs(usersCollection),
          getDocs(ordersCollection),
          getDocs(addressesCollection)
        ]);

        const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const ordersList = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const addressesList = addressesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        setUsers(usersList);
        setOrders(ordersList);
        setAddresses(addressesList);

        // Debugging logs
        console.log('Users:', usersList);
        console.log('Orders:', ordersList);
        console.log('Addresses:', addressesList);

      } catch (error) {
        setError(error.message);
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>; // Display error if any
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      
      <h2>Users</h2>
      <ul>
        {users.length > 0 ? users.map(user => (
          <li key={user.id}>{user.email}</li>
        )) : <li>No users found</li>}
      </ul>
      
      <h2>Orders</h2>
      <ul>
        {orders.length > 0 ? orders.map(order => (
          <li key={order.id}>{JSON.stringify(order)}</li>
        )) : <li>No orders found</li>}
      </ul>
      
      <h2>Addresses</h2>
      <ul>
        {addresses.length > 0 ? addresses.map(address => (
          <li key={address.id}>{JSON.stringify(address)}</li>
        )) : <li>No addresses found</li>}
      </ul>
    </div>
  );
};

export default AdminDashboard;
