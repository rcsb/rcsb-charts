import React from "react";
import {VictoryTooltipProps} from "victory-tooltip";
import {ChartConfigInterface} from "../../../RcsbChartComponent/ChartConfigInterface";
import {ChartTools} from "../../../RcsbChartDataProvider/ChartTools";
import {VictoryTooltip} from "victory";
import {ChartDataValueInterface} from "../../../RcsbChartDataProvider/ChartDataProviderInterface";
import {VictoryChartDataInterface} from "../VictoryChartDataInterface";

type TooltipPropsType = VictoryTooltipProps & {tooltipText?:ChartConfigInterface["tooltipText"]};
export class TooltipComponent extends React.Component<TooltipPropsType> {
    private static defaultEvents = VictoryTooltip.defaultEvents;
    render() {
        return (<VictoryTooltip
            {...this.props}
            text={()=>this.text() ?? "N/A"}
            pointerWidth={5}
            flyoutPadding={10}
            style={{
                fontFamily: ChartTools.getConfig<string>("fontFamily", {}),
                visibility: (e)=>{
                    const d: ChartDataValueInterface = (e.datum as ChartDataValueInterface);
                    if(typeof this.props.tooltipText?.(d) === "string")
                        return "visible";
                    return "hidden";
                }
            }}
            flyoutStyle={{visibility: (e)=>{
                    const d: ChartDataValueInterface = (e.datum as ChartDataValueInterface);
                    if(typeof this.props.tooltipText?.(d) === "string")
                        return "visible";
                    return "hidden";
                }}}
        />);
    }

    private text():string|undefined {
        const d: ChartDataValueInterface = {
            ...(this.props.datum as VictoryChartDataInterface),
        };
        if(typeof this.props.tooltipText?.(d) === "string") {
            return this.props.tooltipText(d) ?? ChartTools.digitGrouping(d.y);
        }
    }
}