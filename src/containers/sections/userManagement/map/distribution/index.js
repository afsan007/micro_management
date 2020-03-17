import React, { useState, useEffect, useCallback } from 'react';
import { ProgressBar } from 'react-bootstrap';
import shortNum from 'short-number';

import cl from '../../../../../Hoc/multiclass';
import Aux from '../../../../../Hoc/wrapper';
import classes from './style.scss';
import NodataSvg from './loading';

export default React.memo(props => {
  let { mapType, visiSocket, mapClicked } = props;
  // states
  const [mapInitialData, set_mapInitialData] = useState([]);
  const [mapSpecificData, set_mapSpecificData] = useState(null);
  const [hasVisitor, set_hasVisitor] = useState(false);
  const [worldAlarm, set_worldAlarm] = useState(false);
  const [dataLoading, set_dataLoading] = useState(true);
  const cn = elem => cl(elem, classes);

  const initialize = useCallback(
    (reset = false) => {
      visiSocket.emit('visitorsTopCountry', { mapType });
      visiSocket.on('visitorsTopCountry_callback', countries => {
        if (reset) {
          set_mapSpecificData(null);
          set_worldAlarm(false);
        }
        set_mapInitialData(countries);
      });
    },
    [mapType, visiSocket],
  );

  useEffect(() => {
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // componentDidUpdate
  useEffect(() => {
    if (mapClicked.id !== 'world') {
      visiSocket.emit('visitorsCountryDetail', {
        countryId: mapClicked.id,
        mapType: mapType,
      });
      set_worldAlarm(true);
    } else initialize(true);
  }, [mapClicked, mapType, visiSocket, initialize]);

  // componentDidUpdate
  useEffect(() => {
    return () => {
      set_dataLoading(false);
    };
  }, [mapInitialData, mapSpecificData]);

  //componentDidMount
  useEffect(() => {
    let visCountry = 'visitorsCountryDetail_receive';
    let visYearlyStateCountry = 'visitorsYearlyStateCountry';

    let visCountry_listener = reply => {
      if (reply && reply !== '{}') {
        set_mapSpecificData(JSON.parse(reply));
        set_hasVisitor(true);
      } else set_hasVisitor(false);
    };

    let visYearlyStateCountry_listener = yearly => {
      if (yearly !== null) initialize();
    };

    visiSocket.on(visCountry, visCountry_listener);
    visiSocket.on(visYearlyStateCountry, visYearlyStateCountry_listener);
    return () => {
      visiSocket.off(visCountry, visCountry_listener);
      visiSocket.off(visYearlyStateCountry, visYearlyStateCountry_listener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // designBody
  const mainData = () => {
    let mapData = mapSpecificData ? mapSpecificData : mapInitialData;
    if (Object.keys(mapData).length === 0) return <NodataSvg />;
    return mapData.map(data => (
      <div key={data.region} className={cn(['MapData-info'])}>
        <h5 className={cn(['mb-5'])} title={+data.count}>
          {shortNum(+data.count)}
        </h5>
        <small className={cn(['small-grey-med'])}> Visitors From {data.region} </small>
        <span className={cn(['percent-span'])}>{data.percent}%</span>
        <div className={cn(['progress-bar'])}>
          <ProgressBar animated now={data.percent} />
        </div>
      </div>
    ));
  };
  const backBtn = () => {
    return worldAlarm && (Object.keys(mapInitialData).length === 0 || mapSpecificData) ? (
      <button
        onClick={() => props.clearSelectedCountry(true)}
        className={cn(['MapData-backToWorld'])}
      >
        World Distribution
      </button>
    ) : (
      ''
    );
  };
  const headerData = () => {
    return (
      <div className={cn(['MapData-header'])}>
        {props.mapClicked && hasVisitor ? props.mapClicked.dataset.tip : 'World'}
      </div>
    );
  };

  // render
  return !dataLoading ? (
    <Aux>
      {headerData()}
      {mainData()}
      {backBtn()}
    </Aux>
  ) : (
    <div className={classes.wrapper}>
      <div className={classes.circle}></div>
      <div className={classes.circle}></div>
      <div className={classes.circle}></div>
      <div className={classes.shadow}></div>
      <div className={classes.shadow}></div>
      <div className={classes.shadow}></div>
      <span>Loading</span>
    </div>
  );
});
