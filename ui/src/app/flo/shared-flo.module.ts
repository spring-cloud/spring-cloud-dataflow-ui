import { NgModule } from '@angular/core';
import { FloModule } from 'spring-flo';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ClarityModule } from '@clr/angular';
import { ClrDynamicFormPropertyComponent } from './shared/properties/df.property.component';
import { ClrPropertiesGroupComponent } from './shared/properties/properties.group.component';
import { PropertiesDialogComponent } from './shared/properties/properties-dialog.component';
import { PropertiesGroupsDialogComponent } from './shared/properties-groups/properties-groups-dialog.component';

@NgModule({
  declarations: [
    ClrDynamicFormPropertyComponent,
    ClrPropertiesGroupComponent,
    PropertiesDialogComponent,
    PropertiesGroupsDialogComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ClarityModule,
    FloModule,
  ],
  providers: [
  ],
  exports: [
    ClrDynamicFormPropertyComponent,
    ClrPropertiesGroupComponent,
    PropertiesDialogComponent,
    PropertiesGroupsDialogComponent,
  ]
})

export class SharedFloModule {
}
