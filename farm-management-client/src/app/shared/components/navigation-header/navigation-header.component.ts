import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-navigation-header',
  templateUrl: './navigation-header.component.html',
  styleUrls: ['./navigation-header.component.scss']
})
export class NavigationHeaderComponent implements OnInit {

  @Output() sideButton: EventEmitter<boolean> = new EventEmitter<boolean>();
  activated: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  navigationButtonClicked = () => {
    this.activated = !this.activated;
    this.sideButton.emit(this.activated);
  }

}
