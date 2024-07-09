import React, { useState, useEffect } from 'react';
import Slider from "react-slick";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './WeatherApp.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const WeatherApp = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('Delhi');

    const fetchData = async (query) => {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${query}&appid=ee9a1b54559d49187393b5764da155fb`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Weather data:', data); // Log the data to check
            const filteredData = data.list.filter((item, index) => index < 40); // 8 items per day for 5 days (5 * 8 = 40)
            setWeatherData({ city: data.city, list: filteredData });
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(searchQuery);
    }, [searchQuery]);

    const handleSearch = (event) => {
        event.preventDefault();
        const query = event.target.elements.search.value;
        setSearchQuery(query);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    const chartData = weatherData.list.map(item => ({
        time: item.dt_txt,
        temperature: (item.main.temp - 273.15).toFixed(2)
    }));

    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3,
        draggable: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    initialSlide: 1
                }
            }
        ]
    };

    return (
        <div className="main-box">
            <form className="search-bar" onSubmit={handleSearch}>
                <input type="text" name="search" placeholder="Search city or state" />
                <button type="submit"><i class="fa-solid fa-magnifying-glass"></i></button>
            </form>
            <div></div>
            <div className="weather-app">
                <div className="weather-sidebar">
                    {weatherData && (
                        <>
                            <div className="weather-box">
                                <div className="weather-icon">
                                    <img
                                        src={`http://openweathermap.org/img/wn/${weatherData.list[0].weather[0].icon}.png`}
                                        alt={weatherData.list[0].weather[0].description}
                                    />
                                </div>
                                <div className="weather-details">
                                    <p>{weatherData.city.name}, {weatherData.city.country}</p>
                                    <h1>{new Date(weatherData.list[0].dt_txt).toLocaleDateString('en-US', { weekday: 'long' })}</h1>
                                    <p>{new Date(weatherData.list[0].dt_txt).toLocaleDateString('en-US', { dateStyle: 'full' })}</p>
                                    <p>{(weatherData.list[0].main.temp - 273.15).toFixed(2)}°C</p>
                                </div>
                            </div>
                            <div className="weather-box">
                                <div className="weather-icon">
                                    <img
                                        src="path/to/wind-icon.png" // Replace with actual wind icon path
                                        alt="Wind Icon"
                                    />
                                </div>
                                <div className="weather-details">
                                    <p>Wind</p>
                                    <p>{weatherData.list[0].wind.speed} m/s</p>
                                </div>
                                <div className="weather-details">
                                    <p>Humidity</p>
                                    <p>{weatherData.list[0].main.humidity}%</p>
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <div className="weather-main">
                    {weatherData && (
                        <div className="weather-container">
                            <h2>{weatherData.city.name} Weather Forecast</h2>
                            <Slider {...settings}>
                                {weatherData.list.map((item, index) => (
                                    <div key={index} className="weather-item">
                                        <p>Date and Time: {new Date(item.dt_txt).toLocaleString()}</p>
                                        <p>Temperature: {(item.main.temp - 273.15).toFixed(2)}°C</p>
                                        <p>Weather: {item.weather[0].description}</p>
                                        <img
                                            src={`http://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                                            alt={item.weather[0].description}
                                        />
                                    </div>
                                ))}
                            </Slider>
                            <div className="chart-container">
                                <ResponsiveContainer width="100%" height={400}>
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="time" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WeatherApp;
