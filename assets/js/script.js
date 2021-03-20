// weather apikey : '95b9bfee3c4c33dbfa36d6592b554c5a'

//api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
//https://api.openweathermap.org/data/2.5/weather?q=torrance&appid=95b9bfee3c4c33dbfa36d6592b554c5a

/**
 * Fetches data from the Open Weather Map API.
 */
function fetchWeatherData() {
    var cityName = $('.search').val();
    var dateString;
    var weatherIcon;
    var temperatureF ;
    var humidity;
    var windSpeed = -1;

    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=95b9bfee3c4c33dbfa36d6592b554c5a')
    .then(function(response) {
        if(response.ok){
            return response.json();
        }
        alert('invalid city name!');
        break;
    })
    .then(function(response){
        console.log(response);
        dateString = moment.unix(response.dt).format("M/DD/YYYY");
        weatherIcon = response.weather[0].icon;
        temperatureF = response.main.temp;
        humidity = response.main.humidity;
        windSpeed = response.wind.speed;
        console.log(dateString);
        console.log(weatherIcon);
        console.log(temperatureF);
        console.log(humidity);
        console.log(windSpeed);

    });
}

//function()

// function buttonHander(event){
    
//     if (event.target.matches('.btn')){
//         fetchWeatherData(event);
//     }
// }

$('body').submit(function (event){
    event.preventDefault();
    fetchWeatherData();
});

