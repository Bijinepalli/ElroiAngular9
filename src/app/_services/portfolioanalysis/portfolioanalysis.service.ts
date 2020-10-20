import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import {
  Benchmark, Portfolio, ExcelFileData, ExcelFile, CompanyMaster,
  Statistics, DailyReturns, FactorBetas, PortfolioTrack, FolderDetails,
  PortfolioSector, PortfolioChar,
  TrackPortfolioSelectedData, SelectTilt, DomainFolder,
  PortfolioActiveContribution, PortfolioRisk,
  SectorGroupData, BestWorstPolicies, TrackChartData, StylePortfolio, HoldingStyle, DailyReturnsMultiplePortfolio, Factors,
  MultipleStatistics, FactorRiskContribution, MultiplePortfolioSector, StyleSizeAttribution, StyleSizeRiskContribution,
  FactorStockData, ExcelFileHeaderData
} from 'src/app/_models/portfolioanalysis';

import { forkJoin } from 'rxjs';
import { TreeNode } from 'primeng/api';
import { Cars } from 'src/app/_models/samples';
import { ReturnValue } from 'src/app/_models/commoncore';

@Injectable({
  providedIn: 'root'
})
export class PortfolioanalysisService {

  private portfolioURL = environment.serviceUrl + 'portfolioAnalysis/';
  private excelURL = environment.serviceUrl + 'excel/';
  private sampleURL = environment.serviceUrl + 'elements/';

  private envKey: string = environment.appName.toString() + '_' + environment.envName.toString() + '_';

  private httpOptionsUploadFile = new HttpHeaders({
    Authorization: 'Bearer ' + sessionStorage.getItem(this.envKey + 'jwtloginToken'),
    // appRegion: 'Test'
    applicationSettings: sessionStorage.getItem(this.envKey + 'applicationSettings')
  });

  constructor(
    private http: HttpClient
  ) { }

