import * as React from "react";

import {AbstractChartImplementation, AbstractChartImplementationInterface} from "../AbstractChartImplementation";
import {ChartDataInterface} from "../../RcsbChartDataProvider/ChartDataProviderInterface";
import uniqid from "uniqid";
import Chart from 'chart.js/auto';
import {DataContainer} from "../../Utils/DataContainer";
import {chartJsTooltip} from "./Components/TootlipComponent";
import {chartJsBarClick} from "./Components/BarComponent";

type ChartDataType = {x: string;y :number;};
export class ChartJsHistogramComponent extends AbstractChartImplementation {

    private readonly elementId: string = uniqid("canvas_");
    private readonly dataContainer = new DataContainer<ChartDataInterface[]>();
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
        const {data}: { data: ChartDataInterface[]; excludedData?: ChartDataInterface[]; } = this.props.dataProvider.getChartData();
        this.dataContainer.set(data);
        this.rootElement = document.getElementById(this.elementId) as HTMLCanvasElement;
        const ctx: CanvasRenderingContext2D | null | undefined = this.rootElement.getElementsByTagName("canvas").item(0)?.getContext('2d');
        if(!ctx)
            return;

        console.log(getChartJsData(data));
        this.chart = new Chart<"bar",ChartDataType[],string>(ctx,{
            type: 'bar',
            data: getChartJsData(data),
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
                        stacked: true
                    },
                    y: {
                        stacked: true
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: chartJsTooltip(this.props.chartConfig?.tooltipText)
                },
                onClick: chartJsBarClick(this.dataContainer)
            }
        });
    }

    shouldComponentUpdate(nextProps: Readonly<AbstractChartImplementationInterface>, nextState: Readonly<any>, nextContext: any): boolean {
        const {data}: { data: ChartDataInterface[]; excludedData?: ChartDataInterface[]; } = nextProps.dataProvider.getChartData();
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
function getChartJsData(data: ChartDataInterface[]){
    if(!data || data.length == 0)
        return {
            datasets: []
        };
    const N = data[0].y.length;
    return {
        datasets: Array(N).fill(undefined).map((v,n)=>({
            data: data.filter(d=>d.y[n].value > 0).map(d=>({x:d.x.toString(), y:d.y[n].value, id:d.y[n].id})),
            backgroundColor: data.filter(d=>d.y[n].value > 0).map(d=>d.y[n].color ?? "#999"),
        }))
    };
}
