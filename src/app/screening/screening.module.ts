import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrimenguiModule } from '../_ui/primengui/primengui.module';
import { ScreeningRoutingModule } from './screening-routing.module';
import { DefinescreeningdataitemsComponent } from './definescreeningdataitems/definescreeningdataitems.component';
import { ViewscreeningdataitemsComponent } from './viewscreeningdataitems/viewscreeningdataitems.component';
import { ConstructscreenComponent } from './constructscreen/constructscreen.component';
import { StocksmodelComponent } from './stocksmodel/stocksmodel.component';
import { SearchtickersComponent } from './searchtickers/searchtickers.component';
import { BenchmarksmodelComponent } from './benchmarksmodel/benchmarksmodel.component';
import { StatisticsmodelComponent } from './statisticsmodel/statisticsmodel.component';
import { MathmodelComponent } from './mathmodel/mathmodel.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        PrimenguiModule,
        ScreeningRoutingModule,
    ],
    declarations: [
        DefinescreeningdataitemsComponent,
        ViewscreeningdataitemsComponent,
        ConstructscreenComponent,
        StocksmodelComponent,
        SearchtickersComponent,
        BenchmarksmodelComponent,
        StatisticsmodelComponent,
        MathmodelComponent,
    ]
})
export class ScreeningModule { }
