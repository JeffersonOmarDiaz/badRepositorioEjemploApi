import { Component, OnInit, HostBinding, ViewChild } from '@angular/core';
import { ContactsService } from '../../../services/contacts.service';
import { Contact } from 'src/app/interfaces/contacts.interface';
import { SortEvent } from 'primeng/api';
import { MatSelectCountryModule } from '@angular-material-extensions/select-country';
import { HttpClientModule } from '@angular/common/http';
import { Country } from '@angular-material-extensions/select-country';
import { Angulartics2GoogleAnalytics } from 'angulartics2';
import { Observable, startWith } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { go, highlight } from 'fuzzysort';
import { FormControl } from '@angular/forms';
import { Table } from 'primeng/table';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmarComponent } from '../../confirmar/confirmar.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contacts-list',
  templateUrl: './contacts-list.component.html',
  styles: [
    `
      li {
        cursor: pointer;
      }
    `
  ]
})


export class ContactsListComponent implements OnInit {

  myControl = new FormControl();
  options: [] = [];
  arr: string[] = [];
  filteredOptions!: Observable<any[]>;
  termino: string = '';
  hayError: boolean = false;
  public contacts: Contact[] = [];
  contactsSugeridos: Contact[] = [];
  mostrarSugerencias: boolean = false;
  @ViewChild('dt')
  table!: Table;
  loading: boolean = true;
  @ViewChild('dt') dt: Table | undefined;

  contact: Contact = {
    ID: '',
    NAME_PREFIX: '',
    FIRST_NAME: '',
    PHOTO: '',
    BIRTHDAY: '',
    PHONE1_TYPE: ''
  };

  phones: string[] = [];

  @HostBinding('class') classes = 'row';

  constructor(private contactsService: ContactsService, private snackBar: MatSnackBar,
    private matDialog: MatDialog) {
  }

  ngOnInit() {
    this.getContacts();
    // for(let i = 0; i<this.phones.length; i++){
    //   this.contact[i].PHONE1_VALUE = this.phones[] 
    // }
    
    this.loading = false;
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  private _filter(value: string) {
    const filterValue = value.toLowerCase();
    return go(value, this.arr).map((r) => highlight(r));
  }

  buscar(termino: string) {

    this.mostrarSugerencias = false;
    this.hayError = false;
    this.termino = termino;
    this.contactsService.getContactNames(termino)
      .subscribe((contacts: any) => {
        console.log(contacts);
        this.contacts = contacts;
      }, (err) => {
        this.hayError = true;
        this.contacts = [];
      });
  }

  sugerencias(termino: string) {
    this.hayError = false;
    this.termino = termino;
    this.mostrarSugerencias = true;

    this.contactsService.getContactNames(termino)
      .subscribe(
        (contacts: any) => this.contactsSugeridos = contacts,
        (err) => this.contactsSugeridos = []
      );

  }

  buscarSugerido(termino: string) {
    this.buscar(termino);
  }

  getContacts() {
    this.contactsService.getContacts()
      .subscribe(
        (res: any) => {
          this.contacts = res;
          for (let i = 0; i < this.contacts.length; i++) {
            this.arr[i] = res[i].FIRST_NAME
            // this.phones[i] = JSON.parse(res[i].PHONE1_VALUE);
          }
          console.log(res);
          // this.contact.PHONE1_VALUE = JSON.parse(this.contact.PHONE1_VALUE!);
          // console.log("this", this.phones)
          // localStorage.setItem('contacts', JSON.stringify( this.contacts )  );
        },
        err => console.error(err)
      );
  }

  deleteContact(ID?: string, FIRST_NAME?: string) {

    const dialog = this.matDialog.open(ConfirmarComponent, {
      width: '250px',
      data: FIRST_NAME
    });

    // dialog.afterClosed()
    //   .pipe(
    //         switchMap( ( result ) => (result)? this.contactsService.deleteContact(ID!) : this.contactsService.deleteContact(ID!)
    //       )
    //       )
    //         .subscribe(  (res: any) => {
    //           console.log(res);
    //           this.getContacts();
    //         },
    //           (err: any) => console.error(err)

    //         );

    // this.mostrarSugerencias = false;
    // this.contactsService.deleteContact(ID!)
    //   .subscribe(
    //     res => {
    //       console.log(res);
    //       this.getContacts();
    //     },
    //     err => console.error(err)
    //   )


    dialog.afterClosed().subscribe(
      (result: any) => {
        console.log("this",this.contact.ID)
        if (result) {
          
          this.contactsService.deleteContact(ID!)
            .subscribe(resp => {

              this.getContacts();
            },
            err => console.error(err));
        }
      }
    );
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

}
