export class LoginRequest {
    userName?: string;
    passWord?: string;
}

export class LoginResponse {
    token?: string;
}

export class Authenticate {
    userId?: string;
    userName?: string;
    passWord?: string;
    oldpassWord?: string;
    token?: string;
    role?: string;
    errorMsg?: string;
    fullName?: string;
    firmName?: string;
    organization?: string;
    isInternal?: boolean;
    loginId?: string;
}





