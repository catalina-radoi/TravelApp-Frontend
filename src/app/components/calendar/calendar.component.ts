import { Component, OnInit, ViewChild } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction';
import { EventInput } from '@fullcalendar/core';

import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import { arrayToUtcDate } from '@fullcalendar/core/datelib/marker';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;

  public calendarOptions: any = {
    properties: {
      calendarPlugins: [dayGridPlugin, interactionPlugin, timeGrigPlugin],
      calendarWeekends: true,
      calendarVisible: true,
      defaultView: 'timeGrid',
      selectable: true,
      firstDay: 1,
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      validRange: {
        start: '2020-02-05',
        end: '2020-02-25'
      }

    },


    events: {
      // handleDateClick: this.handleDateClick,
      // handleSelect: this.handleSelect

    }
  };

  public calendarEvents: EventInput[] = [];

  public someMethod() {
    let calendarApi = this.calendarComponent.getApi();
    calendarApi.next();
  }


  public handleDateClick(arg) {
    if (confirm('Would you like to add an event to ' + arg.dateStr + ' ?')) {
      this.calendarEvents = this.calendarEvents.concat({
        // add new event data. must create new array
        title: 'New Event',
        start: arg.date,
        allDay: arg.allDay,
        color: "rgb("
          + Math.floor(Math.random() * 255) + ","
          + Math.floor(Math.random() * 255) + ","
          + Math.floor(Math.random() * 255) + ")"
      });
    }
  }
  public handleSelect(arg) {
    if (confirm('Would you like to add an event from' + arg.startStr + ' to ' + arg.endStr + ' ?')) {

      // TODO: look at Template Strings:
      // let value: number = 3;
      // let sVar: string = `Test vasriable with value ${value}`;

      this.calendarEvents = this.calendarEvents.concat({
        // add new event data. must create new array
        title: 'New Event Interval',
        start: arg.startStr,
        end: arg.endStr,
        allDay: arg.allDay,
        color: "rgb("
          + Math.floor(Math.random() * 255) + ","
          + Math.floor(Math.random() * 255) + ","
          + Math.floor(Math.random() * 255) + ")",
        startTime: '2020-02-05T10:00:00',
        endTime: '2020-02-10T22:00:00'
      });
    }


  }




  constructor() { }

  ngOnInit(): void { }
}
