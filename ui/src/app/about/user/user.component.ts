import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {SecurityService} from '../../security/service/security.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html'
})
export class UserComponent {
  loggedinUser$ = this.securityService.loggedinUser();

  constructor(private securityService: SecurityService, private router: Router) {}

  logout(): void {
    this.securityService.logout().subscribe(security => {
      this.router.navigate(['/']);
    });
  }
}
