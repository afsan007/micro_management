import React, { useState, useEffect, useCallback } from 'react';
import moment from 'moment';

import MicroChart from '../../../../../../components/layout/chart/microChart';

const OnlineUsers = props => {
  const { socket: usersSocket } = props;

  const [decrease, setDecrease] = useState(false);
  const [increase, setIncrease] = useState(false);
  const [onlinesCount, setOnlinesCount] = useState(0);
  const [diffCount, setDiffCount] = useState(0);
  const [chartData, setChartData] = useState([]);

  let time = moment();
  let current_Month = time.format('MM');
  let current_Day = time.format('D');
  let current_Year = time.format('YYYY');
  let Days_Of_Month = time.daysInMonth();

  useEffect(() => {
    const channels = {
      initial: 'onlines_initial',
      list: 'onlineUsersTList',
      onlines: 'usersOnline',
    };

    const initialData = count => setOnlinesCount(count || 0);
    const chartData = list => {
      if (!list) return null;

      let chartData = list;
      let resultData = [];

      let i = 0;
      let j = +current_Day;

      while (i < current_Day) {
        let specificDay = `${current_Year}/${current_Month}/${i + 1}`;
        chartData[specificDay] === undefined
          ? (resultData[i] = 0)
          : (resultData[i] = chartData[specificDay]);
        i++;
      }

      while (j < Days_Of_Month) {
        resultData[j] = 0;
        j++;
      }
      setChartData([{ data: resultData }]);
    };
    const arrowConfig = count => {
      if (!count) return null;
      let prevCount = +onlinesCount;
      let nexCount = +count;
      if (prevCount < nexCount) {
        setIncrease(true);
        setDecrease(false);
      }
      if (prevCount > nexCount) {
        setIncrease(false);
        setDecrease(true);
      }
      setDiffCount(prevCount - nexCount);
      setOnlinesCount(count);
    };

    usersSocket.on(channels.initial, initialData);
    usersSocket.on(channels.list, chartData);
    usersSocket.on(channels.onlines, arrowConfig);
    return () => {
      usersSocket.off(channels.initial, initialData);
      usersSocket.off(channels.list, chartData);
      usersSocket.off(channels.onlines, arrowConfig);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const setData = useCallback(setChartData, []);
  return (
    <MicroChart
      {...{
        diffCount,
        decrease,
        increase,
        onlinesCount,
        chartData,
        setChartData: setData,
        chartType: 'online_users',
        boxColor: '#4caf50',
        header: 'online Users',
      }}
    />
  );
};

export default React.memo(OnlineUsers);
