const app = require('./app');

// Use PORT from environment (.env or deployment), fallback to 5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
