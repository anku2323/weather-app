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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://api.openweathermap.org/data/2.5/forecast?q=Delhi&appid=ee9a1b54559d49187393b5764da155fb');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                // Filter data for the next 5 days
                const filteredData = data.list.filter((item, index) => index < 40); // 8 items per day for 5 days (5 * 8 = 40)
                setWeatherData({ city: data.city, list: filteredData });
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

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
        <div className="weather-app">
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
    );
};

export default WeatherApp;
