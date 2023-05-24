import {ChartDataInterface, ChartDataValuesInterface} from "../../../RcsbChartDataProvider/ChartDataProviderInterface";
import {DataContainerReader} from "../../../Utils/DataContainer";
import {TooltipItem} from "chart.js/auto";

export function chartJsTooltip(dataContainer: DataContainerReader<ChartDataInterface[]>, tooltipText?:(a: ChartDataValuesInterface) => string|undefined) {
    if(!tooltipText)
        return undefined;
    return {
        callbacks: {
            afterLabel: (tooltipItem: TooltipItem<any>) =>{
                return tooltipText?.({
                    y: tooltipItem.dataset.data[tooltipItem.datasetIndex],
                    values: tooltipItem.dataset.data,
                    index: tooltipItem.datasetIndex,
                    x: tooltipItem.label,
                    id: dataContainer.get()?.[tooltipItem.dataIndex].y[tooltipItem.datasetIndex].id
                })
            }
        }
    }
}