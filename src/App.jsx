import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {

  const [data, setData] = useState({});
  const [location, setLocation] = useState('');

  function separateDateTime(localtime) {
    if (localtime) {
      const dateObj = new Date(localtime);
      const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
      const formattedDate = `${monthNames[dateObj.getMonth()]} ${dateObj.getDate()}, ${dateObj.getFullYear()}`;
  
      // Extract hour, minute, and AM/PM
      const hours12 = dateObj.getHours() % 12 || 12;
      const minutes = String(dateObj.getMinutes()).padStart(2, '0');
      const ampm = dateObj.getHours() >= 12 ? 'pm' : 'am';
  
      // Construct formatted time
      const formattedTime = `${hours12}:${minutes} ${ampm}`;
  
      return { date: formattedDate, time: formattedTime };
    } else {
      // Handle case where localtime is undefined
      console.error("localtime is undefined");
      return { date: '', time: '' };
    }
  }

  const url = `https://api.weatherapi.com/v1/current.json?key=6839e35feb4e488d9a4223610240608&q=${location}&aqi=no`

  const searchLocation = (event) => {
    if (event.key === 'Enter' && event.type === 'keyup') {
      axios.get(url)
        .then((response) => {
          const { location } = response.data; // Destructure location first
          if (location) { // Check if location exists before accessing localtime
            const { localtime } = location || {}; // Conditional extraction
            const { date, time } = separateDateTime(localtime);
            setData({ ...response.data, date, time });
          } else {
            console.error("Location not found in response");
            // Display an error message to the user (optional)
          }
          console.log(response.data)
        })
        .catch((error) => {
          console.error('Error fetching data:', error)
          return (
            <div className="error-message">
              <p>Whoops! Error fetching data</p>
            </div>
          )
        })
        setLocation('')
    }
  };
  

  return (
    <div className="app">
      <div className="search">
        <input
        value={location}
        onChange={event => setLocation(event.target.value)}
        onKeyUp={searchLocation}
        onKeyDown={searchLocation}
        placeholder="Enter Location" 
        type="text"/>
      </div>
      <div className="container">
        <div className="top">
          <div className="localdate">
            {data.location ? <p className="bold">{data.date}</p> : null}
          </div>
          <div className="localtime">
            {data.location ? <p className="bold">{data.time}</p> : null}
          </div>
        </div>  
        <div className="main">
          <div className="location">
            {data.location ? <p className="bold">{data.location.name}, {data.location.region}</p> : null}
          </div>
          <div className="temp">
            {data.current ? <h1 className="bold">{data.current.temp_f.toFixed()}&#176;F</h1> : null}
          </div>
          <div className="description">
            {data.current ? <h3 className="bold">{data.current.condition.text}</h3> : null}
          </div>
        </div>
        <div className="bottom">
          <div className="bottom-top">
            <div className="humidity">
              {data.current ? <p className="bold">{data.current.humidity}%</p> : null}
              <p>Humidity</p>
            </div>
            <div className="wind">
              {data.current ? <p className="bold">{data.current.wind_mph.toFixed()} MPH</p> : null}
              <p>Wind Speed</p>
            </div>
            <div className="gust">
              {data.current ? <p className="bold">{data.current.gust_mph.toFixed()} MPH</p> : null}
              <p>Gust Speed</p>
            </div>
          </div>
          <div className="bottom-bottom">
            <div className="feels">
              {data.current ? <p className="bold">{data.current.feelslike_f.toFixed()}&#176;F</p> : null}
              <p>Feels Like</p>
            </div>
            <div className="windchill">
              {data.current ? <p className="bold">{data.current.windchill_f.toFixed()}&#176;F</p> : null}
              <p>Windchill</p>
            </div>
            <div className="heatindex">
              {data.current ? <p className="bold">{data.current.heatindex_f.toFixed()}&#176;F</p> : null}
              <p>Heat Index</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
