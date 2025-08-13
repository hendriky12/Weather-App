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

  function getRainfallBandDescriptor(value) {
    if (value === 0) {
      return { band: 1, descriptor: "No Rain" };
    } else if (value > 0 && value <= 5) {
      return { band: 2, descriptor: "Light Rain" };
    } else if (value > 5 && value <= 20) {
      return { band: 3, descriptor: "Moderate Rain" };
    } else {
      return { band: 4, descriptor: "Heavy Rain" };
    }
  }

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

    const rainfallValueElem = document.getElementById("rainfall-number");
    rainfallValueElem.textContent = reading.value;
    const rainfallBandElem = document.getElementById("rainfall-band");
    rainfallBandElem.textContent = `Band ${
      getRainfallBandDescriptor(reading.value).band
    } - ${getRainfallBandDescriptor(reading.value).descriptor}`;

    console.log(`Time: ${data.data.readings[0].timestamp}`);
    console.log(`Rainfall: ${reading.value} mm`);
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  function getPM25BandDescriptor(value) {
    if (value >= 0 && value <= 55) {
      return { band: 1, descriptor: "Normal" };
    } else if (value >= 56 && value <= 150) {
      return { band: 2, descriptor: "Elevated" };
    } else if (value >= 151 && value <= 250) {
      return { band: 3, descriptor: "High" };
    } else {
      return { band: 4, descriptor: "Very High" };
    }
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
    const pm25ValueElem = document.getElementById("pm25-number");
    const pm25BandElem = document.getElementById("pm25-band");
    console.log("PM2.5 One Hour Average (West Region):");
    console.log(`Time: ${timestamp}`);
    console.log(`PM2.5 (West): ${westPM25}`);
    //Update the content
    pm25ValueElem.textContent = westPM25;
    pm25BandElem.textContent = `Band ${
      getPM25BandDescriptor(westPM25).band
    } - ${getPM25BandDescriptor(westPM25).descriptor}`;
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
    const d1 = document.getElementById("d1");
    const d2 = document.getElementById("d2");
    const d3 = document.getElementById("d3");
    const d4 = document.getElementById("d4");
    forecasts.innerHTML = ""; // Clear previous content
    forecasts.forEach((f) => {
      console.log(
        `${f.day}: ${f.forecast.text} (${f.temperature.low}–${f.temperature.high}°C)`
      );

      if (forecasts[0]) {
        d1.textContent = `${forecasts[0].day}: ${forecasts[0].forecast.text} (${forecasts[0].temperature.low}–${forecasts[0].temperature.high}°C)`;
      }
      if (forecasts[1]) {
        d2.textContent = `${forecasts[1].day}: ${forecasts[1].forecast.text} (${forecasts[1].temperature.low}–${forecasts[1].temperature.high}°C)`;
      }
      if (forecasts[2]) {
        d3.textContent = `${forecasts[2].day}: ${forecasts[2].forecast.text} (${forecasts[2].temperature.low}–${forecasts[2].temperature.high}°C)`;
      }
      if (forecasts[3]) {
        d4.textContent = `${forecasts[3].day}: ${forecasts[3].forecast.text} (${forecasts[3].temperature.low}–${forecasts[3].temperature.high}°C)`;
      }
    });
  } catch (error) {
    console.error("Error fetching next 4 days data:", error);
  }
});

// 1-hr PM2.5 reading (µg/m3)	Band	Descriptor
// 0 - 55	1	Normal
// 56 - 150	2	Elevated
// 151 - 250	3	High
// >=251	4	Very High
