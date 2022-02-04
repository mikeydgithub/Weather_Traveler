var cityContainerEl = document.querySelector("#cities-container");



var getCityNames = function() {
    //format the api url
    var apiUrl = ("http://api.openweathermap.org/data/2.5/forecast?id=524901&appid=cc2b66d36c81d504c773f0a3f2ccc4d6")
    console.log("function was called")

    //make a getr request to url
    fetch(apiUrl)
    .then(function(response){
        //request was successful
        if (response.ok) {
            console.log(response);
            response.json().then(function(data) {
                console.log(data);
                displayCities(data, user);
            });
        } else {
            alert("Error: " + response.statusText);
        }
    })
    .catch(function(error) {
        alert("Unable to connect to Openweather")
    });
};

var displayCities = function(cities, searchTerm) {
    // check if api returned any cities
    if (cities.length === 0) {
        cityContainerEl.textContent = "No cities found.";
        return;
    }
    
    citySearchTerm.textContent = searchTerm;
}

getCityNames();