// weather apikey : '95b9bfee3c4c33dbfa36d6592b554c5a'

//api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
//https://api.openweathermap.org/data/2.5/forecast?q=torrance&appid=95b9bfee3c4c33dbfa36d6592b554c5a

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
    var today = {
        dateString: '' ,
        weatherIcon: '',
        temperatureF: 25.00,
        humidity: 0,
        windSpeed: -1
    };

    
    fetch(apiURL)
        .then(function(response) {
            return response.json();
        })
        .then(function(response){
            today.dateString = moment.unix(response.list[0].dt).format("M/DD/YYYY"); //convert unix time to date string
            today.weatherIcon = response.list[0].weather[0].icon;
            today.temperatureF = convertKelvinToF(response.list[0].main.temp);
            today.humidity = response.list[0].main.humidity;
            today.windSpeed = response.list[0].wind.speed;
            console.log(today.dateString);
            console.log(today.weatherIcon);
            console.log(today.temperatureF);
            console.log(today.humidity);
            console.log(today.windSpeed);

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

