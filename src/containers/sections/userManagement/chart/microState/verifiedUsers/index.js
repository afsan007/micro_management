import React, { useCallback, useState, useEffect } from 'react';
import { graphql } from 'react-apollo';
import moment from 'moment';

import verifiedUserCount from '../../../../../../Graphql/queries/verifiedUsers';
import MicroChart from '../../../../../../components/layout/chart/microChart';

const VerifiedUsers = props => {
  const usersSocket = props.socket;
  const gql = props.data;

  const [verifiedCount, setVerifiedCount] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [diffCount, setDiffCount] = useState(0);

  const [decrease, setDecrease] = useState(false);
  const [increase, setIncrease] = useState(false);

  const setData = useCallback(setChartData, []);
  useEffect(() => {
    let arrowConfig = list => {
      if (!diffCount) {
        setDiffCount(Object.values(list));
      } else {
        let prevCount = diffCount;
        let currentCount = Object.values(list);
        if (prevCount < currentCount) {
          setIncrease(true);
          setDecrease(false);
          setDiffCount(currentCount);
          setVerifiedCount(verifiedCount + 1);
        }
        if (prevCount > currentCount) {
          setIncrease(false);
          setDecrease(true);
          setDiffCount(currentCount);
          setVerifiedCount(verifiedCount - 1);
        }
      }
    };
    let usersListConfig = list => {
      let chartData = list;
      let resultData = [];
      let time = moment();
      let current_Month = time.format('MM');
      let current_Day = time.format('D');
      let current_Year = time.format('YYYY');
      let Days_Of_Month = time.daysInMonth();
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
    let totalUsersList = list => {
      if (!list) list = { key: 0 };
      arrowConfig(list);
      if (Object.values(list)[0] === 0) return null;
      usersListConfig(list);
    };
    usersSocket.on('totalVerifiedUsersList', totalUsersList);
    return () => {
      usersSocket.off('totalVerifiedUsersList', totalUsersList);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initialCount = () => {
    let receivedUsers = gql.verifiedUsersCount;
    if (receivedUsers) return receivedUsers.count === 0 ? verifiedCount : receivedUsers.count;
  };
  return (
    <MicroChart
      {...{
        diffCount,
        decrease,
        increase,
        onlinesCount: initialCount(),
        chartData,
        setChartData: setData,
        chartType: 'users_verified',
        boxColor: '#662E9B',
        header: 'Verified users',
      }}
    />
  );
};

export default graphql(verifiedUserCount)(VerifiedUsers);
