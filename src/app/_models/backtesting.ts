import { Industries } from './alphas';

export class StrategyList {
    strategyName?: string;
    description?: string;
    strategyType?: string;
}
export class ExistingCriteria {
    criterianame?: string;
    userid?: string;
    firstname?: string;
    criteriaid?: number;
}
export class StockSelection {
    testType?: number; //
    criteriaId?: string; //
    criteriaName?: string; //
    universeType?: number; //
    universeName?: string; //
    screenToPortfolio?: number; //
    alpha?: string; //
    alphaToPortfolio?: number; //
    tieBreakOption?: number; //
    decileType?: number; //
    rank?: number; //
    topValue?: number; //
    bottomValue?: number; //
    startValue?: number; //
    endValue?: number; //
    maxStockGroup?: string; //
    maxStocks?: number; //
    spanBenchMark?: string; //
    spanSector?: string; //
    spanFactorCategory?: string; //
    spanFactorItem?: string; //
    sTopValue: number; //
    sBottomValue: number; //
    sStartValue: number; //
    sEndValue: number; //
    sMaxStockGroup?: string; //
    sMaxStocks?: number; //
    includeAlpha?: string; //
    excludeAlpha?: string; //
    secondCriteriaId?: number; //
    triggerBenchmark?: string; //
    marketConditional?: string; //
    spanExcludeSector?: string; //
    spanExcludeSectorId?: string; //
    customSpanSector?: string; //
    customSpanSectorId?: string; //
    includeCriteriaId?: string; //
    excludeCriteriaId?: string; //
    existingScreenId?: number; //
    existListTickers?: string; //
}
export class PortfolioConstruction {
    benchMark?: string; //
    customBenchmark?: string; //
    cb?: number; //
    sectorNeutral?: number; //
    listNeutral?: number; //
    name?: string; //
    type?: string; //
    typeID?: string; //
    stockHoldings?: number; //
    stockMinHoldings?: number; //
    stockOffset?: number; //
    gicType?: string; //
    sectorHoldings?: number; //
    sectorOffset?: number; //
    shortSales?: string; //
    oneMonthStats?: number; //
    tilt?: number; //
    alphaModel?: string; //
    rankType?: number; //
    portRank?: string; //
    riskScaling?: string; //
    weight?: string; //
    turnOver?: number; //
    bTurnOver?: number; //
    bTCount?: number; //
    tOMGOR?: string; //
    redBench?: string; //
    redTickers?: string; //
}
export class BackTestingFields {
    userId?: number; //
    folder?: number; //
    backTestId?: number;
    backTestingName?: string; //
    strategyType?: string; //
    runId?: number;
    stockSelection?: StockSelection;
    portfolioConstruction?: PortfolioConstruction;
}

export class FolderFiles {
    fileId: number;
    folderId: number;
    userId: number;
    fileName: string;
    fileGroupName: string;
}
export class BatchFiles {
    batchId: number;
    batchName: string;
}
export class CustomBenchMark {
    pptionValue: string;
    lstSectors: Industries[];
    customBenchMarkName: string;
    sectorNetural: boolean;
}
export class CustomOptions {
    sectors: string;
    custbenchmarkName: string;
    listNeutral: string;
    sectorNeutral: string;
    tickers: string;
    becnhmark: string;
    selectionType: string;
    selectionVal: string;
}
