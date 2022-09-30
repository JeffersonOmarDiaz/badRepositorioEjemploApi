import { Component, EventEmitter, OnInit, Output } from '@angular/core';



@Component({
  selector: 'app-navigation-funding',
  templateUrl: './navigation-funding.component.html',
  styles: [
  ]
})

export class NavigationFundingComponent implements OnInit {

  @Output() onAddFunding: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  

  ngOnInit(): void {
  }

  addFunding( event : any){
    this.onAddFunding.emit( true );
  }

}
