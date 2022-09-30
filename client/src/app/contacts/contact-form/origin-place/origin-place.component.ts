import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageService } from 'primeng/api';
import { ContactsService } from 'src/app/services/contacts.service';
import { ConfirmarComponent } from 'src/app/components/confirmar/confirmar.component';

interface Country {
  name: string;
  alpha2Code: string;
  alpha3Code: string;
  numericCode: string;
  callingCode: string;
}


interface SOCIAL {
  id: string,
  value: string | null
}

@Component({
  selector: 'app-origin-place',
  templateUrl: './origin-place.component.html',
  styleUrls: ['./origin-place.component.scss']
})
export class OriginPlaceComponent implements OnInit {

  @Input() placesValuesID: string = '';
  @Input() placesValuesLabelsID: string = '';
  @Input() idValue: string = '';
  @Output() onUpdatePlacesValue: EventEmitter<string> = new EventEmitter<string>();
  @Output() onUpdatePlacesLabelValue: EventEmitter<string> = new EventEmitter<string>();
  @Output() onDeletePlaces: EventEmitter<string> = new EventEmitter<string>();
  @Output() onDeletePlacesLabel: EventEmitter<string> = new EventEmitter<string>();

  defaultValue: Country = {
    name: 'Deutschland',
    alpha2Code: 'DE',
    alpha3Code: 'DEU',
    numericCode: '276',
    callingCode: '',
  };

  //ORIGIN PLACES VALUES
  places: string[] = [];
  placesValues: Country[] = [];

  //ORIGIN PLACES TYPES
  placesLabels: string[] = [];
  placesValuesLabels: SOCIAL[] = [];

  bandera = 0;

  constructor(private contactsService: ContactsService, public messageService: MessageService, private snackBar: MatSnackBar,
    private matDialog: MatDialog) { }

  ngOnInit(): void {
    let newPlacesValueLabel = {
      id: "",
      value: "",
    }
    this.placesValuesLabels.push(newPlacesValueLabel)
  }


  ngOnChanges() {

    if (this.bandera === 0) {

      if (this.idValue) {

        this.placesValues.splice(0, 1);
        this.placesValuesLabels.splice(0, 1);

        if (this.placesValuesID === "" || !this.placesValuesID || this.placesValuesID == null) {
          // this.connections.push("");
          return;
        }
        else {
        
          this.placesValues = JSON.parse(this.placesValuesID);
        }

        // DATES LABELS
        if (this.placesValuesLabelsID == "" || !this.placesValuesLabelsID || this.placesValuesLabelsID == null) {
          this.placesLabels.push("");

        }
        else {
          this.placesLabels = JSON.parse(this.placesValuesLabelsID);
        }


        for (let i = 0; i < this.placesLabels.length; i++) {

          let newPlacesValueLabel = {
            id: this.placesLabels[i],
            value: this.placesLabels[i],
          }
          this.placesValuesLabels.push(newPlacesValueLabel);
        }

      }

      this.bandera++
    }

  }

  addValuePlaces(index: any, places: any) {
    this.places[index] = places.value;
    let lastPlacesValue = JSON.stringify(this.places);
    this.placesValuesID = lastPlacesValue;
    if (this.places.length > this.placesLabels.length) {
      this.placesLabels.push("");
      let lastconnectionsValueLabel = JSON.stringify(this.placesLabels);
      this.placesValuesLabelsID = lastconnectionsValueLabel;
    }
    this.onUpdatePlacesValue.emit(this.placesValuesID);
  }

  addValuePlacesLabel(index: any, places: any) {
    this.placesLabels[index] = places.value;
    let lastPlacesValueLabel = JSON.stringify(this.placesLabels);
    this.placesValuesLabelsID = lastPlacesValueLabel;
    this.onUpdatePlacesLabelValue.emit(this.placesValuesLabelsID);

  }

  addPlaces() {
    let newPlace: Country = {
      name: '',
      alpha2Code: '',
      alpha3Code: '',
      numericCode: '',
      callingCode: '',
    }
    this.placesValues.push(newPlace);
  }

  addPlacesLabel() {
    let newDate: SOCIAL = {
      id: "",
      value: "",
    }
    this.placesValuesLabels.push(newDate);
  }

  deletePlaces(index: any) {
    const dialog = this.matDialog.open(ConfirmarComponent, {
      width: '250px',
      data: "Place: " + this.placesValues[index]
    });

    dialog.afterClosed().subscribe(
      (result: any) => {

        if (result) {
          this.placesValues.splice(index, 1);
          this.placesValuesLabels.splice(index, 1);
          // this.places.splice(index, 1);
          let lastPlacesValue = JSON.stringify(this.placesValues);
          this.placesValuesID = lastPlacesValue;
          this.placesLabels.splice(index, 1);
          let lastPlacesValueLabels = JSON.stringify(this.placesLabels);
          this.placesValuesLabelsID = lastPlacesValueLabels;
          this.onDeletePlaces.emit(this.placesValuesID);
          this.onDeletePlacesLabel.emit(this.placesValuesLabelsID);

        }
      }
    );
  }

  onCountrySelected($event: Country, index: any) {
    this.placesValues[index] = $event;
    let lastPlacesValue = JSON.stringify(this.placesValues);
    this.placesValuesID = lastPlacesValue;
    this.onUpdatePlacesValue.emit(this.placesValuesID);
  }
}




