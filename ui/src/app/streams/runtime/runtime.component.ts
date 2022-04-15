import {Component, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {NotificationService} from 'src/app/shared/service/notification.service';
import {RuntimeService} from '../../shared/api/runtime.service';
import {RuntimeApp, RuntimeStreamPage} from '../../shared/model/runtime.model';
import {DetailsComponent} from './details/details.component';

@Component({
  selector: 'app-runtime',
  templateUrl: './runtime.component.html'
})
export class RuntimeComponent implements OnInit {
  loading = true;
  page: RuntimeStreamPage;
  @ViewChild('detailsModal', {static: true}) detailsModal: DetailsComponent;

  constructor(
    private runtimeService: RuntimeService,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.loading = true;
    this.runtimeService.getRuntime(0, 100000).subscribe(
      (page: RuntimeStreamPage) => {
        this.page = page;
        this.loading = false;
      },
      error => {
        this.notificationService.error(this.translate.instant('commons.message.error'), error);
      }
    );
  }

  details(runtimeApp: RuntimeApp): any {
    this.detailsModal.open(runtimeApp);
    return false;
  }
}
