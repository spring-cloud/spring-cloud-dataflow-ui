import { OnInit, OnDestroy } from '@angular/core';
import { dia } from 'jointjs';

export class ShapeComponent implements OnInit, OnDestroy {

  public cannotShowToolTip = false;

  private _handleCannotShowTooltipOn = () => this.cannotShowToolTip = true;
  private _handleCannotShowTooltipOff = () => this.cannotShowToolTip = false;

  ngOnInit() {
    document.addEventListener('mousedown', this._handleCannotShowTooltipOn);
    document.addEventListener('mouseup', this._handleCannotShowTooltipOff);
  }

  ngOnDestroy() {
    document.removeEventListener('mousedown', this._handleCannotShowTooltipOn);
    document.removeEventListener('mouseup', this._handleCannotShowTooltipOff);
  }

}

export class BaseShapeComponent extends ShapeComponent {

  public data: any;

}

export class ElementComponent extends ShapeComponent {

  public view: dia.ElementView;

}
