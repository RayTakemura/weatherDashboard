// weather apikey : '95b9bfee3c4c33dbfa36d6592b554c5a'

//api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
//https://api.openweathermap.org/data/2.5/forecast?q=torrance&appid=95b9bfee3c4c33dbfa36d6592b554c5a
const FORECAST_DAYS = 5;

function displayToday(forecast){
    
}

/**
 * Converts temperature unit from Kelvin to Fahrenheit 
 * @param {*} tempK Temperature in Kelvin
 * @returns The given temperature in Kelvin
 */
function convertKelvinToF(tempK){
    var tempC = (tempK - 273.15); //convert Kelvin to Celcius
    var tempF = tempC * (9/5) + 32; //convert Celcius to Fahrenheit
    return tempF;
}

function checkConnection() { 
    var cityName = $('.search').val();
    var apiURL = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&appid=95b9bfee3c4c33dbfa36d6592b554c5a';
    $.ajax(apiURL)
        .done(function(){
            fetchWeatherData(apiURL);
        }).fail(function() {
            alert('Error')
        });
};

/**
 * Fetches data from the Open Weather Map API.
 * The data includes: date, weather, temperature in F, humidity, and wind speed.
 */
function fetchWeatherData(apiURL) {
    //object that stores all 5 days worth of weather data
    let forecast = {
        dateString: [] ,
        weatherIcon: [],
        temperatureF: [],
        humidity: [],
        windSpeed: []
    };

    //fetch the data from the OpenWeatherMap api and 
    fetch(apiURL)
        .then(function(response) {
            return response.json();
        })
        .then(function(response){
            for(var i = 0; i < FORECAST_DAYS; i++){
                forecast.dateString.push(moment.unix(response.list[0].dt).format("M/DD/YYYY")); //convert unix time to date string
                forecast.weatherIcon.push(response.list[0].weather[0].icon);
                forecast.temperatureF.push(convertKelvinToF(response.list[0].main.temp));
                forecast.humidity.push(response.list[0].main.humidity);
                forecast.windSpeed.push(response.list[0].wind.speed);
            }
            // displayToday(forecast);
            for(var i = 1; i < FORECAST_DAYS ; i++){
                console.log(forecast.dateString[i])
                console.log(forecast.weatherIcon[i])
                console.log(forecast.temperatureF[i])
                console.log(forecast.humidity[i])
                console.log(forecast.windSpeed[i])
            }
        });
};





// function buttonHander(event){
//     if (event.target.matches('.btn')){
//         fetchWeatherData(event);
//     }
// }

$('body').submit(function (event){
    event.preventDefault();
    checkConnection();
});

