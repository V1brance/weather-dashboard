var APIkey = "5fccaa40170b7ca4954d2b2590ea71f2";
var cityData;

function getCityData(city) {
  let requestURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}&units=imperial`;
  $.ajax({
    url: requestURL,
    method: "GET",
  })
    .then(function (response) {
      console.log(response);
      return response;
    })
    .then(function (data) {
      updateCurrentForecast(city, data);
      getForecast(data.coord.lat, data.coord.lon);
    });
}

function getForecast(lat, lon) {
  let requestURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${APIkey}`;
  $.ajax({
    url: requestURL,
    method: "GET",
  })
    .then(function (respone) {
      console.log(respone);
      return respone;
    })
    .then(function (data) {
      //have to update current UVI with this call because info not included from other API
      $("#uv-color").text(data.current.uvi);
    });
}

//listens for submit click
$("#search-button").on("click", function (event) {
  event.preventDefault();
  let citySearched = $("#city-search").val();
  console.log(citySearched);
  if (citySearched !== "") {
    cityData = getCityData(citySearched);
  }
});

function updateCurrentForecast(city, cityData) {
  $("#cur-city").text(city);
  $("#cur-temp").text("Temp: " + cityData.main.temp);
  $("#cur-wind").text("Wind Speed: " + cityData.wind.speed + " mph");
  $("#cur-humidity").text("Humidity: " + cityData.main.humidity + "%");
}
