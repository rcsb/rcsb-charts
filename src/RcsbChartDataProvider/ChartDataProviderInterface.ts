import {ChartConfigInterface, ChartObjectInterface} from "../RcsbChartComponent/ChartConfigInterface";

export interface ChartDataColumnInterface<T=any> {
    x:string|number;
    y:{value:number; color?:string; id?:T;}[];
}

export interface ChartDataValueInterface<T=any> {
    x:string|number;
    y: number;
    values: {value:number; color?:string; id?:T;}[];
    id?: T;
}

export interface ChartDataProviderInterface extends ChartDataReaderInterface {
    setData(data: ChartObjectInterface[][],  config: ChartConfigInterface): void;
}

export interface ChartDataReaderInterface {
    getChartData(): {data: ChartDataColumnInterface[]; excludedData?:ChartDataColumnInterface[]}
    xDomain(): [number, number] | undefined;
    tickValues(): string[] | number[] | undefined
}