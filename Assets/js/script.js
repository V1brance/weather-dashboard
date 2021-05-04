var APIkey = "5fccaa40170b7ca4954d2b2590ea71f2";
var cityData;

function getCityData(city) {
  let requestURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}&units=imperial`;
  $.ajax({
    url: requestURL,
    method: "GET",
  })
    .then(function (response) {
      return response;
    })
    .then(function (data) {
      updateCurrentForecast(city, data);
      getForecast(data.coord.lat, data.coord.lon);
    });
}

function getForecast(lat, lon) {
  let requestURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${APIkey}&units=imperial`;
  $.ajax({
    url: requestURL,
    method: "GET",
  })
    .then(function (respone) {
      return respone;
    })
    .then(function (data) {
      updateFutureForecast(data);
    });
}

function updateCurrentForecast(city, cityData) {
  $("#cur-city").text(city);
  $("#cur-temp").text("Temp: " + cityData.main.temp + " F");
  $("#cur-wind").text("Wind Speed: " + cityData.wind.speed + " mph");
  $("#cur-humidity").text("Humidity: " + cityData.main.humidity + "%");
}

function updateFutureForecast(forecastData) {
  $("#uv-color").text(forecastData.current.uvi);
  let index = 0;
  $(".forecast-card").each(function () {
    let dayData = forecastData.daily[index];
    let imgCode = dayData.weather[0].icon;
    let dayIcon = `http://openweathermap.org/img/wn/${imgCode}@2x.png`;
    let dayTemp = dayData.temp.day;
    let dayWind = dayData.wind_speed;
    let dayHumidity = dayData.humidity;
    this.querySelector(".temp").textContent = "Temp: " + dayTemp + " F";
    this.querySelector(".wind").textContent = "Wind: " + dayWind + " mph";
    this.querySelector(".humidity").textContent =
      "Humidity: " + dayHumidity + "%";
    this.querySelector(".condition-image").setAttribute("src", dayIcon);
    index++;
  });
}

function saveHistory(city) {
  let savedArray = JSON.parse(localStorage.getItem("savedCities"));
  if (savedArray === null) {
    savedArray = [];
  }
  if (!savedArray.includes(city)) {
    savedArray.unshift(city);
  }
  if (savedArray.length == 6) {
    savedArray.pop();
  }
  localStorage.setItem("savedCities", JSON.stringify(savedArray));
  populateList(savedArray);
}

function populateList(cityArray) {
  let cityList = $(".history-list");
  let cityItems = document.querySelectorAll(".city-element");
  if (cityItems.length !== 0) {
    for (let i = 0; i < cityItems.length; i++) {
      console.log(cityItems[i]);
      cityItems[i].remove();
    }
  }
  for (let i = 0; i < cityArray.length; i++) {
    newElement = $("<li></li>").text(cityArray[i]);
    newElement.attr("class", "city-element");
    cityList.append(newElement);
  }
}

//listens for submit click
$("#search-button").on("click", function (event) {
  event.preventDefault();
  let citySearched = $("#city-search").val();
  if (citySearched !== "") {
    cityData = getCityData(citySearched);
    saveHistory(citySearched);
  }
});
