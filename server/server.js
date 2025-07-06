import express from 'express';

const app = express();
const PORT = 8080;

app.get('/api/weather', (req, res) => {
  res.json({
    location: "Singapore",
    temperature: "31°C",
    condition: "Sunny",
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
