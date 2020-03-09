const weatherUrl = "http://api.openweathermap.org/data/2.5/weather?q=";

const apiKey = "57e8e95b6fc9af21a7275dbba8b586e2";

const submit = document.querySelector("#getTemp");
const weatherInput = document.querySelector("#city");
const weatherDiv = document.querySelector(".weather-div");

const tempColor = temp => {
  let color = "";
  if (temp < 40) {
    color = "blue";
  } else if (temp > 90) {
    color = "red";
  }
  return color;
};

submit.addEventListener("click", async () => {
  event.preventDefault();
  // Get search query and hit API
  let zipCity = weatherInput.value;
  let response = await axios.get(
    `${weatherUrl}${zipCity}&units=imperial&appid=${apiKey}`
  );
  // Clean up response data
  let rawData = response.data;
  let cityName = rawData.name;
  let currentTemp = Math.round(rawData.main.temp);
  let minTemp = Math.round(rawData.main.temp_min);
  let maxTemp = Math.round(rawData.main.temp_max);
  // Clean out the weather Div
  weatherDiv.innerHTML = "";
  // Title the top of the weather div
  let cityH3 = document.createElement("h3");
  cityH3.className = "city-title";
  cityH3.innerText = `Weather in ${cityName}`;
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
    iconDiv.innerHTML += `<i class="wi wi-owm-${weatherId}"></i>`;
    conditions += `${element.description}, `;
  });
  // Format conditions in title case without the extra comma and space
  conditions = conditions.substring(0, conditions.length - 2);
  conditions = titleCase(conditions);
  debugger;
  // Append everything
  conditionsP.innerText = conditions;
  weatherDiv.appendChild(iconDiv);
  weatherDiv.appendChild(conditionsP);
  // Add temperatures to overall forecast
  let tempsP = document.createElement("p");
  tempsP.innerHTML = `The current temperature is <span class="${tempColor(
    currentTemp
  )}">${currentTemp}F</span>. <br/>
  The low will be <span class="${tempColor(
    minTemp
  )}">${minTemp}F</span> and the high wil be <span class="${tempColor(
    maxTemp
  )}">${maxTemp}F</span>.`;
  weatherDiv.appendChild(tempsP);
});

// Make function that capitalizes the first letter of each word since CSS cannot
const titleCase = str => {
  str = str.toLowerCase().split(" ");
  str = str.map(word => word.charAt(0).toUpperCase() + word.slice(1));
  str = str.join(" ");
  return str;
};

console.log(titleCase("first word XERO"));
