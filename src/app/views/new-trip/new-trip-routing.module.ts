import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PickedGroupComponent } from '././components/picked-group/picked-group.component';
import { PickIntervalComponent } from '././components/pick-interval/pick-interval.component';
import { CalendarComponent } from '././components/calendar/calendar.component';
import { PollLocationComponent } from '././components/poll-location/poll-location.component';
import { FinalOfferComponent } from '././components/final-offer/final-offer.component';
import { NewTripComponent } from './new-trip.component';
import { MapsModalComponent } from './components/final-offer/maps-modal/maps-modal.component';
// view new-group


// view picked-group


const routes: Routes = [
  {
    path: '',

    data: {
      title: 'New Trip'
    },


    children: [
      {
        path: '',
        component: NewTripComponent,
        data: {
          title: ''
        }
      },
      {
        path: 'picked-group',

        data: {
          title: 'Picked Group'
        }
        ,
        children: [
          {
            path: '',
            component: PickedGroupComponent,
            data: {
              title: 'Picked Group'
            }

          },
          {
            path: 'pick-interval',

            data: {
              title: ' Pick Interval'
            },
            children: [
              {
                path: '',
                component: PickIntervalComponent,
                data: {
                  title: ' Pick Interval'
                },
              },
              {
                path: 'calendar',

                data: {
                  title: 'Calendar'
                },
                children: [
                  {
                    path: '',
                    component: CalendarComponent,
                    data: {
                      title: 'Calendar'
                    },
                  },
                  {
                    path: 'location',

                    data: {
                      title: 'Poll Location'
                    },
                    children: [
                      {

                        path: '',
                        component: PollLocationComponent,
                        data: {
                          title: 'Poll Location'
                        },
                      },


                      {
                        path: 'offer',
                        component: FinalOfferComponent,
                        data: {
                          title: 'Final Offer'
                        },
                        children: [
                          {
                            path: 'view-maps',
                            component: MapsModalComponent,
                            data: {
                              title: 'Maps view'
                            }
                          },
                        ]


                      },

                    ]
                  }

                ]
              },

            ]
          },

        ]
      },
      // {
      //   path: 'new-group',

      //   data: {
      //     title: 'New Group'
      //   }
      //   ,
      //   children: [
      //     {
      //       path: '',
      //       component: NewGroupViewComponent,
      //       data: {
      //         title: 'New Group'
      //       }

      //     },
      //     {
      //       path: 'pick-interval-2',

      //       data: {
      //         title: ' Pick Interval'
      //       },
      //       children: [
      //         {
      //           path: '',
      //           component: PickIntervalNewGroupViewComponent,
      //           data: {
      //             title: ' Pick Interval'
      //           },
      //         },
      //         {
      //           path: 'calendar-2',

      //           data: {
      //             title: 'Calendar'
      //           },
      //           children: [
      //             {
      //               path: '',
      //               component: CalendarNewGroupViewComponent,
      //               data: {
      //                 title: 'Calendar'
      //               },
      //             },
      //             {
      //               path: 'location-2',

      //               data: {
      //                 title: 'Poll Location'
      //               },
      //               children: [
      //                 {

      //                   path: '',
      //                   component: LocationNewGroupViewComponent,
      //                   data: {
      //                     title: 'Poll Location'
      //                   },
      //                 },


      //                 {
      //                   path: 'offer-2',

      //                   data: {
      //                     title: 'Final Offer'
      //                   },
      //                   children: [
      //                     {

      //                       path: '',
      //                       component: OfferNewGroupViewComponent,
      //                       data: {
      //                         title: 'Final Offer'
      //                       },
      //                     },]


      //                 },

      //               ]
      //             }

      //           ]
      //         },

      //       ]
      //     },

      //   ]
      // }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewTripRoutingModule { }
