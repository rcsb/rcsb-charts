import Chart, {ActiveElement, ChartEvent} from "chart.js/auto";
import {DataContainerReader} from "../../../Utils/DataContainer";
import {ChartDataColumnInterface} from "../../../RcsbChartDataProvider/ChartDataProviderInterface";
import {BarClickCallbackType} from "../../../RcsbChartComponent/ChartConfigInterface";
import Element from "chart.js/dist/core/core.element";

type RawType = {x:string|number; y:number; id:any;};
export function chartJsBarClick(dataContainer: DataContainerReader<ChartDataColumnInterface[]>, axis: "x"|"y", barClickCallback?:BarClickCallbackType) {
    if(! barClickCallback)
        return undefined;
    return (event: ChartEvent, elements: ActiveElement[], chart: Chart) => {
        if(!elements || !Array.isArray(elements) || elements.length == 0 ||!elements[0].element)
            return;
        const element: Element<any,any> & {'$context': {raw:RawType;index:number;} & {parsed:{y:number;x: number;}}} = elements[0].element as any;
        barClickCallback({
            values: dataContainer.get()?.[element.$context.index].y.filter(d=>d.value>0) ?? [],
            y: element.$context.raw.y,
            x: element.$context.raw.x,
            id: element.$context.raw.id
        }, dataContainer.get() ?? [], event.native as any);
    }
}