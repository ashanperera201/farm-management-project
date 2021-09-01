import { Component, Input, OnInit } from '@angular/core';
import { SideNavigationComponent } from '../side-navigation/side-navigation.component';

@Component({
  selector: 'app-navigation-content',
  templateUrl: './navigation-content.component.html',
  styleUrls: ['./navigation-content.component.scss']
})
export class NavigationContentComponent implements OnInit {

  @Input() sideNavigation!: SideNavigationComponent;

  constructor() { }

  ngOnInit(): void {
  }

}
