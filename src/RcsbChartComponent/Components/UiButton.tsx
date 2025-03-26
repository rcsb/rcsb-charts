import React, {Component, CSSProperties, MouseEvent, ReactNode} from "react";

interface UiButtonInterface {
    activeFlag: boolean;
    onCLick: (e:MouseEvent)=>void;
    style?: CSSProperties;
    children: ReactNode;
    title?:string;
}

export class UiButton extends Component<UiButtonInterface> {

    render() {
        return (<div
            className={this.props.activeFlag ? "active" : "inactive"}
            style={this.props.style}
            onClick={(e)=>{
                this.props.onCLick(e);
            }}
        >
            {this.props.children}
        </div>);
    }
}