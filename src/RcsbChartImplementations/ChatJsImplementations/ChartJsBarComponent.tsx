import * as React from "react";

import {AbstractChartImplementation, AbstractChartImplementationInterface} from "../AbstractChartImplementation";
import {ChartDataColumnInterface} from "../../RcsbChartDataProvider/ChartDataProviderInterface";
import {ChartDisplayConfigInterface} from "../../RcsbChartComponent/ChartConfigInterface";
import uniqid from "uniqid";
import Chart, {Scale} from 'chart.js/auto';
import {ChartTools} from "../../RcsbChartDataProvider/ChartTools";
import {DataContainer} from "../../Utils/DataContainer";
import {chartJsTooltip} from "./Components/TootlipComponent";
import {chartJsBarClick} from "./Components/BarComponent";

type ChartDataType = {x: string;y :number;};
export class ChartJsBarComponent extends AbstractChartImplementation {

    private static readonly AXIS_LABEL_THR: number = 10;
    private readonly elementId: string = uniqid("canvas_");
    private readonly dataContainer = new DataContainer<ChartDataColumnInterface[]>();
    private readonly canvasRef: React.RefObject<HTMLCanvasElement> = React.createRef();
    private readonly rootRef: React.RefObject<HTMLDivElement> = React.createRef();
    private chart: Chart<"bar",ChartDataType[],string>;

    render():JSX.Element {
        return (
            <div id={this.elementId} ref={this.rootRef} style={{position:"relative", width: this.props.width, height: this.props.height}} >
                <canvas ref={this.canvasRef}/>
            </div>
        );
    }

    componentDidMount() {
        const {data}: { data: ChartDataColumnInterface[]; excludedData?: ChartDataColumnInterface[]; } = this.props.dataProvider.getChartData();
        this.dataContainer.set(data);
        const displayConfig: Partial<ChartDisplayConfigInterface> = this.props.chartConfig?.chartDisplayConfig ?? {};
        const ctx: CanvasRenderingContext2D | null | undefined = this.canvasRef.current?.getContext('2d');
        if(!ctx)
            return;

        this.chart = new Chart<"bar",ChartDataType[],string>(ctx,{
            type: 'bar',
            data: getChartJsData(data),
            options:{
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                parsing: {
                    xAxisKey: 'y',
                    yAxisKey: 'x',
                },
                scales: {
                    x: {
                        stacked: true
                    },
                    y: {
                        stacked: true,
                        afterFit: function (axis: Scale) {
                            axis.width = ChartTools.getConfig<number>("paddingLeft", displayConfig)
                        },
                        ticks: {
                            callback: function (value, index) {
                                return this.getLabelForValue(value as number).split("").reduce(
                                    (prev, curr, index)=> ctx.measureText(prev+curr).width + ChartJsBarComponent.AXIS_LABEL_THR < ChartTools.getConfig<number>("paddingLeft", displayConfig) ? prev+curr : prev,
                                    ""
                                );
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
                onClick: chartJsBarClick(this.dataContainer, "y", this.props.chartConfig?.barClickCallback)
            }
        });
    }

    shouldComponentUpdate(nextProps: Readonly<AbstractChartImplementationInterface>, nextState: Readonly<any>, nextContext: any): boolean {
        const {data}: { data: ChartDataColumnInterface[]; excludedData?: ChartDataColumnInterface[]; } = nextProps.dataProvider.getChartData();
        this.dataContainer.set(data);
        this.chart.data = getChartJsData(data);
        this.chart.update();
        if(this.rootRef.current && this.rootRef.current.style.width != nextProps.width.toString())
            this.rootRef.current.style.width = nextProps.width.toString();
        if(this.rootRef.current && this.rootRef.current.style.height != nextProps.height.toString()) {
            this.rootRef.current.style.height = nextProps.height.toString()+"px";
        }
        return false;
    }

}

function getChartJsData(data: ChartDataColumnInterface[], displayConfig?: ChartDisplayConfigInterface){
    if(!data || data.length == 0)
        return {
            datasets: []
        };
    const reverseData = data.reverse();
    const N = reverseData[0].y.length;
    return {
        datasets: Array(N).fill(undefined).map((v,n)=>({
            data: reverseData.filter(d=>d.y[n].value > 0).map(d=>({x:d.x.toString(), y:d.y[n].value, id:d.y[n].id})),
            backgroundColor: reverseData.filter(d=>d.y[n].value > 0).map(d=>d.y[n].color ?? "#999"),
            minBarLength: 5,
            barThickness: displayConfig?.barWidth ?? 10
        }))
    };
}