import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled from '@emotion/styled';
import { ThemeProvider } from '@emotion/react';
import { getMoment } from './utils/helpers.js'
import WeatherCard from './views/WeatherCard.js';

const theme = {
  light: {
    backgroundColor: '#ededed',
    foregroundColor: '#f9f9f9',
    boxShadow: '0 1px 3px 0 #999999',
    titleColor: '#212121',
    temperatureColor: '#757575',
    textColor: '#828282',
  },
  dark: {
    backgroundColor: '#1F2022',
    foregroundColor: '#121416',
    boxShadow:
      '0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)',
    titleColor: '#f9f9fa',
    temperatureColor: '#dddddd',
    textColor: '#cccccc',
  },
};
const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

function App() {
  // console.log('invoke function component'); // 元件一開始加入 console.log
  const AUTHORIZATION_KEY = 'CWB-E7CA1BB3-7E06-4946-8E26-963BFCB5CDDF';
  const LOCATION_NAME = '臺北';
  const LOCATION_NAME_FORECAST = '臺北市';
  const [currentTheme, setCurrentTheme] = useState('light');
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

  // TODO: 等使用者可以修改地區時要修改裡面的參數
  const moment = useMemo(() => getMoment(LOCATION_NAME_FORECAST),[]);

  useEffect(() => {
    setCurrentTheme(moment === 'day' ? 'light' : 'dark');
  }, [moment]);

  const fetchCurrentWeather = () => {
    // 加上 return 直接把 fetch API 回傳的 Promise 再回傳出去
    return fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${AUTHORIZATION_KEY}&locationName=${LOCATION_NAME}`)
      .then(response => response.json())
      .then(data => { 
        const locationData = data.records.location[0];
        const weatherElements = locationData.weatherElement.reduce(
          (preValue, currentValue) => {
            if (['WDSD', 'TEMP'].includes(currentValue.elementName)) {
              preValue[currentValue.elementName] = currentValue.elementValue;
            }
            return preValue;
          }, 
          {}
        );
        // console.log(data);
        return {
          observationTime: locationData.time.obsTime,
          locationName: locationData.locationName,
          windSpeed: weatherElements.WDSD, 
          temperature: weatherElements.TEMP,
        };
      });
  };

  const fetchWeatherForecast = () => {
    return fetch(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${AUTHORIZATION_KEY}&locationName=${LOCATION_NAME_FORECAST}`)
      .then(response => response.json())
      .then(data => { 
        // console.log(data);
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

  /** add useCallback to avoid every re-render redefine etchWeatherData */
  const fetchWeatherData = useCallback(async () => {
    setWeatherElement((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    const [ currentWeather, weatherForecast ] = await Promise.all([
      fetchCurrentWeather(),
      fetchWeatherForecast(),
    ]);
    setWeatherElement({
      ...currentWeather,
      ...weatherForecast,
      isLoading: false,
    });
  }, []);

  useEffect(() => {
    // console.log('execute function in useEffect');
    fetchWeatherData();
  }, [fetchWeatherData]);

  useEffect(() => {
    // console.log('execute function in useEffect');
    fetchWeatherData();
  }, [fetchWeatherData]);

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      {/* {console.log('render')} */}
      <Container>
        <WeatherCard 
          weatherElement={weatherElement}
          moment={moment}
          fetchWeatherData={fetchWeatherData}
        />
      </Container>
    </ThemeProvider>
  );
}

export default App;
