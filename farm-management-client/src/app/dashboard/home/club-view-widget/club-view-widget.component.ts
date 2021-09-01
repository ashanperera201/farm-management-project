import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-club-view-widget',
  templateUrl: './club-view-widget.component.html',
  styleUrls: ['./club-view-widget.component.scss']
})
export class ClubViewWidgetComponent implements OnInit {

  @Input() percentageFeedingList!: any[];

  pageSize: number = 5;
  page: any = 1;

  constructor() { }

  ngOnInit(): void {
  }

}
