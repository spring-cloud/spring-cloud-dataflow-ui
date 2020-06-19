import { AfterViewInit, Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import get from 'lodash.get';
import { AboutService } from '../../shared/api/about.service';
import { SecurityService } from '../service/security.service';

@Directive({
  selector: '[appRole]'
})
export class RoleDirective implements AfterViewInit {

  @Input()
  public grantedRole: string[];

  @Input()
  public appRole: string[];

  @Input()
  public appFeature: string;

  private existingDisplayPropertyValue: string;

  constructor(
    private aboutService: AboutService,
    private securityService: SecurityService,
    private elem: ElementRef,
    private renderer: Renderer2) {
  }

  private async checkRoles() {
    if (this.appFeature) {
      const features = this.appFeature.split(',');
      if (this.appFeature) {
        const result = await Promise.all([...features.map(feature => this.aboutService.isFeatureEnabled(feature))]);
        const featureEnabled = result.filter(item => item === true).length > 0;
        this.checkRoleAccess(featureEnabled);
      }
    } else {
      this.checkRoleAccess(true);
    }
  }

  private async checkRoleAccess(featureEnabled: boolean) {
    const hasRoleAccess = await this.securityService.canAccess(this.appRole);
    if (!featureEnabled || !hasRoleAccess) {
      this.renderer.setStyle(this.elem.nativeElement, 'display', 'none');
    } else {
      if (this.existingDisplayPropertyValue) {
        this.renderer.setStyle(this.elem.nativeElement, 'display', this.existingDisplayPropertyValue);
      } else {
        this.renderer.removeStyle(this.elem.nativeElement, 'display');
      }
    }
  }

  ngAfterViewInit() {
    this.existingDisplayPropertyValue = this.elem.nativeElement.style.display;
    this.checkRoles();
  }
}
