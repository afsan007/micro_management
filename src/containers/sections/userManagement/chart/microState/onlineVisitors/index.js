/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import moment from 'moment';
import _ from 'lodash';
import MicroChart from '../../../../../../components/layout/chart/microChart';

const OnlineVisitors = props => {
  const { socket: visitorsSocket } = props;

  const [decrease, setDecrease] = useState(false);
  const [increase, setIncrease] = useState(false);

  const [onlinesCount, setOnlinesCount] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [diffCount, setDiffCount] = useState(0);

  let { current: time } = useRef(moment());
  let { current: chartD } = useRef(false);

  let current_Month = time.format('MM');
  let current_Day = time.format('D');
  let current_Year = time.format('YYYY');
  let Days_Of_Month = time.daysInMonth();

  useEffect(() => {
    const initialCountChannel = 'onlineVisitorsInitial';
    const initialData = count => setOnlinesCount(count || 0);
    visitorsSocket.on(initialCountChannel, initialData);

    return () => visitorsSocket.off(initialCountChannel, initialData);
  }, []);

  useEffect(() => {
    if (chartData.length && _.reduce(chartData[0].data, (sum, n) => sum + n, 0)) chartD = !chartD;

    const totalListChannel = 'onlineVisitorsTList';
    const chart_Data = list => {
      if (!list) return null;
      let resultData = [];

      let i = 0;
      let j = current_Day;

      while (i < current_Day) {
        let specificDay = `${current_Year}/${current_Month}/${i + 1}`;
        list[specificDay] === undefined
          ? (resultData[i] = 0)
          : (resultData[i] = Object.keys(JSON.parse(list[specificDay])).length);
        i++;
      }

      while (j < Days_Of_Month) {
        resultData[j] = 0;
        j++;
      }

      setChartData([{ data: resultData }]);
    };

    visitorsSocket.on(totalListChannel, chart_Data);
    return () => visitorsSocket.off(totalListChannel, chart_Data);
  }, [chartD]);

  useEffect(() => {
    const onlinesCountChannel = 'onlineVisitorsCount';
    const arrowConfig = count => {
      if (count === undefined || count === null) return null;
      let prevCount = onlinesCount;
      let nexCount = count;

      if (prevCount < nexCount) {
        setIncrease(true);
        setDecrease(false);
      }
      if (prevCount > nexCount) {
        setDecrease(true);
        setIncrease(false);
      }
      setDiffCount(prevCount - nexCount);
      setOnlinesCount(count);
    };

    visitorsSocket.on(onlinesCountChannel, arrowConfig);
    return () => visitorsSocket.off(onlinesCountChannel, arrowConfig);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onlinesCount]);

  return (
    <MicroChart
      {...{
        diffCount,
        decrease,
        increase,
        onlinesCount,
        chartData,
        setChartData: useCallback(setChartData, []),
        chartType: 'online_visitors',
        boxColor: '#D7263D',
        header: 'online visitors',
      }}
    />
  );
};

export default OnlineVisitors;
