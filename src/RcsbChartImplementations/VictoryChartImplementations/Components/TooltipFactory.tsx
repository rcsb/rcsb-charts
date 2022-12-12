import {VictoryTooltip} from "victory";
import * as React from "react";
import {VictoryTooltipProps} from "victory-tooltip";
import {ChartTools} from "../../../RcsbChartDataProvider/ChartTools";
import {ChartDataValuesInterface} from "../../../RcsbChartDataProvider/ChartDataProviderInterface";
import {ChartConfigInterface} from "../../../RcsbChartComponent/ChartConfigInterface";

type TooltipPropsType = VictoryTooltipProps & {tooltipText?:ChartConfigInterface["tooltipText"]};
export class TooltipFactory extends React.Component<TooltipPropsType, any> {

    public static getTooltip(props:TooltipPropsType) {
        return (<VictoryTooltip
            {...props}
            text={TooltipFactory.text}
            pointerWidth={5}
            flyoutPadding={10}
            activateData={true}
            style={{
                fontFamily: ChartTools.getConfig<string>("fontFamily", {}),
            }}
        />);
    }

    private static text(props:TooltipPropsType):string {
        const d: ChartDataValuesInterface = (props.datum as ChartDataValuesInterface);
        if(typeof props.tooltipText === "function")
            return props.tooltipText(d);
        const sum = d.values.slice(1).reduce((prev,curr)=>prev+curr,0);
        return ChartTools.digitGrouping(d.y) + (sum > 0? (" of " + ChartTools.digitGrouping(d.y+sum)) : "") + " group members\n" +
            "Click to refine group\n" +
            "Shift-click to search";
    }

}