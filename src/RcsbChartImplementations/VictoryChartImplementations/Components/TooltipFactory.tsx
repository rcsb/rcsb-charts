import * as React from "react";
import {VictoryTooltipProps} from "victory-tooltip";
import {ChartConfigInterface} from "../../../RcsbChartComponent/ChartConfigInterface";
import {TooltipComponent} from "./TooltipComponent";

type TooltipPropsType = VictoryTooltipProps & {tooltipText?:ChartConfigInterface["tooltipText"]};
export class TooltipFactory  {

    public static getTooltip(props:TooltipPropsType):JSX.Element {
        return (<TooltipComponent {...props}/>);
    }

}