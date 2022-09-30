import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FundingContactComponent } from './funding-contact/funding-contact.component';
import { FundingList } from './funding-list/funding-list.component';

const routes: Routes = [

  {
    path: '',
    children: [
      {
        path: '',
        component: FundingList
      },
      {
        path: 'details/:id',
        component: FundingContactComponent
      },

      // {
      //   path: 'edit/:id',
      //   component: FundingContactComponent
      // },
      {
        path: '**',
        redirectTo: ''
      }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FundingRoutingModule { }
