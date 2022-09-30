import { Component, OnInit } from '@angular/core';
import { Contact } from 'src/app/interfaces/contacts.interface';
import { ContactsService } from 'src/app/services/contacts.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  activeRoute: string = '';
  contacts: Contact[] = [];

  constructor( private contactsService: ContactsService) { }

  ngOnInit() {
  }
  
  activateRoute( route: string ) {

    if ( route === this.activeRoute ) { return; }

    this.activeRoute = route;
    this.contacts = [];


  }

}
