import { CombineLatestOperator } from 'rxjs/internal/observable/combineLatest';
import { Holdings, AlphaItems, Industries } from './alphas';
import { SelectItem } from 'primeng/api';

export class Portfolio {
    portfolioId?: string;
    portfolioName?: string;
    createdOn?: string;
    benchmarkName?: string;
    customBenchmark?: string;
    creationDateSort?: string;
    tickers?: string;
    folderId?: string;
    value?: string;
    customStatus?: number;
    alphaModel?: string;
    riskScaling?: number;
    rankValues?: string;
    cbType?: string;
    scaleType?: string;
    fromFile?: string;
}

export class Tickers {
    tickerid?: number;
    ticker?: string;
}
export class CompanyMaster {
    companyID: number;
    companyName: string;
    tickerSymbol: string;
}
export class Benchmark {
    benchId: number;
    benchmark: string;
    benchGroupId: number;
}

export class ExcelFileData {
    id?: number;
    detailID?: number;
    fileID?: number;
    tickers?: string;
    weights?: string;
    shares?: string;
    minWeight?: string;
    maxWeight?: string;
    breakPoint?: string;
    stockOffset?: string;
    benchWgts?: string;
    alphas?: string;
    displayOrder?: number;
    cashWeights?: string;
    tickersProperty?: string;
    companyId?: string;
}

export class ExcelFile {
    fileID?: number;
    fileName?: string;
    folderId?: string;
}

export class PortfolioWeights {
    Id: string;
    value: string;
}

export class BenchMarkWeights {
    Id: string;
    value: string;
}

export class Alphas {
    Id?: string;
    Alpha?: string;
    isSelected?: boolean;
    master?: string;
    weight?: string;
    type?: string;
    benchVal?: string;
}

export class ColAtrr {
    value?: string;
    color?: string;
    align?: string;
    type?: string;
    weight?: string;
    bgColor?: string;
}

export class PortfolioTrack {
    gName?: ColAtrr;
    tickerSymbol?: ColAtrr;
    companyName?: ColAtrr;
    alphastd?: ColAtrr;
    portWeight?: ColAtrr;
    startPrice?: ColAtrr;
    endPrice?: ColAtrr;
    priceReturn?: ColAtrr;
    benchWeight?: ColAtrr;
    activeBet?: ColAtrr;
    actContribution?: ColAtrr;
    contribution?: ColAtrr;
    multiTiltOneWeight?: ColAtrr;
    multiTiltTwoWeight?: ColAtrr;
    multiTiltOneContribution?: ColAtrr;
    multiTiltTwoContribution?: ColAtrr;
}

export class SectorGroupDetails {
    tickerSymbol?: ColAtrr;
    companyName?: ColAtrr;
    weights?: ColAtrr;
    contribution?: ColAtrr;
}

export class SectorGroupData {
    portfolio?: SectorGroupDetails[];
    benchmark?: SectorGroupDetails[];
}


export class PortfolioSector {
    Id?: string;
    portfolioId?: string;
    benchmark?: string;
    gName?: ColAtrr;
    sName?: ColAtrr;
    portWeight?: ColAtrr;
    portfolioPriceReturn?: ColAtrr;
    portfolioContribution?: ColAtrr;
    bWeight?: ColAtrr;
    bPricereturn?: ColAtrr;
    bContribution?: ColAtrr;
    activeWeight?: ColAtrr;
    allocation?: ColAtrr;
    selection?: ColAtrr;
    interaction?: ColAtrr;
    totalEffects?: ColAtrr;
    isFactors?: ColAtrr;
    groupBy?: string;
    totalReturn?: ColAtrr;
    bReturn?: ColAtrr;
    activeReturn?: ColAtrr;
    totalRisk?: ColAtrr;
    activeRisk?: ColAtrr;
    returnRisk?: ColAtrr;
    informationRatio?: ColAtrr;
    groupId?: ColAtrr;
    isModal?: boolean;
}
export class PortfolioActiveContribution {
    Id?: string;
    portfolioId?: string;
    benchmark?: string;
    gName?: ColAtrr;
    sName?: ColAtrr;
    portWeight?: ColAtrr;
    portfolioPriceReturn?: ColAtrr;
    portfolioContribution?: ColAtrr;
    perStockSelection?: ColAtrr;
    perPortfolioSelection?: ColAtrr;
    perTotalActiveContrib?: ColAtrr;
    groupId?: ColAtrr;
    isModal?: boolean;
}

