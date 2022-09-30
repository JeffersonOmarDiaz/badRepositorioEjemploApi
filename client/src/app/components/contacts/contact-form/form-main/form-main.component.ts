import { Component, ComponentFactoryResolver, ComponentRef, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CountryISO, SearchCountryField } from "ngx-intl-tel-input";
import { FormContactComponent } from '../phones/form-contact.component';
import { SocialMediaComponent } from '../social-media/social-media.component';
import { ConnectionsComponent } from '../connections/connections.component';
import { LanguageComponent } from '../language/language.component';
import { Contact } from 'src/app/interfaces/contacts.interface';
import { Router, ActivatedRoute } from '@angular/router';
import { ContactsService } from 'src/app/services/contacts.service';
import { DatePipe } from '@angular/common';
import { ContactsListComponent } from '../../contacts-list/contacts-list.component';
import { DialogModule } from 'primeng/dialog';
import { DialogService } from 'primeng/dynamicdialog';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { InputTagComponent } from '../../input-tag/input-tag.component';
import { DatesComponent } from '../dates/dates.component';
import { OriginPlaceComponent } from '../origin-place/origin-place.component';
import { MatSelectCountryModule } from '@angular-material-extensions/select-country';
import { HttpClientModule } from '@angular/common/http';
import { Country } from '@angular-material-extensions/select-country';
import { Angulartics2GoogleAnalytics } from 'angulartics2';
import { Observable, startWith } from 'rxjs';
import { map } from 'rxjs/operators';
import { go, highlight } from 'fuzzysort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmarComponent } from 'src/app/components/confirmar/confirmar.component';
import { MatDialog } from '@angular/material/dialog';

interface Phone {
  countryCode: string,
  dialCode: string,
  e164Number: string,
  internationalNumber: string,
  nationalNumber: string,
  number: string
}

@Component({
  selector: 'app-form-main',
  templateUrl: './form-main.component.html',
  styleUrls: ['./form-main.component.css'],
  providers: [DialogService, MessageService]
})

export class FormMainComponent implements OnInit {

  //Form to phones fields
  countryFormControl = new FormControl();
  countryRequiredFormControl = new FormControl(null, [Validators.required]);
  countryFormGroup!: FormGroup;
  languageSelected = 'es';
  showCallingCode = 'false';
  display: boolean = false;
  isSubmit = false;
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [
    CountryISO.UnitedStates,
    CountryISO.UnitedKingdom
  ];

  //Interface to contacts from DataBase
  contacts: Contact = {
    ID: '',
    NAME_PREFIX: '',
    FIRST_NAME: '',
    PHOTO: '',
    BIRTHDAY: '',
    PHONE1_TYPE: '',
    PHONE1_VALUE: ''
  };

  //Edit or add new contact
  edit: boolean = false;

  //Get id from route url
  activatedRouteSub: any;

  //string to get idValue from URL
  idValue: string = '0';

  birthdayValue: any;

  ref!: DynamicDialogRef;

  components: ComponentRef<FormContactComponent>[] = [];
  arr: string[] = [];

  //Variables to convert array strings to phones
  arrayDB: [] = [];
  phones: string[] = [];
  phonesValues: Phone[] = [];

  //Variables to convert array strings to phones labels
  arrayPhoneFieldDB: [] = [];
  phonesFields: string[] = [];
  phonesValuesFields: Phone[] = [];

  //check phone value unique.
  phoneUnique: string = "";
  phoneUniqueName: string = "";

  @ViewChild('contactPhoneField', { read: ViewContainerRef }) contactPhoneField!: ViewContainerRef;
  @ViewChild('socialMediaField', { read: ViewContainerRef, static: true }) socialMedia!: ViewContainerRef;
  @ViewChild('connectionsField', { read: ViewContainerRef, static: true }) connectionsField!: ViewContainerRef;
  @ViewChild('languageField', { read: ViewContainerRef, static: true }) languageField!: ViewContainerRef;
  @ViewChild('dateField', { read: ViewContainerRef, static: true }) dateField!: ViewContainerRef;
  @ViewChild('originPlaceField', { read: ViewContainerRef, static: true }) originPlaceField!: ViewContainerRef;


  constructor(private _resolver: ComponentFactoryResolver, private activatedRoute: ActivatedRoute, private router: Router, private contactsService: ContactsService,
    public datepipe: DatePipe, private contactsList: ContactsListComponent, private formBuilder: FormBuilder, public dialogService: DialogService,
    public messageService: MessageService, private snackBar: MatSnackBar,
    private matDialog: MatDialog) { }

