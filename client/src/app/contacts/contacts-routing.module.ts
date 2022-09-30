import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormMainComponent } from './contact-form/form-main/form-main.component';
import { FormContactComponent } from './contact-form/phones/form-contact.component';
import { ContactsListComponent } from './contacts-list/contacts-list.component';

const routes: Routes = [

  {
    path: '',
    children: [{
      path: 'addContact',
      component: FormContactComponent
    },
    {
      path: '',
      component: ContactsListComponent
    },

    {
      path: 'add',
      component: FormMainComponent
    },

    {
      path: 'edit/:id',
      component: FormMainComponent
    },
    {
      path: '**',
      redirectTo: ''
    }]
  },

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactsRoutingModule { }
