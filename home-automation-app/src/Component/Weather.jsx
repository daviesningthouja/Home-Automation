// eslint-disable-next-line no-unused-vars
import React, { useEffect,useRef, useState ,useCallback} from 'react'
import '../App.css'
import { fetchESPTemperature} from "../utility/ApiCall";
import search_icon from '../Assets/search.png';
import clear_icon from '../Assets/clear.png';
import cloud_icon from '../Assets/cloud.png';
import drizzle_icon from '../Assets/drizzle.png';
import rain_icon from '../Assets/rain.png';
import snow_icon from '../Assets/snow.png';
import wind_icon from '../Assets/wind.png';
import humidity_icon from '../Assets/humidity.png';
import homeicon from '../Assets/vecteezy_flat-house-icon_47429171.png';

const Weather = ({location }) => {

  const inputRef = useRef()
  const [weatherData, setWeatherData] = useState(null);
  const [espTemperature, setEspTemperature] = useState(null);
  const [isSearch, setIsSearch] = useState(false);
  const weatherIcons = {
    "01d":  clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    '02n': cloud_icon,
    "03d": cloud_icon,
    "03n": cloud_icon,
    "04d": drizzle_icon,
    "04n": drizzle_icon,
    "09d": rain_icon,
    "09n": rain_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "13d": snow_icon,
    "13n": snow_icon
  }
  const Hicon = homeicon;

  const search = async (city) => {

    if(city === ""){
      alert("Enter City Name")
    }
    try{
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;

      const response = await fetch(url);
      const data = await response.json();
      if(!response.ok){
        alert(data.message);
        return
      }
      console.log(data);
      const icon = weatherIcons[data.weather[0].icon] || clear_icon;
      setWeatherData({
        humidity:data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icons: icon
      })
      
    }catch(err){
      console.error("Error fetching weather data:", err);
      return null;
    }
  }



  

  const loadWeather = useCallback(async () => {
    if(!isSearch){

      if (location == "home") {
        const temp = await fetchESPTemperature();
        if (temp !== null) {
          setEspTemperature(temp);
          console.log(temp)
          return; // Stop execution, as we have ESP data
        }
      }
      
    }else{

      const data = await search("Imphal");
      if (data) {
        setWeatherData(
          {data});
        }
      }
  }, [location]);

  useEffect(() => {
    const interval = setInterval(() => {
      loadWeather();
      console.log(isSearch);
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval); 
  }, [loadWeather]);

  const handleSearch = async () => {
    const city = inputRef.current.value.trim();
    if(city == "home") return(setIsSearch(false));
    if (!city) return alert("Enter City Name");
    setIsSearch(true);
    const data = await search(city);
    if (data) {
      setWeatherData({data});
      setEspTemperature(null); // Reset ESP data on manual search
    }
  };

  return (
    <div className='app'>
      <div className='weather'>
        <div className='search-bar'>
          <input ref={inputRef} type="text" placeholder='Search "home"'/>
          <img src={search_icon} alt="" onClick={() => handleSearch(inputRef.current.value)}/>
        </div>
        
        {espTemperature !== null && !isSearch? (
          <>
            <img src={Hicon} alt="ESP Weather Icon" className="weather-H-icon" />
            <p className="temperature">{espTemperature}°C</p>
            <p className="location">Home (ESP Sensor)</p>
          </>
        ) :weatherData && isSearch? <>
          <img src={weatherData.icons} alt='' className='weather-icon'/>
        <p className='temperature'>{weatherData.temperature}°C</p>
        <p className='location'>{weatherData.location}</p>
        <div className='weather-data'>
          <div className='col'>
            <img src={humidity_icon} alt=''/>
            <div>
              <p>{weatherData.humidity}%</p>
              <span>Humidity</span>
            </div>
          </div>

          <div className='col'>
            <img src={wind_icon} alt=''/>
            <div>
              <p>{weatherData.windSpeed} km/hr</p>
              <span>Wind speed</span>
            </div>
          </div>
        </div>
        </>: 
        <>
          <img src={Hicon} alt="ESP Weather Icon" className="weather-H-icon" />
          <p className="temperature">....°C</p>
          <p className="location">Home</p>
        </>}

        
      </div>
    </div>
  )
}

export default Weather
