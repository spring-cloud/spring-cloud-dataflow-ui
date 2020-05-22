import { Component, OnInit, ViewChild } from '@angular/core';
import { RuntimeService } from '../../shared/api/runtime.service';
import { RuntimeApp, RuntimeStreamPage } from '../../shared/model/runtime.model';
import { DetailsComponent } from './details/details.component';

@Component({
  selector: 'app-runtime',
  templateUrl: './runtime.component.html'
})
export class RuntimeComponent implements OnInit {
  loading = true;
  page: RuntimeStreamPage;
  @ViewChild('detailsModal', { static: true }) detailsModal: DetailsComponent;

  constructor(private runtimeService: RuntimeService) {
  }

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    this.loading = true;
    this.runtimeService.getRuntime(0, 100000)
      .subscribe((page: RuntimeStreamPage) => {
        this.page = page;
        this.loading = false;
      });
  }

  details(runtimeApp: RuntimeApp) {
    this.detailsModal.open(runtimeApp);
    return false;
  }


}
