export interface Bank {
    id: string;
    name: string;
  }
  
  export interface BankGroup {
    name: string;
    banks: Bank[];
  }
  
  
  /** list of banks */
  export const BANKS: Bank[] = [
    {name: 'Home', id: 'A'},
    {name: 'Work', id: 'B'},
    {name: 'Mobile', id: 'C'},
    {name: 'Main', id: 'D'},
    {name: 'Home Fax', id: 'E'},
    {name: 'Work Fax', id: 'F'},
    {name: 'Google Voice', id: 'G'},
    {name: 'Pager', id: 'H'},
    {name: 'Ring Central', id: 'I'},
  ];
  
