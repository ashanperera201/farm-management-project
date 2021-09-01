import { Component, OnInit, Input, Output } from '@angular/core';
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent, PerfectScrollbarDirective } from 'ngx-perfect-scrollbar';
import { NavigationModes } from '../../enums/navigation.enum';

@Component({
  selector: 'app-side-navigation',
  templateUrl: './side-navigation.component.html',
  styleUrls: ['./side-navigation.component.scss']
})
export class SideNavigationComponent implements OnInit {

  @Input() mode: string = NavigationModes.side;
  @Input() open: boolean = false;

  config: PerfectScrollbarConfigInterface = {};

  show!: boolean;

  constructor() { }

  ngOnInit(): void {
    this.show = this.open;
  }

  toggle = () => {
    if (this.mode === NavigationModes.over && this.show) {
      this.show = !this.show;
    } else {
      this.show = !this.show;
    }
  }
}
