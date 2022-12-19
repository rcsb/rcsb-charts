import * as React from "react";

interface UiButtonInterface {
    activeFlag: boolean;
    className: string;
    onCLick: (e:React.MouseEvent)=>void;
    title?:string;
}
export class UiButton extends React.Component<UiButtonInterface> {

    render() {
        return (<div
            className={"pe-3 align-middle d-table-cell"+(this.props.activeFlag ? "" : " text-black-50 text-opacity-75")}
            onClick={(e)=>{
                this.props.onCLick(e);
            }}
        >
            <i title={this.props.title} role={ this.props.activeFlag ? "button" : undefined} className={"bi "+this.props.className} />
        </div>);
    }
}