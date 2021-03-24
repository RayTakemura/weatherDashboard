//https://api.openweathermap.org/data/2.5/forecast?q=torrance&appid=95b9bfee3c4c33dbfa36d6592b554c5a

/**
 * @author Ray Takemura
 * @date 3/20/2021
 * @assignment Challenge 06 Weather Dashboard
 */

// Global variables:
// Number of days that is going to be forecasted to the UI
const FORECAST_DAYS = 5;
// UV Scale: 0-2 is low, 3-5 is moderate, 6-7 is high, 8-10 is very high, and 11+ is extreme.
const UV_SCALE = [3, 6, 8, 11];
// A variable that is used to check if any DOM elements needs to be deleted before projecting a new forecast
var projecting = false;
// The search history.
var weatherHistory = {
    cityNames: []
};


/**
 * Display future forecast in a card.
 * @param {forecast} forecast Holds all the required weather data to present to the user.
 * @param {number} index The number of index of each array 
 */
function displayFuture(forecast, index) {
    // Create elements that goes into a card
    var $date = $('<h4>').text(forecast.dateString[index]);

    var icon = "http://openweathermap.org/img/w/" + forecast.weatherIcon[index] + ".png";
    var $iconEl = $('<img>').attr('src', icon).addClass('w-25 py-3');

    var $tempEl = $('<span>').text('Temp: ' + forecast.temperatureF[index] + '\u00B0F');

    var $humidityEl = $('<span>').text('Humidity:' + forecast.humidity[index] + '%').addClass('py-3');

    // Create wrapper that holds the card data and shape.
    var $castCardBody = $('<div>')
        .addClass('rounded bg-primary text-white p-3 d-flex flex-column')
        .append($date)
        .append($iconEl)
        .append($tempEl)
        .append($humidityEl);

    // Column wrapper that margins the card from the other cards
    var $castCard = $('<div>')
        .addClass('col-3')
        .append($castCardBody);

    $('.forecasts').append($castCard);
};

/**
 * Checks how strong the UV is and gives a color according to its severity
 * @param {number} uvIndex A value that shows how strong the UV radiation is
 * @returns String of color of how strong the UV radiation is
 */
function checkUVSeverity(uvIndex){
    if(uvIndex < UV_SCALE[0]){
        return 'green';
    } else if (uvIndex < UV_SCALE[1]) {
        return 'yellow';
    } else if (uvIndex < UV_SCALE[2]) {
        return 'orange';
    } else if (uvIndex < UV_SCALE[3]){
        return 'red';
    } else {
        return 'purple';
    }
};

/**
 * Display today's forecast to the UI
 * @param {forecast} forecast Forecast object that contains all information about the days
 */
function displayToday(forecast){
    //create h2 that is wrapped with a row
    var $h2El = $('<h2>')
        .text(forecast.cityName + " (" + forecast.dateString[0] + ") ");
    var icon = "http://openweathermap.org/img/w/" + forecast.weatherIcon[0] + ".png";
    var $iconEl = $('<img>').attr('src', icon);
    $h2El.append($iconEl);
    var $titleRowEl = $('<div>')
        .addClass('row p-2')
        .append($h2El);
    
    //create spans that holds text of weather data to present to the UI. Each spans are wrapped with row
    var $tempFEl = $('<span>').text('Temperature: ' + forecast.temperatureF[0] + '\u00B0F').addClass('font');
    var $tempRowEl = $('<div>')
        .addClass('row p-2')
        .append($tempFEl);

    var $humidityEl = $('<span>').text('Humidity: ' + forecast.humidity[0] + '%');
    var $humidityRowEl = $('<div>')
        .addClass('row p-2')
        .append($humidityEl);

    var $windSpeedEl = $('<span>').text('Wind Speed: ' + forecast.windSpeed + " MPH");
    var $wspeedRowEl = $('<div>')
        .addClass('row p-2')
        .append($windSpeedEl);
    
    //Create UV index with background color to indicate severity of UV radiation
    var uvSeverity = checkUVSeverity(forecast.uvi);
    var $uvEl = $('<span>').text('UV Index: ')
    var $uvValEl = $('<span>').text(forecast.uvi);
    if (uvSeverity === 'yellow' ){
        $uvValEl
            .addClass(uvSeverity + ' p-1 rounded');
    } else {
        $uvValEl
            .addClass( uvSeverity + ' p-1 rounded text-light');
    }
    $uvEl.append($uvValEl);
    var $uvRow = $('<div>')
        .addClass('row p-2')
        .append($uvEl);
    
    // append everything above to a container so that they stay in a row
    var $todayContainerEl = $('<div>').addClass('border rounded p-3 w-100 container removable')
    $todayContainerEl
        .append($titleRowEl)
        .append($tempRowEl)
        .append($humidityRowEl)
        .append($wspeedRowEl)
        .append($uvRow);
        
    // append the container above to the existing div element in main section
    $('.today').append($todayContainerEl);
};

/**
 * Converts temperature unit from Kelvin to Fahrenheit 
 * @param {number} tempK Temperature in Kelvin
 * @returns The given temperature in Kelvin
 */
