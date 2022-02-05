var cityContainerEl = document.querySelector("#cities-container");
var apiKey = "cc2b66d36c81d504c773f0a3f2ccc4d6";
var lat, lon;


//create a function that gets a city and searches for it
var getCityNames = function(event) {
    //preventdefault to stop reloading the page
    event.preventDefault();
    //use searchCity to get value and log it
    var searchCity = document.querySelector("#cityName").value;

    //add the weather api for searching a city
    var apiUrl = (`https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${apiKey}`)

    //make a get request to url
    fetch(apiUrl)
    .then(function(response){
        //request was successful
        if (response.ok) {
            console.log(response);
            response.json().then(function(data) {
                console.log(data);
            
                getWeatherByCoord(data.coord.lat, data.coord.lon,)
            });
        } else {
            alert("Error: " + response.statusText);
        }
    })
    .catch(function(error) {
        alert("Unable to connect to Openweather")
    });
};


//create a function to get the weather by its coordinates
function getWeatherByCoord(latitude, longitude) {
    //fetch the api using latitude and longitude
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`)
    .then(function(response) {
        return response.json()
    }).then(function(data) {
        //console log to get the current temperature data
        console.log(data.current.temp)
    })
}

//create a function to indicate if a city name was put into the search.
var displayCities = function(cities, searchTerm) {
    // check if api returned any cities
    if (cities.length === 0) {
        cityContainerEl.textContent = "No cities found.";
        return;
    }
    
    citySearchTerm.textContent = searchTerm;
    
    // created button element
    var btn = document.createElement("button");
    // set text content to the button with search term
    btn.textContent = searchTerm;
    // created list element by creating element list item
    var listEl = document.createElement("li");
    // bundle everything together. appended the btn to the list element
    listEl.appendChild(btn);
    // added list element which contains the button to the existing ul which is city-list
    document.getElementById(cityList).appendChild(listEl);
}


document.querySelector("#searchBtn").addEventListener("click", getCityNames)

//retrieve all the info and create cotainers, then put it on the page, then save to local storage
