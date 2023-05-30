import {
    ChartDisplayConfigInterface,
    ChartObjectInterface
} from "../RcsbChartComponent/ChartConfigInterface";
import {ChartDataColumnInterface} from "./ChartDataProviderInterface";

export class ChartTools {

    private static readonly paddingLeft: number = 150;
    private static readonly paddingTopLarge: number = 50;
    private static readonly paddingTop: number = 10;
    private static readonly paddingRight: number = 15;
    private static readonly constWidth: number = 350;
    private static readonly constHeight: number = 225;
    private static readonly xIncrement: number = 22;
    private static readonly xDomainPadding: number = 10;
    private static readonly barWidth: number = 10;
    private static readonly fontFamily: string = "\"Helvetica Neue\",Helvetica,Arial,sans-serif";
    private static readonly fontSize: number = 12;

    public static getConfig<T>(key: keyof ChartDisplayConfigInterface, chartDisplayConfig?:Partial<ChartDisplayConfigInterface>): T {
        return ((chartDisplayConfig && (typeof chartDisplayConfig[key] === "string" || typeof chartDisplayConfig[key] === "number")) ? chartDisplayConfig[key] : this[key]) as unknown as T;
    }

    public static labelsAsNumber(data: ChartObjectInterface[][]): ChartObjectInterface[][]{
        return data.map(d=>d.map(e=>({
            ...e,
            label:parseFloat(e.label.toString())
        })));
    }

    public static labelsAsString(data: ChartObjectInterface[][]): ChartObjectInterface[][]{
        return data.map(d=>d.map(e=>({
            ...e,
            label:e.label.toString()
        })));
    }

    public static normalizeData(chartData: ChartObjectInterface[][]): ChartDataColumnInterface[]{
        const dataMap: Map<string|number,ChartDataColumnInterface> = new Map<string|number,ChartDataColumnInterface>();
        chartData.flat().forEach(d=>{
            dataMap.set(d.label,{
                x:d.label,
                y:[]
            });
        });
        chartData.forEach(dataGroup=>{
            Array.from(dataMap.keys()).forEach(key=>{
                const d: ChartObjectInterface | undefined = dataGroup.find(d=>d.label==key);
                dataMap.get(key)?.y.push({value:d?.population ?? 0, color: d?.objectConfig?.color, id: d?.objectConfig?.objectId});
            });
        });
        return Array.from(dataMap.values());
    }

    public static digitGrouping(x:string|number): string {
        return parseFloat(x as string).toLocaleString( 'en-US');
    }

}