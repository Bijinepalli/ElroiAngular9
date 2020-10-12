import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { QueryData } from 'src/app/_models/screening';
import { environment } from 'src/environments/environment';
import { AlphaItems, AlphaFunction } from 'src/app/_models/alphas';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private pagePaths = new BehaviorSubject('New');

  private showSpinnerSubject = new BehaviorSubject(false);

  envKey: string = environment.appName.toString() + '_' + environment.envName.toString() + '_';

  // currentItemName = this.alphaItemsSource.asObservable();
  currentAlphaItem: AlphaItems;
  currentScreeningItem: any = 'New';
  currentScreeningCriteria: any = 'New';
  currentLoginId: any = 'New';

  currentModule: any = 'New';
  currentModuleStartTime: any = 'New';
  currentModuleEndTime: any = 'New';

  portfolioTrackingParameters: any = 'New';

  lstMenuItems: any = 'New';

  lstInvalidDates: any = 'New';
  lstPageSections: any = 'New';

  obsPagePath: any = this.pagePaths.asObservable();
  currentPagePath: any = 'New';

  selectedAlphaStrategy: any = 'New';
  screeningViewCondition: any = '';

  isScreeningAlpha: any = '';

  showSpinner = this.showSpinnerSubject.asObservable();

  preservePortfolioData = false;

  constructor() {
    this.checkLoginId();
  }

  checkLoginId() {
    if (sessionStorage.getItem(this.envKey.toString() + 'loginId')) {
      this.changeLoginId(sessionStorage.getItem(this.envKey.toString() + 'loginId').toString());
    }
  }

  changeAlphaItem(itemName: AlphaItems) {
    this.currentAlphaItem = itemName;
  }

  changeScreeningItem(itemName: any) {
    this.currentScreeningItem = itemName;
  }

  changeScreeningCriteria(itemName: any) {
    this.currentScreeningCriteria = itemName;
  }

  changeAlphaStrategy(data: any) {
    this.selectedAlphaStrategy = data;
  }

  savaPortrackparams(portfolioTrackingQuery: any) {
    this.portfolioTrackingParameters = portfolioTrackingQuery;
  }

  clearAlphaItem() {
    this.currentAlphaItem = undefined;
  }

  clearScreeningItem() {
    this.currentScreeningItem = 'New';
  }

  clearScreeningCriteria() {
    this.currentScreeningCriteria = 'New';
  }

  changeLoginId(loginId: any) {
    this.currentLoginId = loginId;
  }

  clearLoginId() {
    this.currentLoginId = 'New';
  }

  changeModule(moduleName: any) {
    this.currentModule = moduleName;
  }

  startModule() {
    this.currentModuleStartTime = new Date();
  }

  endModule() {
    this.currentModuleEndTime = new Date();
    let diffSecs = '';
    if (this.currentModuleStartTime !== 'New' && this.currentModuleEndTime !== 'New') {
      const diffMs = (this.currentModuleEndTime - this.currentModuleStartTime); // milliseconds
      const diffMins = Math.floor(((diffMs % 86400000) % 3600000) / 60000); // minutes
      diffSecs = Math.floor(diffMs / 1000).toFixed(2).toString();
    }
    return diffSecs;
  }

  clearModule() {
    this.currentModule = 'New';
    this.currentModuleStartTime = 'New';
    this.currentModuleEndTime = 'New';
  }

  changeMenuItems(menuItems: any) {
    this.lstMenuItems = menuItems;
  }

  clearMenuItems() {
    this.lstMenuItems = 'New';
  }

  changeInvalidDates(invalidDates: any) {
    this.lstInvalidDates = invalidDates;
  }
  changePageSections(pageSections: any) {
    this.lstPageSections = pageSections;
  }

  clearInvalidDates() {
    this.lstInvalidDates = 'New';
  }

  changePagePath(pagePath: any) {
    this.currentPagePath = pagePath;
    this.pagePaths.next(pagePath);
  }

  clearPagePath() {
    this.currentPagePath = 'New';
    this.pagePaths.complete();
  }

  changeSpinner(show: any) {
    this.showSpinnerSubject.next(show);
  }

  clearSpinner() {
    this.showSpinnerSubject.complete();
  }

  getQueryParams(path) {
    let queryParamsNew: any;
    queryParamsNew = {};
    const np = Math.floor(Math.random() * (10000 - 1 + 1)) + 1;
    const lstMenuItems = this.lstMenuItems;
    const reqRoute = lstMenuItems.filter(m => m.controller === path);
    if (reqRoute && reqRoute !== null && reqRoute.length > 0) {
      queryParamsNew = { Id: reqRoute[0].idPath, TS: np, Mode: '' };
    }
    return queryParamsNew;
  }

  clearData() {
    // this.alphaItemsSource = new BehaviorSubject('New');
    this.currentAlphaItem = undefined;
    this.currentScreeningItem = 'New';
    this.currentScreeningCriteria = 'New';
    this.lstMenuItems = 'New';
    this.lstInvalidDates = 'New';
    this.currentLoginId = 'New';
    this.currentModule = 'New';
    this.currentModuleStartTime = 'New';
    this.currentModuleEndTime = 'New';
    this.portfolioTrackingParameters = 'New';
  }

  getScreeningViewCondition() {
    return this.screeningViewCondition;
  }

  setScreeningViewCondition(queryData: QueryData) {
    this.screeningViewCondition = queryData;
  }

  getScreeningAlphaCondition() {
    return this.isScreeningAlpha;
  }

  setScreeningAlphaCondition(lstData: string) {
    this.isScreeningAlpha = lstData;
  }

}
