import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction';
import { EventInput } from '@fullcalendar/core';
import { Router } from '@angular/router';
import { NgForm, NgModel, FormGroupDirective } from '@angular/forms';

import { DatePipe } from '@angular/common';

import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import { arrayToUtcDate } from '@fullcalendar/core/datelib/marker';
import { PickIntervalComponent } from '../pick-interval/pick-interval.component';

import { PickIntervalService } from '../pick-interval/pick-interval.service';
import { TripService } from '../../../../_services/trip.service';
import { UserServiceService } from '../../../../_services/user-service.service';
import { AlertService } from 'ngx-alerts';
import { Poll } from '../../../../@types/Poll';
import { Choice } from '../../../../@types/Choice';
import { Vote } from '../../../../@types/Vote';
import { Group } from '../../../../@types/Group';
import { Trip } from '../../../../@types/Trip';
import { concat } from 'rxjs/operators';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;


  public href: string = '';
  public nextUrl: string = '/new-trip/picked-group/pick-interval/calendar/location';
  public nextUrl2: string = '/new-trip/new-group/pick-interval-2/calendar-2/location-2';
  public startDate: string;
  public endDate: string;
  public eventChoice: string;
  public pollsAdmin: Poll;
  public currentUserId: number;
  public currentUser: String;
  public currentPollId: number;
  public currentPollRetakeId: number;
  public currentPoll: Poll;
  public poll: Poll;
  public choices: Choice[];
  public choicesRetake: Choice[];
  public votes: Vote[];
  public currentTripId: number;
  public currentTripGroup: Group;
  public currentTripGroupId: number;
  public tripsAdmin: Trip;
  public winner: String;

  public pollCurent: string;
  public afisareChoicesPollNull: any;
  public currentTrip: Trip;
  public selectedChoice: Choice;
  public startDay: any;
  public startDay1: any;
  public startDay2: any;
  public startDay3: any;
  public endDay: any;
  public endDay1: any;
  public endDay2: any;
  public endDay3: any;
  public selectedChoice1: any;
  public retakeMessage: string;
  public pollsRetake: Poll;
  public winner2: any;
  public personalVote: Vote;

  // e admin poll daca a creat trip sau ia trip unde e admin si e opened
  public user1: string;


  @Input() startInterval: any;




  @ViewChild('pollForm', { static: false })
  pollForm: FormGroupDirective;


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
  public retaken2: string;
  selectedChoiceRetake: any;
  currentPollRetake2Id: any;
  votesRetaken: Vote[];
  personalVoteRetaken: Vote;


  constructor(private router: Router,
    private data: PickIntervalService,
    private datePipe: DatePipe,
    private tripService: TripService,
    private userService: UserServiceService,
    private alertService: AlertService,

  ) { }

  public someMethod() {
    const calendarApi = this.calendarComponent.getApi();
    calendarApi.next();
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




  ngOnInit() {




    this.href = this.router.url;
    this.data.currentMessage.subscribe(startInterval => this.startInterval = startInterval);


    // IA USER CURENT
    this.currentUser = sessionStorage.getItem('auth-user');
    console.log(this.currentUser);
    this.currentUserId = JSON.parse(sessionStorage.getItem('auth-user')).userId;



    // ia trip OPENED

    this.tripService.getTripsWhereAdmin(this.currentUserId).subscribe((tripsAdmin: Trip[]) => {
      for (let i = 0; i <= (tripsAdmin.length - 1); i++) {
        if (tripsAdmin[i].status == 'opened') {
          if (tripsAdmin != null) {

            // admin poll
            this.user1 = 'admin-poll';
            console.log(this.user1);
          }
          this.tripsAdmin = tripsAdmin[i];
          console.log(this.tripsAdmin);
          window.sessionStorage.setItem('trip_opened', JSON.stringify(this.tripsAdmin));
        }
      }
    });
    // ia trip curent

    // if (JSON.parse(sessionStorage.getItem('created_trip'))) {
    //   this.currentTrip = JSON.parse(sessionStorage.getItem('created_trip'));
    //   this.currentTripId = JSON.parse(sessionStorage.getItem('created_trip')).tripId;
    //   console.log(this.currentTrip);

    //   // admin poll
    //   this.user1 = 'admin-poll';



    //   // ia grup trip curent

    //   this.tripService.getGroupTrip(this.currentTripId).subscribe((group: Group) => {
    //     this.currentTripGroup = group;
    //     this.currentTripGroupId = this.currentTripGroup.groupId;
    //     console.log(this.currentTripGroup);
    //   });

    // } else
    if (JSON.parse(sessionStorage.getItem('trip_opened'))) {
      this.currentTrip = JSON.parse(sessionStorage.getItem('trip_opened'));
      this.currentTripId = JSON.parse(sessionStorage.getItem('trip_opened')).tripId;
      console.log(this.currentTrip);

      // ia grup trip curent

      this.tripService.getGroupTrip(this.currentTripId).subscribe((group: Group) => {
        this.currentTripGroup = group;
        this.currentTripGroupId = this.currentTripGroup.groupId;
        console.log(this.currentTripGroup);
      });
    }


    // setare interval valid
    console.log(this.calendarOptions.properties.validRange);
    this.calendarOptions.properties.validRange.start = this.currentTrip.startInterval;
    this.calendarOptions.properties.validRange.end = this.currentTrip.endInterval;
    // IA POLL PENTRU TRIP

    this.tripService.getPollsForTrip(this.currentTripId).subscribe((pollsAdmin: Poll[]) => {

      for (let i = 0; i <= (pollsAdmin.length - 1); i++) {
        if ((pollsAdmin[i].status == 'opened') && (pollsAdmin[i].type == 'calendar')) {
          this.pollsAdmin = pollsAdmin[i];
          window.sessionStorage.setItem('poll_opened_calendar', JSON.stringify(this.pollsAdmin));
          console.log(this.pollsAdmin);
        }
        // } else {
        //   // this.pollCurent = 'nu';
        //   window.sessionStorage.setItem('poll_opened_calendar', JSON.stringify(null));
        // }
      }
    });











    // IA POLL-urile
    // DACA E OPENED
    // DACA IL IAU DIN SESSION STORAGE
    if (JSON.parse(sessionStorage.getItem('poll_nou_calendar'))) {
      this.currentPollId = JSON.parse(sessionStorage.getItem('poll_nou_calendar')).id;
      console.log(this.currentPollId);
      // VERIFICAM DACA POLL CREAT RECENT MAI ESTE OPENED

      this.tripService.getPoll(this.currentPollId).subscribe((poll: Poll) => {
        this.currentPoll = poll;

        console.log(poll);

        // this.currentPoll = JSON.parse(sessionStorage.getItem('poll_nou'));
        console.log(this.currentPoll);
        if (this.currentPoll.status == 'opened') {


          // ia choices poll
          this.tripService.getChoices(this.currentPoll.id).subscribe((choices: Choice[]) => {
            this.choices = choices;
            console.log(this.choices);
          });

          // ia votes
          this.tripService.getVotesPoll(this.currentPoll.id).subscribe((votes: Vote[]) => {
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


          this.afisareChoicesPollNull = 'da';
        } else if (this.currentPoll.status == 'closed') {
          this.afisareChoicesPollNull = 'nu';
        }
      });
      // IA POLL CARE E OPENED
    } else if (JSON.parse(sessionStorage.getItem('poll_opened_calendar')) &&
      JSON.parse(sessionStorage.getItem('poll_opened_calendar')) != null) {

      this.currentPollId = JSON.parse(sessionStorage.getItem('poll_opened_calendar')).id;
      console.log(this.currentPollId);

      // ia choices poll
      this.tripService.getChoices(this.currentPollId).subscribe((choices: Choice[]) => {
        this.choices = choices;
        console.log(this.choices);

      });

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
      console.log(this.votes);
      this.pollCurent = 'opened';

    } else {
      this.afisareChoicesPollNull = 'nu2';
    }


    console.log(this.afisareChoicesPollNull);




    // IA VOTUL UTILIZATORULUI
    this.tripService.getVoteUserForPoll(this.currentUserId, this.currentPollId).subscribe((personalVote: Vote) => {
      if (personalVote) {
        this.personalVote = personalVote;
        console.log(this.personalVote.choice.text);
      }
    });
    //IA POLL RETAKEN

    this.tripService.getPollsForTrip(this.currentTripId).subscribe((pollsRetake: Poll[]) => {
      if (pollsRetake) {
        for (let i = 0; i <= (pollsRetake.length - 1); i++) {
          if ((pollsRetake[i].status == 'opened') && (pollsRetake[i].type == 'retake-calendar')) {
            this.retaken2 = 'da';
            this.pollsRetake = pollsRetake[i];
            window.sessionStorage.setItem('poll_opened_retaken_calendar', JSON.stringify(this.pollsRetake));

            console.log(this.pollsRetake);

            console.log(this.retaken2);

            // ia choices
            this.tripService.getChoices(this.pollsRetake.id).subscribe((choicesRetake: Choice[]) => {
              this.choicesRetake = choicesRetake;
              console.log(this.choicesRetake);
            });

            //ia votes

            this.tripService.getVotesPoll(this.pollsRetake.id).subscribe((votesRetaken: Vote[]) => {
              this.votesRetaken = votesRetaken;
            });


          } else if ((pollsRetake[i].status != 'opened') && (pollsRetake[i].type == 'retake-calendar')) {
            this.retaken2 = 'nu';
            console.log(this.retaken2);
          }
        }
      }
    });
    console.log(this.retaken2);
    if (JSON.parse(sessionStorage.getItem('poll_opened_retaken_calendar'))) {
      this.currentPollRetake2Id = JSON.parse(sessionStorage.getItem('poll_opened_retaken_calendar')).id;
      console.log(this.currentPollRetake2Id);
    }




    if (this.choices) {

      for (let j = 0; j <= this.choices.length - 1; j++) {

        let splitted = this.choices[j].text.split('/', 3);
        console.log(splitted);
        this.calendarEvents = this.calendarEvents.concat({
          // add new event data. must create new array
          title: 'New Event Interval',
          start: splitted[0] + 1,
          end: splitted[1] + 1,
          // allDay: arg.allDay,
          color: 'rgb('
            + Math.floor(Math.random() * 255) + ','
            + Math.floor(Math.random() * 255) + ','
            + Math.floor(Math.random() * 255) + ')',
          startTime: 'T10:00:00',
          endTime: 'T22:00:00'
        });
        // if (this.votes[j].choice.text == this.choices[j].text) {

        // }

      }
    }


    //Ia vot utilizator RETAKEN

    this.tripService.getVoteUserForPoll(this.currentUserId, this.currentPollRetake2Id).subscribe((personalVoteRetaken: Vote) => {
      if (personalVoteRetaken) {
        this.personalVoteRetaken = personalVoteRetaken;
        console.log(this.personalVoteRetaken.choice.text);
      }
    });













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
          this.tripService.getVotesPoll(this.currentPollId).subscribe(votes => (this.votes = votes));
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

    this.currentPollRetake2Id = JSON.parse(sessionStorage.getItem('poll_opened_retaken_calendar')).id;
    console.log(this.currentPollRetake2Id);
    this.tripService.createVote(this.selectedChoiceRetake.id, this.currentUserId, this.currentPollRetake2Id, 'done')
      .subscribe(
        data => {
          this.tripService.getVotesPoll(this.currentPollRetake2Id).subscribe(votes2 => (this.votesRetaken = votes2));
          // window.sessionStorage.setItem('poll_nou', JSON.stringify(data));
          this.alertService.success('The vote has been added successfully');
        }, (error) => {
          console.log(error);
          this.alertService.danger('The vote failed to be added');
        });

  }

  findWinner() {

    // array cu de cate ori apara o data in array
    const count = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let max: number;
    let poz: number;
    let winner: string;
    let arr_dates: string[] = new Array(100);
    let arr_dates_unice: string[] = new Array(100);
    let j: number;
    j = 0;
    // numara cati castigatori sunt
    let counter: number;
    counter = 0;

    let winner_arr: string[] = new Array(10);

    let minDays: number;
    minDays = 4;

    // ia toate voturile si imparte intervalul in doua date individuale
    // calculeaza diferenta dintre datele dintr-un interval
    // adauga in vector nou fiecare zilele dint tot intervalul (adica si cele intre start si end date)
    for (let i = 0; i <= this.votes.length - 1; i++) {

      let splitted = this.votes[i].choice.text.split('/', 3);
      let diff = Math.floor(new Date(splitted[0]).getTime() -
        new Date(this.datePipe.transform(new Date(new Date(splitted[1]).setDate(new Date(splitted[1]).getDate() + 1)), 'yyyy-MM-dd')).getTime());
      let day = 1000 * 60 * 60 * 24;

      let days = -Math.floor(diff / day);
      console.log(days);


      for (let k = 0; k <= days - 1; k++) {
        if (splitted[1] != this.datePipe.transform(new Date(new Date(splitted[0]).setDate(new Date(splitted[0]).getDate() + k)), 'yyyy-MM-dd')) {
          arr_dates[j + k] = this.datePipe.transform(new Date(new Date(splitted[0]).setDate(new Date(splitted[0]).getDate() + k)), 'yyyy-MM-dd')
        }

      }
      arr_dates[j + days - 1] = splitted[1];

      splitted = null;


      j = j + days;

    }


    // Acesta este ARRAY cu toate datele votate
    console.log(arr_dates);

    // Face array cu datele distincte din array cu toate datele
    let k = 0;
    this.winner = arr_dates[0];

    for (let j = 0; j <= arr_dates.length - 1; j++) {
      let i = -1;
      for (i = -1; i < j; i++) {

        if (arr_dates[j] == arr_dates[i]) {
          break;
        }
      }
      if (j == i) {
        arr_dates_unice[k] = arr_dates[i];
        k++;
      }
    }


    console.log(arr_dates_unice);

    // calculeaza de cate ori apare o data si pune numarul de aparitii in count[]
    this.winner = arr_dates_unice[0];
    for (let j = 0; j <= arr_dates_unice.length - 1; j++) {
      for (let i = 0; i <= arr_dates.length - 1; i++) {

        if (arr_dates[i] == arr_dates_unice[j] && arr_dates[i] != null) {
          count[j]++;
        }
      }
    }

    console.log(count);



    // gaseste maximul de aparitii
    max = count[0];
    for (let j = 0; j <= arr_dates_unice.length - 1; j++) {
      if (max < count[j]) {
        max = count[j];
      }
      poz = j;
    }

    console.log(max);

    // counter= cate maximuri exista in aparitii
    counter = 0;
    for (let i = 0; i <= count.length - 1; i++) {
      if (count[i] == max) {
        console.log(arr_dates_unice[i]);
        counter++;

      }

    }
    // daca e doar un max, il arata
    if (counter == 1) {
      for (let i = 0; i <= count.length - 1; i++) {
        if (count[i] == max) {
          winner = arr_dates_unice[i];
        }
      }
    }
    // winner = this.choices[poz].text;
    console.log(winner);

    // iau pe cazuri daca iese o singura zi castigatoare sau mai multe

    // daca e un castigator iau interval in jurul datei care sa aiba lungime minDays
    if (counter == 1) {
      this.startDay = this.datePipe.transform(new Date(new Date(winner).setDate(new Date(winner).getDate() - (minDays / 2) + 1)), 'yyyy-MM-dd');
      this.endDay = this.datePipe.transform(new Date(new Date(this.startDay).setDate(new Date(this.startDay).getDate() + minDays - 1)), 'yyyy-MM-dd');
      console.log(this.startDay, this.endDay);
    }

    // daca sunt mai mult de 2 castig, atunci salvez in arie de date castig
    let p = 0;
    if (counter >= 2) {
      for (let i = 0; i <= count.length - 1; i++) {
        if (count[i] == max) {
          winner_arr[p] = arr_dates_unice[i];
          p++;
        }
      }
    }
    console.log(winner_arr);
    // daca avem 2 castigatoare ale datei

    if (counter == 2) {


      // se verifica daca intre ele este mai mic decat minim days
      // daca e mai mic se ia intrervalul dintre ele + interval in jur data 1 +interval in jur data 2
      if ((new Date(winner_arr[0]).getDate() - new Date(winner_arr[1]).getDate() <= minDays) || (new Date(winner_arr[1]).getDate() - new Date(winner_arr[0]).getDate() <= minDays)) {
        if (new Date(winner_arr[0]).getDate() < new Date(winner_arr[1]).getDate()) {
          this.startDay = this.datePipe.transform(new Date(new Date(winner_arr[0]).setDate(new Date(winner_arr[0]).getDate())), 'yyyy-MM-dd');
          this.endDay = this.datePipe.transform(new Date(new Date(this.startDay).setDate(new Date(this.startDay).getDate() + minDays - 1)), 'yyyy-MM-dd');
          console.log(this.startDay, this.endDay);

          this.startDay1 = this.datePipe.transform(new Date(new Date(winner_arr[0]).setDate(new Date(winner_arr[0]).getDate() - (minDays / 2) + 1)), 'yyyy-MM-dd');
          this.endDay1 = this.datePipe.transform(new Date(new Date(this.startDay1).setDate(new Date(this.startDay1).getDate() + minDays - 1)), 'yyyy-MM-dd');
          console.log(this.startDay1, this.endDay1);

          this.startDay2 = this.datePipe.transform(new Date(new Date(winner_arr[1]).setDate(new Date(winner_arr[1]).getDate() - (minDays / 2) + 1)), 'yyyy-MM-dd');
          const endDay2 = this.datePipe.transform(new Date(new Date(this.startDay2).setDate(new Date(this.startDay2).getDate() + minDays - 1)), 'yyyy-MM-dd');
          console.log(this.startDay2, this.endDay2);
        } else {
          this.startDay = this.datePipe.transform(new Date(new Date(winner_arr[1]).setDate(new Date(winner_arr[1]).getDate())), 'yyyy-MM-dd');
          this.endDay = this.datePipe.transform(new Date(new Date(this.startDay).setDate(new Date(this.startDay).getDate() + minDays - 1)), 'yyyy-MM-dd');
          console.log(this.startDay, this.endDay);

          this.startDay1 = this.datePipe.transform(new Date(new Date(winner_arr[0]).setDate(new Date(winner_arr[0]).getDate() - (minDays / 2) + 1)), 'yyyy-MM-dd');
          this.endDay1 = this.datePipe.transform(new Date(new Date(this.startDay1).setDate(new Date(this.startDay1).getDate() + minDays - 1)), 'yyyy-MM-dd');
          console.log(this.startDay1, this.endDay1);

          this.startDay2 = this.datePipe.transform(new Date(new Date(winner_arr[1]).setDate(new Date(winner_arr[1]).getDate() - (minDays / 2) + 1)), 'yyyy-MM-dd');
          this.endDay2 = this.datePipe.transform(new Date(new Date(this.startDay2).setDate(new Date(this.startDay2).getDate() + minDays - 1)), 'yyyy-MM-dd');
          console.log(this.startDay2, this.endDay2);

        }

      } else {
        this.startDay1 = this.datePipe.transform(new Date(new Date(winner_arr[0]).setDate(new Date(winner_arr[0]).getDate() - (minDays / 2) + 1)), 'yyyy-MM-dd');
        this.endDay1 = this.datePipe.transform(new Date(new Date(this.startDay1).setDate(new Date(this.startDay1).getDate() + minDays - 1)), 'yyyy-MM-dd');
        console.log(this.startDay1, this.endDay1);

        this.startDay2 = this.datePipe.transform(new Date(new Date(winner_arr[1]).setDate(new Date(winner_arr[1]).getDate() - (minDays / 2) + 1)), 'yyyy-MM-dd');
        this.endDay2 = this.datePipe.transform(new Date(new Date(this.startDay2).setDate(new Date(this.startDay2).getDate() + minDays - 1)), 'yyyy-MM-dd');
        console.log(this.startDay2, this.endDay2);
      }

    }


    // daca sunt 3 zile

    var aux: any;
    if (counter == 3) {

      //ordonare crescator vector castig
      for (let i = 0; i <= winner_arr.length - 2; i++) {
        for (let j = i + 1; j <= winner_arr.length - 1; j++) {
          if (new Date(winner_arr[i]).getDate() > new Date(winner_arr[j]).getDate()) {
            {
              aux = winner_arr[i];
              winner_arr[i] = winner_arr[j];
              winner_arr[j] = aux;
            }
          }
        }
      }
      console.log(winner_arr);

      // se verifica daca intre ele este mai mic decat minim days
      // daca e mai mic se ia intrervalul dintre ele + interval in jur data 1 +interval in jur data 2

      if (new Date(winner_arr[0]).getDate() - new Date(winner_arr[1]).getDate() <= minDays) {
        this.startDay = this.datePipe.transform(new Date(new Date(winner_arr[0]).setDate(new Date(winner_arr[0]).getDate())), 'yyyy-MM-dd');
        this.endDay = this.datePipe.transform(new Date(new Date(this.startDay).setDate(new Date(this.startDay).getDate() + minDays - 1)), 'yyyy-MM-dd');
        console.log(this.startDay, this.endDay);


        this.startDay1 = this.datePipe.transform(new Date(new Date(winner_arr[0]).setDate(new Date(winner_arr[0]).getDate() - (minDays / 2) + 1)), 'yyyy-MM-dd');
        this.endDay1 = this.datePipe.transform(new Date(new Date(this.startDay1).setDate(new Date(this.startDay1).getDate() + minDays - 1)), 'yyyy-MM-dd');
        console.log(this.startDay1, this.endDay1);

        this.startDay2 = this.datePipe.transform(new Date(new Date(winner_arr[1]).setDate(new Date(winner_arr[1]).getDate() - (minDays / 2) + 1)), 'yyyy-MM-dd');
        this.endDay2 = this.datePipe.transform(new Date(new Date(this.startDay2).setDate(new Date(this.startDay2).getDate() + minDays - 1)), 'yyyy-MM-dd');
        console.log(this.startDay2, this.endDay2);

        this.startDay3 = this.datePipe.transform(new Date(new Date(winner_arr[2]).setDate(new Date(winner_arr[2]).getDate() - (minDays / 2) + 1)), 'yyyy-MM-dd');
        this.endDay3 = this.datePipe.transform(new Date(new Date(this.startDay3).setDate(new Date(this.startDay3).getDate() + minDays - 1)), 'yyyy-MM-dd');
        console.log(this.startDay3, this.endDay3);




      } else if (new Date(winner_arr[1]).getDate() - new Date(winner_arr[2]).getDate() <= minDays) {
        this.startDay = this.datePipe.transform(new Date(new Date(winner_arr[1]).setDate(new Date(winner_arr[1]).getDate())), 'yyyy-MM-dd');
        this.endDay = this.datePipe.transform(new Date(new Date(this.startDay).setDate(new Date(this.startDay).getDate() + minDays - 1)), 'yyyy-MM-dd');
        console.log(this.startDay, this.endDay);

        this.startDay1 = this.datePipe.transform(new Date(new Date(winner_arr[0]).setDate(new Date(winner_arr[0]).getDate() - (minDays / 2) + 1)), 'yyyy-MM-dd');
        this.endDay1 = this.datePipe.transform(new Date(new Date(this.startDay1).setDate(new Date(this.startDay1).getDate() + minDays - 1)), 'yyyy-MM-dd');
        console.log(this.startDay1, this.endDay1);

        this.startDay2 = this.datePipe.transform(new Date(new Date(winner_arr[1]).setDate(new Date(winner_arr[1]).getDate() - (minDays / 2) + 1)), 'yyyy-MM-dd');
        this.endDay2 = this.datePipe.transform(new Date(new Date(this.startDay2).setDate(new Date(this.startDay2).getDate() + minDays - 1)), 'yyyy-MM-dd');
        console.log(this.startDay2, this.endDay2);

        this.startDay3 = this.datePipe.transform(new Date(new Date(winner_arr[2]).setDate(new Date(winner_arr[2]).getDate() - (minDays / 2) + 1)), 'yyyy-MM-dd');
        this.endDay3 = this.datePipe.transform(new Date(new Date(this.startDay3).setDate(new Date(this.startDay3).getDate() + minDays - 1)), 'yyyy-MM-dd');
        console.log(this.startDay3, this.endDay3);




      } else if (new Date(winner_arr[0]).getDate() - new Date(winner_arr[2]).getDate() <= minDays) {
        this.startDay = this.datePipe.transform(new Date(new Date(winner_arr[0]).setDate(new Date(winner_arr[0]).getDate())), 'yyyy-MM-dd');
        this.endDay = this.datePipe.transform(new Date(new Date(this.startDay).setDate(new Date(this.startDay).getDate() + minDays - 1)), 'yyyy-MM-dd');
        console.log(this.startDay, this.endDay);

        this.startDay1 = this.datePipe.transform(new Date(new Date(winner_arr[0]).setDate(new Date(winner_arr[0]).getDate() - (minDays / 2) + 1)), 'yyyy-MM-dd');
        this.endDay1 = this.datePipe.transform(new Date(new Date(this.startDay1).setDate(new Date(this.startDay1).getDate() + minDays - 1)), 'yyyy-MM-dd');
        console.log(this.startDay1, this.endDay1);

        this.startDay2 = this.datePipe.transform(new Date(new Date(winner_arr[1]).setDate(new Date(winner_arr[1]).getDate() - (minDays / 2) + 1)), 'yyyy-MM-dd');
        this.endDay2 = this.datePipe.transform(new Date(new Date(this.startDay2).setDate(new Date(this.startDay2).getDate() + minDays - 1)), 'yyyy-MM-dd');
        console.log(this.startDay2, this.endDay2);

        this.startDay3 = this.datePipe.transform(new Date(new Date(winner_arr[2]).setDate(new Date(winner_arr[2]).getDate() - (minDays / 2) + 1)), 'yyyy-MM-dd');
        this.endDay3 = this.datePipe.transform(new Date(new Date(this.startDay3).setDate(new Date(this.startDay3).getDate() + minDays - 1)), 'yyyy-MM-dd');
        console.log(this.startDay3, this.endDay3);

      }



      else {
        this.startDay1 = this.datePipe.transform(new Date(new Date(winner_arr[0]).setDate(new Date(winner_arr[0]).getDate() - (minDays / 2) + 1)), 'yyyy-MM-dd');
        this.endDay1 = this.datePipe.transform(new Date(new Date(this.startDay1).setDate(new Date(this.startDay1).getDate() + minDays - 1)), 'yyyy-MM-dd');
        console.log(this.startDay1, this.endDay1);

        this.startDay2 = this.datePipe.transform(new Date(new Date(winner_arr[1]).setDate(new Date(winner_arr[1]).getDate() - (minDays / 2) + 1)), 'yyyy-MM-dd');
        this.endDay2 = this.datePipe.transform(new Date(new Date(this.startDay2).setDate(new Date(this.startDay2).getDate() + minDays - 1)), 'yyyy-MM-dd');
        console.log(this.startDay2, this.endDay2);

        this.startDay3 = this.datePipe.transform(new Date(new Date(winner_arr[2]).setDate(new Date(winner_arr[2]).getDate() - (minDays / 2) + 1)), 'yyyy-MM-dd');
        this.endDay3 = this.datePipe.transform(new Date(new Date(this.startDay3).setDate(new Date(this.startDay3).getDate() + minDays - 1)), 'yyyy-MM-dd');
        console.log(this.startDay3, this.endDay3);
      }

    }



  }



  onRetakePoll() {
    this.findWinner();

    // creaza POLL RETAKE +adauga CHOICES
    this.tripService.createPoll(this.currentUserId, this.currentTripGroup.groupId, this.currentTripId, 'retake', 'opened', 'retake-calendar')
      .subscribe(
        data => {
          window.sessionStorage.setItem('retake_calendar', JSON.stringify(data));
          this.alertService.success('The poll has been added successfully');
          this.currentPollRetakeId = JSON.parse(sessionStorage.getItem('retake_calendar')).id;
          console.log(this.currentPollRetakeId);

          if (this.startDay) {
            this.tripService.createChoice(this.currentPollRetakeId, (this.startDay.toString().concat('/')).concat(this.endDay.toString()))
              .subscribe(
                data => {
                }, (error) => {
                  console.log(error);
                });
          }
          if (this.startDay1) {
            this.tripService.createChoice(this.currentPollRetakeId, (this.startDay1.toString().concat('/')).concat(this.endDay1.toString()))
              .subscribe(
                data => {
                }, (error) => {
                  console.log(error);
                });
          }
          if (this.startDay2) {
            this.tripService.createChoice(this.currentPollRetakeId, (this.startDay2.toString().concat('/')).concat(this.endDay2.toString()))
              .subscribe(
                data => {
                }, (error) => {
                  console.log(error);
                });
          }
          if (this.startDay3) {
            this.tripService.createChoice(this.currentPollRetakeId, (this.startDay3.toString().concat('/')).concat(this.endDay3.toString()))
              .subscribe(
                data => {
                }, (error) => {
                  console.log(error);

                });
          }




        }, (error) => {
          console.log(error);
          this.alertService.danger('The poll failed to be added');
        });

    this.currentPollRetakeId = JSON.parse(sessionStorage.getItem('retake_calendar')).id;
    console.log(this.currentPollRetakeId);

    // this.retakeMessage = "Due to multiple possibilities for the trip dates, you have to RETAKE the poll. Please press RETAKE POLL button!"

  }

  onSelectionChange1(startDay, endDay) {
    // this.selectedChoice1 = Object.assign({}, this.selectedChoice1, startDay, endDay);
    this.selectedChoice1 = (startDay.toString().concat('/')).concat(endDay.toString());
    console.log(this.selectedChoice1);
  }

  updateInterval() {

    console.log(this.selectedChoice1);

    let splitted = this.selectedChoice1.split('/', 3);
    this.tripService.updateDatesTrip(this.currentTripId, 'location', splitted[0], splitted[1])
      .subscribe(
        data => {


          this.alertService.success('The location to poll has been updated successfully');
        }, (error) => {
          console.log(error);
          this.alertService.danger('The location to poll failed to be updated');
        }
      );
    this.tripService.updateStatusPoll(this.currentPollId, 'closed')
      .subscribe(
        data => {


          this.alertService.success('The status "closed" has been updated successfully');
        }, (error) => {
          console.log(error);
          this.alertService.danger('The status "closed" failed to be updated');
        }
      );
  }



  findWinnerRetake() {
    let count2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let max2: number;
    let poz2: number;


    this.winner2 = this.votesRetaken[0].choice.text;
    for (let j = 0; j <= this.choicesRetake.length - 1; j++) {
      for (let i = 0; i <= this.votesRetaken.length - 1; i++) {

        if (this.votesRetaken[i].choice.text == this.choicesRetake[j].text) {
          count2[j]++;
        }
      }
    }
    max2 = count2[0];
    for (let j = 0; j <= this.choicesRetake.length - 1; j++) {
      if (max2 < count2[j]) {
        max2 = count2[j];
        poz2 = j;
      }

    }
    console.log(count2);
    console.log(max2);
    console.log(poz2);

    this.winner2 = this.choicesRetake[poz2].text;
    console.log(this.winner2);

  }
  updateIntervalRetake() {

    this.currentPollRetake2Id = JSON.parse(sessionStorage.getItem('poll_opened_retaken_calendar')).id;
    console.log(this.currentPollRetake2Id);
    console.log(this.winner2);

    let splitted = this.winner2.split('/', 3);
    this.tripService.updateDatesTrip(this.currentTripId, 'location', splitted[0], splitted[1])
      .subscribe(
        data => {


          this.alertService.success('The location to poll has been updated successfully');
        }, (error) => {
          console.log(error);
          this.alertService.danger('The location to poll failed to be updated');
        }
      );
    this.tripService.updateStatusPoll(this.currentPollRetake2Id, 'closed')
      .subscribe(
        data => {


          this.alertService.success('The status "closed" has been updated successfully');
        }, (error) => {
          console.log(error);
          this.alertService.danger('The status "closed" failed to be updated');
        }
      );
  }

}
