import {ChartDataColumnInterface, ChartDataValueInterface} from "../RcsbChartDataProvider/ChartDataProviderInterface";
import * as React from "react";

export interface ChartObjectInterface<T=any> {
    label: string|number;
    population: number;
    objectConfig?:{
        objectId?:T;
        color?:string;
    };
}

export type BarClickCallbackType = (datum:ChartDataValueInterface, data:ChartDataColumnInterface[], e?:React.MouseEvent<any>)=>void;
export interface ChartConfigInterface {
    mergeDomainMaxValue?:number;
    mostPopulatedGroups?: number;
    mergeName?: string;
    domainMinValue?:number;
    histogramBinIncrement?: number;
    tickIncrement?: {
        origin: number;
        increment: number
    };
    axisLabel?:string
    barClickCallback?:BarClickCallbackType;
    sort?:(b: ChartDataColumnInterface, a: ChartDataColumnInterface) => number;
    tooltipText?:(a: ChartDataValueInterface) => string|undefined;
    chartDisplayConfig?: Partial<ChartDisplayConfigInterface>;
}
export interface ChartDisplayConfigInterface {
    paddingLeft: number;
    paddingTopLarge: number;
    paddingTop: number;
    paddingRight: number;
    constWidth: number;
    constHeight: number;
    xIncrement: number;
    xDomainPadding: number;
    barWidth: number;
    fontFamily: string;
    fontSize: number;
}

export enum ChartType {
    pie = "pie",
    histogram = "histogram",
    barplot = "barplot"
}