import { Component, Input, OnInit } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { SelectItem } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FundingService } from 'src/app/services/funding.service';
import { FundingDetails } from 'src/app/interfaces/interface-details.interface';
import { Funding } from 'src/app/interfaces/funding.interface';
import { ChartOptions, ChartType, ChartDataset } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';


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
  selector: 'app-funding-contact',
  templateUrl: './funding-contact.component.html',
  providers: [MessageService],
  styles: [`
      :host ::ng-deep .p-cell-editing {
          padding-top: 0 !important;
          padding-bottom: 0 !important;
      }
  `]
})
export class FundingContactComponent implements OnInit {

  idValue: string = '0';
  activatedRouteSub: any;

  datesAccident: any[] = [];
  datesFundingDate: any[] = [];
  termDate: any[] = [];

  //Edit or add new contact
  edit: boolean = false;

  funding: FundingDetails[] = [];
  fundingContact!: Funding;

  products1!: Product[];

  products2!: Product[];

  statuses!: SelectItem[];

  clonedProducts: { [s: string]: Product; } = {};

  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  public barChartLabels: BaseChartDirective["labels"] = ['2020', '2021'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataset[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Year 2020', backgroundColor: '#7FD7FA' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Year 2021', backgroundColor: '#57A6D9' }
  ];

  constructor(private http: HttpClient, private messageService: MessageService, private activatedRoute: ActivatedRoute, private router: Router, private fundingService: FundingService,) { }

  ngOnInit() {
    this.activatedRouteSub = this.activatedRoute.params.subscribe(params => {
      this.idValue = params['id'];
    });

    if (this.idValue) {
      this.fundingService.getFundingOne(this.idValue).subscribe(
        (res: any) => {
          this.fundingContact = res;

        }
      )

      this.fundingService.getFundingByID(this.idValue)
        .subscribe(
          (res: any) => {
            this.funding = res;
            this.datesAccident = res.map((a: { DATE_ACCIDENT: any; }) => this.formatDate(a.DATE_ACCIDENT));
            this.datesFundingDate = res.map((a: { FUNDING_DATE: any; }) => this.formatDate(a.FUNDING_DATE));
            this.termDate = res.map((a: { TERM_DATE: any; }) => this.formatDate(a.TERM_DATE));
            this.edit = true;
          },
          (err: any) => console.log(err)
        )
    }
    this.getProductsSmall().then((data: Product[]) => this.products1 = data);
    this.getProductsSmall().then((data: Product[]) => this.products2 = data);

    this.statuses = [{ label: 'In Stock', value: 'INSTOCK' }, { label: 'Low Stock', value: 'LOWSTOCK' }, { label: 'Out of Stock', value: 'OUTOFSTOCK' }];
  }

  ngDoCheck() {
    let fundingMonthiversary = [];
    let today = this.formatDate(new Date().toLocaleDateString('en-US'));
    let todayFormat = new Date(today);
    let currentBucketMonths;
    let doa60MonthiversaryDate: Date | string;
    let funding60MonthiversaryBalanceDate: Date;
    let months60PayoffBucket;
    let datesFundingDateParse;
    let datesAccidentParse;
    let doa60MonthiversaryString;
    let doa60MonthiveraryParse;
    let fundingDateParse;
    let fundingDateParse1;
    let funding60MonthiversaryBalance;
    let funding60MonthiversaryBalanceDateString;

    for (let i = 0; i < this.funding.length; i++) {
      console.log("i: ", i)
      this.funding[i].APPLICATION_FEE = Number(this.funding[i].CLIENT_FUNDING! * 0.1);
      this.funding[i].CLOSING_COST = Number(this.funding[i].CLIENT_FUNDING! * 0.1);
      this.funding[i].TOTAL_FUNDED = Number(this.funding[i].CLIENT_FUNDING!) + Number(this.funding[i].APPLICATION_FEE!);
      fundingMonthiversary[i] = this.monthDiff(new Date(this.datesFundingDate[i]), todayFormat);
      currentBucketMonths = this.currentBucket(Number(fundingMonthiversary[i]), Number(this.funding[i].TERM_BUCKET!));
      let exp = this.funding[i].RATE! * 0.01;
      this.funding[i].PAYOFF_DATE = this.funding[i].TOTAL_FUNDED! * Math.pow(1 + exp, Number(currentBucketMonths)) + Number(this.funding[i].CLOSING_COST!);


      if (this.datesFundingDate[i] && currentBucketMonths) {
        datesFundingDateParse = this.datesFundingDate[i].split('-');
        let termDateDate = this.addMonths(new Date(datesFundingDateParse[0], datesFundingDateParse[1], datesFundingDateParse[2]), currentBucketMonths - 1);
        console.log("termDate", termDateDate)
        let termDateString = termDateDate!.toString();
        this.termDate[i] = this.formatDate(termDateString);
        this.funding[i].CURRENT_BUCKET = currentBucketMonths / this.funding[i].TERM_BUCKET!;
        datesAccidentParse = this.datesAccident[i].split('-');
        doa60MonthiversaryDate = this.addMonths(new Date(datesAccidentParse[0], datesAccidentParse[1], datesAccidentParse[2]), this.funding[i].DOA60_MONTH_ANNIVERSARY! - 1);
        doa60MonthiversaryString = this.formatDate(doa60MonthiversaryDate.toString());
        doa60MonthiveraryParse = doa60MonthiversaryString.split('-');
        fundingDateParse = this.formatDate((this.funding[i].FUNDING_DATE!).toString())
        fundingDateParse1 = fundingDateParse.split('-');
        funding60MonthiversaryBalance = this.monthDiff(new Date(Number(fundingDateParse1[0]), Number(fundingDateParse1[1]), Number(fundingDateParse1[2])), new Date(Number(doa60MonthiveraryParse[0]), Number(doa60MonthiveraryParse[1]), Number(doa60MonthiveraryParse[2])));
        funding60MonthiversaryBalanceDate = this.addMonths(new Date(datesFundingDateParse[0], datesFundingDateParse[1], datesFundingDateParse[2]), funding60MonthiversaryBalance - 1);
        funding60MonthiversaryBalanceDateString = this.formatDate(funding60MonthiversaryBalanceDate.toString());
        months60PayoffBucket = this.months60PayoffBucket(funding60MonthiversaryBalanceDate, doa60MonthiversaryDate, funding60MonthiversaryBalance, this.funding[i].TERM_BUCKET!);
        this.funding[i].PAY_OFF_5YEARS = Number(this.funding[i].TOTAL_FUNDED)! * (Math.pow((1 + Number(this.funding[i].RATE!) * 0.01), Number(months60PayoffBucket))) + Number(this.funding[i].CLOSING_COST)!;
        this.funding[i].PAY_OFF_5YEARS = Math.round((this.funding[i].PAY_OFF_5YEARS! + Number.EPSILON) * 100) / 100;
      }
      else {
        this.termDate[i] = "";
      }

      console.log("-------")
    }
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

  getProductsSmall() {
    return this.http.get<any>('assets/products-small.json')
      .toPromise()
      .then(res => <Product[]>res.data)
      .then(data => { return data; });
  }

  formatDate(date: string) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }

  addFunding() {
    this.funding.push({});
  }

  monthDiff(d1: Date, d2: Date) {
    let months;
    console.log()
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    if (d1.getDate() >= d2.getDate()) {
      months -= 1;
    }
    return months <= 0 ? 0 : months;
  }

  addMonths(date: Date, months: number) {
    var d = date.getDate();
    date.setMonth(date.getMonth() + +months);

    if (date.getDate() != d) {
      date.setDate(0);
    }
    return date;
  }

  currentBucket(value1: number, value2: number) {
    if (value1 % value2 === 0) {
      return value1 + value2;
    }
    else {
      return value1 - (value1 % value2) + value2;
    }
  }

  months60PayoffBucket(funding60MonthBalanceDate: Date, doa60MonthDate: Date, funding60MontBDate: number, termBucket: number) {
    if (funding60MonthBalanceDate < doa60MonthDate) {
      return funding60MontBDate + (termBucket - (funding60MontBDate % termBucket))
    }
    else {
      if (funding60MontBDate % termBucket === 0) {
        return funding60MontBDate;
      }

      else {
        return funding60MontBDate + (termBucket - (funding60MontBDate % termBucket))
      }
    }

  }

}




