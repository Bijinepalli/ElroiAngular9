import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpResponse, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, retry, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DataService } from 'src/app/_services/data/data.service';
import { environment } from 'src/environments/environment';
import { LoggerService } from 'src/app/_services/log/logger.service';

@Injectable()
export class HttpInterceptorHandler implements HttpInterceptor {

    constructor(
        private router: Router,
        private dataSvc: DataService,
        public msgSvc: MessageService,
        private logger: LoggerService,
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // if (!(req.url.includes(environment.serviceUrl + 'CommonCore/' + 'updateModuleTrack'))) {
        //     this.dataSvc.changeSpinner(true);
        // }
        // console.log(req);

        return next
            .handle(req)
            .pipe(
                // retry(5),
                tap(
                    (event: HttpEvent<any>) => {
                        // console.log(event);
                        if (event instanceof HttpResponse) {
                            // if (!(req.url.includes(environment.serviceUrl + 'CommonCore/' + 'updateModuleTrack'))) {
                            //     this.dataSvc.changeSpinner(false);
                            // }
                            // console.log(event);
                        }
                    },
                    (error) => {
                        // console.log(error);

                        // let errorMessage = '';
                        // if (!navigator.onLine) {
                        //     errorMessage += 'No Internet Connection' + '<br>';
                        // }
                        // // console.log(error);
                        // if (error && error !== null) {
                        //     if (error.error instanceof ErrorEvent) {
                        //         // client-side error
                        //         errorMessage += `Type: HTTP Client Error <br>`;
                        //         errorMessage += `Error: ${error.error.message}<br>`;
                        //     } else {
                        //         // server-side error
                        //         errorMessage += `Type: HTTP Server Error <br>`;
                        //         if (error.status) {
                        //             errorMessage += `Code: ${error.status} <br>`;
                        //             errorMessage += `Message: `;
                        //             if (error.status === 0) {
                        //                 errorMessage += `Service URL doesn't exist <br>`;
                        //             } else if (error.status === 401) {
                        //                 errorMessage += `Unauthorized Request <br>`;
                        //             } else if (error.status === 403) {
                        //                 errorMessage += `Forbidden Request <br>`;
                        //             } else if (error.status === 404) {
                        //                 errorMessage += `Requested Method Not Found <br>`;
                        //             } else if (error.status === 408) {
                        //                 errorMessage += `Request Timeout <br>`;
                        //             } else if (error.status === 415) {
                        //                 errorMessage += `Unsupported Media Type <br>`;
                        //             } else {
                        //                 errorMessage += error.statusText ? `${error.statusText} <br>` : ``;
                        //             }
                        //         }
                        //     }
                        // } else {
                        //     errorMessage += `Null Error <br>`;
                        // }
                        // this.msgSvc.add({
                        //     key: 'errorHandlerMessages',
                        //     sticky: true,
                        //     severity: 'error',
                        //     summary: 'Error Occurred!',
                        //     detail: errorMessage
                        // });
                        // // throwError(error);
                        // // this.spinnerSvc.close();
                        // // if (!(req.url.includes(environment.serviceUrl + 'CommonCore/' + 'updateModuleTrack'))) {
                        // //     this.dataSvc.changeSpinner(false);
                        // // }


                        // this.logger.error('http-interceptor - onerror', error);
                    }
                ),
                catchError(err => {
                    // console.log(err);
                    if (!navigator.onLine) {
                        this.router.navigate(['']);
                    } else {
                        // this.logger.error('http-interceptor - catchError', err);
                        if (err && err !== null && err.status) {
                            // console.log(err.status);
                            // console.log(err.statusText);
                            // this.spinnerSvc.close();
                            // if (!(req.url.includes(environment.serviceUrl + 'CommonCore/' + 'updateModuleTrack'))) {
                            //     this.dataSvc.changeSpinner(false);
                            // }
                            const error = err.statusText;
                            if (err.status === 401) {
                                // auto logout if 401 response returned from api
                                // this.authenticationSvc.logout();
                                // location.reload(true);
                                this.router.navigate(['']);
                            } else if (err.status === 403) {
                                this.router.navigate(['/forbidden/' + error], { skipLocationChange: false });
                            }
                            // else if (err.status === 404) {
                            //     this.router.navigate(['/forbidden/' + error], { skipLocationChange: false });
                            // }
                        }
                    }
                    return throwError(err);
                })
            );
    }
}
