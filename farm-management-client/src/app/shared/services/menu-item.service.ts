import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuItemService {

  constructor() { }

  getMenuItems = () => {
    return [
      {
        id: 1,
        displayName: 'Dashboard',
        route: '/dashboard/home',
        svgIconPath: './assets/media/svg/icons/Design/Layers.svg',
        classes: 'menu-item',
        activeClass: '',
        selected: false,
        isMenuHeading: false,
        isMenuOpened: false,
        subItems: []
      },
      // {
      //   id: 2,
      //   displayName: 'MANAGEMENT LEVEL SECTION',
      //   route: '',
      //   svgIconPath: '',
      //   classes: 'menu-section',
      //   activeClass: '',
      //   selected: false,
      //   isMenuHeading: true,
      //   isMenuOpened: false,
      //   subItems: []
      // },
      {
        id: 2,
        displayName: 'Club Management',
        route: '/dashboard/club-member/view-all',
        svgIconPath: './assets/media/svg/icons/Tools/Angle Grinder.svg',
        classes: 'menu-item',
        activeClass: '',
        selected: false,
        isMenuHeading: false,
        isMenuOpened: false,
        subItems: []
      },
      {
        id: 3,
        displayName: 'Farm Management',
        route: '/dashboard/farm-management/view-farms',
        svgIconPath: './assets/media/svg/icons/Tools/Pantone.svg',
        classes: 'menu-item',
        activeClass: '',
        selected: false,
        isMenuHeading: false,
        isMenuOpened: false,
        subItems: []
      },
      {
        id: 4,
        displayName: 'Pond Management',
        route: '/dashboard/pond-management/view-all',
        svgIconPath: './assets/media/svg/icons/General/Thunder-move.svg',
        classes: 'menu-item',
        activeClass: '',
        selected: false,
        isMenuHeading: false,
        isMenuOpened: false,
        subItems: []
      },
      {
        id: 5,
        displayName: 'Application Management',
        route: '/dashboard/applications/view-all',
        svgIconPath: './assets/media/svg/icons/General/Expand-arrows.svg',
        classes: 'menu-item',
        activeClass: '',
        selected: false,
        isMenuHeading: false,
        isMenuOpened: false,
        subItems: []
      },
      {
        id: 6,
        displayName: 'Feedbrands Management',
        route: '/dashboard/feed-brand/view-all',
        svgIconPath: './assets/media/svg/icons/Devices/Display3.svg',
        classes: 'menu-item',
        activeClass: '',
        selected: false,
        isMenuHeading: false,
        isMenuOpened: false,
        subItems: []
      },
      {
        id: 7,
        displayName: 'Stock Management',
        route: '/dashboard/stock-management/view-all',
        svgIconPath: './assets/media/svg/icons/Devices/Homepod.svg',
        classes: 'menu-item',
        activeClass: '',
        selected: false,
        isMenuHeading: false,
        isMenuOpened: false,
        subItems: []
      },
      {
        id: 8,
        displayName: 'Weekly Sampling',
        route: '/dashboard/weekly-sampling/view-all',
        svgIconPath: './assets/media/svg/icons/Devices/SD-card.svg',
        classes: 'menu-item',
        activeClass: '',
        selected: false,
        isMenuHeading: false,
        isMenuOpened: false,
        subItems: []
      },
      {
        id: 9,
        displayName: 'Feed Chart',
        route: '/dashboard/feed-chart/view-all',
        svgIconPath: './assets/media/svg/icons/Communication/Dial-numbers.svg',
        classes: 'menu-item',
        activeClass: '',
        selected: false,
        isMenuHeading: false,
        isMenuOpened: false,
        subItems: []
      },
      {
        id: 10,
        displayName: 'Percentage of feeding',
        route: '/dashboard/percentage-feeding/view-all',
        svgIconPath: './assets/media/svg/icons/Electric/Outlet.svg',
        classes: 'menu-item',
        activeClass: '',
        selected: false,
        isMenuHeading: false,
        isMenuOpened: false,
        subItems: []
      },
      {
        id: 11,
        displayName: 'Daily Feed',
        route: '/dashboard/daily-feed/view-all',
        svgIconPath: './assets/media/svg/icons/Layout/Layout-arrange.svg',
        classes: 'menu-item',
        activeClass: '',
        selected: false,
        isMenuHeading: false,
        isMenuOpened: false,
        subItems: []
      },
      {
        id: 12,
        displayName: 'Harvest Management',
        route: '/dashboard/harvest-management',
        svgIconPath: './assets/media/svg/icons/Layout/Layout-4-blocks.svg',
        classes: 'menu-item',
        activeClass: '',
        selected: false,
        isMenuHeading: false,
        isMenuOpened: false,
        subItems: []
      },
      {
        id: 13,
        displayName: 'Weekly Application',
        route: '/dashboard/weekly-application',
        svgIconPath: './assets/media/svg/icons/Code/Time-schedule.svg',
        classes: 'menu-item',
        activeClass: '',
        selected: false,
        isMenuHeading: false,
        isMenuOpened: false,
        subItems: []
      },
      {
        id: 14,
        displayName: 'Sales Price',
        route: '/dashboard/sales-price/view-all',
        svgIconPath: './assets/media/svg/icons/Shopping/Price2.svg',
        classes: 'menu-item',
        activeClass: '',
        selected: false,
        isMenuHeading: false,
        isMenuOpened: false,
        subItems: []
      },
      {
        id: 15,
        displayName: 'Weekly Performance',
        route: '/dashboard/weekly-performance',
        svgIconPath: './assets/media/svg/icons/Shopping/Money.svg',
        classes: 'menu-item',
        activeClass: '',
        selected: false,
        isMenuHeading: false,
        isMenuOpened: false,
        subItems: []
      },
      {
        id: 16,
        displayName: 'Reporting Management',
        route: '#',
        svgIconPath: './assets/media/svg/icons/Shopping/Chart-bar1.svg',
        classes: 'menu-item',
        activeClass: '',
        selected: false,
        isMenuHeading: false,
        isMenuOpened: false,
        subItems: [
          {
            id: 1,
            displayName: 'Application',
            route: '/dashboard/report-management/application-detail',
            svgIconPath: '',
            classes: 'menu-item',
            activeClass: '',
            selected: false,
            isMenuHeading: false,
            isMenuOpened: false,
            subItems: []
          },
          {
            id: 2,
            displayName: 'AWB Detail',
            route: '/dashboard/report-management/awb-detail',
            svgIconPath: '',
            classes: 'menu-item',
            activeClass: '',
            selected: false,
            isMenuHeading: false,
            isMenuOpened: false,
            subItems: []
          },
          {
            id: 3,
            displayName: 'Club Member',
            route: '/dashboard/report-management/club-member',
            svgIconPath: '',
            classes: 'menu-item',
            activeClass: '',
            selected: false,
            isMenuHeading: false,
            isMenuOpened: false,
            subItems: []
          },
          {
            id: 4,
            displayName: 'Farm Detail',
            route: '/dashboard/report-management/farm-detail',
            svgIconPath: '',
            classes: 'menu-item',
            activeClass: '',
            selected: false,
            isMenuHeading: false,
            isMenuOpened: false,
            subItems: []
          },
          {
            id: 5,
            displayName: 'Harvest Detail',
            route: '/dashboard/report-management/harvest-detail',
            svgIconPath: '',
            classes: 'menu-item',
            activeClass: '',
            selected: false,
            isMenuHeading: false,
            isMenuOpened: false,
            subItems: []
          },
          {
            id: 6,
            displayName: 'Percentage Feeding',
            route: '/dashboard/report-management/percentage-feeding',
            svgIconPath: '',
            classes: 'menu-item',
            activeClass: '',
            selected: false,
            isMenuHeading: false,
            isMenuOpened: false,
            subItems: []
          },
          {
            id: 7,
            displayName: 'Pond Brand Detail',
            route: '/dashboard/report-management/pond-brand-detail',
            svgIconPath: '',
            classes: 'menu-item',
            activeClass: '',
            selected: false,
            isMenuHeading: false,
            isMenuOpened: false,
            subItems: []
          },
          {
            id: 8,
            displayName: 'Pond Detail',
            route: '/dashboard/report-management/pond-detail',
            svgIconPath: '',
            classes: 'menu-item',
            activeClass: '',
            selected: false,
            isMenuHeading: false,
            isMenuOpened: false,
            subItems: []
          },
          {
            id: 9,
            displayName: 'Sales Detail',
            route: '/dashboard/report-management/sales',
            svgIconPath: '',
            classes: 'menu-item',
            activeClass: '',
            selected: false,
            isMenuHeading: false,
            isMenuOpened: false,
            subItems: []
          },
          {
            id: 10,
            displayName: 'Weekly Application',
            route: '/dashboard/report-management/weekly-application',
            svgIconPath: '',
            classes: 'menu-item',
            activeClass: '',
            selected: false,
            isMenuHeading: false,
            isMenuOpened: false,
            subItems: []
          },
          {
            id: 11,
            displayName: 'Weekly Sample',
            route: '/dashboard/report-management/weekly-sample',
            svgIconPath: '',
            classes: 'menu-item',
            activeClass: '',
            selected: false,
            isMenuHeading: false,
            isMenuOpened: false,
            subItems: []
          },
        ]
      },
      {
        id: 16,
        displayName: 'User Management',
        route: '#',
        svgIconPath: './assets/media/svg/icons/General/User.svg',
        classes: 'menu-item',
        activeClass: '',
        selected: false,
        isMenuHeading: false,
        isMenuOpened: false,
        subItems: [
          {
            id: 1,
            displayName: 'User List',
            route: '/dashboard/user-management/view-users',
            svgIconPath: '',
            classes: 'menu-item',
            activeClass: '',
            selected: false,
            isMenuHeading: false,
            isMenuOpened: false,
            subItems: []
          },
          {
            id: 2,
            displayName: 'User Roles',
            route: '/dashboard/user-management/view-roles',
            svgIconPath: '',
            classes: 'menu-item',
            activeClass: '',
            selected: false,
            isMenuHeading: false,
            isMenuOpened: false,
            subItems: []
          },
          {
            id: 3,
            displayName: 'User Permission',
            route: '/dashboard/user-management/view-permissions',
            svgIconPath: '',
            classes: 'menu-item',
            activeClass: '',
            selected: false,
            isMenuHeading: false,
            isMenuOpened: false,
            subItems: []
          }
        ]
      }
    ]
  }
}
