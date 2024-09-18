 


const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(cors());
const PORT = 5000;

app.get('/sales-data', (req, res) => {
  const filePath = path.join(__dirname, 'sales-data.txt');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('File read error:', err); // Log error
      return res.status(500).json({ error: 'File read error' });
    }

    const reversedData = data.split('\n').reverse();
    
    const salesData = reversedData.map(row => {
      const values = row.split(',').reverse();

      if (values.length < 4) {
        return null;
      }

      const [date, item, quantity, price] = values;
      return {
        date: new Date(date.trim()),
        item: item ? item.trim() : '', // Handle undefined item
        quantity: parseInt(quantity.trim(), 10),
        price: parseFloat(price.trim())
      };
    }).filter(Boolean); 

    const totalSales = salesData.reduce((total, sale) => total + (sale.quantity * sale.price), 0);

    const monthlySales = {};
    const monthlyPopularItems = {};
    const monthlyRevenueItems = {};

    salesData.forEach(sale => {
      const month = sale.date.getMonth() + 1;
      const year = sale.date.getFullYear();
      const key = `${year}-${month}`;

      if (!monthlySales[key]) monthlySales[key] = 0;
      monthlySales[key] += sale.quantity * sale.price;

      if (!monthlyPopularItems[key]) monthlyPopularItems[key] = {};
      if (!monthlyPopularItems[key][sale.item]) monthlyPopularItems[key][sale.item] = 0;
      monthlyPopularItems[key][sale.item] += sale.quantity;

      if (!monthlyRevenueItems[key]) monthlyRevenueItems[key] = {};
      if (!monthlyRevenueItems[key][sale.item]) monthlyRevenueItems[key][sale.item] = 0;
      monthlyRevenueItems[key][sale.item] += sale.quantity * sale.price;
    });

    const popularItems = {};
    const revenueItems = {};

    Object.keys(monthlyPopularItems).forEach(month => {
      popularItems[month] = Object.keys(monthlyPopularItems[month]).reduce((a, b) =>
        monthlyPopularItems[month][a] > monthlyPopularItems[month][b] ? a : b
      );

      revenueItems[month] = Object.keys(monthlyRevenueItems[month]).reduce((a, b) =>
        monthlyRevenueItems[month][a] > monthlyRevenueItems[month][b] ? a : b
      );
    });

    const monthlyOrdersStats = {};
    Object.keys(monthlyPopularItems).forEach(month => {
      const itemOrders = Object.values(monthlyPopularItems[month]);
      monthlyOrdersStats[month] = {
        min: Math.min(...itemOrders),
        max: Math.max(...itemOrders),
        average: itemOrders.reduce((a, b) => a + b, 0) / itemOrders.length
      };
    });

    res.json({
      totalSales,
      monthlySales,
      popularItems,
      revenueItems,
      monthlyOrdersStats
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
