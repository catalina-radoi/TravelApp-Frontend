import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AllTripsComponent } from './all-trips.component';
import { ViewDetailsModalComponent } from './view-details-modal/view-details-modal.component';

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
        path: 'view-details',
        component: ViewDetailsModalComponent,
        data: {
          title: 'View Details'
        }
      },
    ]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes),
  RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AllTripsRoutingModule { }
