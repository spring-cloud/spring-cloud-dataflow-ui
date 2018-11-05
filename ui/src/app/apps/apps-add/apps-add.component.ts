import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

/**
 * Applications Add
 *
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-apps-add',
  templateUrl: './apps-add.component.html'
})
export class AppsAddComponent implements OnDestroy, OnInit {
  /**
   * Radio model (current uri)
   */
  radio: string;

  /**
   * Router Subscription
   */
  routerSubscription: Subscription;

  /**
   * Is Small display
   * @type {boolean}
   */
  isSmallDisplay = false;

  /**
   * Constructor
   *
   * @param {Router} router
   */
  constructor(private router: Router) {
  }

  ngOnInit(): void {

    this.radio = this.router.routerState.snapshot.url;
    this.routerSubscription = this.router.events.subscribe((val: NavigationEnd) => {
      if (val instanceof NavigationEnd) {
        this.radio = val.url;
      }
    });
    this.update();
  }


  /**
   * Destroy
   * Unsubscribe subscription
   */
  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }


  /**
   * Listener on Resize Window
   */
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.update();
  }

  /**
   * Update states
   */
  update() {
    this.isSmallDisplay = document.documentElement.clientWidth < 1200;
  }
}
