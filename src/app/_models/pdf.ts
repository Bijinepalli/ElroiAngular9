export class PDFData {
    title?: string;
    author?: string;
    subject?: string;
    keywords?: string;

    pdfHeader?: string;
    pdfSubHeader?: string;
    addFooter?: boolean;

    content?: PDFDataType[];
}
export class PDFDataType {
    type?: string;
    data?: any;
}
export class PDFTable {
    style?: string[];
    layout?: any;
    table?: PDFTableData;
}
export class PDFTableData {
    widths?: number[];
    heights?: number[];
    headerRows?: number;
    body?: PDFTableCell[][];
}
export class PDFTableCell {
    text: string;
    style?: string;
    color?: string;
    fillColor?: string;
    bold?: boolean;
    italics?: boolean;
    fontSize?: number;
    alignment?: string;
    border?: boolean[];
    rowSpan?: number;
    colSpan?: number;
    width?: number;
    columns?: PDFColumnData[];
}
export class PDFImageData {
    image?: any;
    width?: any;
    alignment?: string;
}
export class PDFColumnData {
    alignment?: string;
    columns?: PDFTableCell[];
}
export class PDFContent {
    content?: any[];
    styles?: any[];
    info?: any[];
    constructor(content, styles, info) {
        this.content = content;
        this.styles = styles;
        this.info = info;
    }
    addStyles(styles: any[]) {
        this.styles = styles;
    }
    addInfo(info: any[]) {
        this.info = info;
    }
    addTextData(textCell: PDFTableCell) {
        this.content.push(textCell);
    }
    addTableData(pdfTable: PDFTable) {
        this.content.push(pdfTable);
    }
    addImageData(pdfImage: PDFImageData) {
        this.content.push(pdfImage);
    }
    addColumns(pdfColumns: PDFColumnData) {
        this.content.push(pdfColumns);
    }
}



