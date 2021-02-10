import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FilterPipeModule } from 'ngx-filter-pipe';


import { AllTripsComponent } from './all-trips.component';
import { ViewDetailsModalComponent } from './view-details-modal/view-details-modal.component';
import { DatePipe } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { AllTripsRoutingModule } from './all-trips-routing,module';
import { PickLocationModalComponent } from './pick-location-modal/pick-location-modal.component';
import { CalendarModalComponent } from './calendar-modal/calendar-modal.component';
import { OfferModalComponent } from './offer-modal/offer-modal.component';
import { MapsModalComponent } from '../new-trip/components/final-offer/maps-modal/maps-modal.component';
import { NewTripModule } from '../new-trip/new-trip.module';


@NgModule({
  declarations: [
    AllTripsComponent,
    ViewDetailsModalComponent,
    PickLocationModalComponent,
    CalendarModalComponent,
    OfferModalComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    ModalModule.forRoot(),
    AllTripsRoutingModule,
    FilterPipeModule,
    FullCalendarModule,
    NewTripModule

  ],
  providers: [DatePipe],
  entryComponents: [MapsModalComponent]
})
export class AllTripsModule { }
