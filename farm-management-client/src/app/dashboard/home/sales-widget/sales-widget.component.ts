import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-sales-widget',
  templateUrl: './sales-widget.component.html',
  styleUrls: ['./sales-widget.component.scss']
})
export class SalesWidgetComponent implements OnInit {

  @Input() salesPriceList!: any[];
  
  pageSize: number = 4;
  page: any = 1;

  constructor() { }

  ngOnInit(): void {
  }

}
