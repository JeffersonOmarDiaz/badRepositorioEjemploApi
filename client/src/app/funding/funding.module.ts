import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { MaterialModule } from '../material/material.module';

import { FundingRoutingModule } from './funding-routing.module';
import { FundingContactComponent } from './funding-contact/funding-contact.component';
import { FundingList } from './funding-list/funding-list.component';
import { FormsModule } from '@angular/forms';
import { ShowPhonePipe } from './pipes/show-phone.pipe';
import { NgChartsModule } from 'ng2-charts';
import { NavigationFundingComponent } from './navigation/navigation-funding.component';


@NgModule({
  declarations: [
    FundingContactComponent,
    FundingList,
    ShowPhonePipe,
 
  ],
  imports: [
    CommonModule,
    FormsModule,
    FundingRoutingModule,
    PrimeNgModule,
    PrimeNgModule,
    MaterialModule,
    NgChartsModule,
  ],
  exports: [
    FundingContactComponent,
    FundingList,

  ]
})
export class FundingModule { }
