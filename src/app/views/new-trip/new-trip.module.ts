import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewTripRoutingModule } from './new-trip-routing.module';
import { FullCalendarModule } from '@fullcalendar/angular';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FilterPipeModule } from 'ngx-filter-pipe';
// components
import { PickedGroupComponent } from '././components/picked-group/picked-group.component';

import { PickIntervalComponent } from '././components/pick-interval/pick-interval.component';
import { CalendarComponent } from '././components/calendar/calendar.component';
import { PollLocationComponent } from '././components/poll-location/poll-location.component';
import { FinalOfferComponent } from '././components/final-offer/final-offer.component';
import { NewTripComponent } from './new-trip.component';



import { NewEditGroupModalComponent } from '../new-trip/components/picked-group/new-edit-group-modal/new-edit-group-modal.component';
import { DetailsComponent } from './../new-trip/components/picked-group/details/details.component';
import { DatePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
// view new-group

// view picked-group
import { AgmCoreModule } from '@agm/core';
import { MapsModalComponent } from './components/final-offer/maps-modal/maps-modal.component';



@NgModule({
  declarations: [
    PickedGroupComponent,
    NewEditGroupModalComponent,
    PickIntervalComponent,
    CalendarComponent,
    PollLocationComponent,
    FinalOfferComponent,
    NewTripComponent,
    DetailsComponent,
    MapsModalComponent,

  ],
  imports: [
    ReactiveFormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyD8TEgM0eB9YMeIM4O9GvEc-65t-PMB7dw',
      libraries: ['places', 'restaurants'],

    }),
    CommonModule,
    NewTripRoutingModule,
    FullCalendarModule,
    FormsModule,
    ModalModule.forRoot(),
    FilterPipeModule
  ],
  entryComponents: [
    NewEditGroupModalComponent,
    DetailsComponent,
    MapsModalComponent,
  ],
  providers: [DatePipe]
})
export class NewTripModule { }
