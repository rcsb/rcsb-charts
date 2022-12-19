import React from "react";
import {VictoryTooltipProps} from "victory-tooltip";
import {ChartConfigInterface} from "../../../RcsbChartComponent/ChartConfigInterface";
import {ChartTools} from "../../../RcsbChartDataProvider/ChartTools";
import {VictoryTooltip} from "victory";
import {ChartDataValuesInterface} from "../../../RcsbChartDataProvider/ChartDataProviderInterface";

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
                    const d: ChartDataValuesInterface = (e.datum as ChartDataValuesInterface);
                    if(typeof this.props.tooltipText?.(d) === "string")
                        return "visible";
                    return "hidden";
                }
            }}
            flyoutStyle={{visibility: (e)=>{
                    const d: ChartDataValuesInterface = (e.datum as ChartDataValuesInterface);
                    if(typeof this.props.tooltipText?.(d) === "string")
                        return "visible";
                    return "hidden";
                }}}
        />);
    }

    private text():string|undefined {
        const d: ChartDataValuesInterface = (this.props.datum as ChartDataValuesInterface);
        if(typeof this.props.tooltipText?.(d) === "string") {
            return this.props.tooltipText(d) ?? ChartTools.digitGrouping(d.y);
        }
    }
}