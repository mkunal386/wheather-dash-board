function formatHour(time) {
  return new Date(time).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

function formatDay(date) {
  return new Date(date).toLocaleDateString([], { weekday: 'short' });
}

function getWeather() {
  const city = document.getElementById("city").value;

  fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`)
    .then(res => res.json())
    .then(loc => {
      if (!loc.results) return alert("City not found");

   const { latitude, longitude, name, country } = loc.results[0];
document.getElementById("cityName").innerText = `${name}, ${country}`;


      fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
        `&current_weather=true&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
      )
      .then(res => res.json())
      .then(data => {
        document.getElementById("temp").innerText =
          data.current_weather.temperature + "°C";

        // Hourly (24 hours)
        const hourly = document.getElementById("hourly");
        hourly.innerHTML = "";
        for (let i = 0; i < 24; i++) {
          hourly.innerHTML += `
            <div class="hour-card">
              <div class="time">${formatHour(data.hourly.time[i])}</div>
              <div class="temp">${data.hourly.temperature_2m[i]}°</div>
            </div>`;
        }

        // Weekly (7 days)
        const daily = document.getElementById("daily");
        daily.innerHTML = "";
        for (let i = 0; i < 7; i++) {
          daily.innerHTML += `
            <div class="day-card">
              <div class="day">${formatDay(data.daily.time[i])}</div>
              <div class="temp">
                ${data.daily.temperature_2m_min[i]}° /
                ${data.daily.temperature_2m_max[i]}°
              </div>
            </div>`;
        }
      });
    });
}