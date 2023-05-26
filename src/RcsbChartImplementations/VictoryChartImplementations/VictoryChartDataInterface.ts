
export interface VictoryChartDataInterface {
    x:string|number;
    y:number;
    values:{value:number; color?:string; id?:any;}[];
    index:number;
    label?:string;
    color?:string;
    id?:any;
}