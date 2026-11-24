const apiKey = "0637731d8b3a8b9ecbe05fb16bc4a626";

async function getWeather() {

    const city = document.getElementById("cityInput").value.trim();

    if (!city) {
        alert("Please enter a city name");
        return;
    }

    try {

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city},IN&appid=${apiKey}&units=metric`
        );

        const data = await response.json();

        if (data.cod !== 200) {
            alert(data.message);
            return;
        }

        document.getElementById("city").innerText =
            data.name;

        document.getElementById("temp").innerText =
            Math.round(data.main.temp) + "°C";

        document.getElementById("description").innerText =
            data.weather[0].description;

        const weatherMain = data.weather[0].main;

        let icon = "🌤️";

        if(weatherMain === "Clouds") icon = "☁️";
        else if(weatherMain === "Rain") icon = "🌧️";
        else if(weatherMain === "Clear") icon = "☀️";
        else if(weatherMain === "Thunderstorm") icon = "⛈️";
        else if(weatherMain === "Snow") icon = "❄️";
        else if(weatherMain === "Mist") icon = "🌫️";

        document.getElementById("icon").innerText = icon;

        document.getElementById("humidity").innerText =
            data.main.humidity;

        document.getElementById("wind").innerText =
            data.wind.speed;
        
        document.getElementById("feelsLike").innerText =
            Math.round(data.main.feels_like) + "°C";

        document.getElementById("country").innerText =
            data.sys.country;    
    }

    catch (error) {
        console.log(error);
        alert("Something went wrong");
    }
}