export class PortfolioRisk {
    groupId?: ColAtrr;
    gName?: ColAtrr;
    sName?: ColAtrr;
    totalReturn?: ColAtrr;
    benchmarkReturn?: ColAtrr;
    activeReturn?: ColAtrr;
    totalRisk?: ColAtrr;
    activeRisk?: ColAtrr;
    returnRisk?: ColAtrr;
    informationRatio?: ColAtrr;
    activeReturnStock?: ColAtrr;
    activeReturnSector?: ColAtrr;
    activeReturnTotal?: ColAtrr;
    activeRiskStock?: ColAtrr;
    activeRiskSector?: ColAtrr;
    activeRiskTotal?: ColAtrr;
    informationRatioStock?: ColAtrr;
    informationRatioSector?: ColAtrr;
    informationRatioTotal?: ColAtrr;
    perStockAllocation?: ColAtrr;
    perSectorAllocation?: ColAtrr;
    perTotalActiveRisk?: ColAtrr;
    perTotalRisk?: ColAtrr;
    perBenchmarkRisk?: ColAtrr;
}

export class BestWorstSector {
    Id?: string;
    portfolioId?: string;
    benchmark?: string;
    groupBy?: string;
    stockport?: number;
    sectorName?: string;
    type?: string;
}

export class BestWorstPolicies {
    groupName?: ColAtrr;
    displayName?: ColAtrr;
    displayValue?: ColAtrr;
    groupVal?: ColAtrr;
}


export class ExamplePortfolioData {
    id?: number;
    portfoliosName?: string;
    returns?: number;
    isWeight?: boolean;
    checked?: boolean;
    disable?: boolean;
}

export class Sectors {
    name: string;
    value: string;
}

export class PeriodReturns {
    returnName: string;
    returnValue: string;
}

export class DailyReturns {
    statDate: string;
    statValue1: string;
    statValue2: string;
}

export class Statistics {
    statName: string;
    statValue1: string;
    statValue2: string;
    predictedVal: string;
    groupVal: string;
}

export class FactorBetas {
    category: string;
    factor: string;
    statValue1: string;
    statValue2: string;
    styleBeta: string;
    groupVal: string;
}

/* #region  [FolderManagement] */
export class DomainFolder {
    domain?: number;
    userName?: string;
    userId?: number;
    userType?: string;
    isAdmin?: string;
    domainFolderId?: string;
    mainFolderId?: string;
    styleClass?: string;
}

export class FolderDetails {
    folderDetailsCount?: FolderDetailsCount;
    portfolios?: Portfolio[];
    // criterias?: any[];
    lists?: Holdings[];
    // files?: any[];
    alphas?: AlphaItems[];
    // backtests?: any[];
    // reports?: any[];
}



export class FolderDetailsCount {
    id?: number;
    folder?: string;
    portfolios?: number;
    criterias?: number;
    lists?: number;
    files?: number;
    alphas?: number;
    backtests?: number;
    reports?: number;
    isFolderDomain?: number;
    hasUserFolders?: number;
    hasUserSubFolders?: number;
}

export class FolderAction {
    userId?: number;
    folderId?: number;
    folder?: string;
}

export class FolderDetailsAction {
    userId?: number;
    type?: string;
    folderId?: number;
    selectedIds?: string;
    actionType?: string;
}
/* #endregion */

export class PortfolioSelectedTilts {
    type?: string;
    displayHeader?: string;
    tilt?: string;
    constraint?: string;
    portfolioName?: string;
    returnValue?: string;
}

