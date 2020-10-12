export class ScreeningReport {
    details?: any;
    columns?: any;
    dateColumns?: any;
    query?: any;
}

export class CountryCodes {
    countryId?: string;
    countryName?: string;
}
export class IndexIndicator {
    benchId?: number;
    benchGroupId?: number;
    benchMark?: string;
    benchmarkValue?: string;
    isEqual?: boolean;
}
export class Rating {
    module?: string;
    ratingDisplayValue?: string;
    ratingDatabaseValue?: string;
    mode?: string;
    modeDisplay?: string;
    isEqual?: boolean;
}

export class Criteria {
    label?: string;
    value?: string;
    criteriaId?: number;
    criteriaName?: string;
    criteriaDesc?: string;
    criteriaInfo?: string;
    viewId?: string;
    rviewId?: string;
    domicile?: string;
    userId?: number;
    firstName?: string;
    folder?: number;
    isDeleteYN?: number;
}

export class QueryData {
    strInformation?: string;
    strCriteriaForModify?: string;
    listData?: string;
    backScreening?: boolean;
    backScreeningDate?: string;
    notInClos?: string;
    colsForZero?: string;
    notInClosTop?: string;
    spIn?: string;
    spNotIn?: string;
    russellIn?: string;
    russellNotIn?: string;
    screeningCount?: string;
    totalCount?: string;
    dateTaken?: string;
    cList?: string;
    hidName?: string;
    roDate?: string;
    hidIndexNo?: string;
    hidIndexNo1?: string;
    hidRIndexNo?: string;
    hidRIndexNo1?: string;
    domicile?: string;
    includeCompIds?: string;
    ticker?: string;
    optYN?: string;
    backdate2?: string;
    subIndDates?: string;
    screeningColumn?: string;
    srColumns?: string;
    rankColumns?: string;
    companyIds?: string;
    rankDisplayColumns?: string;
    screeningSecondCondition?: string;
    cDispType?: string;
    absoluteDates?: string;
    sortc?: string;
    itemDates?: string;
    subems?: string;
    excludeCompIds?: string;
    elroiUniverse?: string;
    displayDates?: string;
    originalQuery?: string;
    newQuery?: string;
    order?: string;
    prevSortField?: string;
    screeningCondition?: string;
    trackQuery?: string;
    download?: string;
    retrieveExisting?: string;
    screeningNavigatedFromFile?: string;
    value?: string;
    printVal?: string;
    strReferer?: string;
    httpReferer?: string;
    formedString?: string;
    groupType?: string;
    actualCriteria?: string;
    subitems?: string;
    reportTitle?: string;
}

export class ScreeningData {
    userId?: number;
    criteriaName?: string;
    saveOption?: number;
    viewId?: string;
    folder?: number;
    domicile?: number;
    createdOn?: string;
    rViewId?: string;
    includeIds?: string;
    excludeIds?: string;
    criteria?: string;
    isReportData?: boolean;
    reportCriteria?: string;
    criteriaId?: string;
}


