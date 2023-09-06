import {
    ChartDataValueInterface
} from "../../../RcsbChartDataProvider/ChartDataProviderInterface";
import {TooltipItem} from "chart.js/auto";
import {ChartDataset} from "chart.js/dist/types";

type RawType = {x:string|number; y:number; id:any;};
export function chartJsTooltip(tooltipText?:(a: ChartDataValueInterface) => string|string[]|undefined) {
    if(!tooltipText)
        return undefined;
    return {
        callbacks: {
            title: function(tooltipItem: TooltipItem<any>[]) {
                const raw: RawType = tooltipItem[0].raw as RawType;
                const tt= tooltipText?.({
                    values: tooltipItem[0].dataset.data,
                    y: raw.y,
                    x: raw.x,
                    id: raw.id
                });
                if(Array.isArray(tt))
                    return tt[0];
                return raw.x.toString();
            },
            label: function (tooltipItem: TooltipItem<any>){
                const raw: RawType = tooltipItem.raw as RawType;
                const tt= tooltipText?.({
                    values: tooltipItem.chart.data.datasets.map(d=>d.data).flat<ChartDataset<any,any>[]>().filter(d=>d.x == raw.x).map(d=>({value: d.y, id:d.id})),
                    y: raw.y,
                    x: raw.x,
                    id: raw.id
                })
                if(Array.isArray(tt))
                    return tt.slice(1);
                return tt;
            }
        }
    }
}