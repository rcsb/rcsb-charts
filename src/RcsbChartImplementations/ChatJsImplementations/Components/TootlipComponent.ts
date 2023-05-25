import {ChartDataValuesInterface} from "../../../RcsbChartDataProvider/ChartDataProviderInterface";
import {TooltipItem} from "chart.js/auto";

type RawType = {x:string|number; y:number; id:any;};
export function chartJsTooltip(tooltipText?:(a: ChartDataValuesInterface) => string|undefined) {
    if(!tooltipText)
        return undefined;
    return {
        callbacks: {
            afterLabel: (tooltipItem: TooltipItem<any>) =>{
                const raw: RawType = tooltipItem.raw as RawType;
                return tooltipText?.({
                    y: raw.y,
                    values: tooltipItem.dataset.data,
                    index: tooltipItem.datasetIndex,
                    x: raw.x,
                    id: raw.id
                })
            }
        }
    }
}