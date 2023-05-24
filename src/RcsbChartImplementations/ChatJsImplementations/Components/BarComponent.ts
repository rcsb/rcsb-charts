import Chart, {ActiveElement, ChartEvent} from "chart.js/auto";
import {DataContainerReader} from "../../../Utils/DataContainer";
import {ChartDataInterface} from "../../../RcsbChartDataProvider/ChartDataProviderInterface";
import {BarClickCallbackType} from "../../../RcsbChartComponent/ChartConfigInterface";

export function chartJsBarClick(dataContainer: DataContainerReader<ChartDataInterface[]>, barClickCallback?:BarClickCallbackType) {
    if(! barClickCallback)
        return undefined;
    return (event: ChartEvent, elements: ActiveElement[], chart: Chart) => {
        console.log(event);
        console.log(elements);
        const element = elements[0];
        if(!element)
            return;
        barClickCallback({
            y: dataContainer.get()?.[element.index].y ?? [],
            x: dataContainer.get()?.[element.index].x ?? "",
            id: dataContainer.get()?.[element.index].y[element.datasetIndex].id
        }, dataContainer.get() ?? []);
    }
}