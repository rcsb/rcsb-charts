import * as React from "react";
import {createRoot} from "react-dom/client";
import {
    VictoryHistogramChartComponent
} from "../RcsbChartImplementations/VictoryChartImplementations/VictoryHistogramChartComponent";
import {ChartObjectInterface} from "../RcsbChartComponent/ChartConfigInterface";
import {ChartComponent} from "../RcsbChartComponent/ChartComponent";
import {HistogramChartDataProvider} from "../RcsbChartDataProvider/HistogramChartDataProvider";
import {ChartDataValueInterface} from "../RcsbChartDataProvider/ChartDataProviderInterface";
import {ChartJsHistogramComponent} from "../RcsbChartImplementations/ChatJsImplementations/ChartJsHistogramComponent";

const node: HTMLElement|null = document.getElementById("chart-element");
if(node==null)
    throw `ERROR: HTML element not found`

const data:ChartObjectInterface[][]= [
    [{
        label: 1,
        population: 1
    },{
        label: 2,
        population: 2
    },{
        label: 3,
        population: 3
    }],[{
        label: 1,
        population: 1
    },{
        label: 2,
        population: 2
    },{
        label: 3,
        population: 3,
        objectConfig:{
            color:"#f00",
            objectId:"2_3"
        }
    }],[{
        label: 3,
        population: 3,
        objectConfig:{
            color:"#0f0",
            objectId:"3_3"
        }
    }],[{
        label:4,
        population:4,
        objectConfig:{
            color: "#00f",
            objectId:"4_4"
        }
    }]
]

const root = createRoot(node);
root.render(<ChartComponent
    data={data}
    chartComponentImplementation={ChartJsHistogramComponent}
    dataProvider={new HistogramChartDataProvider()}
    chartConfig={{
        histogramBinIncrement:1,
        tooltipText: (a: ChartDataValueInterface<string>)=>{
            if(typeof a.id == "string")
                return ['Title King', `value: ${a.y}`, `x: ${a.x}`, `id: ${a.id}`];
        },
        barClickCallback: (a) => console.log(a),
        chartDisplayConfig: {
            constHeight: 1000
        },
        domainMaxValue:10
    }}
/>)