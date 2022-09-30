import { Component, ComponentRef, EventEmitter, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CountryISO, SearchCountryField } from "ngx-intl-tel-input";
import { FormContactComponent } from '../phones/form-contact.component';
import { Contact } from 'src/app/interfaces/contacts.interface';
import { Router, ActivatedRoute } from '@angular/router';
import { ContactsService } from 'src/app/services/contacts.service';
import { DatePipe } from '@angular/common';
import { DialogService } from 'primeng/dynamicdialog';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { InputTagComponent } from '../../input-tag/input-tag.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmarComponent } from 'src/app/components/confirmar/confirmar.component';
import { MatDialog } from '@angular/material/dialog';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';


interface Phone {
  countryCode: string,
  dialCode: string,
  e164Number: string,
  internationalNumber: string,
  nationalNumber: string,
  number: string
}

interface Dates {
  id: string,
  value: string | null
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
    PHOTO: new FormData,
    BIRTHDAY: '',
    PHONE1_TYPE: '',
    PHONE1_VALUE: '',
    ADDRESS1_TYPE: '',
    ADDRESS1_STREET: '',
    DATES_VALUES: '',
    DATES_TYPES: '',
    SOCIAL_VALUES: '',
    SOCIAL_TYPES: '',
    CONNECTIONS_VALUES: '',
    CONNECTIONS_TYPES: '',
    LANGUAGE: '',
    ORIGIN_PLACES_VALUES: '',
    ORIGIN_PLACES_TYPES: ''
  };

  //PHOTO
  images!: any;

  //Edit or add new contact
  edit: boolean = false;
  //Get id from route url
  activatedRouteSub: any;
  //string to get idValue from URL
  idValue: string = '0';
  idValueCharge: string = '0';
  birthdayValue: any;
  ref!: DynamicDialogRef;
  components: ComponentRef<FormContactComponent>[] = [];

  //PHONE
  //Arr contains values from database (PHONE1_VALUES)
  arrPhonesDB: string[] = [];
  //Variables to convert array strings to phones
  arrayDB: string[] = [];
  phones: string[] = [];
  phonesValues: Phone[] = [];
  //Variables to convert array strings to phones labels
  arrayPhoneFieldDB: [] = [];
  phonesFields: string[] = [];
  phonesValuesFields: Phone[] = [];
  //check phone value unique.
  phoneUnique: string = "";
  phoneUniqueName: string = "";

  //DATES
  dates: string[] = [];
  datesValues: Dates[] = [];
  date1 = new Date();
  events: string[] = [];

  //DATES LABELS
  datesLabels: string[] = [];
  datesValuesLabels: Dates[] = [];

  @ViewChild('contactPhoneField', { read: ViewContainerRef }) contactPhoneField!: ViewContainerRef;
  @ViewChild('socialMediaField', { read: ViewContainerRef, static: true }) socialMedia!: ViewContainerRef;
  @ViewChild('connectionsField', { read: ViewContainerRef, static: true }) connectionsField!: ViewContainerRef;
  @ViewChild('languageField', { read: ViewContainerRef, static: true }) languageField!: ViewContainerRef;
  @ViewChild('dateField', { read: ViewContainerRef, static: true }) dateField!: ViewContainerRef;
  @ViewChild('originPlaceField', { read: ViewContainerRef, static: true }) originPlaceField!: ViewContainerRef;

  @Output() selectedDateChange = new EventEmitter<Date>();
  street_number!: string;
  address!: string;
  city!: string;
  state!: string;
  country!: string;
  zip!: string;

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private contactsService: ContactsService,
    public datepipe: DatePipe, private formBuilder: FormBuilder, public dialogService: DialogService,
    public messageService: MessageService, private snackBar: MatSnackBar,
    private matDialog: MatDialog) { }


  ngOnInit() {
    this.getContacts();
    // this.mostrarImg();
    this.activatedRouteSub = this.activatedRoute.params.subscribe(params => {
      this.idValue = params['id'];
    });

    if (this.idValue) {
      this.contactsService.getContact(this.idValue)
        .subscribe(
          (res: any) => {
            this.idValueCharge = '1';
            this.contacts = res;

            const reader = new FileReader();
            reader.onload = (this.contacts.PHOTO);
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
              this.arrayDB = JSON.parse(res.PHONE1_VALUE);
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
            }

            //Assign json to phones values fields
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

            //DATES
            if (res.DATES_VALUES === null || !res.DATES_VALUES) {
              this.dates.push("");
            }
            else {
              this.dates = JSON.parse(res.DATES_VALUES);
            }

            for (let i = 0; i < this.dates.length; i++) {
              let dateValueFormat

              if (this.dates[i] == "") {
                dateValueFormat = "";
              }
              else {
                let dateValue = new Date(this.dates[i]);
                dateValueFormat = this.datepipe.transform(dateValue, 'yyyy-MM-dd');
              }

              let newDateValue = {
                id: this.dates[i],
                value: dateValueFormat
              }
              this.datesValues.push(newDateValue);
            }

            if (this.datesValues.length === 0) {
              let newDateValue = {
                id: "",
                value: "",
              }
              this.datesValues.push(newDateValue);
            }

            //DATES LABELS

            if (res.DATES_TYPES === null || !res.DATES_TYPES) {
              this.datesLabels.push("");
            }
            else {
              this.datesLabels = JSON.parse(res.DATES_TYPES);
            }

            for (let i = 0; i < this.datesLabels.length; i++) {
              let newDateValueLabel = {

                id: this.datesLabels[i],
                value: this.datesLabels[i],
              }
              this.datesValuesLabels.push(newDateValueLabel);
            }
            if (this.datesValuesLabels.length === 0) {
              let newDateValueLabel = {
                id: "",
                value: "",
              }
              this.datesValues.push(newDateValueLabel);
            }

            //SOCIAL VALUES
            if (res.SOCIAL_VALUES === null || !res.SOCIAL_VALUES) {

              this.contacts.SOCIAL_VALUES = "";

            }

            if (res.SOCIAL_TYPES === null || !res.SOCIAL_TYPES) {

              this.contacts.SOCIAL_TYPES = "";

            }

            //LANGUAGE
            if (res.LANGUAGE === null || !res.LANGUAGE) {

              this.contacts.LANGUAGE = "";

            }

            //ORIGIN PLACES
            if (res.ORIGIN_PLACES_VALUES === null || !res.ORIGIN_PLACES_VALUES) {

              this.contacts.ORIGIN_PLACES_VALUES = "";

            }

            if (res.ORIGIN_PLACES_TYPES === null || !res.ORIGIN_PLACES_TYPES) {

              this.contacts.ORIGIN_PLACES_TYPES = "";

            }
            this.edit = true;
          },
          (err: any) => console.log(err)
        )
    }
    else {
      this.arrayDB = [];
      this.phones.push("");
      this.dates.push("");
      this.datesLabels.push("");

      //PHONE
      let newPhoneValue = {
        countryCode: "",
        dialCode: '',
        e164Number: '',
        internationalNumber: "",
        nationalNumber: "",
        number: ""
      }
      this.phonesValues.push(newPhoneValue);

      //PHONE LABEL
      let newPhoneValueField = {
        countryCode: "",
        dialCode: '',
        e164Number: '',
        internationalNumber: "",
        nationalNumber: "",
        number: ""
      }
      this.phonesValuesFields.push(newPhoneValueField);

      //DATE
      let newDateValue = {
        id: "",
        value: "",
      }
      this.datesValues.push(newDateValue);

      //DATE LABEL
      let newDateValueLabel = {
        id: "",
        value: "",
      }
      this.datesValuesLabels.push(newDateValueLabel);

      //SOCIAL AND LABEL
      this.contacts.SOCIAL_VALUES = "";
      this.contacts.SOCIAL_TYPES = "";

      //SOCIAL AND LABEL
      this.contacts.CONNECTIONS_VALUES = "";
      this.contacts.CONNECTIONS_TYPES = "";

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

  mostrarSnackbar(mensaje: string) {
    this.snackBar.open(mensaje, 'Ok!', {
      duration: 2500,
      panelClass: ['blue-snackbar']
    });
  }

  ngOnDestroy() {
    if (this.ref) {
      this.ref.close();
    }
  }

  openNewUser() {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/contacts/add'])
    );

    window.open(url, "_blank");
  }


  deletePhoneField() {

    // Find the component
    const component: any = this.components.find((component) => component.instance instanceof FormContactComponent);
    const componentIndex = this.components.indexOf(component!);

    if (componentIndex !== -1) {
      // Remove component from both view and array
      this.contactPhoneField.remove(this.contactPhoneField.indexOf(component));

      this.components.splice(componentIndex, 1);
    }
  }

  saveNewContact() {

    let bandera = 0;
    if (this.arrPhonesDB.includes(this.phones[0], 0)) {
      bandera++;
      this.phoneUnique = JSON.stringify(this.phones[0]);
    }
    delete this.contacts.ID;
    if (bandera < 1) {

      this.contactsService.saveImageProfile(this.images).subscribe(profile => {
        console.log("exit", profile);
        this.contactsService.saveContact(this.contacts)
        .subscribe(contact => {
          this.router.navigate(['/contacts/edit/', contact.ID]);
          this.mostrarSnackbar('Register created!');
        },
          // (err) => console.error(err)
        );
      });
      
   
    }
    else {
      this.getPhones();
    }
  }

  updateContact() {
    let bandera = 0;

    if (this.phones.includes(this.arrayDB[0])) {
      bandera--
    }

    if (this.arrPhonesDB.includes(this.phones[0], 0)) {
      bandera++;
      this.phoneUnique = JSON.stringify(this.phones[0]);
    }
    if (bandera < 1) {
      this.contactsService.updateContact(this.contacts.ID!, this.contacts)
        .subscribe(
          contact => {
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
  }

  addValuePhone(index: any, phone: any) {
    this.phones[index] = phone.number;
    let lastPhoneValue = JSON.stringify(this.phones);
    this.contacts.PHONE1_VALUE = lastPhoneValue;
    if (this.phones.length > this.phonesFields.length) {
      this.phonesFields.push("");
      let lastPhoneValueLabel = JSON.stringify(this.phonesFields);
      this.contacts.PHONE1_TYPE = lastPhoneValueLabel;
    }
  }

  addValuePhoneLabel(index: any, phone: any) {
    this.phonesFields[index] = phone.number;
    let lastPhoneValueLabel = JSON.stringify(this.phonesFields);
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

          if (this.phones.length > 1) {
            this.phonesValues.splice(index, 1);
            this.phonesValuesFields.splice(index, 1);

            this.phones.splice(index, 1);
            let lastPhoneValue = JSON.stringify(this.phones);
            this.contacts.PHONE1_VALUE = lastPhoneValue;
            this.phonesFields.splice(index, 1);
            let lastPhoneValueFields = JSON.stringify(this.phonesFields);
            this.contacts.PHONE1_TYPE = lastPhoneValueFields;

          }
          else {
            this.phonesValues[0].number = "";
            this.phonesValuesFields[0].number = "";
            this.contacts.PHONE1_VALUE = "";
            this.contacts.PHONE1_TYPE = "";
          }

        }
      }
    );
  }

  //Get first contacts to arr
  getContacts() {
    this.contactsService.getContacts()
      .subscribe(
        (res: any) => {
          //Until correct Contacts DB
          for (let i = 0; i < 8; i++) {
            this.arrPhonesDB[i] = JSON.parse(res[i].PHONE1_VALUE)
          }
          for (let i = 0; i < 8; i++) {
            this.arrPhonesDB[i] = this.arrPhonesDB[i][0]
          }
        },
        err => console.error(err)
      );
  }

  //Get phone unique to show in modal
  getPhones() {
    this.phoneUnique.replace(/"/g, '')
    this.contactsService.getPhones(this.phoneUnique.replace(/"/g, ''))
      .subscribe(
        (res: any) => {
          this.phoneUniqueName = res[0].FIRST_NAME;
          this.mostrarSnackbar(`This number cannot be added because its owner is : ${this.phoneUniqueName}`,);
        }
      )
  }

  //DATES METHODS

  addEvent(event: MatDatepickerInputEvent<Date>, index: any) {
    this.dates[index] = this.datepipe.transform(event.value, 'MM-dd-YYYY')!;
    let lastDateValue = JSON.stringify(this.dates);
    this.contacts.DATES_VALUES = lastDateValue;
  }

  addValueDateLabel(index: any, date: any) {
    this.datesLabels[index] = date.value;
    let lastDateValueLabel = JSON.stringify(this.datesLabels);
    this.contacts.DATES_TYPES = lastDateValueLabel;
  }

  addDate() {
    let newDate: Dates = {
      id: "",
      value: "",
    }
    this.datesValues.push(newDate);
  }

  addDateLabel() {
    let newDate: Dates = {
      id: "",
      value: "",
    }
    this.datesValuesLabels.push(newDate);
  }

  deleteDate(index: any) {
    const dialog = this.matDialog.open(ConfirmarComponent, {
      width: '250px',
      data: "Date" + this.dates[index]
    });

    dialog.afterClosed().subscribe(
      (result: any) => {

        if (result) {

          if (this.dates.length > 1) {
            this.datesValues.splice(index, 1);
            this.datesValuesLabels.splice(index, 1);
            this.dates.splice(index, 1);
            let lastDateValue = JSON.stringify(this.dates);
            this.contacts.DATES_VALUES = lastDateValue;
            this.datesLabels.splice(index, 1);
            let lastDateValueLabels = JSON.stringify(this.datesLabels);
            this.contacts.DATES_TYPES = lastDateValueLabels;
          }
          else {
            this.datesValues[0].value = "";
            this.datesValuesLabels[0].value = "";
            this.contacts.PHONE1_VALUE = "";
            this.contacts.PHONE1_TYPE = "";
          }
        }
      }
    );
  }

  //INPUT SOCIAL
  UpdateSocialValues(value: any) {
    this.contacts.SOCIAL_VALUES = value;
  }

  UpdateSocialValuesLabel(value: any) {
    this.contacts.SOCIAL_TYPES = value;
  }

  deleteSocialValue(value: any) {
    this.contacts.SOCIAL_VALUES = value;
  }

  deleteSocialValueLabel(value: any) {
    this.contacts.SOCIAL_TYPES = value;
  }

  //INPUT CONNECTIONS
  UpdateConnectionsValues(value: any) {
    this.contacts.CONNECTIONS_VALUES = value;
  }

  UpdateConnectionsValuesLabel(value: any) {
    this.contacts.CONNECTIONS_TYPES = value;
  }

  deleteConnectionsValue(value: any) {
    this.contacts.CONNECTIONS_VALUES = value;
  }

  deleteConnectionsValueLabel(value: any) {
    this.contacts.CONNECTIONS_TYPES = value;
  }

  //INPUT LANGUAGES
  UpdateLanguagesValues(value: any) {
    this.contacts.LANGUAGE = value;
  }

  deleteLanguagesValues(value: any) {
    this.contacts.LANGUAGE = value;
  }

  //INPUT ORIGIN PLACES
  UpdatePlacesValues(value: any) {
    this.contacts.ORIGIN_PLACES_VALUES = value;
  }

  UpdatePlacesValuesLabel(value: any) {
    this.contacts.ORIGIN_PLACES_TYPES = value;
  }

  deletePlacesValue(value: any) {
    this.contacts.ORIGIN_PLACES_VALUES = value;
  }

  deletePlacesValueLabel(value: any) {
    this.contacts.ORIGIN_PLACES_TYPES = value;
  }

  placeChangedCallback(place: any) {
    console.log("event", place);
    this.street_number = "";
    this.address = "";
    this.contacts.ADDRESS1_CITY = "";
    this.state = "";
    this.country = "";
    this.zip = "";
    const addressFrom = {
      street_number: "short_name",
      route: "long_name",
      locality: "long_name",
      sublocality_level_1: "sublocality_level_1",
      administrative_area_level_1: "short_name",
      country: "long_name",
      postal_code: "short_name",
    };
    place.address_components.forEach((add: any) => {
      add.types.forEach((addType: any) => {
        if (addType == "street_number")
          this.street_number = add.short_name;
        if (addType == "route") {
          this.address = place.formatted_address;

        }
        if (addType == "locality" || addType == "sublocality_level_1")
          this.contacts.ADDRESS1_CITY = add.long_name;
        if (addType == "administrative_area_level_1")
          this.contacts.ADDRESS1_REGION = add.long_name;
        if (addType == "country")
          this.contacts.ADDRESS1_COUNTRY = add.long_name;
        if (addType == "postal_code")
          this.contacts.ADDRESS1_POSTAL_CODE = add.long_name;
      });

    });
    this.contacts.ADDRESS1_TYPE = place.formatted_address;
  }

  UploadImage(value: any) {
    this.images = value;
  }

}



