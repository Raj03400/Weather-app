let cityInput = document.getElementById("city");
const btn = document.getElementById("search_btn");
const locationBtn = document.getElementById("location-btn");
const apiKey = "fb801d0bfe3a1d41d4afc35ee8fcb988";
let apikeyAstro = "7c8d6dce94bd42848d983742240407";
let currentWeatherCard = document.querySelectorAll(".weather-left .card")[0];
let fiveDaysForecastCard = document.querySelector(".day-forecast");
let sunriseCard = document.querySelectorAll(".highlights .card")[1];
let feels_like_Val = document.querySelector(".feels_like p");
let humidity_Val = document.querySelector(".humidity p");
let visibility_Val = document.querySelector(".visibility p");
let wind_speed_Val = document.querySelector(".wind_speed p");
let uv_Val = document.querySelector(".uv p");
let pressure_Val = document.querySelector(".pressure p");
let hourlyForecastCard = document.querySelector(".hourly-forecast");

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// fetching weather details

const getWeatherDetails = (name, lat, lon, country, state) => {
  let forecast_api = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=40&appid=${apiKey}`;
  let weather_api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  let astro_URL = `https://api.weatherapi.com/v1/forecast.json?key=${apikeyAstro}&q=${name}&aqi=no&alerts=no`;

  fetch(weather_api)
    .then((res) => res.json())
    .then((data) => {
      let date = new Date();
      currentWeatherCard.innerHTML = `
                <div class="current-weather">
                    <div class="details">
                        <h1>${name}</h1>
                        <p>Now</p>
                        <h2 class="temp-heading">${(
                          data.main.temp - 273.15
                        ).toFixed(2)}&deg;C</h2>
                        <p>${data.weather[0].description}</p>
                    </div>
                    <div class="weather-icon">
                        <img src="https://openweathermap.org/img/wn/${
                          data.weather[0].icon
                        }@2x.png" alt="">
                    </div>
                </div>
                <hr>
                <div class="details-foot">
                    <p><i class="fa-solid fa-calendar"></i>&nbsp;&nbsp;${
                      days[date.getDay()]
                    }, ${date.getDate()} ${
        months[date.getMonth()]
      }, ${date.getFullYear()}</p>
                    <p><i class="fa-solid fa-location-dot"></i>&nbsp;&nbsp;${name}, ${country}</p>
                </div>
            `;

      let { visibility } = data;
      let { humidity, pressure, feels_like } = data.main;
      let { speed: wind_speed } = data.wind;

      //convert wind speed from m/s to km/h
      let wind_speedKmh = (wind_speed * 3.6).toFixed(1);

      feels_like_Val.textContent = `${(feels_like - 273.15).toFixed(2)}°C`;
      humidity_Val.textContent = `${humidity} %`;
      pressure_Val.textContent = `${pressure} hpa`;
      visibility_Val.textContent = `${visibility / 1000} km`;
      wind_speed_Val.textContent = `${wind_speedKmh} km/h`;
    })
    .catch(() => {
      console.log(`Failed to fetch current Weather`, error);
      alert(`Failed to fetch current Weather`);
    });

  fetch(forecast_api)
    .then((res) => res.json())
    .then((data) => {
      let hourlyForecast = data.list;
      hourlyForecastCard.innerHTML = ``;
      for (i = 0; i <= 7; i++) {
        let hrForecastDate = new Date(hourlyForecast[i].dt * 1000);
        let hr = hrForecastDate.getHours();
        let a = "PM";
        if (hr < 12) a = "AM";
        if (hr == 0) hr = 12;
        if (hr > 12) hr = hr - 12;

        hourlyForecastCard.innerHTML += `
        <div class="hour">
                    <p>${hr} ${a}</p>
                    <img src="https://openweathermap.org/img/wn/${
                      hourlyForecast[i].weather[0].icon
                    }.png" alt="">
                    <p>${(hourlyForecast[i].main.temp - 273.15).toFixed(
                      2
                    )}&deg;C</p>
                </div>
        `;
      }
      let fiveDaysForecast = [];
      let uniqueForecastDays = new Set();

      data.list.forEach((forecast, index) => {
        let forecastDate = new Date(forecast.dt * 1000);
        let dateString = forecastDate.toDateString();

        if (!uniqueForecastDays.has(dateString)) {
          uniqueForecastDays.add(dateString);
          fiveDaysForecast.push(forecast);
        }
      });

      fiveDaysForecastCard.innerHTML = ``;
      fiveDaysForecast.forEach((forecast, index) => {
        let date = new Date(forecast.dt * 1000);
        fiveDaysForecastCard.innerHTML += `
            <div class="forecast-item">
                   <div class="icon-wrapper">
                       <img src="https://openweathermap.org/img/wn/${
                         forecast.weather[0].icon
                       }.png" alt="">
                       <h4>${(forecast.main.temp - 273.15).toFixed(
                         2
                       )}&deg;C</h4>
                   </div>
                   <p>${date.getDate()} ${months[date.getMonth()]}</p>
                   <p>${days[date.getDay()]}</p>
               </div>
           `;
      });
    })
    .catch((error) => {
      console.error("Error fetching forecast weather:", error);
      alert(`Failed to fetch forecast weather`);
    });

  fetch(astro_URL)
    .then((res) => res.json())
    .then((data) => {
      let { uv } = data.forecast.forecastday[0].day;

      // Function to get UV index description
      function getUVIndexDescription(uv) {
        if (uv <= 2) return "Low";
        if (uv <= 5) return "Moderate";
        if (uv <= 7) return "High";
        if (uv <= 10) return "Very High";
        return "Extreme";
      }

      // Update the DOM
      if (uv !== undefined) {
        let uvDescription = getUVIndexDescription(uv);
        uv_Val.textContent = `${uvDescription}`;
      } else {
        uv_Val.textContent = "N/A";
      }
      let { sunrise, sunset, moonrise, moonset } =
        data.forecast.forecastday[0].astro;
      sunriseCard.innerHTML = `
                  <div class="card-head">
                        <h1>Celestial Highlights</h1>
                    </div>
                    <div class="celestial">
                        <div class="sunrise-sunset">
                            <div class="item">
                                <div class="icon">
                                    <img src="/pics/sunrise.png" alt="">
                                </div>
                                <p>Sunrise</p>
                                <h2>${sunrise}</h2>
                            </div>
                            <div class="item">
                                <div class="icon">
                                    <img src="/pics/sunset.png" alt="">
                                </div>
                                <p>Sunset</p>
                                <h2>${sunset}</h2>
                            </div>
                        </div> 
                        <div class="seperator"></div>
                        <div class="moonrise-moonset">
                            <div class="item">
                                <div class="icon">
                                    <img src="/pics/moon.png" alt="">
                                </div>
                                <p>Moonrise</p>
                                <h2>${moonrise}</h2>
                            </div>
                            <div class="item">
                                <div class="icon">
                                    <img src="/pics/moonset.png" alt="">
                                </div>
                                <p>Moonset</p>
                                <h2>${moonset}</h2>
                            </div>
                        </div>
                    </div>    `;
    })
    .catch((error) => {
      console.log(`Failed to fetching Astronomy data`, error);
      alert(`Failed to fetching Astronomy data`);
    });
};

