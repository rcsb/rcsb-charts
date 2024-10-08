import * as React from "react";
import * as classes from "./scss/bootstrap-chart-display.module.scss";

interface ChartUiInterface {
    fontFamily:string;
    children: React.JSX.Element[];
}

export class ChartUi extends React.Component<ChartUiInterface>{

    render(): React.JSX.Element {
        return (
            <div className={classes.bootstrapRcsbChartComponentScope}>
                <div className={"mt-3 d-table"}  style={{height:22, fontFamily:this.props.fontFamily}}>
                    <div className={"d-table-row"}>{this.props.children}</div>
                </div>
            </div>
        );
    }
}