import * as React from "react";

import {AbstractChartImplementation, AbstractChartImplementationInterface} from "../AbstractChartImplementation";
import {ChartDataInterface} from "../../RcsbChartDataProvider/ChartDataProviderInterface";
import uniqid from "uniqid";
import Chart from 'chart.js/auto';
import {DataContainer} from "../../Utils/DataContainer";
import {chartJsTooltip} from "./Components/TootlipComponent";
import {chartJsBarClick} from "./Components/BarComponent";

export class ChartJsHistogramComponent extends AbstractChartImplementation {

    private readonly elementId: string = uniqid("canvas_");
    private readonly dataContainer = new DataContainer<ChartDataInterface[]>();
    private rootElement: HTMLCanvasElement;
    private chart: Chart<"bar",number[],string>;

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

        this.chart = new Chart<"bar",number[],string>(ctx,{
            type: 'bar',
            data: getChartJsData(data),
            options:{
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'x',
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
                    tooltip: chartJsTooltip(this.dataContainer, this.props.chartConfig?.tooltipText)
                },
                onClick: chartJsBarClick(this.dataContainer)
            }
        });
    }

    shouldComponentUpdate(nextProps: Readonly<AbstractChartImplementationInterface>, nextState: Readonly<any>, nextContext: any): boolean {
        const {data}: { data: ChartDataInterface[]; excludedData?: ChartDataInterface[]; } = nextProps.dataProvider.getChartData();
        this.dataContainer.set(data);
        if(this.rootElement.style.width != nextProps.width.toString())
            this.rootElement.style.width = nextProps.width.toString();
        if(this.rootElement.style.height != nextProps.height.toString()) {
            this.rootElement.style.height = nextProps.height.toString()+"px";
        }
        this.chart.data = getChartJsData(data);
        this.chart.update();
        return false;
    }

}

function getChartJsData(data: ChartDataInterface[]){
    if(!data || data.length == 0)
        return {
            labels: [],
            datasets: []
        };
    const N = data[0].y.length;
    return {
        labels: data.map(d=>d.x.toString()),
        datasets: Array(N).fill(undefined).map((v,n)=>({
            data: data.map(d=>d.y[n].value),
            backgroundColor: data.map(d=>d.y[n].color),
        }))
    };
}