  getHttpOptions() {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + sessionStorage.getItem(this.envKey + 'jwtloginToken'),
      // appRegion: 'Test'
      applicationSettings: sessionStorage.getItem(this.envKey + 'applicationSettings')
    });
  }

  getHttpFormOptions() {
    return new HttpHeaders({
      Authorization: 'Bearer ' + sessionStorage.getItem(this.envKey + 'jwtloginToken'),
      // appRegion: 'Test'
      applicationSettings: sessionStorage.getItem(this.envKey + 'applicationSettings')
    });
  }

  getHttpOptionsMultiPart() {
    return new HttpHeaders({
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + sessionStorage.getItem(this.envKey + 'jwtloginToken'),
      // appRegion: 'Test'
      applicationSettings: sessionStorage.getItem(this.envKey + 'applicationSettings')
    });
  }

  uploadTextFileToServer(frmdata: FormData) {
    return this.http.post<string>(this.excelURL + 'UploadTextFileToServer',
      frmdata, { headers: this.getHttpOptionsMultiPart() });
  }

  // uploadFileToServer(formData: FormData, saveExcel: string, FolderId: string) {
  //   return this.http.post<any>(this.excelURL + 'uploadFileToServer?SaveExcelData=' + saveExcel + '&FolderId=' + FolderId, formData, {
  //     headers: this.getHttpOptions()
  //   });
  // }

  uploadFileToServer(formData: FormData, saveExcel: string, FolderId: string, backDate: string, userid: string) {
    return this.http.post<ExcelFileData[]>(this.excelURL +
      'UploadFileToServer?SaveExcelData=' + saveExcel +
      '&FolderId=' + FolderId + '&backdate=' + backDate + '&userId=' + userid, formData, {
      headers: this.getHttpFormOptions()
    });
  }

  deleteFile(fileId: string) {
    const params = new HttpParams()
      .set('fileId', fileId);
    return this.http.get<ReturnValue>(this.excelURL + 'DeleteFile',
      { headers: this.getHttpOptions(), params });
  }

  getExcelFile(FolderId: string, LatestYN: string) {
    const params = new HttpParams()
      .set('FolderId', FolderId)
      .set('LatestYN', LatestYN);
    return this.http.get<ExcelFile[]>(this.excelURL + 'GetExcelFiles',
      { headers: this.getHttpOptions(), params });
  }

  getExcelFileData(fileID: string) {
    const params = new HttpParams()
      .set('fileID', fileID);
    return this.http.get<ExcelFileData[]>(this.excelURL + 'GetExcelFileData',
      { headers: this.getHttpOptions(), params });
  }

  insertExcelFileData(excelFileData: ExcelFileData) {
    const body = JSON.stringify(excelFileData);
    // return this.http.post<ExcelFileData[]>(this.excelURL + 'InsertExcelFileData',
    //   body, { headers: this.getHttpOptions() });
    return this.http.post<ReturnValue>(this.excelURL + 'InsertExcelFileData',
      body, { headers: this.getHttpOptions() });
  }

  updateExcelFileData(excelFileData: ExcelFileData) {
    const body = JSON.stringify(excelFileData);
    return this.http.post<ReturnValue>(this.excelURL + 'UpdateExcelFileData',
      body, { headers: this.getHttpOptions() });
  }

  deleteExcelFileData(tickerIds: string) {
    const body = JSON.stringify(tickerIds);
    return this.http.post<ReturnValue>(this.excelURL + 'DeleteExcelFileData',
      body, { headers: this.getHttpOptions() });
  }

  getExcelFilteredData(fileID: string, StartTop: string, EndTop: string,
                       StartBottom: string, EndBottom: string,
                       StartMiddle: string, EndMiddle: string) {
    let params = new HttpParams()
      .set('fileID', fileID)
      .set('startVal', StartTop)
      .set('noRec', EndTop);
    const data1 = this.http.get<ExcelFileData[]>(this.excelURL + 'GetExcelFilteredData',
      { headers: this.getHttpOptions(), params });
    params = new HttpParams()
      .set('fileID', fileID)
      .set('startVal', StartBottom)
      .set('noRec', EndBottom);
    const data2 = this.http.get<ExcelFileData[]>(this.excelURL + 'GetExcelFilteredData',
      { headers: this.getHttpOptions(), params });
    params = new HttpParams()
      .set('fileID', fileID)
      .set('startVal', StartMiddle)
      .set('noRec', EndMiddle);
    const data3 = this.http.get<ExcelFileData[]>(this.excelURL + 'GetExcelFilteredData',
      { headers: this.getHttpOptions(), params });
    return forkJoin([data1, data2, data3]);
  }

  getPortfolios(folderId: string, userId: string) {
    const params = new HttpParams()
      .set('folderId', folderId)
      .set('userId', userId);
    return this.http.get<Portfolio[]>(this.portfolioURL + 'GetPortfolioDetails',
      { headers: this.getHttpOptions(), params });
  }

  getPortfolioDetails(portfolioId: string) {
    const params = new HttpParams()
      .set('portfolioId', portfolioId);
    return this.http.get<Portfolio[]>(this.portfolioURL + 'GetPortfolioDetails',
      { headers: this.getHttpOptions(), params });
  }

  getPortfoliosList(folderId: string, userId: string) {
    const params = new HttpParams()
      .set('folderId', folderId)
      .set('userId', userId);
    return this.http.get<Portfolio[]>(this.portfolioURL + 'GetPortfolioList',
      { headers: this.getHttpOptions(), params });
  }

  getRecentPortfolios(userId: string) {
    const params = new HttpParams()
      .set('userId', userId);
    return this.http.get<Portfolio[]>(this.portfolioURL + 'GetRecentPortfolioList',
      { headers: this.getHttpOptions(), params });
  }

  getBenchmarks() {
    return this.http.get<Benchmark[]>(this.portfolioURL + 'GetBenchmarks',
      { headers: this.getHttpOptions() });
  }

  getCompanyTickers() {
    return this.http.get<CompanyMaster[]>(this.portfolioURL + 'GetCompanyTickers',
      { headers: this.getHttpOptions() });
  }

  getFolders(userId: string) {
    const params = new HttpParams()
      .set('userId', userId);
    return this.http.get<TreeNode[]>(this.portfolioURL + 'GetFolders',
      { headers: this.getHttpOptions(), params });
  }

  getCars() {
    return this.http.get<Cars[]>(this.sampleURL + 'GetCars', { headers: this.getHttpOptions() });
  }

  getDailyReturnsData(portfolio: TrackPortfolioSelectedData) {
    const body = JSON.stringify(portfolio);
    return this.http.post<DailyReturns[]>(this.portfolioURL + 'DailyReturns',
      body, { headers: this.getHttpOptions() });
  }

  getTrackBestWorst(portfolio: TrackPortfolioSelectedData) {
    const body = JSON.stringify(portfolio);
    return this.http.post<BestWorstPolicies[]>(this.portfolioURL + 'TrackBestWorst',
      body, { headers: this.getHttpOptions() });
  }

  getFactorsBetaChartData(portfolio: TrackPortfolioSelectedData) {
    const body = JSON.stringify(portfolio);
    return this.http.post<DailyReturns[]>(this.portfolioURL + 'FactorBetasChartData',
      body, { headers: this.getHttpOptions() });
  }

  getStatistics(portfolio: TrackPortfolioSelectedData) {
    const body = JSON.stringify(portfolio);
    return this.http.post<Statistics[]>(this.portfolioURL + 'Statistics',
      body, { headers: this.getHttpOptions() });
  }

  getStatisticsUp(portfolio: TrackPortfolioSelectedData) {
    const body = JSON.stringify(portfolio);
    return this.http.post<Statistics[]>(this.portfolioURL + 'StatisticsUp ',
      body, { headers: this.getHttpOptions() });
  }

  getStatisticsDown(portfolio: TrackPortfolioSelectedData) {
    const body = JSON.stringify(portfolio);
    return this.http.post<Statistics[]>(this.portfolioURL + 'StatisticsDown',
      body, { headers: this.getHttpOptions() });
  }

  getFactorsBeta(portfolio: TrackPortfolioSelectedData) {
    const body = JSON.stringify(portfolio);
    return this.http.post<FactorBetas[]>(this.portfolioURL + 'FactorBetas',
      body, { headers: this.getHttpOptions() });
  }

  getPortfolioTilts(portfolio: TrackPortfolioSelectedData) {
    const body = JSON.stringify(portfolio);
    return this.http.post<SelectTilt[]>(this.portfolioURL + 'SelectTilt',
      body, { headers: this.getHttpOptions() });
  }

  getTrackingData(portfolio: TrackPortfolioSelectedData) {
    const body = JSON.stringify(portfolio);
    return this.http.post<PortfolioTrack[]>(this.portfolioURL + 'GetPortfolioTrackDetails',
      body, { headers: this.getHttpOptions() });
  }

  getPortfolioWeightDetails(portfolio: TrackPortfolioSelectedData) {
    const body = JSON.stringify(portfolio);
    return this.http.post<PortfolioTrack[]>(this.portfolioURL + 'GetPortfolioWeightDetails',
      body, { headers: this.getHttpOptions() });
  }

  GetDailyStatistics(portfolio: TrackPortfolioSelectedData) {
    const body = JSON.stringify(portfolio);
    return this.http.post<Statistics[]>(this.portfolioURL + 'GetDailyStatistics',
      body, { headers: this.getHttpOptions() });
  }

  getSectorData(portfolio: TrackPortfolioSelectedData) {
    const body = JSON.stringify(portfolio);
    return this.http.post<PortfolioSector[]>(this.portfolioURL + 'GetPortfolioSectorDetails',
      body, { headers: this.getHttpOptions() });
  }

  getActiveContribution(portfolio: TrackPortfolioSelectedData) {
    const body = JSON.stringify(portfolio);
    return this.http.post<PortfolioActiveContribution[]>(this.portfolioURL + 'GetPortfolioActiveContributions',
      body, { headers: this.getHttpOptions() });
  }

  getRiskReturn(portfolio: TrackPortfolioSelectedData) {
    const body = JSON.stringify(portfolio);
    return this.http.post<PortfolioRisk[]>(this.portfolioURL + 'GetPortfolioRiskReturn',
      body, { headers: this.getHttpOptions() });
  }

  getSectorGroups(portfolio: TrackPortfolioSelectedData) {
    const body = JSON.stringify(portfolio);
    return this.http.post<SectorGroupData[]>(this.portfolioURL + 'SectorGroupDetails',
      body, { headers: this.getHttpOptions() });
  }

  getWeightDetails(portfolio: TrackPortfolioSelectedData) {
    const body = JSON.stringify(portfolio);
    return this.http.post<PortfolioSector[]>(this.portfolioURL + 'GetPortfolioSectorDetails',
      body, { headers: this.getHttpOptions() });
  }

  getWeightActiveContributionDetails(portfolio: TrackPortfolioSelectedData) {
    const body = JSON.stringify(portfolio);
    return this.http.post<PortfolioActiveContribution[]>(this.portfolioURL + 'GetPortfolioWeightActiveContributions',
      body, { headers: this.getHttpOptions() });
  }

  getWeightDetailSectorData(portfolio: TrackPortfolioSelectedData) {
    const body = JSON.stringify(portfolio);
    return this.http.post<PortfolioSector[]>(this.portfolioURL + 'GetPortfolioWeightSectorDetails',
      body, { headers: this.getHttpOptions() });
  }

  getWeightDetailTrackBestWorst(portfolio: TrackPortfolioSelectedData) {
    const body = JSON.stringify(portfolio);
    return this.http.post<BestWorstPolicies[]>(this.portfolioURL + 'WeightBestWorst',
      body, { headers: this.getHttpOptions() });
  }

  getBenchmarkTracking(PortfolioId: string, BenchmarkName: string) {
    const params = new HttpParams()
      .set('portfolioId', PortfolioId)
      .set('benchMark', BenchmarkName);
    return this.http.get<PortfolioSector[]>(this.portfolioURL + 'GetBenchmarkTracking',
      { headers: this.getHttpOptions(), params });
  }

  getBenchmarkTracking_Risk(PortfolioId: string, BenchmarkName: string) {
    const params = new HttpParams()
      .set('portfolioId', PortfolioId)
      .set('benchMark', BenchmarkName);
    return this.http.get<PortfolioSector[]>(this.portfolioURL + 'GetBenchmarkTracking_Risk',
      { headers: this.getHttpOptions(), params });
  }

  GetPortfolioChar(portfolio: TrackPortfolioSelectedData) {
    const body = JSON.stringify(portfolio);
    return this.http.post<PortfolioChar[]>(this.portfolioURL + 'GetPortfolioCharacteristics', body,
      { headers: this.getHttpOptions() });
  }

  /* #region  [FolderManagement] */
  getDomainFolders() {
    return this.http.get<DomainFolder[]>(this.portfolioURL + 'GetDomainFolders',
      { headers: this.getHttpOptions() });
  }

  getFolderDetails(folderId: string, userId: string, type: string) {
    const params = new HttpParams()
      .set('folderId', folderId)
      .set('userId', userId)
      .set('type', type);
    return this.http.get<FolderDetails>(this.portfolioURL + 'GetFolderDetails',
      { headers: this.getHttpOptions(), params });
  }

  insertSubFolder(data) {
    const body = JSON.stringify(data);
    return this.http.post<ReturnValue>(this.portfolioURL + 'InsertSubFolder',
      body, { headers: this.getHttpOptions() });
  }

  deleteFolder(data) {
    const body = JSON.stringify(data);
    return this.http.post<ReturnValue>(this.portfolioURL + 'DeleteFolder',
      body, { headers: this.getHttpOptions() });
  }

  folderDetailsAction(data) {
    const body = JSON.stringify(data);
    return this.http.post<ReturnValue>(this.portfolioURL + 'FolderDetailsAction',
      body, { headers: this.getHttpOptions() });
  }
  /* #endregion */

  getMyConstraints(PortfolioId: string) {
    const params = new HttpParams()
      .set('portfolioId', PortfolioId);
    return this.http.get<Portfolio[]>(this.portfolioURL + 'GetMyConstraints',
      { headers: this.getHttpOptions(), params });
  }

  getTrackChartData(portfolio: TrackPortfolioSelectedData) {
    const body = JSON.stringify(portfolio);
    return this.http.post<TrackChartData[]>(this.portfolioURL + 'TrackChartData',
      body, { headers: this.getHttpOptions() });
  }

  getTrackReportData(data) {
    const body = JSON.stringify(data);
    return this.http.post<BestWorstPolicies[]>(this.portfolioURL + 'GetTrackReportData',
      body, { headers: this.getHttpOptions() });
  }

  getStyleData(stylePortfolio: StylePortfolio) {
    const body = JSON.stringify(stylePortfolio);
    return this.http.post<HoldingStyle[]>(this.portfolioURL + 'GetStyleData',
      body, { headers: this.getHttpOptions() });
  }

  getMultiplePortfolioTrackingData(portfolio: TrackPortfolioSelectedData) {
    const body = JSON.stringify(portfolio);
    // console.log(this.portfolioURL + 'GetMultiplePortfolioTrackDetails');
    return this.http.post<PortfolioTrack[]>(this.portfolioURL + 'GetMultiplePortfolioTrackDetails',
      body, { headers: this.getHttpOptions() });
  }

  getMultiplePortfolioDailyReturnsData(portfolio: TrackPortfolioSelectedData) {
    const body = JSON.stringify(portfolio);
    return this.http.post<DailyReturnsMultiplePortfolio[]>(this.portfolioURL + 'DailyReturnsMultiplePortfolio',
      body, { headers: this.getHttpOptions() });
  }

  getFactorsData(portfolio: TrackPortfolioSelectedData) {
    const body = JSON.stringify(portfolio);
    return this.http.post<Factors[]>(this.portfolioURL + 'DisplayFactorReturns',
      body, { headers: this.getHttpOptions() });
  }

  getFactorGroupDetails(portfolio: TrackPortfolioSelectedData) {
    const body = JSON.stringify(portfolio);
    return this.http.post<Factors[]>(this.portfolioURL + 'DisplayFactorGroupDetails',
      body, { headers: this.getHttpOptions() });
  }
  getFactorsViewAllData(portfolio: TrackPortfolioSelectedData) {
    const body = JSON.stringify(portfolio);
    return this.http.post<TreeNode[]>(this.portfolioURL + 'DisplayFactorViewAllDetails',
      body, { headers: this.getHttpOptions() });
  }

  getMultipleTrackingStatistics(portfolio: TrackPortfolioSelectedData) {
    const body = JSON.stringify(portfolio);
    return this.http.post<MultipleStatistics[]>(this.portfolioURL + 'MultipleStatistics',
      body, { headers: this.getHttpOptions() });
  }

  getFactorRiskContributions(portfolio: TrackPortfolioSelectedData) {
    const body = JSON.stringify(portfolio);
    return this.http.post<FactorRiskContribution[]>(this.portfolioURL + 'DisplayFactorRiskContribution',
      body, { headers: this.getHttpOptions() });
  }

  getMultipleTrackingSector(portfolio: TrackPortfolioSelectedData) {
    const body = JSON.stringify(portfolio);
    return this.http.post<MultiplePortfolioSector[]>(this.portfolioURL + 'GetMultiplePortfolioSectorDetails',
      body, { headers: this.getHttpOptions() });
  }
  getMultipleTrackingSectorActiveContribution(portfolio: TrackPortfolioSelectedData) {
    const body = JSON.stringify(portfolio);
    return this.http.post<MultiplePortfolioSector[]>(this.portfolioURL + 'GetMultiplePortfolioSectorActiveContributionDetails',
      body, { headers: this.getHttpOptions() });
  }
  getStyleSizeAttributionDetails(portfolio: TrackPortfolioSelectedData) {
    const body = JSON.stringify(portfolio);
    return this.http.post<StyleSizeAttribution[]>(this.portfolioURL + 'StyleSizeAttributionDetails',
      body, { headers: this.getHttpOptions() });
  }
  getStyleSizeRiskContributionDetails(portfolio: TrackPortfolioSelectedData) {
    const body = JSON.stringify(portfolio);
    return this.http.post<StyleSizeRiskContribution[]>(this.portfolioURL + 'StyleSizeRiskContributionDetails',
      body, { headers: this.getHttpOptions() });
  }
  getFactorsDailyData(portfolio: TrackPortfolioSelectedData) {
    const body = JSON.stringify(portfolio);
    return this.http.post<Factors[]>(this.portfolioURL + 'DailyFactorReturns',
      body, { headers: this.getHttpOptions() });
  }
  getFactorGroupDailyDetails(portfolio: TrackPortfolioSelectedData) {
    const body = JSON.stringify(portfolio);
    return this.http.post<Factors[]>(this.portfolioURL + 'DailyFactorGroupDetails',
      body, { headers: this.getHttpOptions() });
  }
  getFactorsViewAllDailyData(portfolio: TrackPortfolioSelectedData) {
    const body = JSON.stringify(portfolio);
    return this.http.post<TreeNode[]>(this.portfolioURL + 'DailyFactorViewAllDetails',
      body, { headers: this.getHttpOptions() });
  }
  getDailyFactorActiveContribution(portfolio: TrackPortfolioSelectedData) {
    const body = JSON.stringify(portfolio);
    return this.http.post<Factors[]>(this.portfolioURL + 'DailyFactorActiveContribution',
      body, { headers: this.getHttpOptions() });
  }
  getDailyFactorSummary(portfolio: TrackPortfolioSelectedData) {
    const body = JSON.stringify(portfolio);
    return this.http.post<TreeNode[]>(this.portfolioURL + 'DailyFactorSummary',
      body, { headers: this.getHttpOptions() });
  }
  getFactorSummary(portfolio: TrackPortfolioSelectedData) {
    const body = JSON.stringify(portfolio);
    return this.http.post<TreeNode[]>(this.portfolioURL + 'FactorSummary',
      body, { headers: this.getHttpOptions() });
  }
  getFactorActiveContribution(portfolio: TrackPortfolioSelectedData) {
    const body = JSON.stringify(portfolio);
    return this.http.post<Factors[]>(this.portfolioURL + 'FactorActiveContribution',
      body, { headers: this.getHttpOptions() });
  }
  getDailyStocksInFactors(portfolio: TrackPortfolioSelectedData) {
    const body = JSON.stringify(portfolio);
    return this.http.post<FactorStockData[]>(this.portfolioURL + 'DailyStocksInFactors',
      body, { headers: this.getHttpOptions() });
  }
  getStocksInFactors(portfolio: TrackPortfolioSelectedData) {
    const body = JSON.stringify(portfolio);
    return this.http.post<FactorStockData[]>(this.portfolioURL + 'StocksInFactors',
      body, { headers: this.getHttpOptions() });
  }
  getExcelFileHeaderData(fileId: string) {
    const params = new HttpParams()
      .set('fileID', fileId);
    return this.http.get<ExcelFileHeaderData[]>(this.excelURL + 'GetExcelFileHeaderData',
      { headers: this.getHttpOptions(), params });
  }
  saveCashtoFile(excelFileHeaderData: ExcelFileHeaderData) {
    const body = JSON.stringify(excelFileHeaderData);
    return this.http.post<ReturnValue>(this.excelURL + 'InsertCashDetails',
      body, { headers: this.getHttpOptions() });
  }
}
