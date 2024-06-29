const form = document.querySelector("form");
const input = document.querySelector("form input.form-control");
const cardContainer = document.getElementById("card-container");
const alertMessage = document.getElementById("alert");
const locate = document.getElementById("locate");
const locationDiv = document.getElementById("userLocation");
const langButton = document.querySelector(".language");

//! Variables
let apiKey = "75b251ce9d3d5c7bf9e4f1832b237076";
let url; // api request
let units = "metric"; // Fahrenheit - imperial
let lang = "en"; // for Deutsch DE
let cities = [];
let userLocation = false;

//! Date Set

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
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const currentDate = new Date();

const dayName = days[currentDate.getDay()];
const monthName = months[currentDate.getMonth()];
const dayNumber = currentDate.getDate();
const formattedDate = `${dayName}, ${monthName}, ${dayNumber}`;

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (input.value) {
    const city = input.value;
    url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&lang=${lang}&appid=${apiKey}`;

    getWeatherData();
  }
  form.reset();
});

locate.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition(({ coords }) => {
    //console.log(coords);
    const { latitude, longitude } = coords;
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${units}&lang=${lang}&appid=${apiKey}`;
    userLocation = true;
    getWeatherData();
  });
});

langButton.addEventListener("click", (e) => {
  if (e.target.textContent === "DE") {
    input.setAttribute("placeholder", "Suche nach einer Stadt");
    lang = "de";
  } else if (e.target.textContent === "EN") {
    input.setAttribute("placeholder", "Search for a city");
    lang = "en";
  }
});

//! Functions

const getWeatherData = async () => {
  try {
    const { data } = await axios(url);
    const { main, name, sys, weather } = data;

    const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`; //^ openweathermap.org

    if (!cities.includes(name)) {
      cities.push(name);
      const card = document.createElement("div");
      card.classList.add("col");
      card.setAttribute("id", `${name}`);
      card.innerHTML = `
    <div class="weather-widget card mb-4  ">
    <div class="weather-header">
      <p>${formattedDate}</p>
      <h2>${name}, ${sys.country}</h2>
      <i class="bi bi-x-circle close-icon"></i>
    </div>
    <div class="weather-body">
      <div class="weather-icon">
        <img src="${iconUrl}" alt="weather icon" />
      </div>
      <div class="temperature">
      <p>${weather[0].description}</p>
        <h1>${main.temp.toFixed(0)} °C </h1>
      </div>
    </div>
  </div> 
    `;

      if (userLocation) {
        locationDiv.appendChild(card);
        userLocation = false;
      } else {
        cardContainer.prepend(card);
      }

      //! Remove Elements
      document.addEventListener("click", (e) => {
        if (e.target.classList.contains("bi-x-circle")) {
          const card = e.target.closest(".col");
          cities = cities.filter((city) => city !== card.id);
          //cities.splice(cities.indexOf(card), 1);
          card.remove();
        }
      });
    } else {
      if (lang == "de") {
        alertMessage.textContent = `Sie kennen das Wetter für die ${name} bereits. Bitte suchen Sie nach einer anderen Stadt 😉`;
      } else {
        alertMessage.textContent = `You already know the weather for ${name}, Please search for another city 😉`;
      }
      alertMessage.classList.replace("d-none", "d-block");
      setTimeout(() => {
        alertMessage.classList.replace("d-block", "d-none");
      }, 3000);
    }
  } catch (error) {
    if (lang == "de") {
      alertMessage.textContent = `Stadt nicht gefunden`;
    } else {
      alertMessage.textContent = `City Not Found!`;
    }

    alertMessage.classList.replace("d-none", "d-block");

    setTimeout(() => {
      alertMessage.classList.replace("d-block", "d-none");
    }, 3000);
  }
};
