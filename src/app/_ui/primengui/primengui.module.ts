import { NgModule } from '@angular/core';
import { LayoutModule } from '@angular/cdk/layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';

import { MessageService, ConfirmationService } from 'primeng/api';
// import {
//     MenuModule,
//     CardModule,
//     SpinnerModule,
//     ProgressSpinnerModule,
//     ScrollPanelModule,
//     PanelMenuModule,
//     ToolbarModule,
//     DialogModule,
//     ConfirmDialogModule,
//     SidebarModule,
//     PanelModule,
//     TreeModule,
//     ButtonModule,
//     InputTextModule,
//     InputTextareaModule,
//     DropdownModule,
//     RadioButtonModule,
//     SelectButtonModule,
//     TooltipModule,
//     OverlayPanelModule,
//     MessagesModule,
//     SplitButtonModule,
//     CalendarModule,
//     AutoCompleteModule,
//     ListboxModule,
//     FileUploadModule,
//     CheckboxModule,
//     FieldsetModule,
//     TabViewModule,
//     TreeTableModule,
//     ChartModule,
// } from 'primeng/primeng';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { OrderListModule } from 'primeng/orderlist';
import { KeyFilterModule } from 'primeng/keyfilter';
import { MessageModule } from 'primeng/message';
import { BlockUIModule } from 'primeng/blockui';

const UIComponents = [
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    // MenuModule,
    // CardModule,
    // SpinnerModule,
    // ProgressSpinnerModule,
    // ScrollPanelModule,
    // PanelMenuModule,
    // ToolbarModule,
    // DialogModule,
    // ConfirmDialogModule,
    // SidebarModule,
    // PanelModule,
    // TreeModule,
    // ButtonModule,
    // InputTextModule,
    // InputTextareaModule,
    // DropdownModule,
    // RadioButtonModule,
    // SelectButtonModule,
    TableModule,
    ToastModule,
    // TooltipModule,
    // OverlayPanelModule,
    // MessagesModule,
    // SplitButtonModule,
    // CalendarModule,
    // AutoCompleteModule,
    OverlayModule,
    PortalModule,
    // ListboxModule,
    // FileUploadModule,
    InputSwitchModule,
    // CheckboxModule,
    // FieldsetModule,
    // TabViewModule,
    // TreeTableModule,
    OrderListModule,
    KeyFilterModule,
    MessageModule,
    // ChartModule,
    BlockUIModule
];

@NgModule({
    imports: [
        UIComponents,
    ],
    exports: [UIComponents],
    providers: [MessageService, ConfirmationService]
})
export class PrimenguiModule { }
