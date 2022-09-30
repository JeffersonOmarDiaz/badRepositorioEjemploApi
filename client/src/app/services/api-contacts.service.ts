import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'; 

@Injectable({
  providedIn: 'root'
})
export class ApiContactsService {

  private apiUrl: string = 'https://people.googleapis.com';

  get httpParams () {
    return new HttpParams().set( 'API key 1', 'AIzaSyBdqUfx5KZjEXO_sl67cWUD7xrCvlpGYoA' );
  }

getPaisPorAlpha() {
    const url = `${ this.apiUrl }/v1/people:listDirectoryPeople`;
    return this.http.get( url );

  }

  constructor( private http: HttpClient ) { }
}




