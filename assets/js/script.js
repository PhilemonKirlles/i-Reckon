unlock='d24c956ef5e85c170fe5bcf070e8ba6a';

var searchBtn = document.querySelector(".searchBtn");
var clearBtn = document.querySelector(".clearBtn");
var locateBtn = document.querySelector(".locateBtn");
var weatherInfo, cityName, historyBtn;
var historyEl = document.querySelector("#history");
var toggle = false;
var searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
var input = document.getElementById("search-input");
init();

function init() {
  getCurrentLocation();
  getSearchHistory();
}

function getSearchHistory() {
  if (searchHistory == null) {
    console.log(
      "There is no search history data in local storage, creating a blank array"
    );
    searchHistory = [];
  }
  // if there is an array, run the function
  else {
    handleFillHistory();
  }
}

function handleFillHistory() {
  for (let i = 0; i < searchHistory.length && i < 8; i++) {
    var buttonDiv = document.createElement("div");
    var buttonEl = document.createElement("button");
    buttonDiv.classList.add("d-grid", "mt-2");
    buttonEl.classList.add("btn", "btn-secondary", "historyBtn");
    buttonEl.dataset.city = searchHistory[i];
    buttonEl.textContent = searchHistory[i];
    historyEl.append(buttonDiv);
    buttonDiv.append(buttonEl);
  }
  historyBtn = document.querySelector(".historyBtn");
}

function handleAppendSingle(searchInput) {
  var buttonDiv = document.createElement("div");
  var buttonEl = document.createElement("button");
  buttonDiv.classList.add("d-grid", "mt-2");
  buttonEl.classList.add("btn", "btn-secondary", "historyBtn");
  buttonEl.dataset.city = searchInput;
  buttonEl.textContent = searchInput;

  if (searchHistory.length >= 10) {
    historyEl.prepend(buttonDiv);
    buttonDiv.prepend(buttonEl);
    // remove last search history
    historyEl.removeChild(historyEl.lastElementChild);
  } else {
    historyEl.append(buttonDiv);
    buttonDiv.append(buttonEl);
  }
}

function handleSearchHistoryClick(event) {
  // get hist button clicked
  var buttonClicked = event.target;
  var searchHistoryInput = buttonClicked.dataset.city;
  if (searchHistoryInput !== undefined) {
    getCoordinates(searchHistoryInput);
  }
}

function handleSearch() {
  // if searchbox is not empty
  var searchInput = document.querySelector("#search-input").value.trim();
  if (searchInput != "") {
    // get the city input
    getCoordinates(searchInput);
    // reset input text on search
    input.value = "";
  }
  // searchbox is empty
  else {
    alert("Enter a city");
  }
}

// get lat and long coordinates of city from this api call

function getCoordinates(searchInput) {
  var lat, lon;
  var coordinateUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    searchInput +
    "&US"
    "&appid=" +
    unlock;
  fetch(coordinateUrl)
    .then(function (response) {
      if (response.status == 404) {
        // tell user the city that they typed was not found
        //make this a modal
        alert("No city named " + searchInput + " found.");
        return;
      } else {
        return response.json();
      }
    })
    //  pull the lat and long, set them to variables
    .then(function (data) {
      lat = data.coord.lat;
      lon = data.coord.lon;
      cityName = data.name;
      // pass lat and lon for next api call
      getWeather(lat, lon);
      searchInput = capitalFormat(searchInput);
      // ADD TO SEARCH HISTORY
      // if the search is already in the search history, don't add it
      if (searchHistory.includes(searchInput)) {
      }
      // if city is not in the search history, push this search to the array
      else {
        if (searchHistory.length >= 8) {
          searchHistory.unshift(searchInput);
          searchHistory.pop();
        } else {
          searchHistory.push(searchInput);
        }
        // new function to add a single element so that the whole list array doesn't get rewritten to page
        handleAppendSingle(searchInput);
      }
      //write event array to local storage
      localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    });
}

function getWeather(lat, lon) {
  var weatherUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&units=imperial" +
    "&exclude=minutely" +
    "&appid=" +
    unlock;
  fetch(weatherUrl)
    .then(function (response) {
      if (response.status == 404) {
        alert("404 error, page not found, check your input.");
      } else {
        return response.json();
      }
    })

    // go into returned object with all the weather data
    .then(function (data) {
      weatherInfo = data;
      fillCurrentData();
    });
}

