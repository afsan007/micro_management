import React from 'react';
import Chart from 'react-apexcharts';

import classes from './style.scss';
import cl from '../../../../../../Hoc/multiclass';
import chartData from './data.json';
const cn = elem => cl(elem, classes);

const MonthlyVisitorsState = props => {
  const series = () => {
    return [
      { name: 'Jun', data: [30, 60, 100, 15, 25, 28, 38, 46, 48, 49] },
      { name: 'July', data: [20, 29, 37] },
      { name: 'Aguest', data: [20, 29, 37, 15, 25, 28, 38] },
      { name: 'February', data: [20, 29, 37, 15, 25, 28, 38] },
    ];
  };

  const chart = () => {
    return {
      toolbar: { show: true },
      events: {
        beforeMount: (chartContext, config) => {
          // console.log('beforeMounted')
        },
        mounted: (chartContext, config) => {
          // console.log('Mounted')
        },
      },
      height: 100,
    };
  };

  const xaxis = () => {
    return {
      categories: ['01', '02', '03', '04', '05', '06', '07', '08'],
      labels: {
        show: true,
        style: {
          colors: '#ccc',
        },
      },
    };
  };
  const options = () => {
    const { fill, dataLabels, noData, yaxis, legend, grid } = chartData;
    return {
      fill,
      dataLabels,
      noData,
      yaxis,
      grid,
      legend,
      xaxis: xaxis(),
      chart: chart(),
    };
  };
  const showHandler = () => {
    let containerClass = ['visits-chart'];
    if (!props.show) containerClass.push('hide');
    return containerClass;
  };
  return (
    <div className={cn(showHandler())}>
      <Chart options={options()} series={series()} type="area" width="100%" height="300px" />
    </div>
  );
};

export default MonthlyVisitorsState;
