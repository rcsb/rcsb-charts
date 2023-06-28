import * as React from "react";
import {ChartTools} from "../RcsbChartDataProvider/ChartTools";
import {ChartDataProviderInterface, ChartDataColumnInterface} from "../RcsbChartDataProvider/ChartDataProviderInterface";
import {AbstractChartImplementationType} from "../RcsbChartImplementations/AbstractChartImplementation";
import {ChartConfigInterface, ChartDisplayConfigInterface, ChartObjectInterface} from "./ChartConfigInterface";
import {UiButton} from "./Components/UiButton";
import {ChartUi} from "./Components/ChartUi";
import {UiText} from "./Components/UiText";
import {isEqual} from "lodash";
export interface ChartInterface {
    data: ChartObjectInterface[][];
    chartConfig?:ChartConfigInterface;
    chartComponentImplementation: AbstractChartImplementationType;
    dataProvider: ChartDataProviderInterface;
}

export interface ChartState {
    chartConfig:ChartConfigInterface;
}

export class ChartComponent extends React.Component <ChartInterface, ChartState> {

    readonly state: ChartState = {
        chartConfig: this.props.chartConfig ?? {}
    };
    private readonly EXPAND_NUMBER: number = 10;

    render():JSX.Element {
        this.props.dataProvider.setData(this.props.data, this.state.chartConfig);
        const displayConfig: Partial<ChartDisplayConfigInterface> = this.state.chartConfig?.chartDisplayConfig ?? {};
        const {data,excludedData}: {data: ChartDataColumnInterface[]; excludedData?:ChartDataColumnInterface[];} = this.props.dataProvider.getChartData();
        const width: number = ChartTools.getConfig<number>("paddingLeft", displayConfig) + ChartTools.getConfig<number>("constWidth", displayConfig) + ChartTools.getConfig<number>("paddingRight", displayConfig);
        const height: number = ChartTools.getConfig<number>("paddingTopLarge", displayConfig) + data.length*ChartTools.getConfig<number>("xIncrement", displayConfig);
        const ChartComponent: AbstractChartImplementationType = this.props.chartComponentImplementation;
        return (
            <div style={{width:width}}>
                <ChartComponent width={width} height={height} chartConfig={this.props.chartConfig} dataProvider={this.props.dataProvider}/>
                {
                    this.chartUI(excludedData?.length ?? 0)
                }
            </div>
        );
    }

    componentDidUpdate(prevProps: Readonly<ChartInterface>, prevState: Readonly<ChartState>, snapshot?: any) {
        if(this.props.chartConfig && !isEqual(prevProps.chartConfig,this.props.chartConfig))
            this.setState({chartConfig: this.props.chartConfig});
    }

    private chartUI(excluded: number): JSX.Element {
        if(!(excluded > 0 || (this.state.chartConfig?.mostPopulatedGroups ?? 0) > (this.props.chartConfig?.mostPopulatedGroups ??0)))
            return (<></>);
        return (<ChartUi fontFamily={ChartTools.getConfig<string>("fontFamily", this.props.chartConfig?.chartDisplayConfig)}>
            <UiButton
                activeFlag={excluded > 0}
                className={"bi-plus-circle"}
                title={"Shift-click to expand all"}
                onCLick={(e)=>{
                    if(e.shiftKey){
                        this.updateCategories(excluded);
                    } else {
                        this.updateCategories(this.EXPAND_NUMBER);
                    }
                }}
            /><UiButton
                activeFlag={(this.state.chartConfig?.mostPopulatedGroups ?? 0) > (this.props.chartConfig?.mostPopulatedGroups ??0)}
                className={"bi-dash-circle"}
                title={"Shift-click to collapse all"}
                onCLick={(e)=>{
                    if(e.shiftKey){
                        this.updateCategories(0);
                    }else{
                        if(this.state.chartConfig?.mostPopulatedGroups && this.props.chartConfig?.mostPopulatedGroups && this.state.chartConfig?.mostPopulatedGroups-this.EXPAND_NUMBER >= this.props.chartConfig?.mostPopulatedGroups)
                            this.updateCategories(-this.EXPAND_NUMBER);
                        else
                            this.updateCategories(0);
                    }
                }}
            /><UiText
                fontSize={ChartTools.getConfig<number>("fontSize",this.props.chartConfig?.chartDisplayConfig)}
                text={`[ ${ChartTools.digitGrouping(excluded)}+ ]`}
            />
        </ChartUi>);
    }

    private updateCategories(n:number): void {
        if(n===0)
            this.setState({
                chartConfig:{
                    ...this.state.chartConfig,
                    mostPopulatedGroups: this.props.chartConfig?.mostPopulatedGroups
                }
            });
        else if(this.state.chartConfig?.mostPopulatedGroups && this.props.chartConfig?.mostPopulatedGroups && this.state.chartConfig?.mostPopulatedGroups+n >= this.props.chartConfig?.mostPopulatedGroups)
            this.setState({
                chartConfig:{
                    ...this.state.chartConfig,
                    mostPopulatedGroups: this.state.chartConfig?.mostPopulatedGroups + n
                }
            });
    }

}