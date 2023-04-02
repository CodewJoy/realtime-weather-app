import { useEffect, useState, useCallback } from 'react';

const fetchCurrentWeather = (authorizationKey, locationName) => {
    // 加上 return 直接把 fetch API 回傳的 Promise 再回傳出去
    return fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${authorizationKey}&locationName=${locationName}`)
        .then(response => response.json())
        .then(data => {
            const locationData = data.records.location[0];
            if (!locationData) return;
            const weatherElements = locationData.weatherElement.reduce(
                (preValue, currentValue) => {
                    if (['WDSD', 'TEMP'].includes(currentValue.elementName)) {
                        preValue[currentValue.elementName] = currentValue.elementValue;
                    }
                    return preValue;
                },
                {}
            );
            return {
                observationTime: locationData.time.obsTime,
                locationName: locationData.locationName,
                windSpeed: weatherElements.WDSD,
                temperature: weatherElements.TEMP,
            };
        });
};

const fetchWeatherForecast = (authorizationKey, cityName) => {
    return fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${authorizationKey}&locationName=${cityName}`)
        .then(response => response.json())
        .then(data => {
            const locationData = data.records.location[0];
            const weatherElements = locationData.weatherElement.reduce(
                (preValue, currentValue) => {
                    if (['Wx', 'PoP', 'CI'].includes(currentValue.elementName)) {
                        /** get nearest 12 hour data here */
                        preValue[currentValue.elementName] = currentValue.time[0].parameter;
                    }
                    return preValue;
                },
                {}
            );
            // console.log('weatherElements', weatherElements)
            return {
                description: weatherElements.Wx.parameterName,
                weatherCode: weatherElements.Wx.parameterValue,
                rainPossibility: weatherElements.PoP.parameterName,
                comfortability: weatherElements.CI.parameterName,
            };
        });
};

const useWeatherAPI = ({ authorizationKey, locationName, cityName }) => {
    const [weatherElement, setWeatherElement] = useState({
        locationName: '',
        description: '',
        windSpeed: 0,
        temperature: 0,
        rainPossibility: 0,
        weatherCode: 0,
        comfortability: '',
        observationTime: new Date(),
        isLoading: true,
    });
    /** add useCallback to avoid every re-render redefine etchWeatherData */
    const fetchWeatherData = useCallback(async () => {
        setWeatherElement((prevState) => ({
            ...prevState,
            isLoading: true,
        }));
        const [currentWeather, weatherForecast] = await Promise.all([
            fetchCurrentWeather(authorizationKey, locationName),
            fetchWeatherForecast(authorizationKey, cityName),
        ]);
        setWeatherElement({
            ...currentWeather,
            ...weatherForecast,
            isLoading: false,
        });
    }, [authorizationKey, locationName, cityName]);

    useEffect(() => {
        fetchWeatherData();
    }, [fetchWeatherData]);
    return [weatherElement, fetchWeatherData];
};

export default useWeatherAPI;