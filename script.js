document.addEventListener("DOMContentLoaded", async () => {
  const getWeatherIcon = (text) => {
    text = text.toLowerCase();
    if (text.includes("thunder")) return "⛈️";
    if (text.includes("shower")) return "🌧️";
    if (text.includes("rain")) return "🌧️";
    if (text.includes("cloud")) return "☁️";
    if (text.includes("sun") || text.includes("clear")) return "☀️";
    return "🌤️"; // default partly sunny
  };

  //rainfall data
  try {
    const res = await fetch(
      "https://api-open.data.gov.sg/v2/real-time/api/rainfall"
    );
    const data = await res.json();

    const stations = data.data.stations;
    const readings = data.data.readings[0].data;

    const station = stations.find((s) => s.name === "Bukit Panjang Road");

    if (!station) {
      console.error("Station 'Bukit Panjang Road' not found.");
      return;
    }

    const reading = readings.find((r) => r.stationId === station.id);

    if (!reading) {
      console.error(`No reading found for stationId: ${station.id}`);
      return;
    }

    const rainfallValueElem = document.getElementById("rainfall-value");
    rainfallValueElem.textContent = `Rainfall: ${reading.value} mm`;

    console.log(`Time: ${data.data.readings[0].timestamp}`);
    console.log(`Rainfall: ${reading.value} mm`);
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  // PM2.5 data
  try {
    const res = await fetch(
      "https://api-open.data.gov.sg/v2/real-time/api/pm25"
    );
    const data = await res.json();

    const item = data.data.items[0];

    const readings = item.readings?.pm25_one_hourly;
    const timestamp = data.data.items[0].timestamp;

    if (!readings) {
      console.error("PM2.5 readings not available.");
      return;
    }

    const westPM25 = readings.west; //for future implemetation, duplicate this line for other regions
    const pm25TimeElem = document.getElementById("pm25-time");
    const pm25ValueElem = document.getElementById("pm25-value");
    console.log("PM2.5 One Hour Average (West Region):");
    console.log(`Time: ${timestamp}`);
    console.log(`PM2.5 (West): ${westPM25}`);
    //Update the content
    pm25ValueElem.textContent = `PM2.5 (West): ${westPM25}`;
  } catch (error) {
    console.error("Error fetching PM2.5 data:", error);
  }

  //next 2 hours
  try {
    const res = await fetch(
      "https://api-open.data.gov.sg/v2/real-time/api/two-hr-forecast"
    );
    const data = await res.json();
    const forecasts = data.data.items[0].forecasts;
    const bukitPanjangForecast = forecasts.find(
      (f) => f.area === "Bukit Panjang"
    );
    if (bukitPanjangForecast) {
      document.getElementById("two-hour-forecast").textContent =
        bukitPanjangForecast.forecast;
    } else {
      console.log("Bukit Panjang forecast not found.");
    }
  } catch (error) {
    console.error("Error fetching 2h data:", error);
  }

  // next 24 hour
  try {
    const res = await fetch(
      "https://api-open.data.gov.sg/v2/real-time/api/twenty-four-hr-forecast"
    );
    const data = await res.json();

    const general = data.data.records[0].general.forecast.text;
    console.log("Next 24 Hours Forecast:");
    console.log(general);

    document.getElementById("next-24-hours").textContent = general;
  } catch (error) {
    console.error("Error fetching 24h data:", error);
  }

  // next 4 days data
  try {
    const res = await fetch(
      "https://api-open.data.gov.sg/v2/real-time/api/four-day-outlook"
    );
    const data = await res.json();

    const forecasts = data.data.records[0].forecasts;
    const forecastList = document.getElementById("forecast-list");
    forecastList.innerHTML = ""; // Clear previous content
    forecasts.forEach((f) => {
      console.log(
        `${f.day}: ${f.forecast.text} (${f.temperature.low}–${f.temperature.high}°C)`
      );

      // Create a list item for each forecast day
      const li = document.createElement("li");
      li.textContent = `${f.day}: ${f.forecast.text} (${f.temperature.low}–${f.temperature.high}°C)`;
      forecastList.appendChild(li);
    });
  } catch (error) {
    console.error("Error fetching next 4 days data:", error);
  }
});
