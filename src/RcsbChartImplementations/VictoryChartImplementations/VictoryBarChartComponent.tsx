import {AbstractChartImplementationInterface} from "../AbstractChartImplementation";
import {ChartTools} from "../../RcsbChartDataProvider/ChartTools";
import {AxisFactory} from "./Components/AxisFactory";
import {Bar, VictoryAxis, VictoryBar, VictoryChart, VictoryStack} from "victory";
import {LabelComponent} from "./Components/LabelComponent";
import * as React from "react";
import {BarComponent} from "./Components/BarComponent";
import {TooltipFactory} from "./Components/TooltipFactory";
import {ChartDataColumnInterface} from "../../RcsbChartDataProvider/ChartDataProviderInterface";
import {ChartConfigInterface, ChartDisplayConfigInterface} from "../../RcsbChartComponent/ChartConfigInterface";
import {VictoryChartDataInterface} from "./VictoryChartDataInterface";

export class VictoryBarChartComponent extends React.Component<AbstractChartImplementationInterface> {
    render():JSX.Element {
        const {data}: {data: ChartDataColumnInterface[]; excludedData?:ChartDataColumnInterface[];} = this.props.dataProvider.getChartData();
        const displayConfig: Partial<ChartDisplayConfigInterface> = this.props.chartConfig?.chartDisplayConfig ?? {};
        return (data.length == 0 ? <></> : <VictoryChart
            domainPadding={{ x: ChartTools.getConfig<number>("xDomainPadding",displayConfig) }}
            padding={{left:ChartTools.getConfig<number>("paddingLeft", displayConfig), top:ChartTools.getConfig<number>("paddingTopLarge",displayConfig), right:ChartTools.getConfig<number>("paddingRight",displayConfig)}}
            height={this.props.height}
            width={this.props.width}
            scale={{y:"linear", x:"linear"}}
        >
            {AxisFactory.getDependentAxis(this.props.chartConfig, {orientation:"top", label:this.props.chartConfig?.axisLabel})}
            {stack(data, this.props.chartConfig)}
            <VictoryAxis tickLabelComponent={<LabelComponent/>} />
        </VictoryChart>);
    }
}

//TODO <VictoryStack animate={true}> BarComponent props fails in capturing updated data
function stack(data:ChartDataColumnInterface[], chartConfig?: ChartConfigInterface): JSX.Element{
    return ( <VictoryStack >
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
            "#5e94c3",
            <BarComponent barClick={chartConfig?.barClickCallback}/>,
            chartConfig?.tooltipText ? TooltipFactory.getTooltip({dx:15, tooltipText:chartConfig?.tooltipText}) : undefined,
            chartConfig?.chartDisplayConfig
        )}
        {
            data[0].y.length > 1 ?
                Array(data[0].y.length-1).fill(undefined).map(
                    (e,n)=>bar(
                        data.map(d=>({
                            ...d,
                            y:d.y[n+1].value,
                            color:d.y[n+1].color,
                            id:d.y[n+1].id,
                            values: d.y,
                            index:n+1
                        })),
                        n+1,
                        "#d0d0d0",
                        <BarComponent />,
                        chartConfig?.tooltipText ? TooltipFactory.getTooltip({dx:15, tooltipText:chartConfig?.tooltipText}) : undefined,
                        chartConfig?.chartDisplayConfig
                    )
                )
                :
                undefined
        }
    </VictoryStack>);
}

function bar(data:VictoryChartDataInterface[], index:number, color: string, barComp: JSX.Element, labelComponent?:JSX.Element, chartDisplayConfig?:Partial<ChartDisplayConfigInterface>): JSX.Element {
    return data.length > 0 ? (<VictoryBar
        key={"victory_bar_"+index}
        barWidth={ChartTools.getConfig<number>("xDomainPadding", chartDisplayConfig)}
        style={{
            data: {
                fill: (d)=>(d.datum.color ?? color)
            }
        }}
        horizontal={true}
        data={data}
        categories={{x:data.map(d=>d.x.toString())}}
        dataComponent={barComp ?? <Bar />}
        labels={labelComponent ? ()=>null : undefined}
        labelComponent={labelComponent}
    />) : <></>;
}