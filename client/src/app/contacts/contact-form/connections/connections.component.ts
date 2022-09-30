import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ConfirmarComponent } from 'src/app/components/confirmar/confirmar.component';
import { Contact } from 'src/app/interfaces/contacts.interface';
import { ContactsService } from 'src/app/services/contacts.service';

interface SOCIAL {
  id: string,
  value: string | null
}

@Component({
  selector: 'app-connections',
  templateUrl: './connections.component.html',
  styleUrls: ['./connections.component.css']
})
export class ConnectionsComponent implements OnInit {

  @Input() connectionsValuesID: string = '';
  @Input() connectionsValuesLabelsID: string = '';
  @Input() idValue: string = '';
  @Output() onUpdateConnectionsValue: EventEmitter<string> = new EventEmitter<string>();
  @Output() onUpdateConnectionsLabelValue: EventEmitter<string> = new EventEmitter<string>();
  @Output() onDeleteConnections: EventEmitter<string> = new EventEmitter<string>();
  @Output() onDeleteConnectionsLabel: EventEmitter<string> = new EventEmitter<string>();

  //CONNECTIONS
  connections: string[] = [];
  connectionsValues: SOCIAL[] = [];

  //CONNECTIONS LABELS
  connectionsLabels: string[] = [];
  connectionsValuesLabels: SOCIAL[] = [];

  bandera = 0;

  contacts: Contact[] = [];

  constructor( private contactsService: ContactsService, public messageService: MessageService, private snackBar: MatSnackBar, private router: Router,
    private matDialog: MatDialog) { }

  ngOnInit(): void {
    let newConnectionsValueLabel = {
      id: "",
      value: "",
    }
    this.connectionsValuesLabels.push(newConnectionsValueLabel);
    this.getContacts();
  }

  ngOnChanges() {

    if (this.bandera === 0) {

      if (this.idValue) {
         
        this.connectionsValues.splice( 0, 1);
        this.connectionsValuesLabels.splice( 0, 1);

        if(this.connectionsValuesID == "" || !this.connectionsValuesID || this.connectionsValuesID == null ){
          // this.connections.push("");
          return;
        }
        else{
          this.connections = JSON.parse(this.connectionsValuesID);
        }
      
        for (let i = 0; i < this.connections.length; i++) {

          let newConnectionsValue = {
            id: this.connections[i],
            value: this.connections[i]
          }
          this.connectionsValues.push(newConnectionsValue);
        }

        if(this.connectionsValuesLabelsID == "" || !this.connectionsValuesLabelsID || this.connectionsValuesLabelsID == null  ){
          this.connectionsLabels.push("");
       
        }
        else{
            this.connectionsLabels = JSON.parse(this.connectionsValuesLabelsID);
        }
        
        
        for (let i = 0; i < this.connectionsLabels.length; i++) {
          
          let newConnectionsValueLabel = {
            id: this.connectionsLabels[i],
            value: this.connectionsLabels[i],
          }
          this.connectionsValuesLabels.push(newConnectionsValueLabel);
        }
      }

      this.bandera++
    }

  }

  getContacts() {
    this.contactsService.getContacts()
      .subscribe(
        (res: any) => {
          this.contacts = res;
        },
        err => console.error(err)
      );
  }

  addValueConnections(index: any, connections: any) {
    this.connections[index] = connections.value;
    let lastconnectionsValue = JSON.stringify(this.connections);
    this.connectionsValuesID = lastconnectionsValue;
    if (this.connections.length > this.connectionsLabels.length) {
      this.connectionsLabels.push("");
      let lastconnectionsValueLabel = JSON.stringify(this.connectionsLabels);
      this.connectionsValuesLabelsID = lastconnectionsValueLabel;
    }
    this.onUpdateConnectionsValue.emit(this.connectionsValuesID);
  }

  addValueConnectionsLabel(index: any, connections: any) {
    this.connectionsLabels[index] = connections.value;
    let lastconnectionsValueLabel = JSON.stringify(this.connectionsLabels);
    this.connectionsValuesLabelsID = lastconnectionsValueLabel;
    this.onUpdateConnectionsLabelValue.emit(this.connectionsValuesLabelsID);

  }

  addConnections() {
    let newDate: SOCIAL = {
      id: "",
      value: "",
    }
    this.connectionsValues.push(newDate);
  }

  addConnectionsLabel() {
    let newDate: SOCIAL = {
      id: "",
      value: "",
    }
    this.connectionsValuesLabels.push(newDate);
  }

  deleteConnections(index: any) {
    const dialog = this.matDialog.open(ConfirmarComponent, {
      width: '250px',
      data: "Connection: " + this.connections[index]
    });

    dialog.afterClosed().subscribe(
      (result: any) => {

        if (result) {
          this.connectionsValues.splice(index, 1);
          this.connectionsValuesLabels.splice(index, 1);
          this.connections.splice(index, 1);
          let lastConnectionValue = JSON.stringify(this.connections);
          this.connectionsValuesID = lastConnectionValue;
          this.connectionsLabels.splice(index, 1);
          let lastConnectionValueLabels = JSON.stringify(this.connectionsLabels);
          this.connectionsValuesLabelsID = lastConnectionValueLabels;
          this.onDeleteConnections.emit(this.connectionsValuesID);
          this.onDeleteConnectionsLabel.emit(this.connectionsValuesLabelsID);
        }
      }
    );
  }

  
  openNewUser() {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/contacts/add'])
    );

    window.open(url, "_blank");
  }
}
