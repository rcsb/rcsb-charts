import Chart, {ActiveElement, ChartEvent} from "chart.js/auto";
import {DataContainerReader} from "../../../Utils/DataContainer";
import {ChartDataColumnInterface} from "../../../RcsbChartDataProvider/ChartDataProviderInterface";
import {BarClickCallbackType} from "../../../RcsbChartComponent/ChartConfigInterface";
import Element from "chart.js/dist/core/core.element";

type RawType = {x:string|number; y:number; id:unknown;};
export function chartJsBarClick(dataContainer: DataContainerReader<ChartDataColumnInterface[]>, barClickCallback?:BarClickCallbackType) {
    if(! barClickCallback)
        return undefined;
    return (event: ChartEvent, elements: ActiveElement[], chart: Chart) => {
        const element: Element<any,any> & {'$context': {raw:RawType;} & {parsed:{y:number;}}} = elements[0].element as any;
        if(!element)
            return;
        barClickCallback({
            values: dataContainer.get()?.[element.$context.parsed.y].y.filter(d=>d.value>0) ?? [],
            y: element.$context.raw.y,
            x: element.$context.raw.x,
            id: element.$context.raw.id
        }, dataContainer.get() ?? []);
    }
}