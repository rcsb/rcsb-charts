import Chart, {ActiveElement, ChartEvent} from "chart.js/auto";
import {DataContainerReader} from "../../../Utils/DataContainer";
import {ChartDataInterface} from "../../../RcsbChartDataProvider/ChartDataProviderInterface";
import {BarClickCallbackType} from "../../../RcsbChartComponent/ChartConfigInterface";
import Element from "chart.js/dist/core/core.element";

type RawType = {x:string|number; y:number; id:any;};
export function chartJsBarClick(dataContainer: DataContainerReader<ChartDataInterface[]>, barClickCallback?:BarClickCallbackType) {
    if(! barClickCallback)
        return undefined;
    return (event: ChartEvent, elements: ActiveElement[], chart: Chart) => {
        const element: Element<any,any> & {'$context': {raw:RawType;} & {parsed:{y:number;}}} = elements[0].element as any;
        if(!element)
            return;
        barClickCallback({
            y: dataContainer.get()?.[element.$context.parsed.y].y.filter(d=>d.value>0) ?? [],
            x: element.$context.raw.x,
            id: element.$context.raw.id
        }, dataContainer.get() ?? []);
    }
}