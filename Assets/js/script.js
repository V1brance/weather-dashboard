var cityName = "Dallas";
var APIkey = "5fccaa40170b7ca4954d2b2590ea71f2";

// uses template literals with the ` grave marker to allow for customizing the url easily
var requestURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${APIkey}`;

//Requests city data via ajax (jquery)
$.ajax({
  url: requestURL,
  method: "GET",
}).then(function (response) {
  //Just testing with console.log for now
  console.log("Ajax Reponse \n-------------");
  console.log(response);
});
