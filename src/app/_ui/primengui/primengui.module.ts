import { NgModule } from '@angular/core';
import { LayoutModule } from '@angular/cdk/layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';

import { MessageService, ConfirmationService } from 'primeng/api';

import { MenuModule } from 'primeng/menu';
import { CardModule } from 'primeng/card';
import { SpinnerModule } from 'primeng/spinner';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SidebarModule } from 'primeng/sidebar';
import { PanelModule } from 'primeng/panel';
import { TreeModule } from 'primeng/tree';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TooltipModule } from 'primeng/tooltip';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MessagesModule } from 'primeng/messages';
import { SplitButtonModule } from 'primeng/splitbutton';
import { CalendarModule } from 'primeng/calendar';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ListboxModule } from 'primeng/listbox';
import { FileUploadModule } from 'primeng/fileupload';
import { CheckboxModule } from 'primeng/checkbox';
import { FieldsetModule } from 'primeng/fieldset';
import { TabViewModule } from 'primeng/tabview';
import { TreeTableModule } from 'primeng/treetable';
import { ChartModule } from 'primeng/chart';


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
    MenuModule,
    CardModule,
    SpinnerModule,
    ProgressSpinnerModule,
    ScrollPanelModule,
    PanelMenuModule,
    ToolbarModule,
    DialogModule,
    ConfirmDialogModule,
    SidebarModule,
    PanelModule,
    TreeModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    RadioButtonModule,
    SelectButtonModule,
    TableModule,
    ToastModule,
    TooltipModule,
    OverlayPanelModule,
    MessagesModule,
    SplitButtonModule,
    CalendarModule,
    AutoCompleteModule,
    OverlayModule,
    PortalModule,
    ListboxModule,
    FileUploadModule,
    InputSwitchModule,
    CheckboxModule,
    FieldsetModule,
    TabViewModule,
    TreeTableModule,
    OrderListModule,
    KeyFilterModule,
    MessageModule,
    ChartModule,
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
