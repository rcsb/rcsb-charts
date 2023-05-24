import * as React from "react";
import {createRoot} from "react-dom/client";
import {ChartObjectInterface} from "../RcsbChartComponent/ChartConfigInterface";
import {ChartComponent} from "../RcsbChartComponent/ChartComponent";
import {HistogramChartDataProvider} from "../RcsbChartDataProvider/HistogramChartDataProvider";
import {ChartJsHistogramComponent} from "../RcsbChartImplementations/ChatJsImplementations/ChartJsHistogramComponent";

const node: HTMLElement|null = document.getElementById("chart-element");
if(node==null)
    throw `ERROR: HTML element not found`

const data: ChartObjectInterface[]= [{
    label: 1,
    population: 1,
    objectConfig: {
        color: "#bb0"
    }
},{
    label: 2,
    population: 2,
    objectConfig: {
        color: "#0b0"
    }
},{
    label: 3,
    population: 3,
    objectConfig: {
        color: "#00b"
    }
},{
    label: 4,
    population: 1,
    objectConfig: {
        color: "#00b"
    }
},{
    label: 5,
    population: 6,
    objectConfig: {
        color: "#00b"
    }
}];

const moreData: ChartObjectInterface[]= [{
    label: 1,
    population: 1,
    objectConfig: {
        color: "#b00"
    }
},{
    label: 2,
    population: 1,
    objectConfig: {
        color: "#b00"
    }
},{
    label: 3,
    population: 1,
    objectConfig: {
        color: "#b00"
    }
},{
    label: 4,
    population: 2,
    objectConfig: {
        color: "#b00"
    }
},{
    label: 5,
    population: 4,
    objectConfig: {
        color: "#b00"
    }
}]

const evenMoreData = [{
    label: 3,
    population: 2,
    objectConfig: {
        color: "#e9c"
    }
}];

const root = createRoot(node);
root.render(<ChartComponent
    data={[data, moreData, evenMoreData]}
    chartComponentImplementation={ChartJsHistogramComponent}
    dataProvider={new HistogramChartDataProvider()}
/>)