function convertKelvinToF(tempK){
    var tempC = (tempK - 273.15); //convert Kelvin to Celcius
    var tempF = tempC * (9/5) + 32; //convert Celcius to Fahrenheit
    tempF = Math.round((tempF + Number.EPSILON) * 100) / 100;
    return tempF;
};

/**
 * Checks the connection to the api then passes the api URL to fetchWeatherData function
 * @param {String} cityName The name of city that is going to searched
 */
function checkConnection(cityName) { 
    var apiURL = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&appid=95b9bfee3c4c33dbfa36d6592b554c5a';
    
    $.ajax(apiURL)
        .done(function(){
            fetchWeatherData(apiURL);
            projecting = true;
        }).fail(function() {
            alert('Error');
        });
};

/**
 * Displays the search history on the UI below the search bar.
 * Every time something is searched, the previous history is removed and the newest version is displayed.
 */
function displaySearchHistory() {
    $('.w-history').remove();

    weatherHistory = JSON.parse(localStorage.getItem('searchHistoryRT'));

    console.log(weatherHistory);
    $historyContainer = $('<div>').addClass('d-flex flex-column border rounded w-history')

    if(!weatherHistory){
        return;
    }
    for (var i = weatherHistory.cityNames.length - 1; i >= 0; i--){
        var $cityName = $('<span>')
            .addClass('px-5 mx-auto')
            .text(weatherHistory.cityNames[i]);
        var $border = $('<div>')
            .addClass('py-3 border-bottom city-name')
            .append($cityName);
        $historyContainer.append($border);
    }
    $('.search-history').append($historyContainer);
};


/**
 * Save the searched city's name into the global array and up to the local storage.
 * @param {string} cityName The name of the city searched
 */
function saveSearch(cityName) {
    if (!weatherHistory){
        weatherHistory = {
            cityNames: []
        }
    }
    if (!weatherHistory.cityNames.includes(cityName)){
        weatherHistory.cityNames.push(cityName);
        localStorage.setItem('searchHistoryRT', JSON.stringify(weatherHistory));
    }
};


/**
 * Fetches data from the Open Weather Map API. The URL is passed on from the checkConnection function
 * The data includes: date, weather, temperature in F, humidity, and wind speed.
 */
function fetchWeatherData(apiURL) {

    //check if anything is being projected currently, and if it is, delete them.
    if(projecting){
        $('.removable').remove();
    }

    //object that stores all 5 days worth of weather data
    let forecast = {
        dateString: [] ,
        weatherIcon: [],
        temperatureF: [],
        humidity: [],
        windSpeed: -1,
        latitude: -1,
        longitude: -1,
        uvi: -1,
        cityName: ""
    };

    //fetch the data from the OpenWeatherMap api and display all data as DOM
    fetch(apiURL)
        .then(function(response) {
            return response.json();
        })
        .then(function(response){
            // This api returns 5 days worth of forecast with 3 hour intervals. 
            // Each day includes 8 intervals
            for (var i = 0; i < (FORECAST_DAYS * 8); i = (i + 8)){
                forecast.dateString.push(moment.unix(response.list[i].dt).format("M/DD/YYYY")); //convert unix time to date string
                forecast.weatherIcon.push(response.list[i].weather[0].icon);
                forecast.temperatureF.push( convertKelvinToF(response.list[i].main.temp) );
                forecast.humidity.push(response.list[i].main.humidity);
            }
            
            // obtain data that's used for other purposes
            forecast.windSpeed = response.list[0].wind.speed;
            forecast.cityName = response.city.name;
            forecast.latitude = response.city.coord.lat;
            forecast.longitude = response.city.coord.lon;

            // store searched city name to the history array and update local storage
            saveSearch(forecast.cityName);
            
            // display search history
            displaySearchHistory();
            
            // fetch through a different URL for today's UV index
            apiForUV = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + forecast.latitude + '&lon=' + forecast.longitude + '&appid=95b9bfee3c4c33dbfa36d6592b554c5a';
            return fetch(apiForUV);
        })
        .then(function(UVresponse){
            return UVresponse.json();
        })
        .then(function(UVresponse){
            // obtain UV index and display today's weather
            forecast.uvi = UVresponse.current.uvi;
            displayToday(forecast);

            // Create title '4-Day forecast' 
            var $futureContainer = $('.future');
            var $h3RowEl = $('<div>').addClass('row removable');
            var $h3El = $('<h3>')
                .text('4-Day Forecast:')
                .addClass('p-2');
            $h3RowEl.append($h3El);
            $futureContainer.append($h3RowEl);

            // Create an element that holds all the cards together in one row.
            var $forecastRow = $('<div>').addClass('row forecasts removable');
            $futureContainer.append($forecastRow);
            for (var i = 1; i < FORECAST_DAYS; i++){ //display future forecasts
                displayFuture(forecast, i);
            }
        });
};

$('body').submit(function (event){
    event.preventDefault();
    var cityName = $('.search').val();
    checkConnection(cityName);
});

// button click listener
// search the array by using the id of button pressed
// pass the array info and run 
$('aside').on('click', '.city-name', function (){
    var cityName = $(this).children().text();
    checkConnection(cityName)
});

displaySearchHistory();