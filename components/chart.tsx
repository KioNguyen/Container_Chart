import React, { useEffect, useRef } from "react";
import Chart, { ChartConfiguration, ChartOptions, Plugin } from "chart.js/auto";
import Temperature from "../data/Temperature";
import moment from "moment/moment";
import zoomPlugin from 'chartjs-plugin-zoom';
import { ZoomPluginOptions } from "chartjs-plugin-zoom/types/options";
Chart.register(zoomPlugin);

export default function App() {
    const canvasEl = useRef<any>(null);
    const [hoverBox, setHoverBox] = React.useState(false);
    const [hoverData, setHoverData] = React.useState<any>({});

    console.log(Temperature.length);
    const dataSource = Temperature.slice(0, 100).map(item => {
        item.date = moment(new Date(item.date)).format("LLLL")
        return item
    });

    const colors = {
        purple: {
            default: "rgba(149, 76, 233, 1)",
            half: "rgba(149, 76, 233, 0.5)",
            quarter: "rgba(149, 76, 233, 0.25)",
            zero: "rgba(149, 76, 233, 0)"
        },
        indigo: {
            default: "rgba(80, 102, 120, 1)",
            quarter: "rgba(80, 102, 120, 0.25)"
        }
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            const ctx: CanvasRenderingContext2D = canvasEl?.current?.getContext("2d");
            const gradient = ctx.createLinearGradient(0, 16, 0, 600);
            gradient.addColorStop(0, colors.purple.half);
            gradient.addColorStop(0.65, colors.purple.quarter);
            gradient.addColorStop(1, colors.purple.zero);

            const weight = dataSource.map(item => item.ambient + Math.random() * 20);
            const weight2 = dataSource.map(item => item.ambient + Math.random() * 20);

            const labels = dataSource.map(item => item.date);
            const data = {
                labels: labels,
                datasets: [
                    {
                        backgroundColor: gradient,
                        label: "Temperature",
                        data: weight,
                        fill: true,
                        borderWidth: 4,
                        borderColor: colors.purple.default,
                        lineTension: 0.2,
                        pointBackgroundColor: colors.purple.default,
                        pointRadius: 4,
                        yAxisId: "y"
                    },
                    {
                        backgroundColor: gradient,
                        label: "Temperature",
                        data: weight2,
                        fill: true,
                        borderWidth: 4,
                        borderColor: colors.indigo.default,
                        lineTension: 0.2,
                        pointBackgroundColor: colors.purple.default,
                        pointRadius: 4,
                        yAxisID: "y1"
                    }
                ]
            };
            const verticalLinePlugin: Plugin = {
                id: "interaction",
                afterDraw: chart => {
                    if (chart.tooltip?.getActiveElements().length) {
                        let x = chart.tooltip.getActiveElements()[0].element.x;
                        let yAxis = chart.scales.y;
                        let ctx = chart.ctx;
                        ctx.save();
                        ctx.beginPath();
                        ctx.moveTo(x, yAxis.top);
                        ctx.lineTo(x, yAxis.bottom);
                        ctx.lineWidth = 1;
                        ctx.setLineDash([3, 3]);
                        ctx.strokeStyle = '#4d4d4d';
                        ctx.stroke();
                        ctx.restore();
                    }
                }
            }
            const zoom: ZoomPluginOptions = {
                pan: {
                    enabled: true,
                    mode: 'xy',
                },
                zoom: {
                    wheel: {
                        enabled: true,
                    },
                    pinch: {
                        enabled: true
                    },
                    mode: 'xy',
                    onZoomComplete({ chart }) {
                        // This update is needed to display up to date zoom level in the title.
                        // Without this, previous zoom level is displayed.
                        // The reason is: title uses the same beforeUpdate hook, and is evaluated before zoom.
                        chart.update('none');
                    }

                }
            }

            const options: ChartOptions = {
                animation: {
                    duration: 1000
                },
                events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'],
                plugins: {
                    title: {
                        display: true,
                        text: 'Chart.js Line Chart - Cubic interpolation mode'
                    },
                    legend: {
                        display: true
                    },
                    tooltip: {
                        enabled: true,
                        mode: 'index',
                        xAlign: "center"
                    },
                    zoom
                },
                interaction: {
                    intersect: false,
                    mode: 'index',
                }

            }
            const config: ChartConfiguration = {
                type: "line",
                data: data,
                plugins: [verticalLinePlugin],
                options
            };

            const myLineChart = new Chart(ctx, config);

            return function cleanup() {
                myLineChart.destroy();
            };
        }

    });



    return (
        <div className="App">
            <span>Chart.js Demo</span>
            <canvas id="myChart" ref={canvasEl} height="100" />
        </div>
    );
}