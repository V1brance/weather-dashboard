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
  let dateArray = setDates();
  $(".forecast-card").each(function () {
    let dayData = forecastData.daily[index];
    let date = dateArray[index];
    this.querySelector(".date").textContent =
      date.substr(0, 2) + "/" + date.substr(2, 2) + "/" + date.substr(4, 4);
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
  populateList(savedArray, city);
}

function populateList(cityArray, city) {
  let cityList = $(".history-list");
  let cityItems = document.querySelectorAll(".city-element");
  if (cityItems.length !== 0) {
    for (let i = 0; i < cityItems.length; i++) {
      cityItems[i].remove();
    }
  }
  for (let i = 0; i < cityArray.length; i++) {
    newElement = $("<button></button>").text(cityArray[i]);
    newElement.attr(
      "class",
      "city-element list-group-item list-group-item-action"
    );
    if (cityArray[i] == city) {
      newElement.attr(
        "class",
        "city-element list-group-item list-group-item-action active"
      );
    }
    cityList.append(newElement);
  }

  $(".city-element").on("click", function (event) {
    event.preventDefault();
    selectedHistory = event.target;
    let newCityData = getCityData(selectedHistory.textContent);
    saveHistory(selectedHistory.textContent);
  });
}

function setDates() {
  let currentDate = moment();
  let dateArray = [];

  for (i = 0; i < 5; i++) {
    dateArray.push(currentDate.format("MMDDYYYY"));
    currentDate.add(1, "d");
  }
  return dateArray;
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

let storedData = JSON.parse(localStorage.getItem("savedCities"));
if (storedData === null) {
  cityData = getCityData("New York City");
  saveHistory("New York City");
} else {
  let lastSearch = storedData[0];
  console.log(lastSearch);
  cityData = getCityData(lastSearch);
  saveHistory(lastSearch);
}
