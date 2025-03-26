import * as React from "react";
import {CSSProperties, ReactNode} from "react";

export interface UiTextInterface {
    text: string;
    style?: CSSProperties;
}
export class UiText extends React.Component<UiTextInterface>{
    render(): ReactNode {
        return (<div
            style={this.props.style}
        >
            {this.props.text}
        </div>);
    }
}