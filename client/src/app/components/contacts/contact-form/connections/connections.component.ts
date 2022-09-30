import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Contact } from 'src/app/interfaces/contacts.interface';
import { ContactsService } from 'src/app/services/contacts.service';

@Component({
  selector: 'app-connections',
  templateUrl: './connections.component.html',
  styleUrls: ['./connections.component.css']
})
export class ConnectionsComponent implements OnInit {

  contacts: Contact[] = [];

  constructor( private contactsService: ContactsService) { }

  ngOnInit(): void {
    this.getContacts();
  }

  getContacts() {
    this.contactsService.getContacts()
      .subscribe(
        (res: any) => {
          this.contacts = res;
          console.log(res);
          // localStorage.setItem('contacts', JSON.stringify( this.contacts )  );
        },
        err => console.error(err)
      );
  }

  
  

}
