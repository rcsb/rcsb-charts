import {
    ChartDataValueInterface
} from "../../../RcsbChartDataProvider/ChartDataProviderInterface";
import {TooltipItem} from "chart.js/auto";

type RawType = {x:string|number; y:number; id:any;};
export function chartJsTooltip(tooltipText?:(a: ChartDataValueInterface) => string|undefined) {
    if(!tooltipText)
        return undefined;
    return {
        callbacks: {
            title: function (){
                return '';
            },
            label: function (tooltipItem: TooltipItem<any>){
                const raw: RawType = tooltipItem.raw as RawType;
                return tooltipText?.({
                    values: tooltipItem.dataset.data,
                    y: raw.y,
                    x: raw.x,
                    id: raw.id
                })
            }
        }
    }
}