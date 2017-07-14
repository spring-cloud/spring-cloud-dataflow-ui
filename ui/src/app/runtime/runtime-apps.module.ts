import {NgModule} from "@angular/core";
import {SharedModule} from "../shared/shared.module";
import {RuntimeAppsComponent} from "./runtime-apps.component";
import {RuntimeAppsService} from "./runtime-apps.service";
import {RuntimeAppsRoutingModule} from "./runtime-routing.module";
import {NgxPaginationModule} from "ngx-pagination";
import {ModalModule} from "ngx-bootstrap";
import {KeyValuePipe} from "../shared/pipes/key-value-filter";

@NgModule({
    imports: [RuntimeAppsRoutingModule, SharedModule, NgxPaginationModule, ModalModule.forRoot()],
    declarations: [RuntimeAppsComponent, KeyValuePipe],
    providers: [RuntimeAppsService]
})
export class RuntimeAppsModule {
}
