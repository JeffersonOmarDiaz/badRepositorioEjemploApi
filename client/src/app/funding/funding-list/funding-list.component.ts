import { Component, OnInit, ViewChild } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { SelectItem } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { ContactsService } from 'src/app/services/contacts.service';
import { Funding } from 'src/app/interfaces/funding.interface';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmarComponent } from 'src/app/components/confirmar/confirmar.component';
import { Table } from 'primeng/table';
import { SortEvent } from 'primeng/api';
import { FundingService } from 'src/app/services/funding.service';



interface Product {
    id?: string;
    code?: string;
    name?: string;
    description?: string;
    price?: number;
    quantity?: number;
    inventoryStatus?: string;
    category?: string;
    image?: string;
    rating?: number;
}

@Component({
    selector: 'app-funding-list',
    templateUrl: './funding-list.component.html',
    providers: [MessageService],
    styles: [`
      :host ::ng-deep .p-cell-editing {
          padding-top: 0 !important;
          padding-bottom: 0 !important;
      }
  `]
})
export class FundingList {
    table!: Table;
    loading: boolean = true;
    @ViewChild('dt') dt: Table | undefined;

    public funding: Funding[] = [];

    products1!: Product[];

    products2!: Product[];

    statuses!: SelectItem[];

    clonedProducts: { [s: string]: Product; } = {};

  
    

    constructor(private http: HttpClient, private messageService: MessageService, private fundingService: FundingService, private matDialog: MatDialog) { }

    ngOnInit() {
        this.loading = false;
        this.getFunding();
    }

    onRowEditInit(product: Product) {
        this.clonedProducts[product.id!] = { ...product };
    }

    onRowEditSave(product: Product) {
        if (product.price! > 0) {
            delete this.clonedProducts[product.id!];
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product is updated' });
        }
        else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Price' });
        }
    }

    onRowEditCancel(product: Product, index: number) {
        this.products2[index] = this.clonedProducts[product.id!];
        //   delete this.products2[product.id];
    }

    
    getFunding() {
        this.fundingService.getFunding()
            .subscribe(
                (res: any) => {
                    this.funding = res;
                    console.log("funding", this.funding)
            
                },
                err => console.error(err)
            );
    }


    deleteFunding(ID?: string, FIRST_NAME?: string) {

        const dialog = this.matDialog.open(ConfirmarComponent, {
            width: '250px',
            data: FIRST_NAME
        });

        dialog.afterClosed().subscribe(
            (result: any) => {

                if (result) {

                    this.fundingService.deleteFunding(ID!)
                        .subscribe(resp => {

                            this.getFunding();
                        },
                            err => console.error(err));
                }
            }
        );
    }

    applyFilterGlobal($event: any, stringVal: any) {
        this.dt!.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
    }

    
}

