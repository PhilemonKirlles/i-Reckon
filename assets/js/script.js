//openweathermap.org/ and create an account and get your API KEY


// Declaring the variables
var searchBtn = document.querySelector("#search-btn");
var resultsContainer = document.querySelector("#results-container");
var citySearchEl = document.querySelector("#city-search");
var infoContainerEl = document.querySelector("#info-container");
var forecastRowEl = document.querySelector("#forecast-row");
var alertEl = document.querySelector("#alert");
var historyContainer = document.querySelector("#search-history");
var cityHistoryBtn = document.querySelector("#search-history");

//at moment
var currentDate = moment().format("MM/DD/YYYY");
var dayIndex = 1;
var cityHistory = [];

//form event function
var formSubmitHandler = function (event) {
  event.preventDefault();

  var userCity = citySearchEl.value.trim();

  if (userCity) {
    getLatLong(userCity);
    citySearchEl.value = "";
    alertEl.className = "alert";
    alertEl.classList.add("hide");
  } else {
    citySearchEl.value = "";
    alertEl.classList.remove("hide");
  }
};


//Calling API by geographical coordinates- latitude and longitude

var getLatLong = function (userInput) {
  var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&units=imperial&appid=1dbaf12658a24f647c152b2cc45339bb`;
  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        var cityName = data.name;
        dayIndex = 1;
        getForecast(data, cityName);
        searchHistory(cityName);
      });
    } else {
      alertEl.classList.remove("hide");
      return formSubmitHandler();
    }
  });
}
//Calling API by city ID
var getForecast = function (data, cityName) {
  resultsContainer.classList.remove("hide");
  var latEl = data.coord.lat;
  var longEl = data.coord.lon;
  var apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latEl}&lon=${longEl}&exclude=hourly,minutely&appid=1dbaf12658a24f647c152b2cc45339bb`;
  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        displayForecast(data, cityName);
      })
    }
  })
}
//API URL + API ID

// fetching the API
var searchHistory = function (cityName) {
  var getHistoryStorage = JSON.parse(localStorage.getItem("City History"));
  var historyBtn = document.createElement("button");
 
  if (getHistoryStorage === null) {
    cityHistory.push(cityName);
    historyBtn.textContent = cityName;
    historyBtn.classList.add("w-100");
    historyBtn.classList.add("recall-btn");
    historyBtn.setAttribute("id", "search-history");
    historyContainer.appendChild(historyBtn);
    localStorage.setItem("City History", JSON.stringify(cityHistory));
  } else {
    cityHistory = getHistoryStorage;
    
    if (cityHistory.includes(cityName)) {
      return null;
    } else {
      historyBtn.textContent = cityName;
      historyBtn.classList.add("w-100");
      historyBtn.classList.add("recall-btn");
      historyBtn.setAttribute("id", "search-history");
      historyContainer.appendChild(historyBtn);
      cityHistory.push(cityName);
      localStorage.setItem("City History", JSON.stringify(cityHistory));
    }
  }
};

var getSearchHistory = function () {
  var getHistoryStorage = JSON.parse(localStorage.getItem("City History"));
  if (getHistoryStorage === null) {
    return;
  } else {
    cityHistory = getHistoryStorage;
    for (var i = 0; i < cityHistory.length; i++) {
      var historyBtn = document.createElement("button");
      historyBtn.textContent = cityHistory[i];
      historyBtn.classList.add("w-100");
      historyBtn.classList.add("recall-btn");
      historyBtn.setAttribute("id", "search-history");
      historyContainer.appendChild(historyBtn);
    }
  }
};

var recallHistory = function (event) {
  var cityHistoryText = event.target.textContent;
  dayIndex = 1;
  getLatLong(cityHistoryText);
};

var displayForecast = function (weatherData, cityName) {
  var cityNameEl = document.querySelector("#city-name");
  var tempEl = document.querySelector("#temp");
  var windEl = document.querySelector("#wind");
  var humidityEL = document.querySelector("#humidity");
  var uvEl = document.querySelector("#uv-index");
  var iconImg = document.querySelector("#icon-img");
  if (weatherData.status === "city not found") {
    console.log("Nothing");
  } else {
    iconImg.src = `http://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}.png`;
    cityNameEl.textContent = `${cityName} (${currentDate})`;
    tempEl.textContent = weatherData.current.temp;
    windEl.textContent = weatherData.current.wind_speed;
    humidityEL.textContent = weatherData.current.humidity;
    uvEl.textContent = weatherData.current.uvi;
    var uvIndex = weatherData.current.uvi;
    if (uvIndex <= 2) {
      uvEl.className = "low";
    } else if (3 <= uvIndex <= 7) {
      uvEl.className = "mid";
    } else if (uvIndex >= 8) {
      uvEl.className = "high";
    }
    var i = 0;
    $(".forecast-box").each(function () {
      var futureDay = moment().add(dayIndex, "days").format("MM/DD/YYYY");
      var futureDate = $(this).find("span")[0];
      var futureTemp = $(this).find("span")[1];
      var futureWind = $(this).find("span")[2];
      var futureHumidity = $(this).find("span")[3];
      var futureIcon = $(this).find("img")[0];
      futureDate.textContent = futureDay;
      futureIcon.src = `http://openweathermap.org/img/wn/${weatherData.daily[i].weather[0].icon}.png`;
      futureTemp.textContent = weatherData.daily[i].temp.day;
      futureWind.textContent = weatherData.daily[i].wind_speed;
      futureHumidity.textContent = weatherData.daily[i].humidity;
      i++;
      dayIndex++;
    });
  }
};

getSearchHistory();
searchBtn.addEventListener("click", formSubmitHandler);
cityHistoryBtn.addEventListener("click", recallHistory);
