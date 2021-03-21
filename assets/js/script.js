// weather apikey : '95b9bfee3c4c33dbfa36d6592b554c5a'

//api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
//https://api.openweathermap.org/data/2.5/forecast?q=torrance&appid=95b9bfee3c4c33dbfa36d6592b554c5a
const FORECAST_DAYS = 5;
// UV Scale
const UV_SCALE = [3, 6, 8, 11]


function displayFuture(forecast, index) {
    var $forecast = $('<h4>').text(forecast.dateString[index]);

    var icon = "http://openweathermap.org/img/w/" + forecast.weatherIcon[index] + ".png";
    var $iconEl = $('<img>').attr('src', icon).addClass('w-25 py-3');

    var $tempEl = $('<span>').text('Temp: ' + forecast.temperatureF[index] + '\u00B0F');

    var $humidityEl = $('<span>').text('Humidity:' + forecast.humidity[index] + '%').addClass('py-3');

    var $castCardBody = $('<div>')
        .addClass('rounded bg-primary text-white p-3 d-flex flex-column')
        .append($forecast)
        .append($iconEl)
        .append($tempEl)
        .append($humidityEl);
    var $castCard = $('<div>')
        .addClass('col-3')
        .append($castCardBody);

    $('.forecasts').append($castCard);
}

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
}

/**
 * 
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
    
    //create spans. Each spans are wrapped with row
    var $tempFEl = $('<span>').text('Temperature: ' + forecast.temperatureF[0] + '\u00B0F').addClass('font');
    var $tempRowEl = $('<div>')
        .addClass('row p-2')
        .append($tempFEl);

    var $humidityEl = $('<span>').text('Humidity: ' + forecast.humidity + '%');
    var $humidityRowEl = $('<div>')
        .addClass('row p-2')
        .append($humidityEl);

    var $windSpeedEl = $('<span>').text('Wind Speed: ' + forecast.windSpeed + " MPH");
    var $wspeedRowEl = $('<div>')
        .addClass('row p-2')
        .append($windSpeedEl);
    
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
    
    var $todayContainerEl = $('<div>').addClass('border rounded p-3 w-100 container')
    $todayContainerEl
        .append($titleRowEl)
        .append($tempRowEl)
        .append($humidityRowEl)
        .append($wspeedRowEl)
        .append($uvRow);
        
    $('.today').append($todayContainerEl);
    

}

/**
 * Converts temperature unit from Kelvin to Fahrenheit 
 * @param {*} tempK Temperature in Kelvin
 * @returns The given temperature in Kelvin
 */
function convertKelvinToF(tempK){
    var tempC = (tempK - 273.15); //convert Kelvin to Celcius
    var tempF = tempC * (9/5) + 32; //convert Celcius to Fahrenheit
    tempF = Math.round((tempF + Number.EPSILON) * 100) / 100;
    return tempF;
}

/**
 * Checks the connection to the api then passes the api URL to fetchWeatherData function
 */
function checkConnection() { 
    var cityName = $('.search').val();
    var apiURL = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&appid=95b9bfee3c4c33dbfa36d6592b554c5a';
    $.ajax(apiURL)
        .done(function(){
            fetchWeatherData(apiURL);
        }).fail(function() {
            alert('Error');
        });
};

/**
 * Fetches data from the Open Weather Map API. The URL is passed on from the checkConnection function
 * The data includes: date, weather, temperature in F, humidity, and wind speed.
 */
function fetchWeatherData(apiURL) {
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
            
            forecast.windSpeed = response.list[0].wind.speed;
            forecast.cityName = response.city.name;
            forecast.latitude = response.city.coord.lat;
            forecast.longitude = response.city.coord.lon;
            
            console.log(forecast.windSpeed);
            console.log(forecast.latitude);
            console.log(forecast.longitude);
            console.log(forecast.cityName);
            apiForUV = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + forecast.latitude + '&lon=' + forecast.longitude + '&appid=95b9bfee3c4c33dbfa36d6592b554c5a';
            return fetch(apiForUV);
        })
        .then(function(UVresponse){
            return UVresponse.json();
        })
        .then(function(UVresponse){
            forecast.uvi = UVresponse.current.uvi;
            console.log(forecast.uvi);
            displayToday(forecast);

            var $futureContainer = $('.future');
            var $h3RowEl = $('<div>').addClass('row');
            var $h3El = $('<h3>').text('4-Day Forecast:').addClass('p-2');
            $h3RowEl.append($h3El);
            $futureContainer.append($h3RowEl);
            var $forecastRow = $('<div>').addClass('row forecasts');
            $futureContainer.append($forecastRow);
            for (var i = 1; i < FORECAST_DAYS; i++){
                console.log(forecast.dateString[i]);
                displayFuture(forecast, i);
            }
        });
};

$('body').submit(function (event){
    event.preventDefault();
    checkConnection();
});

