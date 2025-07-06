import express from "express";

const app = express();
const PORT = 8080;

app.get("/api/metadata", async (req, res) => {
  const collectionId = "1456"; // NEA Collection ID
  const url = `https://api-production.data.gov.sg/v2/public/api/collections/${collectionId}/metadata`;

  try {
    const response = await fetch(url);
    if (!response.ok)
      return res.status(502).json({ error: "Failed to fetch data" });

    const data = await response.json();
    const childDatasets = data?.data?.collectionMetadata?.childDatasets || [];

    // returns the dataset id for NEA collection 2 hour, 24 hour, 4 days
    res.json({ childDatasets });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/2hour", async (req, res) => {
  const url = "https://api.data.gov.sg/v1/environment/2-hour-weather-forecast";
  try {
    const response = await fetch(url);
    if (!response.ok)
      return res.status(502).json({ error: "Failed to fetch data" });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/24hour", async (req, res) => {
  const url = "https://api.data.gov.sg/v1/environment/24-hour-weather-forecast";
  try {
    const response = await fetch(url);
    if (!response.ok)
      return res.status(502).json({ error: "Failed to fetch data" });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/4days", async (req, res) => {
  const url = "https://api.data.gov.sg/v1/environment/4-day-weather-forecast";
  try {
    const response = await fetch(url);
    if (!response.ok)
      return res.status(502).json({ error: "Failed to fetch data" });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
