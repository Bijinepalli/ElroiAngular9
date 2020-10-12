// import { TreeNode } from '@angular/router/src/utils/tree';

export class MasterPages {
    id?: number;
    pageName?: string;
    controller?: string;
    hasView?: number;
    hasEdit?: number;
    hasSection?: number;
    role?: string;
    pageId?: number;
    isModule?: number;
    moduleOrder?: number;
    treeLevel?: number;
    pageOrder?: number;
    idPath?: string;
    items?: MasterPages[];
    sections?: MasterPages[];
    masterPageId?: number;
}

export class LeftNavMenu {
    label?: string;
    icon?: string;
    routerLink?: string;
    queryParams?: any;
    items?: LeftNavMenu[];
}

export class MasterDetailItem {
    id?: number;
    masterId?: number;
    dataKey?: string;
    value?: string;
    isActive?: number;
    createdOn?: string;
    createdBy?: number;
    updatedOn?: string;
    updatedBy?: number;
    additionalValue?: string;
}
export class AppSettings {
    id?: number;
    dataKey?: string;
    value?: string;
    description?: string;
    type?: string;
}
// class QueryParams {
//     id?: number;
//     hasView?: number;
//     hasEdit?: number;
//     hasSection?: number;
// }
// export class TreeNodee {
//     label?: string;
//     icon?: string;
//     routerLink?: string;
//     queryParams?: QueryParams;
// }
// export class TreeMenu {
//     data?: TreeNodee;
//     children?: TreeMenu[]
// }
// export class SecurePages {
//     children?: TreeMenu[];
//     selectedIds?: string[];
// }
