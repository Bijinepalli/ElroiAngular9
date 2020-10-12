export class ExportExcel {
    data?: any;
    fileName?: string;
    headers?: any;
    reportHeader?: string;
    pageNo?: number;
    pageRecords?: number;
}
export class EmailHTMLContent {
    mailTo?: any;
    mailCC?: any;
    mailBCC?: any;
    addBccToAddressBook?: string;
    mailSubject?: string;
    mailComments?: string;
    mailSignature?: string;
    mailBody?: string;
}

export interface Car {
    vin?;
    year?;
    brand?;
    color?;
    price?;
    saleDate?;
    isSelected?;
}

export interface Cars {
    label?;
    icon?;
    data?;
    styleClass?;
    collapsedIcon?;
    expandedIcon?;
    isSelected?;
    children: any[];
}
