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

    private readonly elementId: string = uniqid("canvas_");
    private readonly dataContainer = new DataContainer<ChartDataColumnInterface[]>();
    private rootElement: HTMLCanvasElement;
    private chart: Chart<"bar",ChartDataType[],string>;

    render():JSX.Element {
        return (
            <div id={this.elementId} style={{position:"relative", width: this.props.width, height: this.props.height}} >
                <canvas/>
            </div>
        );
    }

    componentDidMount() {
        const {data}: { data: ChartDataColumnInterface[]; excludedData?: ChartDataColumnInterface[]; } = this.props.dataProvider.getChartData();
        this.dataContainer.set(data);
        const displayConfig: Partial<ChartDisplayConfigInterface> = this.props.chartConfig?.chartDisplayConfig ?? {};
        this.rootElement = document.getElementById(this.elementId) as HTMLCanvasElement;
        const ctx: CanvasRenderingContext2D | null | undefined = this.rootElement.getElementsByTagName("canvas").item(0)?.getContext('2d');
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
                        afterFit: (axis: Scale)=> {
                            axis.width = ChartTools.getConfig<number>("paddingLeft", displayConfig)
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: chartJsTooltip(this.props.chartConfig?.tooltipText)
                },
                onClick: chartJsBarClick(this.dataContainer, this.props.chartConfig?.barClickCallback)
            }
        });
    }

    shouldComponentUpdate(nextProps: Readonly<AbstractChartImplementationInterface>, nextState: Readonly<any>, nextContext: any): boolean {
        const {data}: { data: ChartDataColumnInterface[]; excludedData?: ChartDataColumnInterface[]; } = nextProps.dataProvider.getChartData();
        this.dataContainer.set(data);
        this.chart.data = getChartJsData(data);
        this.chart.update();
        if(this.rootElement.style.width != nextProps.width.toString())
            this.rootElement.style.width = nextProps.width.toString();
        if(this.rootElement.style.height != nextProps.height.toString()) {
            this.rootElement.style.height = nextProps.height.toString()+"px";
        }
        return false;
    }

}

function getChartJsData(data: ChartDataColumnInterface[]){
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
        }))
    };
}