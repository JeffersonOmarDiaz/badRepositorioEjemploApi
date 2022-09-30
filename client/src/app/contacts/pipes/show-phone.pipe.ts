import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'showPhone'
})
export class ShowPhonePipe implements PipeTransform {

  transform(value: string){
    if(value === null || value ===""){
      return ""
    }
    else{
      let valueArray:string[]= [];
      valueArray = JSON.parse(value);
      return valueArray[0];
    }
    
  }

}
