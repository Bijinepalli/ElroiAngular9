// import { SeriesOptionsType } from 'highcharts';

export enum ModuleNames {
    UserManagement = 'User Management',
    Screening = 'Screening',
    RatingChanges = 'Rating Changes',
    PortfolioAnalysis = 'Portfolio Analysis',
    IndividualSecurityAnalysis = 'Individual Security Analysis',
    Holdings = 'Holdings',
    FactorAnalysis = 'Factor Analysis',
    Backtesting = 'Backtesting',
    Alphas = 'Alphas',
    Admin = 'Admin',
}

export enum RecentDataNames {
    UserManagement = 'User Management',
    Screening = 'screen',
    RatingChanges = 'Rating Changes',
    PortfolioAnalysis = 'portfolio',
    IndividualSecurityAnalysis = 'Individual Security Analysis',
    Holdings = 'Holdings',
    FactorAnalysis = 'Factor Analysis',
    Backtesting = 'Backtesting',
    Alphas = 'alpha',
    Reports = 'report',
}

export enum PageRoutes {
    Dashboard = '/menu/dashboard',
    Configuration = '/menu/admin/config',
    LogManagement = '/menu/admin/log',

    PortfolioPath = '/menu/portfolio/',
    FolderManagement = '/menu/portfolio/folderMgmt',
    SingleTracking = '/menu/portfolio/singletracking',
    MultiTracking = '/menu/portfolio/multitracking',
    TrackPortfolio = '/menu/portfolio/trackportfolio',
    SelectTilt = '/menu/portfolio/selecttilt',
    HoldingsAnalysis = '/menu/portfolio/holdingsanalysis',
    HoldingsGraph = '/menu/portfolio/holdingsgraph',
    DailyReturns = '/menu/portfolio/dailyreturns',
    TrackSector = '/menu/portfolio/tracksector',
    TrackSCA = '/menu/portfolio/tracksca',
    TrackReport = '/menu/portfolio/trackreport',
    TrackChart = '/menu/portfolio/trackchart',
    TrackStyle = '/menu/portfolio/trackstyle',
    FromSavedOnline = '/menu/portfolio/fromsaved',
    FromExcelFile = '/menu/portfolio/fromexcel',

    TrackReportDisplay = '/menu/portfolio/trackreportdisplay',

    Constraints = '/menu/portfolio/constraints',
    Characteristics = '/menu/portfolio/portfoliochar',
    DailyStatistics = '/menu/portfolio/dailystatistics',

    WeightDetails = '/sector/wght',
    WeightSectorDetails = '/sector/wghtsector',
    WeightSectorChart = '/sector/wghtsectorchart',
    WeightActiveContribution = '/sector/wghtactcontribution',
    ActiveContributionChart = '/sector/wghtactcontributionchart',
    WeightBestWorst = '/sector/wghtbestworst',
    DailyFactors = '/sector/wghtfactors',
    DailyFactorTotalContribution = '/sector/wghtfactortotcontr',
    DailyFactorTotalContributionChart = '/sector/wghtfactortotcontrchart',
    DailyFactorsAll = '/sector/wghtfactorsall',
    DailyFactorActiveContribution = '/sector/wghtfactoractcontr',
    DailyFactorActiveContributionChart = '/sector/wghtfactoractcontrchart',
    DailyFactorSummary = '/sector/wghtfactorsummary',
    DailyStocksInFactors = '/sector/wghtfactorstocks',

    ConstructAlphaStrategy = '/menu/alpha/constructalphastrategy',
    ViewAlphaStrategy = '/menu/alpha/viewalphastrategies',
    DefineAlphaDataItem = '/menu/alpha/definealphadataitem',
    AlphaViewReport = '/menu/alpha/alphaviewreport',
    ViewCombinedAlphas = '/menu/alpha/combinedalphas',
    ViewCombinedAlphaStrategies = '/menu/alpha/viewcombinedalphas',

    DefineScreeningDataItem = '/menu/screening/definescreeningdataitem',
    ScreeningViewReport = '/menu/screening/screeningviewreport',
    ScreeningReport = '/menu/screening/screeningreport',
    Constructscreen = '/menu/screening/constructscreen',
    ScreeningReportOptions = '/menu/screening/selectdataitem',
    ReportDataItems = '/menu/screening/reportingdataitems',
    ViewScreens = '/menu/screening/viewscreens',
    ViewScreensReport = '/menu/screening/viewscreensreport',

    MultiDailyReturns = '/menu/portfolio/multidailyreturns',
    MultiTrackStatistics = '/menu/portfolio/multitrackstatistics',

    Factors = '/menu/portfolio/factors',
    FactorsRisk = '/menu/portfolio/factorsrisk',
    FactorsRiskDetails = '/menu/portfolio/factorsriskdetails',

    ReportNotes = '/menu/reports/reportsnotes',
    VerifyCash = '/menu/portfolio/verifycash',
}

export class ModuleTrack {
    loginId?: string;
    moduleName?: string;
    totalTime?: string;
}
export class InvalidDates {
    invaliddate?: string;
}
export class EmailAddress {
    emailId?: string;
}

export class GraphProperties {
    dialogHeader?: string;
    panelHeader?: string;
    graphType?: string;
    labels?: string[];
    // dataset?: SeriesOptionsType[];
    maxValue?: number;
    minValue?: number;
    graphTitle?: string;
    graphSubTitle?: string;
}
export class GraphDataset {
    label?: string;
    data?: number[];
    borderColor?: string;
    backgroundColor?: string;
    fill?: boolean;
    type?: string;
    name?: string;
}

export class GraphsetProperties {
    dialogHeader?: string;
    panelHeader?: string;
    graphType?: string;
    labels?: string[];
    dataset?: [];
    maxValue?: number;
    minValue?: number;
    graphTitle?: string[];
}
export class Graphset {
    name: string;
    data: number[];
    type: string;
    color: string;
    borderColor: string;
}

export class ModelReturn {
    description?: string;
    value?: string;
    mode?: string;
    returnObject?: any;
}

export class RecentData {
    name?: string;
    strid?: string;
    folder?: string;
}

export class ReturnValue {
    status?: string;
    statusMessage?: string;
    detailIds?: string;
}

export class TableColumns {
    header?: string;
}

export class LogFiles {
    label?: string;
    icon?: string;
    path?: string;
    styleClass?: string;
    collapsedIcon?: string;
    expandedIcon?: string;
    children?: LogFiles[];
}

export class Log {
    logDate?: Date;
    loggedOn?: string;
    userId?: string;
    logType?: string;
    methodName?: string;
    component?: string;
    logMessage?: string;
    color?: string;
}
export class TickerCompanies {
    tickers?: string;
    companyIds?: string;
}
