import {VictoryAxis, VictoryLabel} from "victory";
import * as React from "react";
import {VictoryAxisProps} from "victory-axis";
import {ChartTools} from "../../../RcsbChartDataProvider/ChartTools";
import {ChartConfigInterface} from "../../../RcsbChartComponent/ChartConfigInterface";

export class AxisFactory {

    public static getDependentAxis(config?: ChartConfigInterface, props?: VictoryAxisProps): JSX.Element {
        return (<VictoryAxis
            {...props}
            dependentAxis={true}
            crossAxis={true}
            style={{
                grid: {
                    stroke: "#999999",
                    strokeDasharray: "1 3"
                },
            }}
            tickFormat={
                (t: number)=>{
                    if(config?.tickFormat?.imgAxis)
                        return config.tickFormat.imgAxis(t);
                    return (!t.toString().includes('.') ? ChartTools.digitGrouping(t) : "");
                }
            }
            axisLabelComponent={<VictoryLabel style={{fontFamily: ChartTools.getConfig<string>("fontFamily", {}), fontSize:ChartTools.getConfig<string>("fontSize",{})}} />}
            tickLabelComponent={<VictoryLabel style={{fontFamily: ChartTools.getConfig<string>("fontFamily", {}), fontSize:ChartTools.getConfig<number>("fontSize",{})}} />}
        />);
    }

    public static getRegularAxis(config?: ChartConfigInterface, props?: VictoryAxisProps): JSX.Element {
        return (<VictoryAxis
            {...props}
            tickFormat={(t) => {
                if(config?.tickFormat?.domAxis)
                    return config.tickFormat.domAxis(t);
                return t;
            }}
            label={config?.axisLabel}
            axisLabelComponent={<VictoryLabel style={{fontFamily: ChartTools.getConfig<string>("fontFamily", {}), fontSize:ChartTools.getConfig<string>("fontSize", {})}} />}
            tickLabelComponent={<VictoryLabel style={{fontFamily: ChartTools.getConfig<string>("fontFamily", {}), fontSize:ChartTools.getConfig<string>("fontSize", {})}} />}
        />);
    }

}