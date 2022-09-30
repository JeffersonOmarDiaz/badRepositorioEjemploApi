import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectCountryModule } from "@angular-material-extensions/select-country";
import { NgModule } from '@angular/core';

import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { MaterialModule } from '../material/material.module';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';

import { ConnectionsComponent } from '../contacts/contact-form/connections/connections.component';
import { ContactsListComponent } from '../contacts/contacts-list/contacts-list.component';
import { ContactInputComponent } from '../contacts/contact-form/contact-input/contact-input.component';
import { ContactsRoutingModule } from './contacts-routing.module';
import { DatesComponent } from './contact-form/dates/dates.component';
import { FormContactComponent } from '../contacts/contact-form/phones/form-contact.component';
import { FormMainComponent } from '../contacts/contact-form/form-main/form-main.component';
import { LanguageComponent } from '../contacts/contact-form/language/language.component';
import { OriginPlaceComponent } from '../contacts/contact-form/origin-place/origin-place.component';
import { ShowPhonePipe } from '../contacts/pipes/show-phone.pipe';
import { SocialMediaComponent } from '../contacts/contact-form/social-media/social-media.component';
import { ProfilePictureComponent } from './contact-form/profile-picture/profile-picture.component';


@NgModule({
  declarations: [
    ContactsListComponent,
    ConnectionsComponent,
    ContactInputComponent,
    DatesComponent,
    FormContactComponent,
    FormMainComponent,
    LanguageComponent,
    OriginPlaceComponent,
    SocialMediaComponent,
    ShowPhonePipe,
    ProfilePictureComponent,
    
  ],
  imports: [
    CommonModule,
    ContactsRoutingModule,
    FlexLayoutModule,
    FormsModule,
    GooglePlaceModule,
    MatMomentDateModule,
    MatNativeDateModule,
    MaterialModule,
    MatSelectCountryModule.forRoot('en'), // you can use 'br' | 'de' | 'en' | 'es' | 'fr' | 'hr' | 'it' | 'nl' | 'pt' --> MatSelectCountrySupportedLanguages,
    NgxIntlTelInputModule,
    PrimeNgModule,
    PrimeNgModule,
  ],
})
export class ContactsModule { }
