import * as React from "react";
import {createRoot} from "react-dom/client";
import {
    VictoryHistogramChartComponent
} from "../RcsbChartImplementations/VictoryChartImplementations/VictoryHistogramChartComponent";
import {ChartObjectInterface} from "../RcsbChartComponent/ChartConfigInterface";
import {ChartComponent} from "../RcsbChartComponent/ChartComponent";
import {HistogramChartDataProvider} from "../RcsbChartDataProvider/HistogramChartDataProvider";

const node: HTMLElement|null = document.getElementById("chart-element");
if(node==null)
    throw `ERROR: HTML element not found`

const data:ChartObjectInterface[]= [{
    label: 1,
    population: 1
},{
    label: 2,
    population: 2
},{
    label: 3,
    population: 3
}]

const root = createRoot(node);
root.render(<ChartComponent
    data={[data]}
    chartComponentImplementation={VictoryHistogramChartComponent}
    dataProvider={new HistogramChartDataProvider()}
    chartConfig={{
        histogramBinIncrement:1,
        chartDisplayConfig:{
            constHeight: 600
        }
    }}
/>)