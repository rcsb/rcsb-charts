import * as React from "react";
import {ChartTools} from "../../RcsbChartDataProvider/ChartTools";

export interface UiTextInterface {
    text: string;
    fontSize: number;
}
export class UiText extends React.Component<UiTextInterface>{
    render(): JSX.Element {
        return (<div className={"ps-1 text-muted text-opacity-50 align-middle d-table-cell"} style={{fontSize:this.props.fontSize}}>
            {this.props.text}
        </div>);
    }
}