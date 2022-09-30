import { AppComponent } from './app.component';
// import {A11yModule} from '@angular/cdk/a11y';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkTreeModule } from '@angular/cdk/tree';
import { DatePipe } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { PortalModule } from '@angular/cdk/portal';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { Angulartics2Module } from 'angulartics2';
import { FileUploadModule } from 'ng2-file-upload';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { MarkdownModule } from 'ngx-markdown';
import { MaterialModule } from './material/material.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgChartsModule } from 'ng2-charts';
import { PrimeNgModule } from './prime-ng/prime-ng.module';

import { AppRoutingModule } from './app-routing.module';
import { ConfirmarComponent } from './components/confirmar/confirmar.component';
import { FundingModule } from './funding/funding.module';
import { NavigationComponent } from './contacts/navigation/navigation.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { InputTagComponent } from './contacts/input-tag/input-tag.component';
import { NavigationFundingComponent } from './funding/navigation/navigation-funding.component';

@NgModule({
  declarations: [
    AppComponent,
    ConfirmarComponent,
    NavigationComponent,
    NavbarComponent,
    InputTagComponent,
    NavigationFundingComponent,
  ],
  imports: [
    // A11yModule,
    Angulartics2Module.forRoot(),
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    CommonModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    DragDropModule,
    FlexLayoutModule,
    FileUploadModule,
    FormsModule,
    FundingModule,
    GooglePlaceModule,
    HttpClientModule,
    MaterialModule,
    MarkdownModule.forRoot(),
    NgChartsModule,
    NgxMatSelectSearchModule,
    PortalModule,
    PrimeNgModule,
    ReactiveFormsModule,
    ScrollingModule,

  ],
  providers: [
    DatePipe,
    InputTagComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
