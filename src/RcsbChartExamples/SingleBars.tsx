import * as React from "react";
import {createRoot} from "react-dom/client";
import {ChartObjectInterface} from "../RcsbChartComponent/ChartConfigInterface";
import {ChartComponent} from "../RcsbChartComponent/ChartComponent";
import {
    VictoryBarChartComponent
} from "../RcsbChartImplementations/VictoryChartImplementations/VictoryBarChartComponent";
import {BarChartDataProvider} from "../RcsbChartDataProvider/BarChartDataProvider";
import {ChartJsBarComponent} from "../RcsbChartImplementations/ChatJsImplementations/ChartJsBarComponent";

const node: HTMLElement|null = document.getElementById("chart-element");
if(node==null)
    throw `ERROR: HTML element not found`

const data:ChartObjectInterface[]= [{
    label: "A",
    population: 1
},{
    label: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    population: 2
},{
    label: "C",
    population: 3
},{
    label: "D",
    population: 1
},{
    label: "E",
    population: 6
}]

const root = createRoot(node);
root.render(<ChartComponent
    data={[data]}
    chartComponentImplementation={ChartJsBarComponent}
    dataProvider={new BarChartDataProvider()}
    chartConfig={{
        mostPopulatedGroups: 3,
        chartDisplayConfig: {
            constWidth: 100
        }
    }}
/>)