function fillCurrentData() {
  // CURRENT WEATHER
  var cityWrap = document.querySelector("#city-wrapper");
  var temp = document.querySelector("#temp");
  var feels = document.querySelector("#feels-like");
  var wind = document.querySelector("#wind");
  var humidity = document.querySelector("#humidity");
  var uvIndex = document.querySelector("#uv-index");
  var cityNameEl = document.querySelector(".city");
  var currentIconEl = document.querySelector("#current-icon");
  var currentIconCode = weatherInfo.current.weather[0].icon;
  var iconUrl =
    "https://openweathermap.org/img/wn/" + currentIconCode + "@2x.png";

  let currentDate = new Date();
  let cDay = currentDate.getDate();
  let cMonth = currentDate.getMonth() + 1;
  let cYear = currentDate.getFullYear();

  // show all weather elements
  cityWrap.classList.remove("invisible");
  // append city name to page
  cityNameEl.textContent = "In " + cityName;
  // create span to fill with current date
  var todayEl = document.createElement("span");
  // use the date function in JS to set current date and append to page
  todayEl.innerHTML = " (" + cMonth + "/" + cDay + "/" + cYear + ")";
  cityNameEl.appendChild(todayEl);
  currentIconEl.setAttribute("src", iconUrl);
  //TODO--add map? if time permitted
  // append current weather info to the page

  var tempData = weatherInfo.current.temp;

  // round temperature
  simpleTemp = Math.round(tempData);
  temp.textContent = simpleTemp + "\xB0 F";
  feels.textContent = Math.round(weatherInfo.current.feels_like) + "\xB0 F";
  wind.textContent = Math.round(weatherInfo.current.wind_speed) + " MPH";
  humidity.textContent = weatherInfo.current.humidity + " %";
  uvIndex.textContent = weatherInfo.current.uvi;
  if (weatherInfo.current.uvi < 2) {
    uvIndex.setAttribute("class", "btn-success btn-gradient text-white");
  } else if (weatherInfo.current.uvi > 2) {
    uvIndex.setAttribute("class", "bg-warning bg-gradient text-white");
  } else {
    uvIndex.setAttribute("class", "bg-danger bg-gradient text-white");
  }
  // go fill the 5 day forecast next
  fillForecastData();
}

function fillForecastData() {
  var forecastEL = document.querySelector(".forecast-wrapper");
  // if we have already completed the for loop once and flipped the toggle switch
  if (toggle == true) {
    // reset 5-day forecast so they don't append over prev query
    for (let i = 0; i < forecastEL.children.length; i++) {
      // target acquired
      //TODO refactor to use .children?
      var dateEl = document.querySelector(".date");
      var iconEl = document.querySelector(".icon");
      var tempEl = document.querySelector(".temp");
      var windEl = document.querySelector(".wind");
      var humidityEl = document.querySelector(".humidity");
      // delete, destroy, burn, remove
      dateEl.remove();
      iconEl.remove();
      tempEl.remove();
      windEl.remove();
      humidityEl.remove();
    }
  }
  for (let i = 0; i < forecastEL.children.length; i++) {
    // create the elements to be displayed
    var tempEl = document.createElement("div");
    var windEl = document.createElement("div");
    var humidityEl = document.createElement("div");
    var iconEl = document.createElement("div");
    var dateEl = document.createElement("div");
    var iconCode = weatherInfo.daily[i + 1].weather[0].icon;
    var unixDate = weatherInfo.daily[i + 1].dt;
    var iconUrl = "https://openweathermap.org/img/wn/" + iconCode + "@2x.png";

    // assign classes
    dateEl.setAttribute("class", "date fw-bold");
    iconEl.setAttribute("class", "icon");
    tempEl.setAttribute("class", "temp");
    windEl.setAttribute("class", "wind");
    humidityEl.setAttribute("class", "humidity");

    // assign values
    if (i == 0) {
      dateEl.innerText = "Tomorrow ";
    } else {
      dateEl.innerText = timeConverter(unixDate);
    }

    iconEl.innerHTML = "<img src=" + iconUrl + ">";
    tempEl.innerText =
      "Temp: " + Math.round(weatherInfo.daily[i + 1].temp.day) + "\xB0 F";
    windEl.innerText =
      "Wind: " + Math.round(weatherInfo.daily[i + 1].wind_speed) + " MPH";
    humidityEl.innerText =
      "Humidity: " + Math.round(weatherInfo.daily[i + 1].humidity) + " %";

    // append to page
    forecastEL.classList.remove("invisible");
    forecastEL.children[i].appendChild(dateEl);
    forecastEL.children[i].appendChild(iconEl);
    forecastEL.children[i].appendChild(tempEl);
    forecastEL.children[i].appendChild(windEl);
    forecastEL.children[i].appendChild(humidityEl);
    // toggle this switch to true which signals that the for loop has been run before
    toggle = true;
  }
}

