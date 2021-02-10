import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AllTripsComponent } from './all-trips.component';
import { ViewDetailsModalComponent } from './view-details-modal/view-details-modal.component';
import { PickLocationModalComponent } from './pick-location-modal/pick-location-modal.component';
import { CalendarModalComponent } from './calendar-modal/calendar-modal.component';
import { OfferModalComponent } from './offer-modal/offer-modal.component';

const routes: Routes = [
  {
    path: '',
    component: AllTripsComponent,
    data: {
      title: 'All Trips'
    },
    children: [
      {
        path: '',
        component: AllTripsComponent,
        data: {
          title: ''
        }

      },
      {
        path: 'pick-location',
        component: PickLocationModalComponent,
        data: {
          title: 'Pick Location'
        }
      },
      {
        path: 'view-details',
        component: ViewDetailsModalComponent,
        data: {
          title: 'View Details'
        }
      },
      {
        path: 'calendar-vote',
        component: CalendarModalComponent,
        data: {
          title: 'Vote Calendar'
        }
      },
      {
        path: 'offer-vote',
        component: OfferModalComponent,
        data: {
          title: 'Vote Offer'
        }
      },
    ]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllTripsRoutingModule { }
