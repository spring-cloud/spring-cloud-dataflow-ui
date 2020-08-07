import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  Inject,
  EventEmitter,
  Injectable,
  Injector,
  Type
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subject } from 'rxjs';

export class ModalDialog {
  private _open = false;
  private _opened = new EventEmitter<boolean>();

  set isOpen(open: boolean) {
    if (this._open !== open) {
      this._open = open;
      this._opened.emit(open);
    }
  }

  get isOpen() {
    return this._open;
  }

  get opened(): Subject<boolean> {
    return this._opened;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private applicationRef: ApplicationRef
  ) {
  }

  public show<T extends ModalDialog>(componentType: Type<T>): T {
    const nodeComponentFactory = this.componentFactoryResolver.resolveComponentFactory(componentType);
    const componentRef: ComponentRef<T> = nodeComponentFactory.create(this.injector);
    componentRef.changeDetectorRef.markForCheck();
    componentRef.changeDetectorRef.detectChanges();
    this.applicationRef.attachView(componentRef.hostView);
    this.document.body.appendChild(componentRef.location.nativeElement);
    const subscription = componentRef.instance.opened.subscribe((open) => {
      if (!open) {
        this.document.body.removeChild(componentRef.location.nativeElement);
        this.applicationRef.detachView(componentRef.hostView);
        componentRef.destroy();
        subscription.unsubscribe();
      }
    });
    componentRef.instance.isOpen = true;
    return componentRef.instance;
  }

}
