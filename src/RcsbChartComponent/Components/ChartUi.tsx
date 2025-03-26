import React, {ReactNode, Component} from "react";
import * as classes from "./scss/bootstrap-chart-display.module.scss";

interface ChartUiInterface {
    fontFamily:string;
    children: ReactNode[];
}

export class ChartUi extends Component<ChartUiInterface>{

    render(): ReactNode {
        return (
            <div className={classes.bootstrapRcsbChartComponentScope}>
                <div style={{height:22, fontFamily:this.props.fontFamily}}>
                    <div style={{display:"flex", alignItems: "center", height:24}}>{this.props.children}</div>
                </div>
            </div>
        );
    }
}