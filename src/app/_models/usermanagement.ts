export class User {
    userId?: number;
    emailId?: string;
    userName?: string;
    firmName?: string;
    status?: number;
    occupation?: string;
    firstName?: string;
    lastName?: string;
    country?: string;
    state?: string;
    zipCode?: string;
    phone?: string;
    fax?: string;
    gender?: string;
    password?: string;
    secretQues?: string;
    anstoSecQues?: string;
    /**
     * Action type-Create/Edit User
     */
    actionType?: string;
    /**
     * Domain-selected Organization
     */
    domain?: string;
    name?: string;
    /**
     * Role  of user
     */
    role?: string;
    /**
     * Determines whether user is internal/external
     */
    isInternal?: boolean;
    internalExternal?: string;
}
/**
 * Company master
 */
export class CompanyMaster {
    companyID: number;
    companyName: string;
    tickerSymbol: string;
}

export class Folder {
    id?: number;
    folderName?: string;
    path?: string;
    treeLevel?: number;
}

export class UserReport {
    userId?: number;
    userName?: string;
    accessed?: string;
    /**
     * accessed time of user
     */
    times?: string;
    moduleName?: string;
}
export class LoginErrorMessage {
    ErrorMessage?: string;
    ReturnVal?: string;
    Exception?: string;
    ExceptionDetails?: ExceptionDetails;
    ErrorType?: string;
}
export class ExceptionDetails {
    ErrorMessage?: string;
    StackTrace?: string;
    MethodName?: string;
    Source?: string;
    ExceptionType?: string;
    InnerMessage?: string;
    InnerStackTrace?: string;
    InnerMethodName?: string;
    InnerSource?: string;
    InnerExceptionType?: string;
    NavigateUrl?: string;
}

