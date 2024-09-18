 

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SalesData = () => {
  const [salesData, setSalesData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/sales-data')
      .then(response => {
        setSalesData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching sales data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p style={styles.loading}>Loading sales data...</p>;
  if (!salesData) return <p style={styles.noData}>No sales data available.</p>;

  const formatNumber = (value) => (value !== null && value !== undefined) ? value.toFixed(2) : 'N/A';

  return (
    <div style={styles.container}>
      <h2 style={styles.totalSales}>Total Sales: ${formatNumber(salesData.totalSales)}</h2>

      <h3 style={styles.sectionTitle}>Monthly Sales</h3>
      <ul style={styles.list}>
        {Object.keys(salesData.monthlySales).map(month => (
          <li key={month} style={styles.listItem}>
            {month}: ${formatNumber(salesData.monthlySales[month])}
          </li>
        ))}
      </ul>

      <h3 style={styles.sectionTitle}>Popular Items by Month</h3>
      <ul style={styles.list}>
        {Object.keys(salesData.popularItems).map(month => (
          <li key={month} style={styles.listItem}>
            {month}: {salesData.popularItems[month] || 'N/A'}
          </li>
        ))}
      </ul>

      <h3 style={styles.sectionTitle}>Items Generating Most Revenue by Month</h3>
      <ul style={styles.list}>
        {Object.keys(salesData.revenueItems).map(month => (
          <li key={month} style={styles.listItem}>
            {month}: {salesData.revenueItems[month] || 'N/A'}
          </li>
        ))}
      </ul>

      <h3 style={styles.sectionTitle}>Monthly Orders Stats (Most Popular Item)</h3>
      <ul style={styles.list}>
        {Object.keys(salesData.monthlyOrdersStats).map(month => (
          <li key={month} style={styles.listItem}>
            {month} - Min: {formatNumber(salesData.monthlyOrdersStats[month].min)}, Max: {formatNumber(salesData.monthlyOrdersStats[month].max)}, Avg: {formatNumber(salesData.monthlyOrdersStats[month].average)}
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f4f4f9',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    maxWidth: '800px',
    margin: 'auto'
  },
  totalSales: {
    color: '#333',
    fontSize: '24px',
    fontWeight: 'bold'
  },
  sectionTitle: {
    color: '#555',
    fontSize: '20px',
    borderBottom: '2px solid #ddd',
    paddingBottom: '5px',
    marginBottom: '10px'
  },
  list: {
    listStyleType: 'none',
    padding: '0'
  },
  listItem: {
    padding: '8px',
    borderBottom: '1px solid #ddd',
    fontSize: '16px'
  },
  loading: {
    color: '#007BFF',
    fontSize: '18px',
    textAlign: 'center'
  },
  noData: {
    color: '#FF0000',
    fontSize: '18px',
    textAlign: 'center'
  }
};

export default SalesData;
