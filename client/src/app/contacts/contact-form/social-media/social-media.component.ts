
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageService } from 'primeng/api';
import { ConfirmarComponent } from 'src/app/components/confirmar/confirmar.component';

interface Social {
  id: string,
  value: string | null
}

@Component({
  selector: 'app-social-media',
  templateUrl: './social-media.component.html',
  styleUrls: ['./social-media.component.css']
})

export class SocialMediaComponent implements OnInit{

  @Input() socialValuesID: string = '';
  @Input() socialValuesLabelsID: string = '';
  @Input() phone1Value: string = '';
  @Input() idValue: string = '';
  @Output() onUpdateSocialValue: EventEmitter<string> = new EventEmitter<string>();
  @Output() onUpdateSocialLabelValue: EventEmitter<string> = new EventEmitter<string>();
  @Output() onDeleteSocial: EventEmitter<string> = new EventEmitter<string>();
  @Output() onDeleteSocialLabel: EventEmitter<string> = new EventEmitter<string>();


  //SOCIAL
  social: string[] = [];
  socialValues: Social[] = [];


  //SOCIAL LABELS
  socialLabels: string[] = [];
  socialValuesLabels: Social[] = [];

  bandera = 0;

  constructor(public messageService: MessageService, private snackBar: MatSnackBar,
    private matDialog: MatDialog) { }

    ngOnInit(): void {
      let newSocialValueLabel = {
        id: "",
        value: "",
      }
      this.socialValuesLabels.push(newSocialValueLabel);
    }

  ngOnChanges() {

    if (this.bandera === 0) {

      if (this.idValue) {
         
        this.socialValues.splice( 0, 1);
        this.socialValuesLabels.splice( 0, 1);
        
        if(this.socialValuesID == "" || !this.socialValuesID || this.socialValuesID == null ){
          // this.social.push("");
          console.log("first")
          return;
        }
        else{
          this.social = JSON.parse(this.socialValuesID);
        }

        for (let i = 0; i < this.social.length; i++) {

          let newSocialValue = {
            id: this.social[i],
            value: this.social[i]
          }
          this.socialValues.push(newSocialValue);
        }

        // DATES LABELS
        if(this.socialValuesLabelsID == "" || !this.socialValuesLabelsID || this.socialValuesLabelsID == null  ){
          // this.socialLabels.push("");
        }
        else{
            this.socialLabels = JSON.parse(this.socialValuesLabelsID);
        }
        
        
        for (let i = 0; i < this.socialLabels.length; i++) {
          
          let newSocialValueLabel = {
            id: this.socialLabels[i],
            value: this.socialLabels[i],
          }
          this.socialValuesLabels.push(newSocialValueLabel);
        }
      }


      this.bandera++
    }

  }

  addValueSocial(index: any, social: any) {
    this.social[index] = social.value;
    let lastSocialValue = JSON.stringify(this.social);
    this.socialValuesID = lastSocialValue;
    if (this.social.length > this.socialLabels.length) {
      this.socialLabels.push("");
      let lastSocialValueLabel = JSON.stringify(this.socialLabels);
      this.socialValuesLabelsID = lastSocialValueLabel;
    }
    this.onUpdateSocialValue.emit(this.socialValuesID);


  }

  addValueSocialLabel(index: any, social: any) {
    this.socialLabels[index] = social.value;
    let lastSocialValueLabel = JSON.stringify(this.socialLabels);
    this.socialValuesLabelsID = lastSocialValueLabel;
    this.onUpdateSocialLabelValue.emit(this.socialValuesLabelsID);

  }

  addSocial() {
    let newDate: Social = {
      id: "",
      value: "",
    }
    this.socialValues.push(newDate);
  }

  addSocialLabel() {
    let newDate: Social = {
      id: "",
      value: "",
    }
    this.socialValuesLabels.push(newDate);
  }

  deleteSocial(index: any) {
    const dialog = this.matDialog.open(ConfirmarComponent, {
      width: '250px',
      data: "Social Media: " + this.social[index]
    });

    dialog.afterClosed().subscribe(
      (result: any) => {

        if (result) {
          this.socialValues.splice(index, 1);
          this.socialValuesLabels.splice(index, 1);
          this.social.splice(index, 1);
          let lastDateValue = JSON.stringify(this.social);
          this.socialValuesID = lastDateValue;
          this.socialLabels.splice(index, 1);
          let lastDateValueLabels = JSON.stringify(this.socialLabels);
          this.socialValuesLabelsID = lastDateValueLabels;
          this.onDeleteSocial.emit(this.socialValuesID);
          this.onDeleteSocialLabel.emit(this.socialValuesLabelsID);
         
        }
      }
    );
  }

}
