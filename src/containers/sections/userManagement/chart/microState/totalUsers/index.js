import React, { useEffect, useState, useCallback } from 'react';
import { graphql } from 'react-apollo';
import moment from 'moment';

import MicroChart from '../../../../../../components/layout/chart/microChart';
import userCountQuery from '../../../../../../Graphql/queries/usersCount';
const TotalUsers = props => {
  const [decrease, setDecrease] = useState(false);
  const [increase, setIncrease] = useState(false);

  const [diffCount, setDiffCount] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [totalsCount, setTotalsCount] = useState(0);

  const { socket: usersSocket } = props;
  const gql = props.data;

  const setData = useCallback(setChartData, []);

  useEffect(() => {
    const arrowConfig = listVals => {
      if (!diffCount) {
        setDiffCount(listVals);
      } else {
        let prevCount = diffCount;
        let currentCount = listVals;

        if (prevCount < currentCount) {
          setIncrease(true);
          setDecrease(false);
          setDiffCount(currentCount);
          setTotalsCount(totalsCount + 1);
        }
        if (prevCount > currentCount) {
          setIncrease(false);
          setDecrease(true);
          setDiffCount(currentCount);
          setTotalsCount(totalsCount - 1);
        }
      }
    };
    const userListConfig = list => {
      let chartData = list,
        resultData = [],
        time = moment(),
        current_Month = time.format('MM'),
        current_Day = time.format('D'),
        current_Year = time.format('YYYY'),
        Days_Of_Month = time.daysInMonth(),
        i = 0,
        j = +current_Day;

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
      return resultData;
    };
    const usersList = async list => {
      if (!list) list = { key: 0 };
      const listVals = Object.values(list);
      arrowConfig(listVals);
      if (listVals[0] === 0) return null;
      const resultData = await userListConfig(list);
      setChartData([{ data: resultData }]);
    };
    usersSocket.on('totalUsersList', usersList);
    return () => {
      usersSocket.off('totalUsersList', usersList);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      if (gql.usersCount) setTotalsCount(gql.usersCount.count);
    };
  }, [gql.usersCount]);

  return (
    <MicroChart
      {...{
        diffCount,
        decrease,
        increase,
        onlinesCount: totalsCount,
        chartData,
        setChartData: setData,
        chartType: 'users_count',
        boxColor: '#00B1F2',
        header: 'Total users',
      }}
    />
  );
};

export default graphql(userCountQuery)(TotalUsers);
