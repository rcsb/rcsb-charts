import {AbstractChartImplementation} from "../AbstractChartImplementation";
import {ChartTools} from "../../RcsbChartDataProvider/ChartTools";
import {AxisFactory} from "./Components/AxisFactory";
import {Bar, VictoryBar, VictoryChart, VictoryStack} from "victory";
import * as React from "react";
import {BarComponent} from "./Components/BarComponent";
import {TooltipFactory} from "./Components/TooltipFactory";
import {ChartDataColumnInterface} from "../../RcsbChartDataProvider/ChartDataProviderInterface";
import {ChartConfigInterface, ChartDisplayConfigInterface} from "../../RcsbChartComponent/ChartConfigInterface";
import {VictoryChartDataInterface} from "./VictoryChartDataInterface";

export class VictoryHistogramChartComponent extends AbstractChartImplementation {

    render() {
        const {data}: { data: ChartDataColumnInterface[];} = this.props.dataProvider.getChartData();
        const displayConfig: Partial<ChartDisplayConfigInterface> = this.props.chartConfig?.chartDisplayConfig ?? {};
        const width: number = ChartTools.getConfig<number>("paddingLeft", displayConfig) + ChartTools.getConfig<number>("constWidth", displayConfig) + ChartTools.getConfig<number>("paddingRight", displayConfig);
        const dom = this.props.dataProvider.xDomain();
        const nBins: number = dom ? (dom[1]-dom[0])/(this.props.chartConfig?.histogramBinIncrement ?? 1) : data.length;
        return (data.length == 0 ? <></> : <VictoryChart
            padding={{left:ChartTools.getConfig<number>("paddingLeft", displayConfig), bottom:ChartTools.getConfig<number>("paddingTopLarge", displayConfig), top: ChartTools.getConfig<number>("paddingTop", displayConfig), right:ChartTools.getConfig<number>("paddingRight", displayConfig)}}
            height={ChartTools.getConfig<number>("constHeight", displayConfig)}
            width={width}
            domain={{x:this.props.dataProvider.xDomain()}}
        >
            {AxisFactory.getDependentAxis(this.props.chartConfig)}
            {stack(data, nBins, this.props.chartConfig)}
            {AxisFactory.getRegularAxis(this.props.chartConfig)}
        </VictoryChart>);
    }

}

//TODO <VictoryStack animate={true}> BarComponent props fails in capturing updated data
function stack(data: ChartDataColumnInterface[], nBins: number, chartConfig?: ChartConfigInterface): JSX.Element{
    return (<VictoryStack>
        {bar(
            data.map(d=>({
                ...d,
                y:d.y[0].value,
                color:d.y[0].color,
                id:d.y[0].id,
                values:d.y,
                index:0
            })),
            0,
            nBins,
            "#5e94c3",
            <BarComponent barClick={chartConfig?.barClickCallback}/>,
            chartConfig?.tooltipText ? TooltipFactory.getTooltip({dy:-15, tooltipText:chartConfig?.tooltipText}) : undefined,
            chartConfig?.chartDisplayConfig
        )}
        {
            data[0] && (data[0].y.length > 1) ?
                Array(data[0].y.length-1).fill(undefined).map(
                    (e,n)=>bar(
                        data.map(d=>({
                            ...d,
                            y:d.y[n+1].value,
                            color:d.y[n+1].color,
                            id:d.y[n+1].id,
                            values:d.y,
                            index:n+1
                        })),
                        n+1,
                        nBins,
                        "#d0d0d0",
                        <BarComponent />,
                        chartConfig?.tooltipText ? TooltipFactory.getTooltip({dy:-15, tooltipText:chartConfig?.tooltipText}) : undefined,
                        chartConfig?.chartDisplayConfig
                    )
                )
                :
                undefined
        }
    </VictoryStack>);
}

function bar(data: VictoryChartDataInterface[], index:number, nBins: number, color: string, barComp?: JSX.Element, labelComponent?: JSX.Element, chartDisplayConfig?:Partial<ChartDisplayConfigInterface>): JSX.Element {
    return data.length > 0 ? (<VictoryBar
        key={"victory_bar_"+index}
        barWidth={(Math.ceil(ChartTools.getConfig<number>("constWidth", chartDisplayConfig)/nBins)-3)}
        alignment={"middle"}
        style={{
            data: {
                fill: (d)=>(d.datum.color ?? color)
            }
        }}
        data={data}
        dataComponent={barComp ?? <Bar />}
        labels={labelComponent ? ()=>null : undefined}
        labelComponent={labelComponent}
    />)  : <></>;
}