  ngOnInit() {
    this.getContacts();
    // console.log(this.contacts);
    this.activatedRouteSub = this.activatedRoute.params.subscribe(params => {
      this.idValue = params['id'];

    });

    if (this.idValue) {
      this.contactsService.getContact(this.idValue)
        .subscribe(
          (res: any) => {
            console.log(res);
            this.contacts = res;

            //Array string to phones values
            if (res.PHONE1_VALUE === null) {
              this.arrayDB = [];
            }
            else {
              this.arrayDB = res.PHONE1_VALUE;
            }

            //Assign null value to phones
            if (this.arrayDB.length === 0) {
              this.phones.push("");
            }
            else {
              this.phones = JSON.parse(res.PHONE1_VALUE);
              console.log("this.phones", this.phones)
            }

            //Assign json to phones values
            for (let i = 0; i < this.phones.length; i++) {
              let newPhoneValue = {
                countryCode: this.phones[i],
                dialCode: '',
                e164Number: '',
                internationalNumber: this.phones[i],
                nationalNumber: this.phones[i],
                number: this.phones[i]
              }
              this.phonesValues.push(newPhoneValue);
            }
            console.log("Phone values", this.phonesValues);

            if (this.phonesValues.length === 0) {
              let newPhoneValue = {
                countryCode: "",
                dialCode: '',
                e164Number: '',
                internationalNumber: "",
                nationalNumber: "",
                number: ""
              }
              this.phonesValues.push(newPhoneValue);
            }

            //Array string to phones values fields
            if (res.PHONE1_TYPE === null) {
              this.arrayPhoneFieldDB = [];
            }
            else {
              this.arrayPhoneFieldDB = res.PHONE1_TYPE;
            }
            //Assign null value to phones fields
            if (this.arrayPhoneFieldDB.length === 0) {
              this.phonesFields.push("");
            }
            else {
              this.phonesFields = JSON.parse(res.PHONE1_TYPE);
              console.log("this.phonesFields", this.phonesFields)
            }

            //Assign json to phones values fields
            console.log("before values fields", this.phonesValuesFields)
            for (let j = 0; j < this.phonesFields.length; j++) {
              let newPhoneValueField = {
                countryCode: this.phonesFields[j],
                dialCode: '',
                e164Number: '',
                internationalNumber: this.phonesFields[j],
                nationalNumber: this.phonesFields[j],
                number: this.phonesFields[j]
              }
              this.phonesValuesFields.push(newPhoneValueField);
            }
            console.log("Phone values Fields", this.phonesValuesFields);

            if (this.phonesValuesFields.length === 0) {
              let newPhoneValueField = {
                countryCode: "",
                dialCode: '',
                e164Number: '',
                internationalNumber: "",
                nationalNumber: "",
                number: ""
              }
              this.phonesValuesFields.push(newPhoneValueField);
            }
            this.birthdayValue = new Date();
            this.birthdayValue = this.datepipe.transform(this.contacts.BIRTHDAY, 'yyyy-dd-MM');
            this.contacts.BIRTHDAY = this.birthdayValue;
            this.edit = true;
          },
          (err: any) => console.log(err)
        )
    }
    else {
      let newPhoneValue = {
        countryCode: "",
        dialCode: '',
        e164Number: '',
        internationalNumber: "",
        nationalNumber: "",
        number: ""
      }
      this.phonesValues.push(newPhoneValue);

      let newPhoneValueField = {
        countryCode: "",
        dialCode: '',
        e164Number: '',
        internationalNumber: "",
        nationalNumber: "",
        number: ""
      }
      this.phonesValuesFields.push(newPhoneValueField);
    }
  }

  showDialog() {
    this.display = true;
  }

  show() {
    this.ref = this.dialogService.open(InputTagComponent, {
      header: 'Create Label',
      width: '25%',
      contentStyle: { "max-height": "400px", "overflow": "auto" },
      baseZIndex: 10000
    });
  }

  ngOnDestroy() {
    if (this.ref) {
      this.ref.close();
    }
  }

  // addPhoneField() {

  //   const factory = this._resolver.resolveComponentFactory(FormContactComponent);
  //   // this will insert your component into the page
  //   const component = this.contactPhoneField.createComponent(factory);

  //   this.components.push(component);

  // }

  deletePhoneField() {

    // Find the component
    const component: any = this.components.find((component) => component.instance instanceof FormContactComponent);
    const componentIndex = this.components.indexOf(component!);

    if (componentIndex !== -1) {
      // Remove component from both view and array
      console.log("components:", this.contactPhoneField);
      // console.log(this.contactPhoneField.indexOf(component!));
      this.contactPhoneField.remove(this.contactPhoneField.indexOf(component));

      this.components.splice(componentIndex, 1);
    }
  }


  addSocialMediaField() {

    const factory = this._resolver.resolveComponentFactory(SocialMediaComponent);
    // this will insert your component onto the page
    const component = this.socialMedia.createComponent(factory);
  }

  addConnectionsField() {
    const factory = this._resolver.resolveComponentFactory(ConnectionsComponent);
    // this will insert your component onto the page
    const component = this.connectionsField.createComponent(factory);
  }

  addLanguageField() {
    const factory = this._resolver.resolveComponentFactory(LanguageComponent);
    // this will insert your component onto the page
    const component = this.languageField.createComponent(factory);
  }

  addDateField() {
    const factory = this._resolver.resolveComponentFactory(DatesComponent);
    // this will insert your component onto the page
    const component = this.dateField.createComponent(factory);
  }

