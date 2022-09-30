
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageService } from 'primeng/api';
import { ConfirmarComponent } from 'src/app/components/confirmar/confirmar.component';

interface Social {
  id: string,
  value: string | null
}

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.css']
})
export class LanguageComponent implements OnInit {

  @Input() languageValuesID: string = '';
  @Input() idValue: string = '';
  @Input() idValueCharge: string = '';
  @Output() onUpdateLanguageValue: EventEmitter<string> = new EventEmitter<string>();
  @Output() onDeleteLanguage: EventEmitter<string> = new EventEmitter<string>();

  //SOCIAL
  language: string[] = [];
  languageValues: Social[] = [];

  bandera = 0;
  timeOut!: number;

  constructor(public messageService: MessageService, private snackBar: MatSnackBar,
    private matDialog: MatDialog) { }

  ngOnInit(): void {

  }

  ngOnChanges() {

    //   setTimeout(() =>{
    //     this.initComponent();
    // }, 0);
    if (this.bandera === 0) {

      if (this.idValue) {
        this.languageValues.splice(0, 1);

        if (this.languageValuesID == "" || !this.languageValuesID || this.languageValuesID == null) {
          // this.social.push("");
          return;
        }
        else {
          this.language = JSON.parse(this.languageValuesID);
        }

        for (let i = 0; i < this.language.length; i++) {

          let newLanguageValue = {
            id: this.language[i],
            value: this.language[i]
          }
          this.languageValues.push(newLanguageValue);
        }

      }

      this.bandera++;
    }
  }


  addValueLanguage(index: any, language: any) {
    this.language[index] = language.value;
    let lastLanguageValue = JSON.stringify(this.language);
    this.languageValuesID = lastLanguageValue;
    this.onUpdateLanguageValue.emit(this.languageValuesID);
  }

  addLanguage() {
    let newLanguage: Social = {
      id: "",
      value: "",
    }
    this.languageValues.push(newLanguage);
  }

  deleteLanguage(index: any) {
    const dialog = this.matDialog.open(ConfirmarComponent, {
      width: '250px',
      data: "Language: " + this.language[index]
    });

    dialog.afterClosed().subscribe(
      (result: any) => {

        if (result) {
          this.languageValues.splice(index, 1);
          this.language.splice(index, 1);
          let lastLanguageValue = JSON.stringify(this.language);
          this.languageValuesID = lastLanguageValue;
          this.onDeleteLanguage.emit(this.languageValuesID);
        }
      }
    );
  }

}