// convert unix timestamp from API into other arbitrary human time
function timeConverter(UNIX_timestamp) {
  var a = new Date(UNIX_timestamp * 1000);
  var year = a.getFullYear();
  var month = a.getMonth() + 1;
  var date = a.getDate();
  var formattedDate = month + "/" + date + "/" + year;
  return formattedDate;
}

// Get current location from browser
function getCurrentLocation() {
  console.log("Requesting device location");
  navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
}

// grab coords from current location if given permission & location is available
function successCallback(position) {
  var lat = parseFloat(position.coords.latitude);
  var lon = parseFloat(position.coords.longitude);
  // make lat and long 4 decimals for the api to work
  lat = lat.toFixed(4);
  lon = lon.toFixed(4);
  // get city name based on current location
  useCurrentLocation(lat, lon);
}

// handle errors for get current location
function errorCallback(error) {
  var errorDiv = document.querySelector(".error");
  switch (error.code) {
    case error.PERMISSION_DENIED:
      errorDiv.innerHTML = "User denied the request for Geolocation.";
      break;
    case error.POSITION_UNAVAILABLE:
      errorDiv.innerHTML = "Location information is unavailable.";
      break;
    case error.TIMEOUT:
      errorDiv.innerHTML = "The request to get user location timed out.";
      break;
    case error.UNKNOWN_ERROR:
      errorDiv.innerHTML = "An unknown error occurred.";
      break;
  }
}

function useCurrentLocation(lat, lon) {
  apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?lat=" +
    lat +
    "&lon=" +
    lon +
    "&appid=" +
    unlock;

  // make api call
  fetch(apiUrl)
    .then(function (response) {
      if (response.status == 404) {
        // tell user the city that they typed was not found
        //TODO make this a modal
        alert("No city found.");
        return;
      } else {
        return response.json();
      }
    })
    // go into returned object and pull city name using lat and lon, set  to variable
    .then(function (data) {
      // get city name from this api call
      cityName = data.name;

      // pass lat and lon for next api call
      getWeather(lat, lon);
      // add current location to search history
      if (searchHistory.includes(cityName)) {
        // do nothing
      } else {
        if (searchHistory.length >= 10) {
          // add item to beginning of saved array
          searchHistory.unshift(cityName);
          // remove last item from array
          searchHistory.pop();
        } else {
          searchHistory.push(cityName);
        }
        handleAppendSingle(cityName);
      }
      localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    });
}

// click button or enter key in searchbox
input.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    searchBtn.click();
    input.value = "";
    // disable search button
    searchBtn.disabled = true;
  } else {
    if (input.value.trim() != "") searchBtn.disabled = false;
    else {
      searchBtn.disabled = true;
    }
  }
});
// Capitalize input
function capitalFormat(searchInput) {
  var cap = searchInput.split(" ");
  for (let i = 0; i < cap.length; i++) {
    cap[i] = cap[i][0].toUpperCase() + cap[i].substr(1);
  }
  return cap.join(" ");
}
// clear saved array

function handleClear() {
  searchHistory = [];
  // save to local storage
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  location.reload();
}

searchBtn.addEventListener("click", handleSearch);
clearBtn.addEventListener("click", handleClear);
locateBtn.addEventListener("click", getCurrentLocation);
historyEl.addEventListener("click", handleSearchHistoryClick);
