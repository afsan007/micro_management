import React, { useEffect } from 'react';
import moment from 'moment';
import { isEqual } from 'lodash';
import { ReactComponent as DownArrow } from '../../../../assets/icons/arrows_down_double.svg';
import { ReactComponent as UpArrow } from '../../../../assets/icons/arrows_up_double.svg';

import classes from './style.scss';
import MicroState from '../microState';

const MicroChart = props => {
  const {
    diffCount,
    decrease,
    increase,
    onlinesCount,
    chartData,
    setChartData,
    chartType,
    boxColor,
    header,
  } = props;

  let Days_Of_Month = moment().daysInMonth();

  useEffect(() => {
    let j = 0;
    let finalData = [];
    while (j < Days_Of_Month) {
      finalData[j] = 0;
      j++;
    }

    setChartData([{ data: finalData }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const arrowDownHandler = () => {
    let classArray = [classes.arrow_down];
    if (decrease) classArray.push(classes.visible);
    return classArray.join(' ');
  };

  const arrowUpHandler = () => {
    let classArray = [classes.arrow_up];
    if (increase) classArray.push(classes.visible);
    return classArray.join(' ');
  };
  return (
    <div className={classes.container}>
      <h5 className={classes.header} style={{ background: boxColor }}>
        {header}
      </h5>
      <div className={classes.counter_section}>
        <span className={classes.counter}>
          {onlinesCount}
          {/* <span>{diffCount ? diffCount : ''}</span> */}
        </span>
        <span className={arrowUpHandler()}>
          <UpArrow width="15px" height="15px" />
        </span>
        <span className={arrowDownHandler()}>
          <DownArrow width="15px" height="15px" />
        </span>
      </div>
      <MicroState type={chartType} color={boxColor} series={chartData} />
    </div>
  );
};

export default React.memo(MicroChart, isEqual);
