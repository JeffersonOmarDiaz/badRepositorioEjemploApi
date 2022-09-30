import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { } from '@angular/forms';
import { FormGroup } from "@angular/forms";
import {
  CountryISO,
  SearchCountryField
} from "ngx-intl-tel-input";


@Component({
  selector: 'app-form-contact',
  templateUrl: './form-contact.component.html',
  styleUrls: ['./form-contact.component.css']
})
export class FormContactComponent implements OnInit {

  @Input() phone1Value: string = '';
  @Input() phone1Type: string = '';
  @Output() onNewPhoneValue1: EventEmitter<string> = new EventEmitter<string>();
  form: FormGroup | undefined;
  isSubmit = false;

  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [
    CountryISO.UnitedStates,
    CountryISO.UnitedKingdom
  ];


  constructor() { }

  ngOnInit(): void {
  }

  addPhone() {

    this.onNewPhoneValue1.emit(this.phone1Value);

  }


}