  addOriginPlaceField() {
    const factory = this._resolver.resolveComponentFactory(OriginPlaceComponent);
    // this will insert your component onto the page
    const component = this.originPlaceField.createComponent(factory);
  }

  openNewUser() {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/contacts/add'])
    );

    window.open(url, "_blank");
  }

  saveNewContact() {
    delete this.contacts.ID;
    this.contactsService.saveContact(this.contacts)
      .subscribe(contact => {
        console.log(contact.ID)
        this.router.navigate(['/contacts/edit/', contact.ID]);
        this.mostrarSnackbar('Register created!');
      },
        // (err) => console.error(err)
      )
  }

  updateContact() {
    let bandera = 0;
    for (let i = 0; i < this.phones.length; i++) {

      if (this.arr.includes(this.phones[i], 0)) {
        bandera++;
        this.phoneUnique = JSON.stringify(this.phones[i]);
      }
    }
    if (bandera < 2) {
      this.contactsService.updateContact(this.contacts.ID!, this.contacts)
        .subscribe(
          contact => {
            console.log("this contact");
            console.log(this.arr);
            this.mostrarSnackbar('Register updated!');
          },
          err => console.error(err)
        )
    }

    else {
      this.getPhones();
      

    }
  }

  addNewPhoneValue1(arg: any) {
    this.contacts.PHONE1_VALUE = arg.number;
  }

  mostrarSnackbar(mensaje: string) {
    this.snackBar.open(mensaje, 'Ok!', {
      duration: 2500,
      panelClass: ['blue-snackbar']
    });
  }

  addPhone() {

    let newPhone: Phone = {
      countryCode: "",
      dialCode: "",
      e164Number: "",
      internationalNumber: "",
      nationalNumber: "",
      number: ""
    }

    this.phonesValues.push(newPhone);

  }

  addPhoneLabel() {
    let newPhone: Phone = {
      countryCode: "",
      dialCode: "",
      e164Number: "",
      internationalNumber: "",
      nationalNumber: "",
      number: ""
    }
    this.phonesValuesFields.push(newPhone);
    console.log("beforeFields", this.phonesValuesFields);
  }

  addValuePhone(index: any, phone: any) {
    this.phones[index] = phone.number;
    console.log(this.phones);
    let lastPhoneValue = JSON.stringify(this.phones);
    console.log("stringify phones", lastPhoneValue)
    this.contacts.PHONE1_VALUE = lastPhoneValue;
    if (this.phones.length > this.phonesFields.length) {
      this.phonesFields.push("");
      let lastPhoneValueLabel = JSON.stringify(this.phonesFields);
      this.contacts.PHONE1_TYPE = lastPhoneValueLabel;
    }

  }

  addValuePhoneLabel(index: any, phone: any) {
    console.log("object", phone.number)
    this.phonesFields[index] = phone.number;
    console.log("last values fields", this.phonesFields);
    let lastPhoneValueLabel = JSON.stringify(this.phonesFields);
    console.log("stringify phones fields", lastPhoneValueLabel)
    this.contacts.PHONE1_TYPE = lastPhoneValueLabel;
  }

  deletePhone(index: any) {
    const dialog = this.matDialog.open(ConfirmarComponent, {
      width: '250px',
      data: this.phones[index]
    });

    dialog.afterClosed().subscribe(
      (result: any) => {

        if (result) {

          this.phonesValues.splice(index, 1);
          this.phonesValuesFields.splice(index, 1);

          this.phones.splice(index, 1);
          let lastPhoneValue = JSON.stringify(this.phones);
          console.log(lastPhoneValue)
          this.contacts.PHONE1_VALUE = lastPhoneValue;
          this.phonesFields.splice(index, 1);
          let lastPhoneValueFields = JSON.stringify(this.phonesFields);
          this.contacts.PHONE1_TYPE = lastPhoneValueFields;
          this.updateContact();
        }
      }
    );
  }

  getContacts() {
    this.contactsService.getContacts()
      .subscribe(
        (res: any) => {
          let contacts = res;
          for (let i = 0; i < 3; i++) {
            this.arr[i] = JSON.parse(res[i].PHONE1_VALUE)
            // this.phones[i] = JSON.parse(res[i].PHONE1_VALUE);
          }
          for (let i = 0; i < 3; i++) {
            this.arr[i] = this.arr[i][0]
          }
          console.log("array", this.arr);
          // this.contact.PHONE1_VALUE = JSON.parse(this.contact.PHONE1_VALUE!);
          // console.log("this", this.phones)
          // localStorage.setItem('contacts', JSON.stringify( this.contacts )  );
        },
        err => console.error(err)
      );
  }

  getPhones() {
    this.phoneUnique.replace(/"/g, '')
    this.contactsService.getPhones(this.phoneUnique.replace(/"/g, ''))
      .subscribe(
        (res: any) => {
          this.phoneUniqueName = res[0].FIRST_NAME;
          console.log("unique name", res[0].FIRST_NAME);
          this.mostrarSnackbar(`This number cannot be added because its owner is : ${this.phoneUniqueName}`, );
        }
      )
  }



}



