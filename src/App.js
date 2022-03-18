import styled from '@emotion/styled';
import { ReactComponent as DaycloudyIcon } from './images/day-cloudy.svg';
import { ReactComponent as AirFlowIcon } from './images/airFlow.svg';
import { ReactComponent as RainIcon } from './images/rain.svg';
import { ReactComponent as RefreshIcon } from './images/refresh.svg';

const Container = styled.div`
  background-color: #ededed;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const WeatherCard = styled.div`
  min-width: 360px;
  padding: 15px;
  box-shadow: 0 1px 3px 0 #999999;
  background-color: #f9f9f9;
`;
const Location = styled.div`
  font-size: 28px;
  color: #212121;
  margin-bottom: 20px;
`;
const Description = styled.div`
  font-size: 16px;
  color: #828282;
  margin-bottom: 30px;
`;
const CurrentWeather = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;
const Temperature = styled.div`
  color: #757575;
  font-size: 96px;
  font-weight: 300;
  display: flex;
`;
const Daycloudy = styled(DaycloudyIcon)`
  flex-basis: 30%
`;
const Celsius = styled.div`
  font-weight: normal;
  font-size: 42px;
`;
const AirFlow = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: #828282;
  margin-bottom: 20px;
  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;
const Rain = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: #828282;
  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;
const RefreshWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;
const Refresh = styled.div`
  font-size: 12px;
  display: inline-flex;
  align-items: flex-end;
  color: #828282;
  svg {
    width: 15px;
    height: auto;
    margin-left: 10px;
    cursor: pointer;
  }
`;
function App() {
  return (
    <Container>
      <WeatherCard>
        <Location>台北市</Location>
        <Description>多雲時晴</Description>
        <CurrentWeather>
          <Temperature>
            23 <Celsius>°C</Celsius>
          </Temperature>
          <Daycloudy />
        </CurrentWeather>
        <AirFlow>
          <AirFlowIcon />
          23 m/h
        </AirFlow >
        <Rain>
          <RainIcon />
          48%
        </Rain>
        <RefreshWrapper>
          <Refresh>
            最後觀測時間
            <RefreshIcon />
          </Refresh>
        </RefreshWrapper >
      </WeatherCard>
    </Container>
  );
}

export default App;
