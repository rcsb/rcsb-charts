import {ChartConfigInterface, ChartObjectInterface} from "../RcsbChartComponent/ChartViewInterface";
import {ChartTools} from "../RcsbChartTools/ChartTools";
import {ChartDataInterface} from "./ChartDataInterface";
import {BarData} from "../RcsbChartComponent/ChartComponents/BarComponent";

export class BarChartData implements ChartDataInterface{
    private data: ChartObjectInterface[] ;
    private subData: ChartObjectInterface[];
    private config: ChartConfigInterface;
    private stringTicks: string[];
    private excludedData: BarData[];

    public setData(data: ChartObjectInterface[], subData: ChartObjectInterface[], config: ChartConfigInterface):void {
        this.data = data;
        this.subData = subData;
        this.config = config;
    }

    public getChartData(): {barData: BarData[]; excludedData: BarData[];}{
        const data: BarData[] = ChartTools.labelsAsString(this.data);
        const subData: BarData[] = this.subData ? ChartTools.labelsAsString(this.subData) : [];

        const mergedValues: Map<string|number, number> = new Map<string, number>();
        subData.forEach((d)=>{
            mergedValues.set(d.x,0);
        });
        data.forEach((d)=>{
            mergedValues.set(d.x,d.y);
        });
        const categories: Set<string|number> = new Set(data.map(d=>d.x));
        const subCategories: Set<string|number> = new Set(subData.map(d=>d.x));
        subCategories.forEach(c=>{
            if(!categories.has(c))
                data.push({x:c, y:0, isLabel:true});
        });
        categories.forEach(c=>{
            if(!subCategories.has(c))
                subData.push({x:c, y:0, isLabel:true});
        });
        const allowedCategories: Set<string|number> = new Set<string|number>([...mergedValues.entries()]
            .sort((a,b)=>(b[1]-a[1]))
            .slice(0,this.config?.mostPopulatedGroups ?? mergedValues.size)
            .map(e=>e[0]));

        const sort = (b: BarData, a: BarData) => {
            if(mergedValues.get(b.x) != mergedValues.get(a.x))
                return mergedValues.get(b.x)-mergedValues.get(a.x);
            else
                return a.x.toString().localeCompare(b.x.toString())
        };
        const barOut: BarData[] = data.sort((a,b)=>sort(a,b)).filter(d=>(allowedCategories.has(d.x)));
        const subOut: BarData[] = subData.sort((a,b)=>sort(a,b)).filter(d=>(allowedCategories.has(d.x)));
        const excludedOut: BarData[] = data.filter(d=>(!allowedCategories.has(d.x)));
        ChartTools.addComplementaryData(barOut,subOut);
        this.stringTicks = barOut.map(d=>d.x as string);
        return {
            barData: barOut,
            excludedData: excludedOut
        };
    }

    public tickValues(): string[] {
        return this.stringTicks;
    }

    public getMissingCategories(): BarData[]{
        return this.excludedData;
    }

}