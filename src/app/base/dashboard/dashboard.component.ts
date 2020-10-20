import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { LoggerService } from 'src/app/_services/log/logger.service';
import { CompanyMaster } from 'src/app/_models/portfolioanalysis';
import { PortfolioanalysisService } from 'src/app/_services/portfolioanalysis/portfolioanalysis.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  componentName: string;
  lstSelectedCompanies: CompanyMaster[];
  selectedStock: CompanyMaster;
  stock: string;
  url: string;
  @ViewChild('frm') iframe: ElementRef;

  constructor(
    private logger: LoggerService,
    private portfolioSvc: PortfolioanalysisService,
    private sanitizer: DomSanitizer,
  ) {
    this.componentName = 'Dashboard';
  }

  ngOnInit() {
    this.initialisations();
  }

  initialisations() {
    this.logger.info(this.componentName, 'Initialisations', 'Entry');
    this.stock = 'EBIX';
    this.getCompanyTickers();
  }

  setUrl() {
    // tslint:disable-next-line:max-line-length
    this.url = 'http://api.stockdio.com/visualization/financial/charts/v1/HistoricalPrices?app-key=D3309DD46F5348BBB6A3B793F0C1985B&symbol=' + this.selectedStock.tickerSymbol;
    this.url += '&days=365&width=1500&height=420';
  }

  getCompanyTickers() {
    this.portfolioSvc.getCompanyTickers().subscribe(
      (data) => {
        this.lstSelectedCompanies = data;
        const selectTicker = this.lstSelectedCompanies.filter(P => P.tickerSymbol === 'AAPL');
        this.selectedStock = selectTicker[0];
        // tslint:disable-next-line:max-line-length
        this.url = 'http://api.stockdio.com/visualization/financial/charts/v1/HistoricalPrices?app-key=D3309DD46F5348BBB6A3B793F0C1985B&symbol=' + this.selectedStock.tickerSymbol;
        this.url += '&days=365&width=1500&height=420';
      }
    );
  }
}
