import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationError, NavigationCancel } from '@angular/router';
import { Validators } from '@angular/forms';
import { ValidatorHelper } from './_core/_pipes/validationhelper.validator';
import { DataService } from './_services/data/data.service';
import { merge, of, fromEvent } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  showSpinner = false;
  showNetworkConn = false;
  constructor(
    private router: Router,
    private dataSvc: DataService,
    private msgSvc: MessageService,
  ) {
    router.events.subscribe((event) => {
      // console.log(event);
      if (event instanceof NavigationStart) {
        // this.dataSvc.changeSpinner(true);
      }

      if (event instanceof NavigationEnd) {
        // this.dataSvc.changeSpinner(false);
      }

      if (event instanceof NavigationError) {
        // this.dataSvc.changeSpinner(false);
      }
      if (event instanceof NavigationCancel) {
        // this.dataSvc.changeSpinner(false);
      }
    });
  }

  ngOnInit() {
    Validators.required = ValidatorHelper.required;
    // this.dataSvc.showSpinner.subscribe((show) => {
    //   setTimeout(() => {
    //     this.showSpinner = show;
    //   });
    // });
    this.buildConnectivitySubscription();
  }

  onRejectError() {
    this.msgSvc.clear('errorHandlerMessages');
  }

  buildConnectivitySubscription() {
    merge(
      of(navigator.onLine),
      fromEvent(window, 'online').pipe(mapTo(true)),
      fromEvent(window, 'offline').pipe(mapTo(false))
    ).subscribe((isOnline) => {
      this.showNetworkConn = !navigator.onLine;
      if (!isOnline) {
        // this.router.navigate(['/forbidden/' + 'No Internet Connection'], { skipLocationChange: false });
        this.msgSvc.add({
          key: 'connection',
          closable: false,
          sticky: true,
          severity: 'error',
          summary: 'Error Occurred!',
          detail: 'No Internet Connection'
        });
      } else {
        this.onRejectConnection();
        // this.router.navigate(['']);
      }
    })
  }

  onRejectConnection() {
    if (navigator.onLine) {
      this.msgSvc.clear('connection');
    }
  }

  onReject() {
    this.msgSvc.clear('alert');
  }

  onRejectException() {
    this.msgSvc.clear('exception');
  }


}
