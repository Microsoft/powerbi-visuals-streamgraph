/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

module powerbi.extensibility.visual {
    // powerbi.extensibility.utils.interactivity
    import SelectableDataPoint = powerbi.extensibility.utils.interactivity.SelectableDataPoint;

    // powerbi.extensibility.utils.chart
    import LegendData = powerbi.extensibility.utils.chart.legend.LegendData;
    import IDataLabelInfo = powerbi.extensibility.utils.chart.dataLabel.IDataLabelInfo;

    // powerbi.extensibility.utils.formatting
    import IValueFormatter = powerbi.extensibility.utils.formatting.IValueFormatter;

    // powerbi.extensibility.visual
    import VisualSettings = settings.VisualSettings;

    export interface StreamData {
        metadata: DataViewMetadataColumn;
        series: StreamGraphSeries[];
        legendData: LegendData;
        valueFormatter: IValueFormatter;
        categoryFormatter: IValueFormatter;
        settings: VisualSettings;
        categoriesText: PrimitiveValue[];
        xMinValue: number;
        xMaxValue: number;
        yMinValue: number;
        yMaxValue: number;
        yAxisValueMaxTextSize: number;
        yAxisValueMaxTextHalfSize: number;
        xAxisValueMaxTextSize: number;
        xAxisValueMaxTextHalfSize: number;
        yAxisFontSize: number;
        yAxisFontHalfSize: number;
        xAxisFontSize: number;
        xAxisFontHalfSize: number;
    }

    export interface AxisLabelProperties {
        maxTextWidth: number;
        needToRotate: boolean;
        marginBottom: number;
        marginLeft: number;
    }

    export interface StreamDataPoint extends IDataLabelInfo {
        x: number;
        y: number;
        y0?: number;
        text: string;
        labelFontSize: string;
    }

    export interface StreamGraphSeries extends SelectableDataPoint {
        color: string;
        dataPoints: StreamDataPoint[];
        tooltipInfo?: VisualTooltipDataItem[];
        highlight?: boolean;
    }
}
