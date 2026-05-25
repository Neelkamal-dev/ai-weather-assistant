async function getWeather(location) {

  try {

    const weatherInfo = [];

    for (let { city, date } of location) {
      
      if (!city.toLowerCase().includes('india')) {
      city = `${city}, India`;
      }

      let url = '';

      if (date.toLowerCase() === 'today') {

        url =
        `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${city}`;

      } else {

        url =
        `http://api.weatherapi.com/v1/future.json?key=${process.env.WEATHER_API_KEY}&q=${city}&dt=${date}`;
      }

      const response = await fetch(url);

      if (!response.ok) {

        throw new Error(
          `Weather API failed with status ${response.status}`
        );
      }

      const data = await response.json();

      if (data.error) {

        throw new Error(data.error.message);
      }

      weatherInfo.push(data);
    }

    return {
      success: true,
      data: weatherInfo
    };

  } catch (error) {

    console.error("Weather Tool Error:", error.message);

    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = getWeather;