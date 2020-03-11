// Global Stuff
// ===============================================
// Global Variables
const weatherUrl = "http://api.openweathermap.org/data/2.5/";
const weatherApiKey = "57e8e95b6fc9af21a7275dbba8b586e2";

const newApiKey = "480a960d4e99423fa9b31e3837cc6410";
const newsURL = "http://newsapi.org/v2/";

const submit = document.querySelector("#getTemp");
const weatherInput = document.querySelector("#city");
const weatherDiv = document.querySelector(".weather-div");
const newsDiv = document.querySelector(".news-div");

// Make function that capitalizes the first letter of each word since CSS cannot
// Use this throughout
const titleCase = str => {
  str = str.toLowerCase().split(" ");
  str = str.map(word => word.charAt(0).toUpperCase() + word.slice(1));
  str = str.join(" ");
  return str;
};

// Weather Scripting
// ================================================
// Set Color classes
const tempColor = temp => {
  let color = "";
  if (temp < 40) {
    color = "blue";
  } else if (temp >= 40 && temp < 60) {
    color = "navy";
  } else if (temp >= 60 && temp < 80) {
    color = "purple";
  } else if (temp >= 80 && temp < 90) {
    color = "burgundy";
  } else if (temp >= 90) {
    color = "red";
  }
  return color;
};

// Event Listener for weather "go"
submit.addEventListener("click", async () => {
  event.preventDefault();
  // Get search query and hit API
  let zipCity = weatherInput.value;
  let currentWeather = await axios.get(
    `${weatherUrl}weather?q=${zipCity}&units=imperial&appid=${weatherApiKey}`
  );
  let forecast = await axios.get(
    `${weatherUrl}forecast?q=${zipCity}&units=imperial&appid=${weatherApiKey}&cnt=3`
  );
  weatherInput.value = "";
  // Clean up response data
  let rawCurrent = currentWeather.data;
  let rawForecast = forecast.data.list;
  buildWeatherCard(rawCurrent);
  buildForecastCard(rawForecast);
});

// Build Current weather
const buildWeatherCard = rawData => {
  let cityName = rawData.name;
  let currentTemp = Math.round(rawData.main.temp);
  let minTemp = Math.round(rawData.main.temp_min);
  let maxTemp = Math.round(rawData.main.temp_max);
  // Clean out the weather Div
  weatherDiv.innerHTML = "";
  // Title the top of the weather div
  let cityH3 = document.createElement("h3");
  cityH3.className = "city-title";
  cityH3.innerText = `Current Weather in ${cityName}`;
  weatherDiv.appendChild(cityH3);
  // Create Div to hold weather icons
  let iconDiv = document.createElement("div");
  iconDiv.className = "weather-icons";
  // Create P to hold all weather conditions and an empty string to store in
  let conditionsP = document.createElement("p");
  conditionsP.className = "weather-conditions";
  let conditions = "";
  // Go through the weather array to pull multiple conditions and icons
  rawData.weather.forEach(element => {
    let weatherId = element.id;
    iconDiv.innerHTML += `<i class="wi wi-owm-${weatherId} ${tempColor(
      currentTemp
    )}"></i>`;
    conditions += `${element.description}, `;
  });
  // Format conditions in title case without the extra comma and space
  conditions = conditions.substring(0, conditions.length - 2);
  conditions = titleCase(conditions);
  // Append icons and text
  conditionsP.innerText = conditions;
  weatherDiv.appendChild(iconDiv);
  weatherDiv.appendChild(conditionsP);
  // Add and append temperatures to overall forecast with colors
  let tempsP = document.createElement("p");
  tempsP.className = "temps";
  tempsP.innerHTML = `The current temperature is <span class="${tempColor(
    currentTemp
  )}">${currentTemp}\xB0F</span>. <br/>
  The low will be <span class="${tempColor(
    minTemp
  )}">${minTemp}\xB0F</span> and the high wil be <span class="${tempColor(
    maxTemp
  )}">${maxTemp}\xB0F</span>.`;
  weatherDiv.appendChild(tempsP);
};

// Build forecast with icons
const buildForecastCard = rawData => {
  // Title the top of the foreforecast div
  let forecastH3 = document.createElement("h3");
  forecastH3.className = "forecast-title";
  forecastH3.innerText = `Forecast over the next 6 Hours`;
  weatherDiv.appendChild(forecastH3);
  // Create forecast holder Div
  let forecastDiv = document.createElement("div");
  forecastDiv.className = "forecast";
  // Create each forecast entry, with icons and temp
  rawData.forEach(element => {
    // Create temperature paragraph
    let tempP = document.createElement("p");
    let currentTemp = Math.round(element.main.temp);
    tempP.innerHTML = `<span class="${tempColor(
      currentTemp
    )}">${currentTemp}\xB0F</span>`;
    // Create two divs, one for multiple icons, one to hold that div and tempP
    let hourDiv = document.createElement("div");
    hourDiv.className = "hour-div";
    let forecastIcons = document.createElement("div");
    element.weather.forEach(element => {
      let weatherId = element.id;
      forecastIcons.innerHTML += `<i class="wi wi-owm-${weatherId} forecast-icon ${tempColor(
        currentTemp
      )}"></i>`;
    });
    hourDiv.appendChild(forecastIcons);
    hourDiv.appendChild(tempP);
    forecastDiv.appendChild(hourDiv);
  });
  weatherDiv.appendChild(forecastDiv);
};

// News Scripting
// ================================================
const getHeadlines = async () => {
  let resp = await axios.get(
    `${newsURL}top-headlines?country=us&category=general&pageSize=5&apiKey=${newApiKey}`
  );
  let rawNewsData = resp.data.articles;
  buildNewsCard(rawNewsData);
};
getHeadlines();

// Build News Card

const buildNewsCard = rawData => {
  // Clean out the news Div
  newsDiv.innerHTML = "";
  // Title the top of the news div
  let newsH3 = document.createElement("h3");
  newsH3.className = "news-title";
  newsH3.innerText = `Top Headlines`;
  newsDiv.appendChild(newsH3);
  // Create img from first article's image url
  let newsImg = document.createElement("img");
  newsImg.className = "news-img";
  newsImg.src = rawData[0].urlToImage;
  newsDiv.appendChild(newsImg);
  // Create headline Div
  let headlineDiv = document.createElement("div");
  headlineDiv.className = "headline-div";
  // Go through the article array to pull stories and create links
  rawData.forEach(article => {
    let headline = document.createElement("h4");
    let headlineLink = document.createElement("a");
    headlineLink.href = article.url;
    headlineLink.innerText = article.title;
    headlineLink.target = "_blank";
    headline.appendChild(headlineLink);
    headlineDiv.appendChild(headline);
  });
  newsDiv.appendChild(headlineDiv);
};
