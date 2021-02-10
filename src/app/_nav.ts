import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Menu',
    url: '/dashboard',
    icon: 'icon-home',

  },
  {
    title: true,
    name: 'Personal Info'
  },
  {
    name: 'Groups',
    url: '/groups',
    icon: 'icon-puzzle',
  },

  {
    title: true,
    name: 'Trip Planner'
  },
  {
    name: 'All Trips',
    url: '/all-trips',
    icon: 'icon-puzzle',
  },
  // {
  //   name: 'New Trip',
  //   url: '/new-trip',
  //   icon: 'icon-puzzle',
  // },
  {
    name: 'New Trip',
    url: '/new-trip',
    icon: 'icon-puzzle',
    children: [
      {
        name: 'New Trip',
        url: '/new-trip',
        icon: 'icon-people'
      },

      {
        name: 'Picked Group',
        url: '/new-trip/picked-group',
        icon: 'icon-people'
      },

      {
        name: 'Pick Interval',
        url: '/new-trip/picked-group/pick-interval',
        icon: 'icon-check'
      },
      {
        name: 'Calendar',
        url: '/new-trip/picked-group/pick-interval/calendar',
        icon: 'icon-calendar'
      },
      {
        name: 'Poll Location',
        url: '/new-trip/picked-group/pick-interval/calendar/location',
        icon: 'icon-location-pin'
      },
      {
        name: 'Final Offer',
        url: '/new-trip/picked-group/pick-interval/calendar/location/offer',
        icon: 'icon-check'
      }]
  },



];
