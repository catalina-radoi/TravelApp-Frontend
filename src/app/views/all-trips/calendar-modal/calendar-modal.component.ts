import { Component, OnInit, ViewChild } from '@angular/core';
import { Trip } from '../../../@types/Trip';

import { BsModalRef } from 'ngx-bootstrap';
import { Subject } from 'rxjs';
import { FullCalendarComponent } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction';
import { EventInput } from '@fullcalendar/core';
import { Router } from '@angular/router';
import { NgForm, NgModel, FormGroupDirective } from '@angular/forms';

import { DatePipe } from '@angular/common';

import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import { TripService } from '../../../_services/trip.service';
import { UserServiceService } from '../../../_services/user-service.service';
import { Poll } from '../../../@types/Poll';
import { Vote } from '../../../@types/Vote';
import { AlertService } from 'ngx-alerts';
import { Choice } from '../../../@types/Choice';

@Component({
  selector: 'app-calendar-modal',
  templateUrl: './calendar-modal.component.html',
  styleUrls: ['./calendar-modal.component.css']
})
export class CalendarModalComponent implements OnInit {
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;

  public calendarOptions: any = {
    properties: {
      calendarPlugins: [dayGridPlugin, interactionPlugin, timeGrigPlugin],
      calendarWeekends: true,
      calendarVisible: true,
      defaultView: 'dayGridMonth',
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

  public selectedTrip: Trip;
  public onClose: Subject<Trip>;
  polls: any;
  pollUser: Poll;
  choices: any;
  votes: any;
  currentUserId: any;
  personalVote: any;
  startDate: string;
  endDate: string;
  public eventChoice: string;
  currentPollId: any;
  selectedChoice: any;
  pollsRetake: Poll;
  choicesRetake: Choice[];
  votesRetaken: Vote[];
  currentPollRetakeId: any;
  selectedChoiceRetake: any;
  personalVoteRetaken: Vote;




  constructor(
    public bsModalRef: BsModalRef,
    private datePipe: DatePipe,
    private tripService: TripService,
    private userService: UserServiceService,
    private alertService: AlertService,
  ) { }


  ngOnInit(): void {
    this.onClose = new Subject();



    // setare interval valid
    console.log(this.calendarOptions.properties.validRange);
    this.calendarOptions.properties.validRange.start = this.selectedTrip.startInterval;
    this.calendarOptions.properties.validRange.end = this.selectedTrip.endInterval;

    // ia USER CURENT

    this.currentUserId = JSON.parse(sessionStorage.getItem('auth-user')).userId;

    console.log(this.currentUserId);



    // IA POLL

    this.tripService.getPollsForTrip(this.selectedTrip.tripId).subscribe((polls: Poll[]) => {
      if (polls) {
        for (let i = 0; i <= (polls.length - 1); i++) {
          if ((polls[i].status == 'opened') && (polls[i].type == 'calendar')) {
            this.pollUser = polls[i];
            window.sessionStorage.setItem('poll_calendar_opened', JSON.stringify(this.pollUser));
            console.log(this.pollUser);




            this.tripService.getChoices(this.pollUser.id).subscribe(choices => (this.choices = choices));
            console.log(this.choices);

            // ia votes
            this.tripService.getVotesPoll(this.currentPollId).subscribe((votes: Vote[]) => {
              this.votes = votes;
              for (let j = 0; j <= this.votes.length - 1; j++) {

                let splitted = this.votes[j].choice.text.split('/', 3);
                console.log(splitted);
                this.calendarEvents = this.calendarEvents.concat({
                  // add new event data. must create new array
                  title: this.votes[j].user.userName,
                  start: splitted[0],
                  end: this.datePipe.transform(new Date(new Date(splitted[1]).setDate(new Date(splitted[1]).getDate() + 1)), 'yyyy-MM-dd'),
                  // allDay: arg.allDay,
                  color: 'rgb('
                    + Math.floor(Math.random() * 255) + ','
                    + Math.floor(Math.random() * 255) + ','
                    + Math.floor(Math.random() * 255) + ')',
                  startTime: 'T10:00:00',
                  endTime: 'T22:00:00'
                });
              }
            });

            //ia vot personal
            this.tripService.getVoteUserForPoll(this.currentUserId, this.pollUser.id).subscribe((personalVote: Vote) => {
              if (personalVote) {
                this.personalVote = personalVote;
                console.log(this.personalVote.choice.text);
              }
            });
          }
        }
      }
    });
    if (JSON.parse(sessionStorage.getItem('poll_calendar_opened'))) {
      this.currentPollId = JSON.parse(sessionStorage.getItem('poll_calendar_opened')).id;
      console.log(this.currentPollId);
    }



    //IA POLL RETAKEN

    this.tripService.getPollsForTrip(this.selectedTrip.tripId).subscribe((pollsRetake: Poll[]) => {
      if (pollsRetake) {
        for (let i = 0; i <= (pollsRetake.length - 1); i++) {
          if ((pollsRetake[i].status == 'opened') && (pollsRetake[i].type == 'retake-calendar')) {
            this.pollsRetake = pollsRetake[i];
            window.sessionStorage.setItem('poll_opened_calendar_retaken', JSON.stringify(this.pollsRetake));
            console.log(this.pollsRetake);

            // ia choices
            this.tripService.getChoices(this.pollsRetake.id).subscribe((choicesRetake: Choice[]) => {
              this.choicesRetake = choicesRetake;
              console.log(this.choicesRetake);
            });

            //ia votes

            this.tripService.getVotesPoll(this.pollsRetake.id).subscribe((votesRetaken: Vote[]) => {
              this.votesRetaken = votesRetaken;
            });


          }
        }
      }
    });
    if (JSON.parse(sessionStorage.getItem('poll_opened_calendar_retaken'))) {
      this.currentPollRetakeId = JSON.parse(sessionStorage.getItem('poll_opened_calendar_retaken')).id;
      console.log(this.currentPollRetakeId);
    }

    //Ia vot utilizator RETAKEN
    this.tripService.getVoteUserForPoll(this.currentUserId, this.currentPollRetakeId).subscribe((personalVoteRetaken: Vote) => {
      if (personalVoteRetaken) {
        this.personalVoteRetaken = personalVoteRetaken;
        console.log(this.personalVoteRetaken.choice.text);
      }
    });






  }




  public onCancel(): void {
    this.onClose.next();
    this.bsModalRef.hide();
  }




  public handleDateClick(arg) {
    if (confirm('Would you like to add an event to ' + arg.dateStr + ' ?')) {
      this.calendarEvents = this.calendarEvents.concat({
        // add new event data. must create new array
        title: 'New Event',
        start: arg.date,
        allDay: arg.allDay,
        color: 'rgb('
          + Math.floor(Math.random() * 255) + ','
          + Math.floor(Math.random() * 255) + ','
          + Math.floor(Math.random() * 255) + ')'
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
        color: 'rgb('
          + Math.floor(Math.random() * 255) + ','
          + Math.floor(Math.random() * 255) + ','
          + Math.floor(Math.random() * 255) + ')',
        startTime: 'T10:00:00',
        endTime: 'T22:00:00'
      });
    }

    this.startDate = this.datePipe.transform(new Date(new Date(arg.startStr).setDate(new Date(arg.startStr).getDate())), 'yyyy-MM-dd');
    this.endDate = this.datePipe.transform(new Date(new Date(arg.endStr).setDate(new Date(arg.endStr).getDate() - 1)), 'yyyy-MM-dd');
    console.log(this.startDate, this.endDate);
    this.eventChoice = (this.startDate.toString().concat('/')).concat(this.endDate.toString());
    console.log(this.eventChoice);

    // separa intervalul in 2 date
    let splitted = this.eventChoice.split('/', 3);
    console.log(splitted);


    // ADD choice
    this.tripService.createChoice(this.currentPollId, this.eventChoice)
      .subscribe(
        data => {
          this.alertService.success('The choice has been added successfully');
          this.tripService.getChoices(this.currentPollId).subscribe(choices => (this.choices = choices));
        }, (error) => {
          console.log(error);
          this.alertService.danger('The choice failed to be added');
        });


  }

  public someMethod() {
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.next();
  }



  onSelectionChange(choice) {
    this.selectedChoice = Object.assign({}, this.selectedChoice, choice);
    console.log(this.selectedChoice);
  }


  onVote() {
    console.log(this.selectedChoice.id);
    this.tripService.createVote(this.selectedChoice.id, this.currentUserId, this.currentPollId, 'done')
      .subscribe(
        data => {

          // window.sessionStorage.setItem('poll_nou', JSON.stringify(data));
          this.alertService.success('The vote has been added successfully');
        }, (error) => {
          console.log(error);
          this.alertService.danger('The vote failed to be added');
        });

  }

  onSelectionChangeRetake(choice) {
    this.selectedChoiceRetake = Object.assign({}, this.selectedChoiceRetake, choice);
    console.log(this.selectedChoiceRetake);
  }

  onVoteRetake() {


    this.tripService.createVote(this.selectedChoiceRetake.id, this.currentUserId, this.currentPollRetakeId, 'done')
      .subscribe(
        data => {

          // window.sessionStorage.setItem('poll_nou', JSON.stringify(data));
          this.alertService.success('The vote has been added successfully');
        }, (error) => {
          console.log(error);
          this.alertService.danger('The vote failed to be added');
        });

  }


}
