import React, { useState, useEffect, useMemo } from 'react';
import styled from '@emotion/styled';
import { ThemeProvider } from '@emotion/react';
import { getMoment } from './utils/helpers.js'
import useWeatherAPI from './hooks/useWeatherAPI';
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
  const [weatherElement, fetchWeatherData] = useWeatherAPI(AUTHORIZATION_KEY, LOCATION_NAME, LOCATION_NAME_FORECAST);

  // TODO: 等使用者可以修改地區時要修改裡面的參數
  const moment = useMemo(() => getMoment(LOCATION_NAME_FORECAST),[]);

  useEffect(() => {
    setCurrentTheme(moment === 'day' ? 'light' : 'dark');
  }, [moment]);

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      {/* {console.log('render')} */}
      <Container>
        <WeatherCard
          moment={moment}
          weatherElement={weatherElement}
          fetchWeatherData={fetchWeatherData}
        />
      </Container>
    </ThemeProvider>
  );
}

export default App;
