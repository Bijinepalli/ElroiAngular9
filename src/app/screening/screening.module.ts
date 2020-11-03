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
import { GrowthmodelComponent } from './growthmodel/growthmodel.component';
import { SubindmodelComponent } from './subindmodel/subindmodel.component';
import { AlphamodelComponent } from './alphamodel/alphamodel.component';
import { BoolmodelComponent } from './boolmodel/boolmodel.component';
import { DecilemodelComponent } from './decilemodel/decilemodel.component';
import { MiddlemodelComponent } from './middlemodel/middlemodel.component';
import { RankmodelComponent } from './rankmodel/rankmodel.component';
import { NtilemodelComponent } from './ntilemodel/ntilemodel.component';
import { CountrycodemodelComponent } from './countrycodemodel/countrycodemodel.component';
import { CommonCoreModule } from '../common/common.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        PrimenguiModule,
        CommonCoreModule,
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
        GrowthmodelComponent,
        SubindmodelComponent,
        AlphamodelComponent,
        BoolmodelComponent,
        DecilemodelComponent,
        MiddlemodelComponent,
        RankmodelComponent,
        NtilemodelComponent,
        CountrycodemodelComponent,
    ]
})
export class ScreeningModule { }
