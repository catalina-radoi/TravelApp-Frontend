import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UserComponent } from './user.component';
import { UserRoutingModule } from './user-routing.module';

import { CalendarComponent } from '../new-trip/components/calendar/calendar.component';




@NgModule({
  declarations: [
    UserComponent,

  ],
  imports: [
    CommonModule,
    FormsModule,
    UserRoutingModule,



  ]
})
export class UserModule { }
