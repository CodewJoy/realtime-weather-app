import React, { useState, useEffect, useMemo } from 'react';
import styled from '@emotion/styled';
import { ThemeProvider } from '@emotion/react';
import { getMoment, findLocation } from './utils/helpers.js'
import useWeatherAPI from './hooks/useWeatherAPI';
import WeatherCard from './views/WeatherCard.js';
import WeatherSetting from './views/WeatherSetting.js';

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

const AUTHORIZATION_KEY = process.env.REACT_APP_API_AUTHORIZATION_KEY;
function App() {
  // console.log('invoke function component'); // 元件一開始加入 console.log
  const storageCity = localStorage.getItem('cityName') || '臺北市';
  const [currentCity, setCurrentCity] = useState(storageCity);  
  const [currentTheme, setCurrentTheme] = useState('light');
  const [currentPage, setCurrentPage] = useState('WeatherCard');
  const location = useMemo(() => findLocation(currentCity), [currentCity]);
  const { cityName, locationName, sunriseCityName } = location; 
  const [weatherElement, fetchWeatherData] = useWeatherAPI({
    authorizationKey: AUTHORIZATION_KEY, 
    locationName, 
    cityName,
  });

  const moment = useMemo(() => getMoment(sunriseCityName),[sunriseCityName]);
  const handleChangePage = (currentPage) => { 
    setCurrentPage(currentPage) 
  };
  const handleChangeCurrentCity = (currentCity) => { 
    setCurrentCity(currentCity); 
  };
  useEffect(() => {
    setCurrentTheme(moment === 'day' ? 'light' : 'dark');
  }, [moment]);

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      {/* {console.log('render')} */}
      <Container>
        {currentPage === 'WeatherCard'
          && (
            <WeatherCard
              cityName={cityName}
              moment={moment}
              weatherElement={weatherElement}
              fetchWeatherData={fetchWeatherData}
              handleChangePage={handleChangePage}
            />
        )}
        {currentPage === 'WeatherSetting'
          && (
          <WeatherSetting
            cityName={cityName}
            handleChangePage={handleChangePage}
            handleChangeCurrentCity={handleChangeCurrentCity}
          />
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
