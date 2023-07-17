let searchHistory = []
let lastCitySearched = ""

// api call to openweathermap.org
let getCityWeather = function(city) {
    // format the OpenWeather api url
    let apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=ce39e7239416ad754359ca762d28521a&units=imperial";

    // make a request to the url
    fetch(apiUrl)
        
        .then(function(response) {
        // request was successful
            if (response.ok) {
                response.json().then(function(data) {
                    displayWeather(data);
                });
            // request fails
            } else {
                alert("Error: " + response.statusText);
            }
        })  

        // alert user if there is no responce from OpenWeather
        .catch(function(error) {
            alert("Unable to connect to OpenWeather");
        })
};