export class TrackPortfolioSelectedData {
    folderId?: string;
    portfolioId?: string;
    portfolioName?: string;
    selectionType?: string;
    benchmarkId?: string;
    benchmarkName?: string;
    customBenchmark?: string;
    endDate?: string;
    createdOn?: string;
    trackType?: string;
    tickers?: string;
    value?: string;
    customStatus?: string;
    alphaModel?: string;
    riskScaling?: string;
    rankValues?: string;
    cbType?: string;
    displayHeader?: string;
    tilt?: string;
    constraintType?: string;
    weightType?: string;
    groupBy?: string;
    selectedTilts?: PortfolioSelectedTilts[];
    scaleType?: string;
    portfolioVal?: string;
    benchmarkVal?: string;
    bets?: string;
    activeVariance?: string;
    residualVariance?: string;
    perActiveVariance?: string;
    activeRisk?: string;
    portfolioRisk?: string;
    benchmarkRisk?: string;
    observations?: string;
    riskMode?: string;
    groupId?: string;
    sectorGroupDetailsMode?: string;
    weightStartDate?: string;
    weightEndDate?: string;
    factorBetaDisplayType?: string;
    factorBetaName?: string;
    fromFile?: string;
    statisticsPeriod?: string;
    selectedDataItem?: string;
    selectedAvgDataItem?: string;
    portCharDate?: string;
    multiTiltOne?: string;
    multiTiltTwo?: string;
    sectorName?: string;
    subSectorName?: string;
    factorDisplayBy?: string;
    factorGroupNumber?: string;
    factorGroupName?: string;
    factorRiskDisplayBy?: string;
    factorRiskPage?: string;
    multiTiltOnePortfolioVal?: string;
    multiTiltTwoPortfolioVal?: string;
    factorItem?: string;
    inPortfolioModule?: boolean;
    styleBenchmarkType?: string;
    styleSizeRiskPage?: string;
    factorGroupId?: string;
}

export class SelectTilt {
    id?: string;
    isChecked?: boolean;
    portfolioName?: string;
    returnVal?: string;
    isWeight?: boolean;
    isDisable?: boolean;
    displayHeaders?: string;
    tilt?: string;
    constraintType?: string;
    weightType?: string;
}

export class PortfolioChar {
    statName: ColAtrr;
    portVal1: ColAtrr;
    portVal2: ColAtrr;
    benchVal1: ColAtrr;
    benchVal2: ColAtrr;
    groupVal: ColAtrr;
}

export class Factors {
    groupId?: ColAtrr;
    groupNumber?: ColAtrr;
    groupName?: ColAtrr;
    factorCategory?: ColAtrr;
    indicator?: ColAtrr;
    portfolioReturns?: ColAtrr;
    benchmarkReturns?: ColAtrr;
    difference?: ColAtrr;
    factorItem?: ColAtrr;
}
export class TrackChartData {
    label?: string;
    statValue1?: string;
    statValue2?: string;
}

export class StylePortfolio {
    portfolioId?: string[];
    portfolioTilt?: string;
    startDate?: string;
    endDate?: string;
    portWeights?: string[];
    benchmarkWeights?: string[];
    customBenchWeights?: string[];
    alphas?: Alphas[];
    valueAlphas?: Alphas[];
    growthAlphas?: Alphas[];
    sizeAlphas?: Alphas[];
    benchmarks?: string[];
    routeBackto?: string;
}

export class HoldingStyle {
    portfolioData?: HoldingPortfolio[];
    benchmarkData?: HoldingBenchmark[];
}


export class HoldingPortfolio {
    dailydate?: string;
    portfolioName?: string;
    customBenchmarkName?: string;
    portfolioGrowthValuePlot?: string;
    portfolioSizePlot?: string;
    marketGrowthValuePlot?: string;
    marketSizePlot?: string;
    equalGrowthValuePlot?: string;
    equalSizePlot?: string;
    customGrowthValuePlot?: string;
    customSizePlot?: string;
    customMarketGrowthValuePlot?: string;
    customMarketSizePlot?: string;
    customEqualGrowthValuePlot?: string;
    customEqualSizePlot?: string;
}

export class HoldingBenchmark {
    dailydate?: string;
    benchmarkName?: string;
    benchmarkGrowthValuePlot?: string;
    benchmarkSizePlot?: string;
    equalPlot?: string;
    equalSizePlot?: string;
}



