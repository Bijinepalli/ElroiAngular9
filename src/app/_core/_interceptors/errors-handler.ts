import { Injectable, Injector, ErrorHandler } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LoggerService } from 'src/app/_services/log/logger.service';

@Injectable()
export class ErrorLogService {
    constructor(
        private injector: Injector,
        private logger: LoggerService,
        // private msgSvc: MessageService,
    ) { }
    logError(error: any) {
        // console.log(error);
        this.logger.error('errorHandler', 'logError', error);
        const msgSvc = this.injector.get(MessageService);
        const router = this.injector.get(Router);
        let errorSummary = 'Error Occurred!';
        // const dataSvc = this.injector.get(DataService);
        const date = new Date().toLocaleString();
        let errorMessage = '';
        errorMessage += 'Time: ' + date + '<br>';
        // errorMessage += 'Location: ' + router.url + '<br>';
        if (!navigator.onLine) {
            // Handle offline error
            errorMessage += 'No Internet Connection.' + '<br>';
        }
        if (error instanceof HttpErrorResponse) {
            errorMessage += `Type: HTTP Error <br>`;
            errorMessage += `Code: ${error.status} <br>`;
            // errorMessage += `Message: ${error.message} <br>`;
            if (error && error !== null) {
                if (error.error instanceof ErrorEvent) {
                    // client-side error
                    errorMessage += `Sub Type: HTTP Client Error <br>`;
                    errorMessage += `Error: ${error.error.message}<br>`;
                } else {
                    // server-side error
                    errorMessage += `Sub Type: HTTP Server Error <br>`;
                    if (error.status !== undefined && error.status !== null) {
                        // errorMessage += `Code: ${error.status} <br>`;
                        errorMessage += `Status: `;
                        if (error.status === 0) {
                            errorMessage += `Service URL doesn't exist <br>`;
                            errorSummary = `Service URL doesn't exist`;
                        } else if (error.status === 401) {
                            errorMessage += `Unauthorized Request <br>`;
                            errorSummary = `Unauthorized Request`;
                        } else if (error.status === 403) {
                            errorMessage += `Forbidden Request <br>`;
                            errorSummary = `Forbidden Request`;
                        } else if (error.status === 404) {
                            errorMessage += `Requested Method Not Found <br>`;
                            errorSummary = `Requested Method Not Found`;
                        } else if (error.status === 408) {
                            errorMessage += `Request Timeout <br>`;
                            errorSummary = `Request Timeout`;
                        } else if (error.status === 415) {
                            errorMessage += `Unsupported Media Type <br>`;
                            errorSummary = `Unsupported Media Type`;
                        } else {
                            errorMessage += error.statusText ? `${error.statusText} <br>` : ``;
                        }
                        errorMessage += error.message ? `Message: ${error.message} <br>` : ``;
                    }
                }
            } else {
                errorMessage += `Null Error <br>`;
            }
        } else if (error instanceof TypeError) {
            errorMessage += `Type: Type Error <br>`;
            errorMessage += `Message: ${error.message} <br>`;
        } else if (error instanceof Error) {
            errorMessage += `Type: General Error <br>`;
            errorMessage += `Message: ${error.message} <br>`;
        } else {
            errorMessage += `Type: Unknown Error <br>`;
            errorMessage += `Message: ${error} <br>`;
        }
        this.logger.error('errorHandler', 'logError', errorMessage);
        msgSvc.clear();
        msgSvc.add({
            key: 'errorHandlerMessages',
            sticky: true,
            severity: 'error',
            summary: errorSummary,
            detail: errorMessage
        });
    }
}

@Injectable()
export class ErrorsHandler implements ErrorHandler {
    constructor(
        private injector: Injector,
    ) { }
    handleError(error: Error | HttpErrorResponse) {
        const errorLogService = this.injector.get(ErrorLogService);
        errorLogService.logError(error);
    }
}


