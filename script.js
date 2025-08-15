document.addEventListener('DOMContentLoaded', () => {
    const cityInput = document.getElementById("city-input");
    const getWeatherButton = document.getElementById("get-weather-btn");
    const weatherInfo = document.getElementById("weather-info");
    const cityNameDisplay = document.getElementById("city-name");
    const temperatureDisplay = document.getElementById("temperature");
    const descriptionDisplay = document.getElementById("description");
    const windDisplay = document.getElementById("wind");
    const errorMessage = document.getElementById("error-message");
    const body = document.body; // Get the body element to change its background

    const OPENWEATHER_API_KEY = "26d3392130f554b88a7b11d1bf9ff84b"; // Your OpenWeatherMap API Key
    const UNSPLASH_ACCESS_KEY = "3ip49qvmckRq0R9epStsBfFnZ3348k-YGtWKcbowENk"; /* UNSPLASH ACCESS KEY*/

    getWeatherButton.addEventListener('click', async () => {
        const city = cityInput.value.trim();
        if (city === "") return;

        try {
            const weatherData = await fetchWeatherData(city);
            displayWeatherData(weatherData);
            await setDynamicBackground(city, weatherData.weather[0].main); // Call function to set background
        } catch (error) {
            console.error("Error:", error);
            showError();
            body.style.backgroundImage = 'none'; // Clear background on error
            body.style.backgroundColor = '#121212'; // Reset to default background color
        }
    });

    async function fetchWeatherData(city) {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${OPENWEATHER_API_KEY}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("City not found");
        }
        const data = await response.json();
        return data;
    }

    function displayWeatherData(data) {
        const { name, main, weather, wind } = data;
        cityNameDisplay.textContent = name;
        temperatureDisplay.textContent = `Temperature: ${main.temp}°C`;
        descriptionDisplay.textContent = `Weather: ${weather[0].description}`;
        windDisplay.textContent = `Wind: ${wind.speed} m/s`;

        weatherInfo.classList.remove("hidden");
        errorMessage.classList.add("hidden");
    }

    async function setDynamicBackground(city, weatherCondition) {
        let query = `${city} ${weatherCondition} famous place`; // Example query
        
        // Refine weather conditions for better image search
        let simplifiedWeather = weatherCondition.toLowerCase();
        if (simplifiedWeather.includes("clear") || simplifiedWeather.includes("sunny")) {
            query = `${city} sunny sky`;
        } else if (simplifiedWeather.includes("cloud") || simplifiedWeather.includes("overcast")) {
            query = `${city} cloudy sky`;
        } else if (simplifiedWeather.includes("rain") || simplifiedWeather.includes("drizzle")) {
            query = `${city} rainy street`;
        } else if (simplifiedWeather.includes("snow")) {
            query = `${city} snowy landscape`;
        } else if (simplifiedWeather.includes("thunderstorm")) {
            query = `${city} lightning storm`;
        } else if (simplifiedWeather.includes("mist") || simplifiedWeather.includes("fog") || simplifiedWeather.includes("haze")) {
            query = `${city} misty morning`;
        } else {
            query = `${city} landscape`; // Default fallback
        }


        const unsplashUrl = `https://api.unsplash.com/search/photos?query=${query}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=1`;

        try {
            const response = await fetch(unsplashUrl);
            if (!response.ok) {
                throw new Error("Could not fetch background image from Unsplash");
            }
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                const imageUrl = data.results[0].urls.regular;
                body.style.backgroundImage = `url('${imageUrl}')`;
                body.style.backgroundSize = 'cover';
                body.style.backgroundPosition = 'center';
                body.style.backgroundRepeat = 'no-repeat';
                body.style.transition = 'background-image 1s ease-in-out'; // Smooth transition
            } else {
                // Fallback if no images found for the specific query
                console.warn("No specific images found for the query. Trying a more general city search.");
                const generalCityQuery = `${city} cityscape`;
                const generalUnsplashUrl = `https://api.unsplash.com/search/photos?query=${generalCityQuery}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=1`;
                const generalResponse = await fetch(generalUnsplashUrl);
                const generalData = await generalResponse.json();
                if (generalData.results && generalData.results.length > 0) {
                     const imageUrl = generalData.results[0].urls.regular;
                     body.style.backgroundImage = `url('${imageUrl}')`;
                     body.style.backgroundSize = 'cover';
                     body.style.backgroundPosition = 'center';
                     body.style.backgroundRepeat = 'no-repeat';
                     body.style.transition = 'background-image 1s ease-in-out';
                } else {
                    console.warn("No images found for the city. Using default background.");
                    body.style.backgroundImage = 'none'; // Clear background
                    body.style.backgroundColor = '#121212'; // Reset to default background color
                }
            }
        } catch (error) {
            console.error("Error setting dynamic background:", error);
            body.style.backgroundImage = 'none'; // Clear background on error
            body.style.backgroundColor = '#121212'; // Reset to default background color
        }
    }

    function showError() {
        errorMessage.classList.remove('hidden');
        weatherInfo.classList.add('hidden');
        body.style.backgroundImage = 'none'; // Clear background on error
        body.style.backgroundColor = '#121212'; // Reset to default background color
    }

});