// Create a container for suggestions
let suggestionsContainer = null;

function createSuggestionsContainer() {
  if (!suggestionsContainer) {
    suggestionsContainer = document.createElement("div");
    suggestionsContainer.id = "suggestions-container";
    cityInput.parentNode.insertBefore(suggestionsContainer, cityInput.nextSibling);
  }
  return suggestionsContainer;
}

// Handle input changes
async function handleInput() {
  const query = cityInput.value;
  if (query.length < 3) {
    suggestionsContainer.innerHTML = "";
    suggestionsContainer.style.display = "none";
    return;
  }

  try {
    let requestOptions = {
      method: "GET",
    };
    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/autocomplete?text=${query}&apiKey=bbd1d26975a64a10a4ff6be9d630e874`,
      requestOptions
    );
    const data = await response.json();
    displaySuggestions(data.features);
  } catch (error) {
    alert(`Failed to search weather data for ${query}`)
    console.error("Error fetching suggestions:", error);
  }
}

// Display suggestions
function displaySuggestions(features) {
  let container = createSuggestionsContainer();
  container.innerHTML = "";

  if (features.length === 0) {
    console.log("No suggestions to display");
    suggestionsContainer.innerHTML = "No suggestions to display";
    return;
  }
  features.forEach((feature) => {
    const suggestion = document.createElement("div");
    suggestion.classList.add("suggestion");
    suggestion.textContent = feature.properties.formatted;

    suggestion.addEventListener("click", () => {
      let { city, lat, lon, country, state } = feature.properties;
       city = feature.properties.city ? feature.properties.city : feature.properties.address_line1;

      console.log(feature.properties);


      getWeatherDetails(city, lat, lon, country, state);
      cityInput.value = ""
      hideSuggestions();
    });
    container.appendChild(suggestion);
    
  });
  container.style.display = "block";
}
function hideSuggestions() {
  suggestionsContainer.innerHTML = "";
  suggestionsContainer.style.display = "none";
}

// Debounce function to limit API calls
function debounce(func, delay) {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
}

cityInput.removeEventListener("input", debounce(handleInput, 300));
// Add event listener for input changes
cityInput.addEventListener("input", debounce(handleInput, 300));
// Add this event listener to hide suggestions when clicking outside
document.addEventListener("click", (event) => {
  if (
    suggestionsContainer &&
    !suggestionsContainer.contains(event.target) &&
    event.target !== cityInput
  ) {
    hideSuggestions();
  }
});

//  getting weather updates
const getWeatherUpdate = () => {
  let cityName = cityInput.value.trim();
  cityInput.value = "";

  if (!cityName) {
    cityInput.placeholder = "Please enter your cityInput name";
    cityInput.classList.add("red-placeholder");
    return;
  } else {
    cityInput.classList.remove("red-placeholder");
  }

  let geocodingapi = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${apiKey}`;

  fetch(geocodingapi)
    .then((res) => res.json())
    .then((data) => {
      let { name, lat, lon, country, state } = data[0];
      getWeatherDetails(name, lat, lon, country, state);
    })
    .catch(() => {
      console.log(`Failed to fetch coordinates of ${cityName}`);
      alert(`Failed to fetch coordinates of ${cityName}`);
    });
};
// fecting user  location coordinates
const getUsersCoordinates = () => {
  navigator.geolocation.getCurrentPosition((position) => {
    let { latitude, longitude } = position.coords;

    let reverse_geocoding_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`;

    fetch(reverse_geocoding_URL)
      .then((res) => res.json())
      .then((data) => {
        let { name, country, state } = data[0];
        getWeatherDetails(name, latitude, longitude, country, state);
      })
      .catch((error) => {
        console.log(error);
        alert(`Failed to fetching user coordinates`);
      });
  });
};
btn.addEventListener("click", getWeatherUpdate);
cityInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    getWeatherUpdate();
  }
});
locationBtn.addEventListener("click", getUsersCoordinates);
window.addEventListener("load", getUsersCoordinates());

const hasTakenTour = localStorage.getItem("hasTakenTour");

if (!hasTakenTour) {
  const driver = window.driver.js.driver;

  const driverObj = driver({
    showProgress: true,
    steps: [
      {
        element: "body",
        popover: {
          title: "About",
          description:
            "Hello everyone! In this weather web-app you will get up-to-date weather data of your respected cityInput/location ",
          popoverClass: "driver-popover driverjs-theme",
        },
      },

      {
        element: ".search-items",
        popover: {
          title: "Search",
          description:
            " Here in this search field you can search weather forecast for your desired cityInput",
          popoverClass: "driver-popover driverjs-theme",
        },
      },

      {
        element: ".one",
        popover: {
          title: "",
          description:
            "Here you will see current weather and some location details",
          popoverClass: "driver-popover driverjs-theme",
        },
      },

      {
        element: ".two",
        popover: {
          title: "",
          description: "You can also see next 5 days forecast \nwith dates",
          popoverClass: "driver-popover driverjs-theme",
        },
      },

      {
        element: ".three",
        popover: {
          title: "",
          description:
            "Here you will acheive various weather highlights to be more knowladgeable",
          popoverClass: "driver-popover driverjs-theme",
        },
      },

      {
        element: ".four",
        popover: {
          title: "",
          description:
            "In this field you will get Astromonical updates such as Sunrise and Moonrise ",
          popoverClass: "driver-popover driverjs-theme",
        },
      },

      {
        element: ".five",
        popover: {
          title: "",
          description:
            "Last but not least her eyou will get houly\n update of weather ",
          popoverClass: "driver-popover driverjs-theme",
        },
      },
    ],
  });
  driverObj.drive();
  localStorage.setItem("hasTakenTour", true);
}
