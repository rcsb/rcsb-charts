import * as React from "react";

import {AbstractChartImplementationInterface} from "../AbstractChartImplementation";
import {ChartDataColumnInterface} from "../../RcsbChartDataProvider/ChartDataProviderInterface";
import uniqid from "uniqid";
import Chart, {Scale} from 'chart.js/auto';
import {DataContainer} from "../../Utils/DataContainer";
import {chartJsTooltip} from "./Components/TootlipComponent";
import {chartJsBarClick} from "./Components/BarComponent";
import {ChartTools} from "../../RcsbChartDataProvider/ChartTools";
import {ChartConfigInterface, ChartDisplayConfigInterface} from "../../RcsbChartComponent/ChartConfigInterface";
import {ReactNode} from "react";

type ChartDataType = {x: number;y :number;};
export class ChartJsHistogramComponent extends React.Component<AbstractChartImplementationInterface> {

    private readonly elementId: string = uniqid("canvas_");
    private readonly dataContainer = new DataContainer<ChartDataColumnInterface[]>();
    private readonly canvasRef: React.RefObject<HTMLCanvasElement | null> = React.createRef();
    private readonly rootRef: React.RefObject<HTMLDivElement | null> = React.createRef();
    private chart: Chart<"bar",ChartDataType[],string>;

    render(): ReactNode {
        return (
            <div ref={this.rootRef} id={this.elementId} style={{position:"relative", width: this.props.width, height: this.props.height}} >
                <canvas ref={this.canvasRef}/>
            </div>
        );
    }

    componentDidMount() {
        const {data}: { data: ChartDataColumnInterface[]; excludedData?: ChartDataColumnInterface[]; } = this.props.dataProvider.getChartData();
        this.dataContainer.set(data);
        const chartConfig: ChartConfigInterface|undefined = this.props.chartConfig;
        const displayConfig: Partial<ChartDisplayConfigInterface> = chartConfig?.chartDisplayConfig ?? {};
        const ctx: CanvasRenderingContext2D | null | undefined = this.canvasRef.current?.getContext('2d');
        if(!ctx)
            return;

        this.chart = new Chart<"bar",ChartDataType[],string>(ctx,{
            type: 'bar',
            data: getChartJsData(data, this.props.chartConfig),
            options:{
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'x',
                parsing: {
                    xAxisKey: 'x',
                    yAxisKey: 'y',
                },
                scales: {
                    x: {
                        type: 'linear',
                        title: {
                            display: true,
                            text: this.props.chartConfig?.axisLabel
                        },
                        stacked: true,
                        ticks: {
                            callback: function(value, index) {
                                if(chartConfig?.tickFormat?.domAxis)
                                    return chartConfig.tickFormat.domAxis(this.getLabelForValue(value as number));
                                return this.getLabelForValue(value as number);
                            },
                            font: {
                                family: ChartTools.getConfig<string>("fontFamily", displayConfig),
                                size: ChartTools.getConfig<number>("fontSize", displayConfig)
                            }
                        },
                        suggestedMin: this.props.chartConfig?.domainMinValue,
                        suggestedMax: this.props.chartConfig?.domainMaxValue
                    },
                    y: {
                        stacked: true,
                        afterFit: function (axis: Scale) {
                            axis.width = ChartTools.getConfig<number>("paddingLeft", displayConfig)
                        },
                        ticks: {
                            font: {
                                family: ChartTools.getConfig<string>("fontFamily", displayConfig),
                                size: ChartTools.getConfig<number>("fontSize", displayConfig)
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: chartJsTooltip(this.props.chartConfig?.tooltipText)
                },
                onClick: chartJsBarClick(this.dataContainer, "x", this.props.chartConfig?.barClickCallback)
            }
        });
    }

    shouldComponentUpdate(nextProps: Readonly<AbstractChartImplementationInterface>, nextState: Readonly<any>, nextContext: any): boolean {
        const {data}: { data: ChartDataColumnInterface[]; excludedData?: ChartDataColumnInterface[]; } = nextProps.dataProvider.getChartData();
        this.dataContainer.set(data);
        this.chart.data = getChartJsData(data, this.props.chartConfig);
        this.chart.update();
        if(this.rootRef.current && this.rootRef.current.style.width != nextProps.width.toString())
            this.rootRef.current.style.width = nextProps.width.toString();
        if(this.rootRef.current && this.rootRef.current.style.height != nextProps.height.toString()) {
            this.rootRef.current.style.height = nextProps.height.toString()+"px";
        }
        return false;
    }

}
function getChartJsData(data: ChartDataColumnInterface[], chartConfig?: ChartConfigInterface){
    if(!data || data.length == 0)
        return {
            datasets: []
        };
    const N = data[0].y.length;
    return {
        datasets: Array(N).fill(undefined).map((v,n)=>({
            data: data.filter(d=>d.y[n].value > 0 || chartConfig?.domainEmptyBins).map(d=>({
                x:d.x as number,
                y: d.y[n].value == 0 ? (null as unknown as number) : d.y[n].value,
                id:d.y[n].id
            })),
            backgroundColor: data.filter(d=>d.y[n].value > 0 || chartConfig?.domainEmptyBins).map(d=>d.y[n].color ?? "#999"),
            minBarLength: ChartTools.getConfig<number>("minBarLength",  chartConfig?.chartDisplayConfig)
        }))
    };
}
