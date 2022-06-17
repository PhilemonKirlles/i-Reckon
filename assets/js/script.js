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
//form event function
var formSubmitHandler = function(event) {
    event.preventDefault();
  
    var userCity = citySearchEl.value.trim();
  
    if (userCity) {
      getLatLong(userCity);
      citySearchEl.value = "";
      alertEl.className = "alert"
      alertEl.classList.add("hide");
    }
    else {
      citySearchEl.value = "";
      alertEl.classList.remove("hide");
    }
  };
  //at moment
  var currentDate = moment().format("MM/DD/YYYY");
var dayIndex = 1
var cityHistory = [];

//Calling API by geographical coordinates- latitude and longitude

var getLatLong = function(userInput) {
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${userInput}&units=imperial&appid=d498050fd144f23d29ece9160220d384
    `
    fetch(apiUrl)
        .then(function(response) {
          if (response.ok) {
            response.json().then(function(data) {
              var cityName = data.name;
              dayIndex = 1;
              getForecast(data, cityName);
              searchHistory(cityName);
            })
          }
          else {
            alertEl.classList.remove("hide");
            return formSubmitHandler();
          }
        })
  }
  //Calling API by city ID
var getForecast = function(data, cityName) {
    resultsContainer.classList.remove("hide");
    var latEl = data.coord.lat
    var longEl = data.coord.lon
    var apiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${latEl}&lon=${longEl}&units=imperial&appid=d498050fd144f23d29ece9160220d384`
    fetch(apiUrl)
        .then(function(response) {
          if (response.ok) {
            response.json().then(function(data) {
              displayForecast(data, cityName)
            })
          }
        })
  }
  console.log()
  //API URL + API ID

// fetching the API
