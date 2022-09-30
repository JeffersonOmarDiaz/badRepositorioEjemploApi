import { AfterContentChecked, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, AfterContentChecked {

  items: MenuItem[] = [];
  activatedRouteSub: any;
  idValue: string = '0';
  idValueFunding: string = '0';


  constructor(public router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {


    this.items = [
      { label: 'Contacts', icon: 'fa-regular fa-address-book' },
      { label: 'Lawyers', icon: 'fa-solid fa-scale-balanced' },
      { label: 'Funding', icon: 'pi pi-money-bill' },
      { label: 'Medical', icon: 'fa-solid fa-book-medical' },
      { label: 'Legal', icon: 'fa-solid fa-file-contract' },
      { label: 'Finances', icon: 'fa-solid fa-coins' },
    ];
  }

  ngAfterContentChecked(){
    this.idValue = this.router.url;
    this.idValueFunding = this.router.url;
    this.idValue = this.idValue.replace('/contacts/edit/', '');
    this.idValueFunding = this.idValueFunding.replace('/funding/details/', '');
  }

}
