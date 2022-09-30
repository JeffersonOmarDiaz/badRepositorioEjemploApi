import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Contact } from '../interfaces/contacts.interface';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  API_URI = environment.baseURL;

  constructor(private http: HttpClient) { }

  getContacts() {
    return this.http.get(`${this.API_URI}/contacts`);
  }

  getContact(id: string) {
    return this.http.get(`${this.API_URI}/contacts/${id}`);
  }

  getContactNames(name: string) {
    return this.http.get(`${this.API_URI}/contacts/names/${name}`);
  }

  deleteContact(id: string) {
    return this.http.delete(`${this.API_URI}/contacts/${id}`);
  }

  saveContact(Contact: Contact) :Observable<Contact> {
    
    return this.http.post(`${this.API_URI}/contacts`, Contact);
  }

  saveImageProfile( image: any) {
    const formData = new FormData();
    formData.append('file', image);
    return this.http.post(`${this.API_URI}/contacts/profile`, formData);
  }

  updateContact(id: string, updatedContact: Contact): Observable<Contact> {
    return this.http.put(`${this.API_URI}/contacts/${id}`, updatedContact);
  }

  getPhones( phone: string){
    return this.http.get(`${this.API_URI}/contacts/phones/${phone}`)
  }

}
