var cityContainerEl = document.querySelector("#cities-container");
var weatherList = document.querySelector("#weatherList");
var currentWeather = document.querySelector("#current-weather");
var forecast = document.querySelector("#forecast");

var apiKey = "cc2b66d36c81d504c773f0a3f2ccc4d6";
var lat, lon;

const DIRECTION = {
    N: {
        MIN: 348.75,
        MAX: 11.25
    },
    NNE: {
        MIN: 11.25,
        MAX: 33.75
    },
    NE: {
        MIN: 33.75,
        MAX: 56.25
    },
    ENE: {
        MIN: 56.25,
        MAX: 78.75
    },
    E: {
        MIN: 78.75,
        MAX: 101.25
    },
    ESE: {
        MIN: 101.25,
        MAX: 123.75
    },
    SE: {
        MIN: 123.75,
        MAX: 146.25
    },
    SSE: {
        MIN: 146.25,
        MAX: 168.75
    },
    S: {
        MIN: 168.75,
        MAX: 191.25
    },
    SSW: {
        MIN: 191.25,
        MAX: 213.75
    },
    SW: {
        MIN: 213.75,
        MAX: 236.25
    },
    WSW: {
        MIN: 236.25,
        MAX: 258.75
    },
    W: {
        MIN: 258.75,
        MAX: 281.25
    },
    WNW:{
        MIN:281.25,
        MAX: 303.75
    },
    NW:{
        MIN:303.75,
        MAX:326.25
    },
    NNW:{
        MIN:326.25, 
        MAX:348.75
    }
}


//create a function that gets a city and searches for it
var getCityWeather = function(event) {
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
            //parse as json
            response.json().then(function(data) {
                console.log(data);
                //Load weather for search results
                getWeatherByCoord(data.coord.lat, data.coord.lon).then(
                    //Update results
                    weather => upsertWeather(data, weather)
                );
                
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
    return fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`)
    .then(function(response) {
        return response.json()
    })
    .then(function(data) {
        //console log to get the current temperature data
        console.log(data);
        return data;
    });
}

//Select weather item
function selectWeather(item){

    //Get list items
    var listItems = weatherList.querySelectorAll("li");

    //Set active/load selected item
    var defaultItemClass = item.getAttribute("data-default") ?? "bg-secondary";
    setActive(item, true, defaultItemClass);

    //De-select other items 
    listItems.forEach(weatherItem => {    
        if(weatherItem != item){
            setActive(weatherItem, false, defaultItemClass);
        }
    });

    var weather = JSON.parse(localStorage.getItem(item.id.replace("li-", "")));

    //Load weather read-out
    //Set current weath display
    currentWeather.innerHTML = '';
    var currentCard = weatherCard(weather, true); 
    currentWeather.appendChild(currentCard);

    //Set 5-day forecast cards
    forecast.innerHTML = innerHTML = '';
    for(var i = 1; i < 6; i++){
        forecast.appendChild(new weatherCard(weather.daily[i]));
    }
}

//Add or update weather for search result
var upsertWeather = function(searchResult, weather) {

    //Check storage for existing weather
    var storedWeather = localStorage.getItem(searchResult.name);
    var item;

    //Add list-item/button for new results
    if(!storedWeather) {
        //Create list-item/button
        item = weatherItem(searchResult.name);

        //Add list element
        weatherList.appendChild(item);
    } else {
        //Use existing item
        item = weatherList.querySelector(`[id="li-${searchResult.name}"`);
    }

    //Save weather to localStorage
    localStorage.setItem(searchResult.name, JSON.stringify(weather));

    //Set current selection
    selectWeather(item);
}

//Create weather list-item/button template
function weatherItem(id){
    var itemHtml = `<li id="li-${id}"class="btn list-group-item" data-default="bg-secondary" onclick="selectWeather(this);">${id}</li>`;
    return createElementFromHTML(itemHtml);
}

//Create weather card template
function weatherCard(weather, isCurrent = false){
    var weatherDescription = isCurrent ? weather.current.weather[0] : weather.weather[0];
    var imgSrc = `http://openweathermap.org/img/wn/${weatherDescription.icon}@2x.png`;

    var date = isCurrent ? weather.current.dt : weather.dt;
    var windSpeed = isCurrent ? weather.current.wind_speed : weather.wind_speed;
    var windDirection = isCurrent ? weather.current.wind_deg : weather.wind_deg;
    var humidity = isCurrent? weather.current.humidity : weather.humidity;

    var cardHtml =  
    `<div class="card"> <span class="icon"><img class="img-fluid" src="${imgSrc}" /></span>
        <div class="title">
            <p>${utcDate(date)}</p>
        </div>
        <div class="temp">${isCurrent ? weather.current.temp : `[${weather.temp.min},${weather.temp.max}]`}<sup>&deg;</sup></div>
        <div class="row">
            <div class="col-4">
                <div class="header">Detail</div>
                <div class="value">${weatherDescription.description}</div>
            </div>
            <div class="col-4">
                <div class="header">Wind</div>
                <div class="value">${windSpeed} Mph (${getDirection(windDirection)})</div>
            </div>
            <div class="col-4">
                <div class="header">Humidity</div>
                <div class="value">${humidity}%</div>
            </div>
        </div>
    </div>`;
    return createElementFromHTML(cardHtml);
}

//Create element from html string
function createElementFromHTML(elementHtml) {
    var template = document.createElement('template');
    elementHtml = elementHtml.trim();
    template.innerHTML = elementHtml;
    return template.content.firstChild;
}

//Set css classes for state
function setActive(item, active, defaultClass){
    if(active){
        item.classList.remove(defaultClass);
        item.classList.add("active");
    }
    else{
        item.classList.remove("active");
        item.classList.add(defaultClass);
    }
}

//Get item with provided key from localStorage
//Null returned as empty collection when using 'asArray'
function storageItem(key, asArray = false){
    var item = localStorage.getItem(key);
    return asArray ? item ?? [] : item;
}

//Convert degrees(0-360) into meteorlogical direction
function getDirection(degrees){
    var dir;

    for (var [direction, range] of Object.entries(DIRECTION)) {
        if(degrees < DIRECTION.N.MAX || degrees >= DIRECTION.N.MIN)
        {
            dir = "N";
            break;
        } else if (degrees >= range.MIN && degrees < range.MAX)
        {
            dir = direction;
            break;
        }    
    }
    return dir;    
}

//Convert utc ticks to local date
function utcDate(ticks){
    return utcTimeStamp(ticks).toLocaleDateString();
}

//Convert utc ticks to timestamp
function utcTimeStamp(ticks){
    return new Date(ticks * 1000);
}

document.querySelector("#searchBtn").addEventListener("click", getCityWeather)

//retrieve all the info and create cotainers, then put it on the page, then save to local storage
