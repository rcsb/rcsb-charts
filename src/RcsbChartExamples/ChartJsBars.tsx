import * as React from "react";
import {createRoot} from "react-dom/client";
import {ChartObjectInterface} from "../RcsbChartComponent/ChartConfigInterface";
import {ChartComponent} from "../RcsbChartComponent/ChartComponent";
import {BarChartDataProvider} from "../RcsbChartDataProvider/BarChartDataProvider";
import {ChartJsBarComponent} from "../RcsbChartImplementations/ChatJsImplementations/ChartJsBarComponent";

const node: HTMLElement|null = document.getElementById("chart-element");
if(node==null)
    throw `ERROR: HTML element not found`

const data: ChartObjectInterface[]= [{
    label: "AAAAAAAA",
    population: 1,
    objectConfig: {
        color: "#bb0",
        objectId: "Yellow"
    }
},{
    label: "BBBB",
    population: 2,
    objectConfig: {
        color: "#0b0"
    }
},{
    label: "CCC",
    population: 3,
    objectConfig: {
        color: "#00b"
    }
},{
    label: "DDDDD",
    population: 1,
    objectConfig: {
        color: "#00b"
    }
},{
    label: "EE",
    population: 6,
    objectConfig: {
        color: "#00b",
        objectId: "Blue"
    }
}];

const moreData: ChartObjectInterface[]= [{
    label: "AAAAAAAA",
    population: 1,
    objectConfig: {
        color: "#b00"
    }
},{
    label: "BBBB",
    population: 1,
    objectConfig: {
        color: "#b00"
    }
},{
    label: "CCC",
    population: 1,
    objectConfig: {
        color: "#b00"
    }
},{
    label: "DDDDD",
    population: 2,
    objectConfig: {
        color: "#b00"
    }
},{
    label: "EE",
    population: 4,
    objectConfig: {
        color: "#b00",
        objectId: "Red"
    }
}]

const evenMoreData: ChartObjectInterface[] = [{
    label: "EE",
    population: 2,
    objectConfig: {
        color: "#e9c",
        objectId: "Pink"
    }
}];

const root = createRoot(node);
root.render(<ChartComponent
    data={[data, moreData, evenMoreData]}
    chartComponentImplementation={ChartJsBarComponent}
    dataProvider={new BarChartDataProvider()}
    chartConfig={{
        mostPopulatedGroups: 3,
        tooltipText: (a)=> a.id,
        barClickCallback: (e, f) => console.log(e)
    }}
/>)