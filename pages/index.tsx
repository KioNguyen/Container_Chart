// import React, { useEffect, useRef } from "react";
// import Chart, { ChartConfiguration, Plugin } from "chart.js/auto";
// import Temperature from "../data/Temperature";
// import moment from "moment/moment";
// import zoomPlugin from 'chartjs-plugin-zoom';
// Chart.register(zoomPlugin);

import dynamic from 'next/dynamic'

const DynamicComponentWithNoSSR = dynamic(() => import('../components/chart'), {
  ssr: false
})

export default () => <DynamicComponentWithNoSSR />  