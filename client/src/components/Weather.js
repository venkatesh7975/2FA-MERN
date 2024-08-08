import React, { useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom"; // Import Navigate from react-router-dom

const Weather = () => {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState(null);
  const [loggedOut, setLoggedOut] = useState(false); // State to track logout

  const apiKey = "b03a640e5ef6980o4da35b006t5f2942";

  const fetchWeather = async () => {
    try {
      const response = await axios.get(
        `https://api.shecodes.io/weather/v1/current?query=${query}&key=${apiKey}`
      );
      setWeather(response.data);
    } catch (error) {
      console.error("Error fetching the weather data", error);
    }
  };

  const handleLogout = () => {
    // Call the parent component's logout function
    setLoggedOut(true); // Set loggedOut state to true
  };

  // Redirect to home if loggedOut state is true
  if (loggedOut) {
    return <Navigate to="/" />;
  }

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow-lg">
        <div className="d-flex justify-content-end mb-3">
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
        <h1 className="text-center mb-4">Weather Forecast</h1>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Enter city name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="btn btn-primary" onClick={fetchWeather}>
            Search
          </button>
        </div>
        {weather &&
          (weather.city ? (
            <div className="weather-details">
              <h2>
                {weather.city}, {weather.country}
              </h2>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p>
                    <strong>Condition:</strong> {weather.condition.description}
                  </p>
                  <p>
                    <strong>Temperature:</strong> {weather.temperature.current}
                    °C
                  </p>
                  <p>
                    <strong>Feels Like:</strong>{" "}
                    {weather.temperature.feels_like}°C
                  </p>
                  <p>
                    <strong>Humidity:</strong> {weather.temperature.humidity}%
                  </p>
                  <p>
                    <strong>Pressure:</strong> {weather.temperature.pressure}{" "}
                    hPa
                  </p>
                  <p>
                    <strong>Wind Speed:</strong> {weather.wind.speed} m/s
                  </p>
                </div>
                <img
                  src={weather.condition.icon_url}
                  alt={weather.condition.description}
                />
              </div>
            </div>
          ) : (
            <h1>City not found</h1>
          ))}
      </div>
    </div>
  );
};

export default Weather;
