import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastyService } from 'ng2-toasty';
import { RuntimeApp } from './model/runtime-app';
import { Page } from '../shared/model/page';
import { ModalDirective } from 'ngx-bootstrap';
import { RuntimeAppsService } from './runtime-apps.service';
import { Subscription } from 'rxjs/Subscription';
import { PageInfo } from '../shared/model/pageInfo';

/**
 * Component that loads Runtime applications.
 *
 * @author Ilayaperumal Gopinathan
 */
@Component({
    selector: 'app-runtime-apps',
    templateUrl: './runtime-apps.component.html',
})
export class RuntimeAppsComponent implements OnInit {

    private busy: Subscription;

    @ViewChild('childModal')
    private childModal: ModalDirective;

    public runtimeApps: Page<RuntimeApp>;

    public runtimeApp: RuntimeApp;

    constructor(private runtimeAppsService: RuntimeAppsService,
                private toastyService: ToastyService) {
    }

    public ngOnInit() {
        this.loadRuntimeApps(new PageInfo());
    }

    private loadRuntimeApps(pageInfo: PageInfo) {
        this.busy = this.runtimeAppsService.getRuntimeApps(pageInfo).subscribe(
            data => {
                this.runtimeApps = data;
                this.toastyService.success('Runtime applications loaded.');
            }
        );
    }

    public getPage(page: number) {
        console.log(`Getting page ${page}.`);
        const pageInfo = new PageInfo();
        pageInfo.pageNumber = page - 1;
        this.loadRuntimeApps(pageInfo);
    }

    public appDetails(item: RuntimeApp) {
        this.showChildModal(item);
    }

    public showChildModal(item: RuntimeApp): void {
        this.runtimeApp = item;
        this.childModal.show();
    }

    public hideChildModal(): void {
        this.childModal.hide();
    }

    public cancel = function () {
        this.hideChildModal();
    };

}
