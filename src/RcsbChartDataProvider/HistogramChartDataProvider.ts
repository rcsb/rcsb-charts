import {ChartDataProviderInterface, ChartDataColumnInterface} from "./ChartDataProviderInterface";
import {ChartConfigInterface, ChartObjectInterface} from "../RcsbChartComponent/ChartConfigInterface";
import {ChartTools} from "./ChartTools";

export class HistogramChartDataProvider implements ChartDataProviderInterface{

    private config: ChartConfigInterface;
    private data: ChartDataColumnInterface[];

    public setData(chartData: ChartObjectInterface[][], config?: ChartConfigInterface):void {
        this.config = config ?? {};
        const data: ChartDataColumnInterface[] = ChartTools.normalizeData(ChartTools.labelsAsNumber(chartData));
        const barData: ChartDataColumnInterface[] = this.transformData(data)
        this.data = barData.sort((r,s)=>((r.x as number)-(s.x as number)));
    }

    public getChartData(): { data: ChartDataColumnInterface[]; } {
        return {data: this.data};
    }

    public xDomain(): [number, number]{
        const dx: number = (this.config?.histogramBinIncrement ? this.config?.histogramBinIncrement*0.5 : 0);
        return [
            this.config?.domainMinValue ?? Math.floor(Math.min(...this.data.map(d=>d.x as number))) - dx,
            this.config?.mergeDomainMaxValue ?
                Math.ceil(this.config?.mergeDomainMaxValue) + dx
                :
                Math.ceil(Math.max(...this.data.map(d=>d.x as number))) + dx
        ]
    }

    public tickValues(): number[] | undefined {
        if(this.config?.tickIncrement){
            const tickValues: number[] = [];
            for(let i: number=this.config.tickIncrement.origin;i<=this.xDomain()[1];i+=this.config.tickIncrement.increment){
                tickValues.push(i);
            }
            return tickValues
        }
        return undefined;
    }

    private transformData(data: ChartDataColumnInterface[]): ChartDataColumnInterface[]{
        if(!data)
            return [];
        let out: ChartDataColumnInterface[] = data;
        if(this.config?.mergeDomainMaxValue) {
            out = ChartTools.mergeDomainMaxValue(data, this.config.mergeDomainMaxValue);
        }
        return out.map(d=>({x:(d.x as number),y:d.y}));
    }

}