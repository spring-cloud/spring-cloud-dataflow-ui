import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AboutState } from '../../shared/store/about.reducer';
import { AboutService } from '../../shared/api/about.service';
import { NotificationService } from '../../shared/service/notification.service';
import { ClipboardCopyService } from '../../shared/service/clipboard-copy.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-about-info',
  templateUrl: './info.component.html'
})
export class InfoComponent implements OnInit {
  loading = true;
  about: AboutState;
  @Input() isOpen = false;
  @ViewChild('container', { read: ElementRef, static: true }) container: ElementRef;


  constructor(private aboutService: AboutService,
              private clipboardCopyService: ClipboardCopyService,
              private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.aboutService.getAbout()
      .subscribe(((about: AboutState) => {
        this.about = about;
        this.loading = false;
      }));
  }

  copyToClipboard() {
    if (this.about) {
      this.clipboardCopyService.executeCopy(new JsonPipe().transform(this.about), this.container.nativeElement);
      this.notificationService.success('Copy to clipboard', 'Copied About Details to Clipboard (As JSON).');
    }
  }


}
