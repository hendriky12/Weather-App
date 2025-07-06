import express from "express";

const app = express();
const PORT = 8080;

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

app.get("/api/rain", async (req, res) => {
  const url = "https://api-open.data.gov.sg/v2/real-time/api/rainfall";
  try {
    const response = await fetch(url);
    if (!response.ok)
      return res.status(502).json({ error: "Failed to fetch data" });

    const data = await response.json();

    // Extract readings array
    const readings = data?.data?.readings || [];
    if (readings.length === 0) {
      return res.status(404).json({ error: "No rainfall data found" });
    }

    // Get latest reading timestamp's data array
    const latestReading = readings[readings.length - 1];
    const BukitPanjang = latestReading.data.find((r) => r.stationId === "S64");
    const rainfallValue = BukitPanjang ? BukitPanjang.value : null;

    // Return only the info related to station S64
    res.json({
      stationId: "S64",
      rainfall: rainfallValue,
      timestamp: latestReading.timestamp,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/pm25", async (req, res) => {
  const url = "https://api-open.data.gov.sg/v2/real-time/api/psi";
  try {
    const response = await fetch(url);
    if (!response.ok)
      return res.status(502).json({ error: "Failed to fetch data" });
    const data = await response.json();

    const pm25west =
      data?.data?.items?.[0]?.readings?.pm25_sub_index?.west ?? null;

    if (pm25west !== null) {
      res.json({
        region: "West",
        pm25: pm25west,
        timestamp: data?.data?.items?.[0]?.timestamp || null,
      });
    } else {
      res.status(404).json({ error: "PM2.5 data not found for West region" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
