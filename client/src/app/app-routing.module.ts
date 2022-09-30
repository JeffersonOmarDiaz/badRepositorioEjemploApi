import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppComponent } from "./app.component";
import { FormMainComponent } from "./contacts/contact-form/form-main/form-main.component";
import { FormContactComponent } from "./contacts/contact-form/phones/form-contact.component";
import { ContactsListComponent } from "./contacts/contacts-list/contacts-list.component";

const routes: Routes = [
    {
        path: 'contacts',
        loadChildren: () => import('./contacts/contacts.module').then(m => m.ContactsModule)
    },
    {
        path: 'funding',
        loadChildren: () => import('./funding/funding.module').then(m => m.FundingModule)
    },

    {
        path: '**',
        redirectTo: 'contacts'
    }

];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)

    ],
    exports: [
        RouterModule

    ]
})

export class AppRoutingModule {

}