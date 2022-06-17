import * as React from "react";
import {ChartTools} from "../RcsbChartTools/ChartTools";
import {ChartDataProviderInterface} from "../RcsbChartDataProvider/ChartDataProviderInterface";
import {HistogramChartDataProvider} from "../RcsbChartDataProvider/HistogramChartDataProvider";
import {AbstractChartComponent} from "./AbstractChartComponent";
import {AbstractChartImplementationType} from "./AbstractChartImplementation";


export class HistogramChartComponent extends AbstractChartComponent {

    protected readonly dataProvider: ChartDataProviderInterface = new HistogramChartDataProvider();

    render():JSX.Element {
        this.dataProvider.setData(this.state.data, this.state.subData, this.state.chartConfig);
        const width: number = ChartTools.paddingLeft + ChartTools.constWidth + ChartTools.paddingRight;
        const ChartComponent: AbstractChartImplementationType = this.props.chartComponentImplementation;
        const height: number = ChartTools.constHeight;
        return (
            <div style={{width:width}}>
                <ChartComponent width={width} height={height} chartConfig={this.props.chartConfig} dataProvider={this.dataProvider}/>
            </div>
        );
    }

}