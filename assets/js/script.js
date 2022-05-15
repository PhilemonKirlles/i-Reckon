const timeEl = document.getElementById ("time");
const dateEl = document.getElementsById ("date");
const weatherNowEl = document.getElementsById("weather-now");
const timeZone=getElementById("time-zon");
const countryEl = document.getElementsById("country");
const weatherForecastEl = document.getElementsById("weather-forecast");
const currentTempEl = document.getElementById("current-temp");

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day =time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour %12: hour
    const minutes = time.getMinutes ();
}, 1000);


const API_KEY = d498050fd144f23d29ece9160220d384

api.openweathermap.org/data/2.5/onecall?lat=38.8&lon=12.09&callback=test