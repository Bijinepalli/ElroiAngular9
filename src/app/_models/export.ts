

export class ExportData {
    data?: any;
    fileName?: string;
    headers?: ExportHeaders[];
    columns?: ExportColumns[];
    reportHeader?: string;
    pageNo?: number;
    pageRecords?: number;
    tableHeaders?: ExportTableHeaders[];
}
export class ExportHeaders {
    colName: string;
    displayName: string;
}

export class ExportTableHeaders {
    displayName?: string[];
    colSpan?: string[];
}

export class ExportColumns {
    field?: string;
    header?: string;
    align?: string;
    width?: string;
    color?: string;
}
export class EmailHTMLContent {
    mailTo?: string;
    mailCC?: string;
    mailBCC?: string;
    addBccToAddressBook?: string;
    mailSubject?: string;
    mailComments?: string;
    mailSignature?: string;
    mailBody?: string;
}
