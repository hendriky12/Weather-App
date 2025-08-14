document.addEventListener("DOMContentLoaded", async () => {
  const getWeatherIcon = (text) => {
    text = text.toLowerCase();
    if (text.includes("thunder")) return "⛈️";
    if (text.includes("shower") || text.includes("rain")) return "🌧️";
    if (text.includes("cloud")) return "☁️";
    if (text.includes("sun") || text.includes("clear")) return "☀️";
    return "🌤️"; // default partly sunny
  };

  const getRainfallBandDescriptor = (value) => {
    if (value === 0) return { band: 1, descriptor: "No umbrella needed ☀️" };
    if (value > 0 && value <= 5)
      return { band: 2, descriptor: "Maybe take an umbrella ☔" };
    if (value > 5 && value <= 20)
      return { band: 3, descriptor: "Umbrella a must 🌧" };
    return { band: 4, descriptor: "Stay indoors ☔" };
  };

  const getPM25BandDescriptor = (value) => {
    if (value >= 0 && value <= 55)
      return { band: 1, descriptor: "Easy Breathing 🌬" };
    if (value >= 56 && value <= 150)
      return { band: 2, descriptor: "Sensitive? Mask Up 😷" };
    if (value >= 151 && value <= 250)
      return { band: 3, descriptor: "Limit outdoor time 🚶‍♂️" };
    return { band: 4, descriptor: "Stay indoors 🏠" };
  };

  try {
    const res = await fetch(
      "https://api-open.data.gov.sg/v2/real-time/api/rainfall"
    );
    const data = await res.json();

    const stations = data.data.stations;
    const readings = data.data.readings[0].data;
    const station = stations.find((s) => s.name === "Bukit Panjang Road");
    if (!station)
      return console.error("Station 'Bukit Panjang Road' not found.");

    const reading = readings.find((r) => r.stationId === station.id);
    if (!reading)
      return console.error(`No reading for stationId: ${station.id}`);

    document.getElementById("rainfall-number").textContent = reading.value;
    document.getElementById("rainfall-band").textContent =
      getRainfallBandDescriptor(reading.value).descriptor;
  } catch (error) {
    console.error("Error fetching rainfall:", error);
  }

  try {
    const res = await fetch(
      "https://api-open.data.gov.sg/v2/real-time/api/pm25"
    );
    const data = await res.json();

    const item = data.data.items[0];
    const readings = item.readings?.pm25_one_hourly;
    if (!readings) return console.error("PM2.5 readings not available.");

    const westPM25 = readings.west;
    document.getElementById("pm25-number").textContent = westPM25;
    document.getElementById("pm25-band").textContent =
      getPM25BandDescriptor(westPM25).descriptor;
  } catch (error) {
    console.error("Error fetching PM2.5:", error);
  }

  let twoHourForecastText = "";
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
      twoHourForecastText = bukitPanjangForecast.forecast;
      document.getElementById("two-hour-forecast").textContent =
        twoHourForecastText;
    }
  } catch (error) {
    console.error("Error fetching 2-hour forecast:", error);
  }

  let tempLow = "",
    tempHigh = "";
  try {
    const res = await fetch(
      "https://api-open.data.gov.sg/v2/real-time/api/twenty-four-hr-forecast"
    );
    const data = await res.json();

    const general = data.data.records[0].general.forecast.text;
    document.getElementById("next-24-hours").textContent = general;
  } catch (error) {
    console.error("Error fetching 24-hour forecast:", error);
  }

  try {
    const res = await fetch(
      "https://api-open.data.gov.sg/v2/real-time/api/four-day-outlook"
    );
    const data = await res.json();
    const forecasts = data.data.records[0].forecasts;

    forecasts.forEach((f, idx) => {
      const elem = document.getElementById(`d${idx + 1}`);
      if (elem) {
        elem.innerHTML = `${f.day}<br>${f.forecast.text}<br>(${f.temperature.low}–${f.temperature.high}°C)`;
      }
    });

    if (forecasts[0]) {
      tempLow = forecasts[0].temperature.low;
      tempHigh = forecasts[0].temperature.high;
    }
  } catch (error) {
    console.error("Error fetching 4-day outlook:", error);
  }

  const weatherIcon = getWeatherIcon(twoHourForecastText || "Partly Cloudy");

  const hours = new Date().getHours();
  const timeOfDay = hours >= 18 || hours < 6 ? "🌙 Night" : "☀️ Day";

  const tempRange = tempLow && tempHigh ? `🌡️ ${tempLow}–${tempHigh}°C` : "";
  const cleanForecastText = twoHourForecastText.replace(/\s*\(.*?\)/, "");

  document.getElementById("two-hour-forecast").innerHTML = `

    ${weatherIcon} ${cleanForecastText}<br>
    ${timeOfDay}<br>
    ${tempRange}
  `;
});
