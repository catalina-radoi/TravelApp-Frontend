import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Subject } from 'rxjs';
import { Trip } from '../../../@types/Trip';
import { AlertService } from 'ngx-alerts';
import { TripService } from '../../../_services/trip.service';
import { Router } from '@angular/router';
import { UserServiceService } from '../../../_services/user-service.service';
import { Poll } from '../../../@types/Poll';
import { Vote } from '../../../@types/Vote';
import { NgForm } from '@angular/forms';
import { Choice } from '../../../@types/Choice';

@Component({
  selector: 'app-pick-location-modal',
  templateUrl: './pick-location-modal.component.html',
  styleUrls: ['./pick-location-modal.component.css']
})
export class PickLocationModalComponent implements OnInit {


  modelChoice = new Choice();
  public selectedTrip: Trip;
  public onClose: Subject<Trip>;
  polls: any;
  pollUser: Poll;
  choices: any;
  votes: any;
  currentUserId: any;
  personalVote: any;
  currentPollId: any;
  selectedChoice: any;
  polls2: any;
  pollUser2: Poll;
  choices2: any;
  votes2: any;
  personalVote2: Vote;
  selectedChoiceRetake: any;
  currentPollRetake2Id: any;




  constructor(private router: Router,
    private tripService: TripService,
    private userService: UserServiceService,
    private modalService: BsModalService,
    private alertService: AlertService,
    public bsModalRef: BsModalRef,
  ) { }

  ngOnInit(): void {

    this.currentUserId = JSON.parse(sessionStorage.getItem('auth-user')).userId;

    console.log(this.currentUserId);


    console.log(this.selectedTrip);
    this.tripService.getPollsForTrip(this.selectedTrip.tripId).subscribe((polls: Poll[]) => {
      this.polls = polls;
      console.log(this.polls);



      for (let i = 0; i <= (polls.length - 1); i++) {
        // if (polls != null) {
        //   this.user2 = 'user-poll';
        //   console.log(this.user2);
        // }
        if ((polls[i].status == 'opened') && (polls[i].type == 'location')) {

          this.pollUser = polls[i];
          window.sessionStorage.setItem('poll_user_location', JSON.stringify(this.pollUser));
          console.log(this.pollUser);

          this.tripService.getChoices(this.pollUser.id).subscribe(choices => (this.choices = choices));
          console.log(this.choices);

          // ia votes
          this.tripService.getVotesPoll(this.pollUser.id).subscribe(votes => (this.votes = votes));
          console.log(this.votes);

          //ia vot personal
          this.tripService.getVoteUserForPoll(this.currentUserId, this.pollUser.id).subscribe((personalVote: Vote) => {
            this.personalVote = personalVote;
            console.log(this.personalVote.choice.text);
          });
        }
      }

    });







    // POLL RETAKEN
    //
    this.tripService.getPollsForTrip(this.selectedTrip.tripId).subscribe((polls2: Poll[]) => {
      this.polls2 = polls2;
      console.log(this.polls2);



      for (let i = 0; i <= (polls2.length - 1); i++) {
        // if (polls != null) {
        //   this.user2 = 'user-poll';
        //   console.log(this.user2);
        // }
        if ((polls2[i].status == 'opened') && (polls2[i].type == 'retake-location')) {

          this.pollUser2 = polls2[i];
          window.sessionStorage.setItem('poll_user_location_retake', JSON.stringify(this.pollUser2));
          console.log(this.pollUser2);

          this.tripService.getChoices(this.pollUser2.id).subscribe(choices2 => (this.choices2 = choices2));
          console.log(this.choices2);

          // ia votes
          this.tripService.getVotesPoll(this.pollUser2.id).subscribe(votes2 => (this.votes2 = votes2));
          console.log(this.votes2);

          //ia vot personal
          this.tripService.getVoteUserForPoll(this.currentUserId, this.pollUser2.id).subscribe((personalVote2: Vote) => {
            this.personalVote2 = personalVote2;
            console.log(this.personalVote2.choice.text);
          });
        }
      }

    });





    this.onClose = new Subject();
  }
  public onCancel(): void {
    this.onClose.next();
    this.bsModalRef.hide();
  }



  onAddChoice(choiceForm: NgForm) {

    if (JSON.parse(sessionStorage.getItem('poll_user_location'))) {
      this.currentPollId = JSON.parse(sessionStorage.getItem('poll_user_location')).id;
      console.log(this.currentPollId);
    }




    console.log(choiceForm.value.text);
    this.tripService.createChoice(this.currentPollId, choiceForm.value.text)
      .subscribe(
        data => {

          // window.sessionStorage.setItem('poll_nou', JSON.stringify(data));
          this.alertService.success('The choice has been added successfully');
          this.tripService.getChoices(this.currentPollId).subscribe(choices => (this.choices = choices));
          console.log(this.choices);
        }, (error) => {
          console.log(error);
          this.alertService.danger('The choice failed to be added');
        });



    // this.currentPollId = JSON.parse(sessionStorage.getItem('poll_nou')).id;
    // console.log(this.currentPollId);




  }

  onSelectionChange(choice) {
    this.selectedChoice = Object.assign({}, this.selectedChoice, choice);
    console.log(this.selectedChoice);
  }


  onVote() {
    if (JSON.parse(sessionStorage.getItem('poll_user_location'))) {
      this.currentPollId = JSON.parse(sessionStorage.getItem('poll_user_location')).id;
      console.log(this.currentPollId);
    }

    console.log(this.selectedChoice.id);
    this.tripService.createVote(this.selectedChoice.id, this.currentUserId, this.currentPollId, 'done')
      .subscribe(
        data => {

          this.tripService.getVotesPoll(this.currentPollId).subscribe(votes => (this.votes = votes));
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

    this.currentPollRetake2Id = JSON.parse(sessionStorage.getItem('poll_user_location_retake')).id;
    console.log(this.currentPollRetake2Id);
    this.tripService.createVote(this.selectedChoiceRetake.id, this.currentUserId, this.currentPollRetake2Id, 'done')
      .subscribe(
        data => {

          // window.sessionStorage.setItem('poll_nou', JSON.stringify(data));
          this.alertService.success('The vote has been added successfully');
        }, (error) => {
          console.log(error);
          this.alertService.danger('The vote failed to be added');
        });

  }


  onSave() {

  }
}