export class PortfolioContraints {
    noOfStocks: number;
    benchmark: string;
    benchmakType: string;
    benchmarkCustom: boolean;
    benchmarkCustomModalData: CustomModalData;
    maxStocksHoldings: string;
    minStocksHoldings: string;
    maxBenchamrkStocks: string;
    grouping: string;
    maxGrouping: string;
    maxGroupingOffset: string;
    allowShortSales: boolean;
    allowShortSalesModalData: any;
    date: boolean;
    backDate: Date;
    monthStats: boolean;
    decilType: string;
    decilTypeBenchmark: string;
    alphas: AlphaItems[];
    rank: any;
    rankType: string;
    riskScaling: string;
    equalVolatility: string;
    weight: string;
    fundamentalWeightings: boolean;
    fundamentalWeightingsModalData: any;
}


export class ViewAlpha {
    alpha: string;
    isRankChecked: boolean;
    decilType: string;
    refer: string;
}


export class Overlay {
    column: string;
    columnValue: any;
}




export class CustomModalData {
    optionValue?: string;
    customBenchmarkName?: string;
    sectorNetural?: boolean;
    listNetural?: boolean;
    overWrite?: boolean;
    benchmark?: string;
    groupBy?: string;
    lstSectors?: Industries[];
    tickers?: Tickers[];
    file?: File;
    saveFile?: boolean;
    folder?: Portfolio;
    excelFile?: ExcelFile;
}

export class DailyReturnsMultiplePortfolio {
    displayDate?: ColAtrr;
    portfolioValue?: ColAtrr;
    benchmarkValue?: ColAtrr;
    tilt1Value?: ColAtrr;
    tilt2Value?: ColAtrr;
}

export class FactorSummaryDetails {
    groupNumber?: ColAtrr;
    groupName?: ColAtrr;
    portfolioWeights?: ColAtrr;
    portfolioReturns?: ColAtrr;
    portfolioContribution?: ColAtrr;
    benchmarkWeights?: ColAtrr;
    benchmarkReturns?: ColAtrr;
    benchmarkContribution?: ColAtrr;
    activeWeight?: ColAtrr;
    allocation?: ColAtrr;
    selection?: ColAtrr;
    interaction?: ColAtrr;
    totalEffect?: ColAtrr;
    isGrouping?: ColAtrr;
    perStockSelection?: ColAtrr;
    perPortfolioSelection?: ColAtrr;
    perTotalActiveContribution?: ColAtrr;
    isModal?: boolean;
}

export class TreeNode {
    data?: FactorSummaryDetails;
    children?: TreeNode[];
    leaf?: boolean;
    expanded?: boolean;
}

export class MultipleStatistics {
    statName?: string;
    statValue?: string;
    statValue1?: string;
    statValue2?: string;
    statValue3?: string;
    statValue4?: string;
    predictedVal?: string;
    groupVal?: string;
}

export class FactorRiskContribution {
    groupId?: ColAtrr;
    groupNumber?: ColAtrr;
    groupName?: ColAtrr;
    factorCategory?: ColAtrr;
    indicator?: ColAtrr;
    totalRisk?: ColAtrr;
    benchmarkRisk?: ColAtrr;
    activeRisk?: ColAtrr;
    stockAllocation?: ColAtrr;
    portAllocation?: ColAtrr;
    riskDifference?: ColAtrr;
    allocationImpact?: ColAtrr;
    selectionImpact?: ColAtrr;
    totalImpact?: ColAtrr;
    totalActiveRisk?: ColAtrr;
    activeweight?: ColAtrr;
    totalReturn?: ColAtrr;
    benchmarkReturn?: ColAtrr;
    activeReturn?: ColAtrr;
    returnRisk?: ColAtrr;
    informationRatio?: ColAtrr;
    activeReturnStock?: ColAtrr;
    activeReturnPort?: ColAtrr;
    activeReturnTotal?: ColAtrr;
    activeRiskStock?: ColAtrr;
    activeRiskPort?: ColAtrr;
    activeRiskTotal?: ColAtrr;
    informationRatioStock?: ColAtrr;
    informationRatioPort?: ColAtrr;
    informationRatioTotal?: ColAtrr;
    factorItem?: ColAtrr;
}

