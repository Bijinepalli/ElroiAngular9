// export class Categories {
//     label?: string;
//     value?: string;
// }

export class Items {
    label?: string;
    value?: string;
    categoryId?: string;
    databaseValue?: string;
}

export class AxisItems {
    label?: string;
    value?: string;
    categoryId?: string;
    category?: string;
}

// export class SGITypes {
//     label?: string;
//     value?: string;
// }

export class AlphaItems {
    userId?: number;
    itemName?: string;
    itemDesc?: string;
    itemInfo?: string;
    isChecked?: boolean;
    isRankChecked?: boolean;
    viewAlpha?: string;
    isDisable?: boolean;
}

export class AlphaStrategy {
    strategyId?: number;
    strategy?: string;
    type?: string;
    strategyValue?: string;
}

export class Alpha {
    userId?: string;
    itemName?: string;
    itemDetails?: Selectables[];
    folder?: string;
}
export class Selectables {
    label?: string;
    value?: AlphaDetails;
}
export class CustomDecileVal {
    userId?: number;
    dataItem?: string;
    minValue?: string;
    maxValue?: string;
    decileValue?: string;
    decileDefault?: string;
}
export class CustomDecile {
    userId?: number;
    dataItem?: string;
    scale?: string;
    decileDefault?: string;
    data?: CustomDecileVal[];
}

export class ViewAlphas {
    id?: string;
    itemName?: string;
    minVal?: string;
    maxVal?: string;
    decileVal?: string;
}

export class Holdings {
    holdingId?: string;
    holdingName?: string;
    tickers?: string;
    companyIds?: string;
}

export class SaveAlphasVal {
    userId?: string;
    itemName?: string;
    itemDesc?: string;
    itemInfo?: string;
    calcType?: string;
    alphaType?: string;
    typeValue?: string;
    folder?: string;
}

export class Industries {
    label?: string;
    value?: string;
    isSelected?: boolean;
    children?: any[];
}

export class AlphaDetails {
    itemInfo?: string;
    itemDesc?: string;
    calcType?: string;
    alphaType?: string;
    typeValue?: string;
}

export class ExistingAlphas {
    label?: string;
    value?: any;
    folder?: string;
    valDesc?: Selectables[];
    userId?: string;
}

export class AlphaReport {
    details?: any;
    columns?: any;
    legend?: any;
    attributes?: any;
    spans?: any;
    alphaDetail1?: any;
    alphaDetail2?: any;
    alphaDetail3?: any;
    alphaDetail4?: any;
    alphaDetail5?: any;
    alphaDetail6?: any;
    alphaDetail7?: any;
    alphaDetail8?: any;
    alphaDetail9?: any;
    alphaDetail10?: any;
    alphaCols1?: any;
    alphaCols2?: any;
    alphaCols3?: any;
    alphaCols4?: any;
    alphaCols5?: any;
    alphaCols6?: any;
    alphaCols7?: any;
    alphaCols8?: any;
    alphaCols9?: any;
    alphaCols10?: any;
    alphaLegend1?: any;
    alphaLegend2?: any;
    alphaLegend3?: any;
    alphaLegend4?: any;
    alphaLegend5?: any;
    alphaLegend6?: any;
    alphaLegend7?: any;
    alphaLegend8?: any;
    alphaLegend9?: any;
    alphaLegend10?: any;
}

export class AlphaFunction {
    userId?: string;
    models?: string;
    decile?: string;
    ranking?: string;
    benchmarkName?: string;
    dailyDate?: string;
    backDate?: string;
    latestDate?: string;
    sessionId?: string;
    companyIds?: string;
    portfolioIds?: string;
    includedCompanyids?: string;
    excludedCompanyids?: string;
    selectedGroup?: string;
    combinedModels?: string;
    combinedWeights?: string;
}

export class AlphaView {
    compId?: string;
    tickerSymbol?: string;
    weights?: string;
    shares?: string;
    alphaValue?: string;
    dailyDate?: string;
    selectedGroup?: string;
    maxSector?: string;
    alphaTable?: string;

    top?: string;
    bottom?: string;
    middle?: string;
    topValue?: string;
    bottomValue?: string;
    middleStartValue?: string;
    middleEndValue?: string;
    secName?: string;
    maxStocks?: string;
    minStocks?: string;

    spanBenchmark?: string;
    spanSectorgroup?: string;
    spanTickerCnt?: number;
    spanIncludes?: string;
    spanExcludes?: string;
    spanIncludeType?: string;
    spanExcludeType?: string;

    spanFactorCategory?: string;
    spanFactorItem?: string;

    spanSize?: string;

    alphaMode?: string;
    ranking?: string;
    sortValue?: string;
    viewType?: string;
    sortOrder?: string;
    tieBreak?: string;

}

export class AlphaSpanTickers {
    tickerSymbol?: string;
}
