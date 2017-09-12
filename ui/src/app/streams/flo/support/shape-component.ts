import { OnInit, OnDestroy } from '@angular/core';
import { dia } from 'jointjs';

export interface ShapeComponent {
  view: dia.ElementView;
}

export class BaseShapeComponent implements ShapeComponent, OnInit, OnDestroy {

  public view: dia.ElementView;
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