export class MultiplePortfolioSector {
    groupId?: ColAtrr;
    gName?: ColAtrr;
    sName?: ColAtrr;
    pWeight?: ColAtrr;
    pReturn?: ColAtrr;
    pContribution?: ColAtrr;
    pStockSelection?: ColAtrr;
    pPortfolioSelection?: ColAtrr;
    pActiveContribution?: ColAtrr;
    bWeight?: ColAtrr;
    bContribution?: ColAtrr;
    tiltOneWeight?: ColAtrr;
    tiltOneContribution?: ColAtrr;
    tiltOneReturn?: ColAtrr;
    tiltOneStockSelection?: ColAtrr;
    tiltOnePortfolioSelection?: ColAtrr;
    tiltOneActiveContribution?: ColAtrr;
    tiltTwoWeight?: ColAtrr;
    tiltTwoContribution?: ColAtrr;
    tiltTwoReturn?: ColAtrr;
    tiltTwoStockSelection?: ColAtrr;
    tiltTwoPortfolioSelection?: ColAtrr;
    tiltTwoActiveContribution?: ColAtrr;
}
export class StyleSizeAttribution {
    position?: ColAtrr;
    benchmark?: ColAtrr;
    portfolioWeight?: ColAtrr;
    portfolioReturn?: ColAtrr;
    portfolioContribution?: ColAtrr;
    benchmarkWeight?: ColAtrr;
    benchmarkReturn?: ColAtrr;
    benchmarkContribution?: ColAtrr;
    activeWeight?: ColAtrr;
    allocation?: ColAtrr;
    selection?: ColAtrr;
    interaction?: ColAtrr;
    totalEffect?: ColAtrr;
    group?: ColAtrr;
}
export class StyleSizeRiskContribution {
    groupId?: ColAtrr;
    groupName?: ColAtrr;
    totalRisk?: ColAtrr;
    benchmarkRisk?: ColAtrr;
    activeRisk?: ColAtrr;
    stockAllocation?: ColAtrr;
    sectorAllocation?: ColAtrr;
    riskDifference?: ColAtrr;
    allocationImpact?: ColAtrr;
    selectionImpact?: ColAtrr;
    totalImpact?: ColAtrr;
    totalActiveRisk?: ColAtrr;
    activeweight?: ColAtrr;
    totalReturn?: ColAtrr;
    benchmarkReturn?: ColAtrr;
    activeReturn?: ColAtrr;
    returnRisk?: ColAtrr;
    informationRatio?: ColAtrr;
    activeReturnStock?: ColAtrr;
    activeReturnSector?: ColAtrr;
    activeReturnTotal?: ColAtrr;
    activeRiskStock?: ColAtrr;
    activeRiskSector?: ColAtrr;
    activeRiskTotal?: ColAtrr;
    informationRatioStock?: ColAtrr;
    informationRatioSector?: ColAtrr;
    informationRatioTotal?: ColAtrr;
}
export class FactorStockDetails {
    tickerSymbol?: ColAtrr;
    companyName?: ColAtrr;
    weights?: ColAtrr;
    contribution?: ColAtrr;
    returnRisk?: ColAtrr;
    activeRisk?: ColAtrr;
    factorItem?: ColAtrr;
    totalRisk?: ColAtrr;
}
export class FactorStockData {
    portfolio?: FactorStockDetails[];
    benchmark?: FactorStockDetails[];
}
export class ExcelFileHeaderData {
    fileID?: string;
    fileName?: string;
    cash?: string;
    interestRate?: string;
    totalWeight?: string;
}

export class PortfolioConstraints {
    stocks?: string;
    weights?: string;
    shares?: string;
    minWeights?: string;
    maxWeights?: string;
    breakPoints?: string;
    stockOffsets?: string;
    benchWeights?: string;
    alphaVals?: string;
    companyIds?: string;
    cashWeights?: string;
    backdate?: string;
}



