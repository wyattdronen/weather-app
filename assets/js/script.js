let searchHistory = []
let lastCitySearched = ""

// api call to openweathermap.org
let getCityWeather = function(city) {
    // format the OpenWeather api url
    let apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=ce39e7239416ad754359ca762d28521a&units=imperial";

    // make a request to the url
    fetch(apiUrl)
     .then(function(response) {
        if (response.ok) {
         response.json().then(function(data) {displayWeather(data);
    });
        } else 
        {alert("Error: " + response.statusText);}
    })  
        .catch(function(error) {
            alert("Unable to connect to OpenWeather");
        })
};



// function to handle city search form submit
let searchSubmitHandler = function(event) {
    // stop page from refreshing
    event.preventDefault();

    // get value from input element
    let cityName = $("#cityname").val().trim();

    // check if the search field has a value
    if(cityName) {
        // pass the value to getCityWeather function
        getCityWeather(cityName);

        // clear the search input
        $("#cityname").val("");
    } else {
        // if nothing was entered alert the user
        alert("Please enter a city name");
    }
};

// function to display the information collected from openweathermap.org
let displayWeather = function(weatherData) {

    // format and display the values
    $("#main-city-name").text(weatherData.name + " (" + dayjs(weatherData.dt * 1000).format("MM/DD/YYYY") + ") ").append(`<img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png"></img>`);
    $("#main-city-temp").text("Temperature: " + weatherData.main.temp.toFixed(1) + "°F");
    $("#main-city-humid").text("Humidity: " + weatherData.main.humidity + "%");
    $("#main-city-wind").text("Wind Speed: " + weatherData.wind.speed.toFixed(1) + " mph");


    // five-day api call
    fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + weatherData.name + "&appid=ce39e7239416ad754359ca762d28521a&units=imperial")
        .then(function(response) {
            response.json().then(function(data) {

                // clear any previous entries in the five-day forecast
                $("#five-day").empty();

                // get every 8th value (24hours) in the returned array from the api call
                for(i = 7; i <= data.list.length; i += 8){

                    // insert data into my day forecast card template
                    let fiveDayCard =`
                    <div class="col-md-2 m-2 py-3 card text-white bg-primary">
                        <div class="card-body p-1">
                            <h5 class="card-title">` + dayjs(data.list[i].dt * 1000).format("MM/DD/YYYY") + `</h5>
                            <img src="https://openweathermap.org/img/wn/` + data.list[i].weather[0].icon + `.png" alt="rain">
                            <p class="card-text">Temp: ` + data.list[i].main.temp + `</p>
                            <p class="card-text">Humidity: ` + data.list[i].main.humidity + `</p>
                        </div>
                    </div>
                    `;

                    // append the day to the five-day forecast
                    $("#five-day").append(fiveDayCard);
               }
            })
        });


    lastCitySearched = weatherData.name;

    saveSearchHistory(weatherData.name);
};

let saveSearchHistory = function (city) {
    if(!searchHistory.includes(city)){
        searchHistory.push(city);
        $("#search-history").append("<a href='#' class='list-group-item list-group-item-action' id='" + city + "'>" + city + "</a>")
} 
localStorage.setItem("weatherSearchHistory", JSON.stringify(searchHistory));
localStorage.setItem("lastCitySearched", JSON.stringify(lastCitySearched));
    loadSearchHistory();
};

// function to load saved city search history from local storage
let loadSearchHistory = function() {
    searchHistory = JSON.parse(localStorage.getItem("weatherSearchHistory"));
    lastCitySearched = JSON.parse(localStorage.getItem("lastCitySearched"));
  
    // if nothing in localStorage, create an empty searchHistory array and an empty lastCitySearched string
    if (!searchHistory) {
        searchHistory = []
    }

    if (!lastCitySearched) {
        lastCitySearched = ""
    }

    // clear any previous values from th search-history ul
    $("#search-history").empty();

    // for loop that will run through all the citys found in the array
    for(i = 0 ; i < searchHistory.length ;i++) {

        // add the city as a link, set it's id, and append it to the search-history ul
        $("#search-history").append("<a href='#' class='list-group-item list-group-item-action' id='" + searchHistory[i] + "'>" + searchHistory[i] + "</a>");
    }
  };

loadSearchHistory();

if (lastCitySearched != ""){
    getCityWeather(lastCitySearched);
}

$("#search-form").submit(searchSubmitHandler);
$("#search-history").on("click", function(event){
    let prevCity = $(event.target).closest("a").attr("id");
    getCityWeather(prevCity);
});