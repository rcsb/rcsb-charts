import {BarClickCallbackType} from "./ChartComponents/BarComponent";

export interface ChartObjectInterface {
    label: string|number;
    population: number;
}

export interface ChartConfigInterface {
    mergeGroupSize?: number;
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
}

export interface ChartViewInterface {
    data: ChartObjectInterface[];
    subData?: ChartObjectInterface[];
    chartConfig?:ChartConfigInterface;
}

export enum ChartType {
    pie = "pie",
    histogram = "histogram",
    barplot = "barplot"
}