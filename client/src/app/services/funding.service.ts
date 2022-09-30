import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FundingService {

  API_URI = environment.baseURL;

  constructor(private http: HttpClient) { }

  getFunding() {
    return this.http.get(`${this.API_URI}/funding/`);
  }

  getFundingByID( id: string ){
    return this.http.get(`${this.API_URI}/funding/${id}`);
  }

  deleteFunding(id: string) {
    return this.http.delete(`${this.API_URI}/funding/${id}`);
  }

  getFundingOne(id: string){
    return this.http.get(`${this.API_URI}/funding/contacts/${id}`);
  }


  



}
