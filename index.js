const searchInput = document.querySelector('#search');
const container = document.querySelector('.container');
const all = document.querySelector('.load1');
const body = document.querySelector('.main');
const loader = document.querySelector('.loader');
const formContainer = document.querySelector('.form-container');
const info = document.querySelector('.info');
const contOne = document.querySelector('container-one');
const centrado = document.querySelector('.centrado');
const errorApi = document.querySelector('error-api');
// Los paises descargados desde la api se guardan en el array de countries
// La api deberia pedirse solo una vez
// Usar este array para crear el filtrado
let countries = [];
const getCountries = async () => {
  try {
    // Llamo a la API Rest Countries
    const restCountries = await fetch('https://restcountries.com/v3.1/all');
    // Transformo la respuesta a JSON
    const data = await restCountries.json();
    // Guardo el array de los paises recibido dentro de contries
    countries = [...data];
    if (countries) {
      centrado.classList.remove('centrado');
      centrado.classList.add('info');
      all.classList.remove('load1')
    } 
  } catch (error) {
    alert('VAYA!! ALGO HA SALIDO MAL AL INTENTAR CARGAR LOS PAÍSES');
  }}
  getCountries();

// Api de temperatura
const getWeather = async (lat, lon) => {
  try{
    // diseño de preloader
    container.innerHTML = `
    <div class="centrado-weather">
        <div class="spinner-container">
          <div class="spinner">
        <div class="spinner">
          <div class="spinner">
            <div class="spinner">
              <div class="spinner">
                <div class="spinner"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
  </div>
  </div>
    `;
    const apiWeather = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=72cf5f1145a9a05f1e267183a4d257ba&units=metric`);
    const dataWeather = await apiWeather.json();
    return dataWeather;
  } catch(error){
    alert('vaya, parece que hubo un error al cargar el clima');
  }
};


// Toda la logica del desafio va dentro del evento del input.
searchInput.addEventListener('input', async e => {
  e.preventDefault();
  // Filtro de busqueda del input
  const countriesFilter = countries.filter(country => country.name.common.toLowerCase().startsWith(searchInput.value.toLowerCase()));
  // alerta "Describe mejor el nombre"
  const information = e.target.parentElement.children[1];
  const information2 = e.target.parentElement.children[2];
  container.innerHTML = "";
  if (countriesFilter.length === 0) {
    container.innerHTML = " ";
    information.classList.remove('show-info');
    information2.classList.add('show-info2');
    contOne.innerHTML = ""
  }
  if (countriesFilter.length > 10) {
    container.innerHTML = "";
    information2.classList.remove('show-info2');
    information.classList.add('show-info');
  }
  if (countriesFilter.length > 1 && countriesFilter.length <= 10){
      // elimino los mensajes de errores
      information.classList.remove('show-info');
      information2.classList.remove('show-info2');
      // añado los elementos correspondientes
      for (let numberCountry = 0; numberCountry < countriesFilter.length; numberCountry++) {
        container.innerHTML += `
        <div class='country'>
        <img src='${countriesFilter[numberCountry].flags.svg}' class ='flags'>
            <h1 class ='country-name'>${countriesFilter[numberCountry].name.common}</h1>
        </div>
        `;
      }
  }
  if (countriesFilter.length === 1 && searchInput.value !== "") {
    const lat = countriesFilter[0].latlng[0];
    const lon = countriesFilter[0].latlng[1];
    const weatherApi  =  await getWeather(lat,lon);
    container.classList.add('container-one');
    container.classList.remove('container');
    container.innerHTML = " ";
    container.innerHTML = ` 
      <div class="div-country">
        <div class="country-only-one">
          <img src='${countriesFilter[0].flags.svg}' class ="flags-only-one">
          <h1 class="countryname-one">${countriesFilter[0].name.common}</h1>
        </div>
        <div class="div-weather">
          <img class="weather-icon" src="https://openweathermap.org/img/wn/${weatherApi.weather[0].icon}@2x.png">
          <p class="description-weather">${weatherApi.weather[0].description} |</p>
          <p class="temp">${weatherApi.main.temp} C°</p>
        </div>
      </div>
        <div class="stats">
            <p class='capital'>🌐 Capital: ${countriesFilter[0].capital}</p>
            <p class="poblacion">🌐 Population: ${countriesFilter[0].population.toLocaleString()} Inhabitants</p>
            <p class="region">🌐 Region: ${countriesFilter[0].region}</p>
            <p class="continente">🌐 Sub Region: ${countriesFilter[0].subregion}</p>
            <p class="hora">🌐 Time Zones: ${countriesFilter[0].timezones[0]}</p>
        </div>
            `;
  } else{
    container.classList.remove('container-one');
    container.classList.add('container');
  };
});
