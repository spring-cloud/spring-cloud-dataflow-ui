import { Component, OnInit } from '@angular/core';
import { SecurityService } from '../../security/service/security.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  shouldProtect = this.securityService.shouldProtect();

  constructor(private securityService: SecurityService) {
  }

  ngOnInit(): void {
  }
}
