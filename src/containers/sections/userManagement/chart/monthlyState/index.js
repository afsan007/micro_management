import React, { useState } from 'react';

import cl from '../../../../../Hoc/multiclass';
import MonthlyVisitorsState from './visitors';
import MonthlyUsersState from './users';
import classes from './style.scss';

import { ReactComponent as LeftArrow } from '../../../../../assets/icons/arrows_left.svg';
import { ReactComponent as RightArrow } from '../../../../../assets/icons/arrows_right.svg';

const cn = elem => cl(elem, classes);
const MonthlyState = props => {
  const [showVisitorsChart, setShowVisitorsChart] = useState(true);
  const [showUsersChart, setShowUsersChart] = useState(false);

  const nexButtonHandler = () => {
    setShowUsersChart(true);
    setShowVisitorsChart(false);
  };

  const prevButtonHandler = () => {
    setShowUsersChart(false);
    setShowVisitorsChart(true);
  };
  const leftButton = () => {
    if (showUsersChart) {
      return (
        <button
          type="button"
          className={cn(['slick-prev', 'slick-arrow'])}
          onClick={prevButtonHandler}
        >
          <LeftArrow width="20px" height="20px" />
        </button>
      );
    }
  };
  const rightButton = () => {
    if (showVisitorsChart) {
      return (
        <button
          type="button"
          className={cn(['slick-next', 'slick-arrow'])}
          onClick={nexButtonHandler}
        >
          <RightArrow width="20px" height="20px" />
        </button>
      );
    }
  };
  return (
    <div className={classes['monthlyState-container']}>
      {leftButton()}
      {rightButton()}
      <MonthlyVisitorsState show={showVisitorsChart} />
      <MonthlyUsersState show={showUsersChart} />
    </div>
  );
};

export default MonthlyState;
