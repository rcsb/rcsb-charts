import React from "react";
import {ChartDataReaderInterface} from "../RcsbChartDataProvider/ChartDataProviderInterface";
import {ChartConfigInterface} from "../RcsbChartComponent/ChartConfigInterface";

export interface AbstractChartImplementationInterface {
    height: number;
    width: number;
    dataProvider: ChartDataReaderInterface;
    chartConfig?: ChartConfigInterface;
}

export type AbstractChartImplementationType = typeof React.Component<AbstractChartImplementationInterface>;