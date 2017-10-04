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

module powerbi.extensibility.visual.tooltipBuilder {
    // powerbi.extensibility.utils.formatting
    import valueFormatter = powerbi.extensibility.utils.formatting.valueFormatter;

    const HighlightedValueDisplayName: string = "Highlighted",
        DefaultSeriesIndex: number = 0;

    export interface TooltipSeriesDataItem {
        value?: any;
        highlightedValue?: any;
        metadata: DataViewValueColumn;
    }

    export function createTooltipInfo(
        dataView: DataView,
        dataViewCat: DataViewCategorical,
        seriesIndex?: number): VisualTooltipDataItem[] {

        let seriesSource: TooltipSeriesDataItem[] = [],
            valuesSource: DataViewMetadataColumn = undefined;

        seriesIndex = seriesIndex | DefaultSeriesIndex;
        if (dataViewCat && dataViewCat.values) {
            valuesSource = dataViewCat.values.source;

            if (dataViewCat.values.length > 0) {
                const valueColumn: DataViewValueColumn = dataViewCat.values[seriesIndex],
                    isAutoGeneratedColumn: boolean = !!(valueColumn
                        && valueColumn.source
                        && (valueColumn.source as any).isAutoGeneratedColumn);

                if (!isAutoGeneratedColumn) {
                    seriesSource.push({
                        value: null,
                        highlightedValue: undefined,
                        metadata: valueColumn
                    });
                }
            }
        }

        return createTooltipData(dataView, valuesSource, seriesSource);
    }

    export function createTooltipData(
        dataView: DataView,
        valuesSource: DataViewMetadataColumn,
        seriesValues: TooltipSeriesDataItem[]): VisualTooltipDataItem[] {

        const items: VisualTooltipDataItem[] = [];

        if (valuesSource) {
            // Dynamic series value
            let dynamicValue: string;

            if (seriesValues.length > 0) {
                const dynamicValueMetadata: DataViewMetadataColumn = seriesValues[0].metadata.source;

                dynamicValue = getFormattedValue(
                    valuesSource,
                    dynamicValueMetadata.groupName);
            }

            items.push({
                displayName: valuesSource.displayName,
                value: dynamicValue
            });
        }

        for (let index: number = 0; index < seriesValues.length; index++) {
            const seriesData: TooltipSeriesDataItem = seriesValues[index];

            if (seriesData && seriesData.metadata) {
                const seriesMetadataColumn: DataViewMetadataColumn = seriesData.metadata.source,
                    value: any = seriesData.value,
                    highlightedValue: any = seriesData.highlightedValue;

                if (value || value === 0) {
                    let formattedValue: string = getFormattedValue(
                        seriesMetadataColumn,
                        value);

                    items.push({
                        displayName: seriesMetadataColumn.displayName,
                        value: formattedValue
                    });
                }

                if (highlightedValue || highlightedValue === 0) {
                    let formattedHighlightedValue: string = getFormattedValue(
                        seriesMetadataColumn,
                        highlightedValue);

                    items.push({
                        displayName: HighlightedValueDisplayName,
                        value: formattedHighlightedValue
                    });
                }

                if (seriesData.metadata.values) {
                    let valuesList: string;
                    if (seriesData.metadata.highlights)
                        valuesList = seriesData.metadata.highlights.filter(d => d === null ? false : true ).join(" ");
                    else
                        valuesList = seriesData.metadata.values.join(" ");
                    items.push({
                        displayName: "values",
                        value: valuesList
                    });
                }
            }
        }

        return items;
    }

    export function getFormattedValue(column: DataViewMetadataColumn, value: any): string {
        const formatString: string = getFormatStringFromColumn(column);

        return valueFormatter.format(value, formatString);
    }

    export function getFormatStringFromColumn(column: DataViewMetadataColumn): string {
        if (!column) {
            return null;
        }

        const formatString: string = valueFormatter.getFormatStringByColumn(column, true);

        return formatString || column.format;
    }
}
