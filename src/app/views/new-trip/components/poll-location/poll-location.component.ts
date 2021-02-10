import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Trip } from '../../../../@types/Trip';
import { Poll } from '../../../../@types/Poll';
import { TripService } from '../../../../_services/trip.service';
import { UserServiceService } from '../../../../_services/user-service.service';
import { BsModalService } from 'ngx-bootstrap';
import { AlertService } from 'ngx-alerts';
import { FormGroupDirective, NgForm } from '@angular/forms';
import { Group } from '../../../../@types/Group';
import { Choice } from '../../../../@types/Choice';
import { Vote } from '../../../../@types/Vote';
import { Theme } from '@fullcalendar/core';
import { Offer } from '../../../../@types/Offer';

@Component({
  selector: 'app-poll-location',
  templateUrl: './poll-location.component.html',
  styleUrls: ['./poll-location.component.css']
})
export class PollLocationComponent implements OnInit {
  public href: string = '';
  public nextUrl: string = '/new-trip/picked-group/pick-interval/calendar/location/offer';
  public poll: Poll;
  public currentTripId: number;
  public currentPollId: number;
  public currentTripGroup: Group;
  public currentTripGroupId: number;
  public currentUser: String;
  public currentUserId: number;
  public choices: Choice[];
  public selectedChoice: Choice;
  public votes: Vote[];
  public pollsAdmin: Poll;
  public tripsAdmin: Trip;
  public group: Group;
  public winner: String;
  public pollCurent: any;
  public groups: Group[];
  public pollUser: Poll;
  public groupsUser: Group[];

  public currentPollId2: number;
  public choices2: Choice[];
  public selectedChoice2: Choice;
  public votes2: Vote[];
  public winner_arr: String[] = new Array(10);

  model = new Poll();
  modelChoice = new Choice();

  public user1: any;
  public user2: any;

  public afisareChoicesPollNull: any;
  public currentPoll: Poll;
  personalVote: Vote;
  personalVote2: Vote;
  selectedChoice3: any;
  currentPollRetakeId: any;
  retaken: string;
  votesRetaken: Vote[];
  pollsRetake: any;
  choicesRetake: any;
  currentPollRetake2Id: any;
  selectedChoiceRetake: any;
  personalVoteRetaken: Vote;
  winner2: any;
  currentTrip: any;
  offers: Offer[];
  currentPollOffer: any;
  currentPollOfferId: any;

  constructor(private router: Router,
    private tripService: TripService,
    private userService: UserServiceService,
    private modalService: BsModalService,
    private alertService: AlertService) { }


  @ViewChild('pollForm', { static: false })
  pollForm: FormGroupDirective;


  @ViewChild('choiceForm', { static: false })
  choiceForm: FormGroupDirective;


  @ViewChild('choiceForm2', { static: false })
  choiceForm2: FormGroupDirective;

  ngOnInit() {

    this.href = this.router.url;
    // daca e poll curent nu mai afiseaza crearea poll in html
    this.pollCurent = 'nu';

    // GET USER FROM LOGIN SESSION
    this.currentUser = sessionStorage.getItem('auth-user');

    console.log(this.currentUser);
    this.currentUserId = JSON.parse(sessionStorage.getItem('auth-user')).userId;

    console.log(this.currentUserId);


    // TRIPS OPENED WHERE ADMIN
    this.tripService.getTripsWhereAdmin(this.currentUserId).subscribe((tripsAdmin: Trip[]) => {

      for (let i = 0; i <= (tripsAdmin.length - 1); i++) {
        if (tripsAdmin[i].status == 'opened') {
          if (tripsAdmin != null) {
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

    if (JSON.parse(sessionStorage.getItem('created_trip'))) {
      this.currentTripId = JSON.parse(sessionStorage.getItem('created_trip')).tripId;
      console.log(this.currentTripId);
      this.currentTrip = JSON.parse(sessionStorage.getItem('created_trip'));
      console.log(this.currentTrip);

      this.user1 = 'admin-poll';

      // ia grup trip curent

      this.tripService.getGroupTrip(this.currentTripId).subscribe((group: Group) => {
        this.currentTripGroup = group;
        this.currentTripGroupId = this.currentTripGroup.groupId;
        console.log(this.currentTripGroup);
      });

    } else if (JSON.parse(sessionStorage.getItem('trip_opened'))) {
      this.currentTripId = JSON.parse(sessionStorage.getItem('trip_opened')).tripId;
      console.log(this.currentTripId);
      this.currentTrip = JSON.parse(sessionStorage.getItem('trip_opened'));
      console.log(this.currentTrip);

      this.user1 = 'admin-poll';

      // ia grup trip curent

      this.tripService.getGroupTrip(this.currentTripId).subscribe((group: Group) => {
        this.currentTripGroup = group;
        this.currentTripGroupId = this.currentTripGroup.groupId;
        console.log(this.currentTripGroup);
      });




    }




    // POLLS FOR TRIP
    // un singur poll opened al unui admin la un moment dat

    this.tripService.getPollsForTrip(this.currentTripId).subscribe((pollsAdmin: Poll[]) => {

      for (let i = 0; i <= (pollsAdmin.length - 1); i++) {
        if ((pollsAdmin[i].status == 'opened') && (pollsAdmin[i].type == 'location') && (pollsAdmin[i].user.userId == this.currentUserId)) {
          this.pollsAdmin = pollsAdmin[i];
          window.sessionStorage.setItem('poll_opened', JSON.stringify(this.pollsAdmin));
          console.log(this.pollsAdmin);
          this.pollCurent = 'opened';
        }
        // else {
        //   this.pollCurent = 'nu';
        //   window.sessionStorage.setItem('poll_opened', JSON.stringify(null));
        // }
      }
    });





    // IA POLL CURENT

    if (JSON.parse(sessionStorage.getItem('poll_nou'))) {
      this.currentPollId = JSON.parse(sessionStorage.getItem('poll_nou')).id;
      console.log(this.currentPollId);


      // VERIFICAM DACA POLL CREAT RECENT MAI ESTE OPENED
      this.tripService.getPoll(this.currentPollId).subscribe((poll: Poll) => {
        this.currentPoll = poll;
        console.log(this.currentPoll);
        if (this.currentPoll.status == 'opened' && this.currentPoll) {


          // ia choices poll
          this.tripService.getChoices(this.currentPollId).subscribe(choices => (this.choices = choices));
          console.log(this.choices);

          // ia votes
          this.tripService.getVotesPoll(this.currentPollId).subscribe(votes => (this.votes = votes));
          console.log(this.votes);
          this.pollCurent = 'opened';

        } else if (this.currentPoll.status == 'closed') {
          this.pollCurent = 'nu';
          this.currentPollId = null;
        }
      });
      // IA POLL CARE E OPENED
    }
    if (JSON.parse(sessionStorage.getItem('poll_opened')) && JSON.parse(sessionStorage.getItem('poll_opened')) != null) {

      this.currentPollId = JSON.parse(sessionStorage.getItem('poll_opened')).id;
      console.log(this.currentPollId);

      this.tripService.getPoll(this.currentPollId).subscribe((poll: Poll) => {
        this.currentPoll = poll;
        console.log(this.currentPoll);
        if (this.currentPoll.status == 'opened' && this.currentPoll) {

          // ia choices poll
          this.tripService.getChoices(this.currentPollId).subscribe(choices => (this.choices = choices));
          console.log(this.choices);

          // ia votes
          this.tripService.getVotesPoll(this.currentPollId).subscribe(votes => (this.votes = votes));
          console.log(this.votes);
          this.pollCurent = 'opened';

        } else {
          this.currentPollId = null;
          this.pollCurent = 'nu';
        }



      });




    }
    this.tripService.getVoteUserForPoll(this.currentUserId, this.currentPollId).subscribe((personalVote: Vote) => {
      if (personalVote) {
        this.personalVote = personalVote;
        console.log(this.personalVote.choice.text);
      }
    });











    /// PENTRU UTILIZATORI DIN GRUP TRIP OPENED

    // group din care face parte un user
    this.userService.getGroups(this.currentUserId).subscribe((groups: Group[]) => {
      this.groupsUser = groups;
      console.log(this.groupsUser);
      //polls pentru grup din care face parte
      this.tripService.getPollsForGroup(this.groupsUser[0].groupId).subscribe((pollUsers: Poll[]) => {
        console.log(pollUsers);
        for (let i = 0; i <= (pollUsers.length - 1); i++) {
          if (pollUsers != null) {
            this.user2 = 'user-poll';
            console.log(this.user2);
          }
          if ((pollUsers[i].status == 'opened') && (pollUsers[i].type == 'location') && (pollUsers[i].user.userId != this.currentUserId)) {

            this.pollUser = pollUsers[i];
            window.sessionStorage.setItem('poll_user', JSON.stringify(this.pollUser));
            console.log(this.pollUser);
          }
        }

        // window.sessionStorage.setItem('trips_admin', JSON.stringify(this.tripsAdmin));

      });
    });
    if (JSON.parse(sessionStorage.getItem('poll_user'))) {
      this.currentPollId2 = JSON.parse(sessionStorage.getItem('poll_user')).id;
      console.log(this.currentPollId2);


      // ia choices poll
      this.tripService.getChoices(this.currentPollId2).subscribe(choices2 => (this.choices2 = choices2));
      console.log(this.choices2);

      // ia votes
      this.tripService.getVotesPoll(this.currentPollId2).subscribe(votes2 => (this.votes2 = votes2));
      console.log(this.votes2);


      // this.pollCurent = 'opened';
    }
    this.tripService.getVoteUserForPoll(this.currentUserId, this.currentPollId2).subscribe((personalVote2: Vote) => {
      if (personalVote2) {
        this.personalVote2 = personalVote2;
        console.log(this.personalVote2.choice.text);
      }
    });









    // IA POLL RETAKEN


    //IA POLL RETAKEN

    this.tripService.getPollsForTrip(this.currentTripId).subscribe((pollsRetake: Poll[]) => {

      for (let i = 0; i <= (pollsRetake.length - 1); i++) {
        if ((pollsRetake[i].status == 'opened') && (pollsRetake[i].type == 'retake-location')) {
          this.pollsRetake = pollsRetake[i];
          window.sessionStorage.setItem('poll_opened_retaken_location', JSON.stringify(this.pollsRetake));
          console.log(this.pollsRetake);
          this.retaken = "da";


          // ia choices
          this.tripService.getChoices(this.pollsRetake.id).subscribe((choicesRetake: Choice[]) => {
            this.choicesRetake = choicesRetake;
            console.log(this.choicesRetake);
          });

          //ia votes

          this.tripService.getVotesPoll(this.pollsRetake.id).subscribe((votesRetaken: Vote[]) => {
            this.votesRetaken = votesRetaken;
          });


        } else if ((pollsRetake[i].status != 'opened') && (pollsRetake[i].type == 'retake-location')) {
          this.retaken = "nu";
        }
      }
    });
    if (JSON.parse(sessionStorage.getItem('poll_opened_retaken_location'))) {
      this.currentPollRetake2Id = JSON.parse(sessionStorage.getItem('poll_opened_retaken_location')).id;
      console.log(this.currentPollRetake2Id);

    }





    //Ia vot utilizator RETAKEN
    this.tripService.getVoteUserForPoll(this.currentUserId, this.currentPollRetake2Id).subscribe((personalVoteRetaken: Vote) => {
      this.personalVoteRetaken = personalVoteRetaken;
      console.log(this.personalVoteRetaken.choice.text);
    });



  }

  onCreate(pollForm: NgForm) {
    console.log(pollForm.value.question);
    this.tripService.createPoll(this.currentUserId, this.currentTripGroup.groupId, this.currentTripId, this.pollForm.value.question, 'opened', 'location')
      .subscribe(
        data => {

          window.sessionStorage.setItem('poll_nou', JSON.stringify(data));
          this.alertService.success('The poll has been added successfully');
          this.tripService.getChoices(this.currentPollId).subscribe(choices => (this.choices = choices));
          console.log(this.choices);
        }, (error) => {
          console.log(error);
          this.alertService.danger('The poll failed to be added');
        });

    // this.currentPollId = JSON.parse(sessionStorage.getItem('poll_nou')).id;
    // console.log(this.currentPollId);

    // this.userService.setAdminGroup(this.currentUserId, this.currentGroupId + 1)
    //   .subscribe(
    //     (user: User) => {
    //       this.users.push(user);
    //       this.alertService.success('The admin has been added successfully');
    //     }, (error) => {
    //       console.log(error);
    //       this.alertService.danger('The admin failed to be added');
    //     });


  }
  onAddChoice(choiceForm: NgForm) {

    if (JSON.parse(sessionStorage.getItem('poll_nou'))) {
      this.currentPollId = JSON.parse(sessionStorage.getItem('poll_nou')).id;
      console.log(this.currentPollId);
    }
    if (JSON.parse(sessionStorage.getItem('poll_opened'))) {
      this.currentPollId = JSON.parse(sessionStorage.getItem('poll_opened')).id;
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
  onAddChoice2(choiceForm2: NgForm) {

    this.currentPollId2 = JSON.parse(sessionStorage.getItem('poll_user')).id;
    console.log(this.currentPollId2);


    console.log(choiceForm2.value.text);
    this.tripService.createChoice(this.currentPollId2, choiceForm2.value.text)
      .subscribe(
        data => {

          // window.sessionStorage.setItem('poll_nou', JSON.stringify(data));
          this.alertService.success('The choice has been added successfully');
          this.tripService.getChoices(this.currentPollId2).subscribe(choices2 => (this.choices2 = choices2));
          console.log(this.choices2);
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
  onSave() {

  }
  onVote() {
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

  onVote2() {
    console.log(this.selectedChoice.id);
    this.tripService.createVote(this.selectedChoice.id, this.currentUserId, this.currentPollId2, 'done')
      .subscribe(
        data => {

          // window.sessionStorage.setItem('poll_nou', JSON.stringify(data));
          this.alertService.success('The vote has been added successfully');
          this.tripService.getVotesPoll(this.currentPollId2).subscribe(votes2 => (this.votes2 = votes2));
        }, (error) => {
          console.log(error);
          this.alertService.danger('The vote failed to be added');
        });

  }



  findWinner() {


    let count = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let max: number;
    let poz: number;
    let counter = 0;

    let winner_arr: String[] = new Array(10);


    this.winner = this.votes[0].choice.text;
    for (let j = 0; j <= this.choices.length - 1; j++) {
      for (let i = 0; i <= this.votes.length - 1; i++) {

        if (this.votes[i].choice.text == this.choices[j].text) {
          count[j]++;
        }
      }
    }
    max = count[0];
    for (let j = 0; j <= this.choices.length - 1; j++) {
      if (max < count[j]) {
        max = count[j];
        poz = j;
      }

    }
    for (let i = 0; i <= this.choices.length - 1; i++) {
      if (count[i] == max) {
        counter = counter + 1;

      }
    }

    console.log(this.choices);
    console.log(count);
    console.log(counter);
    console.log(max);



    if (counter == 1) {
      this.winner = this.choices[poz].text;
      console.log(this.winner);
    }
    else {
      this.winner = null;
    }

    if (counter >= 2) {
      let p = 0;
      for (let i = 0; i <= this.choices.length - 1; i++) {
        if (count[i] == max) {
          this.winner_arr[p] = this.choices[i].text;
          counter = counter + 1;
          p++
        }
      }
      console.log(this.winner_arr);
    }

  }


  onSelectionChange3(winnerPoll) {
    // this.selectedChoice1 = Object.assign({}, this.selectedChoice1, startDay, endDay);
    this.selectedChoice3 = winnerPoll;
    console.log(this.selectedChoice3);
  }


  updateLocation() {

    console.log(this.selectedChoice3);
    this.tripService.updateLocationTrip(this.currentTripId, 'offer', this.selectedChoice3)
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



  onRetakePoll() {
    this.findWinner();

    // creaza POLL RETAKE +adauga CHOICES
    this.tripService.createPoll(this.currentUserId, this.currentTripGroup.groupId, this.currentTripId, 'retake', 'opened', 'retake-location')
      .subscribe(
        data => {
          window.sessionStorage.setItem('retake_location', JSON.stringify(data));
          this.alertService.success('The poll has been added successfully');
          this.currentPollRetakeId = JSON.parse(sessionStorage.getItem('retake_location')).id;
          console.log(this.currentPollRetakeId);

          if (this.winner) {
            this.tripService.createChoice(this.currentPollRetakeId, this.winner)
              .subscribe(
                data => {
                }, (error) => {
                  console.log(error);
                });
          }
          if (this.winner_arr[0]) {
            this.tripService.createChoice(this.currentPollRetakeId, this.winner_arr[0])
              .subscribe(
                data => {
                }, (error) => {
                  console.log(error);
                });
          }
          if (this.winner_arr[1]) {
            this.tripService.createChoice(this.currentPollRetakeId, this.winner_arr[1])
              .subscribe(
                data => {
                }, (error) => {
                  console.log(error);
                });
          }
          if (this.winner_arr[2]) {
            this.tripService.createChoice(this.currentPollRetakeId, this.winner_arr[2])
              .subscribe(
                data => {
                }, (error) => {
                  console.log(error);

                });
          }
          if (this.winner_arr[3]) {
            this.tripService.createChoice(this.currentPollRetakeId, this.winner_arr[3])
              .subscribe(
                data => {
                }, (error) => {
                  console.log(error);

                });
          }
          if (this.winner_arr[4]) {
            this.tripService.createChoice(this.currentPollRetakeId, this.winner_arr[4])
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
    if (JSON.parse(sessionStorage.getItem('retake_location'))) {
      this.currentPollRetakeId = JSON.parse(sessionStorage.getItem('retake_location')).id;
      console.log(this.currentPollRetakeId);
    }

    // this.retakeMessage = "Due to multiple possibilities for the trip dates, you have to RETAKE the poll. Please press RETAKE POLL button!"

  }



  onSelectionChangeRetake(choice) {
    this.selectedChoiceRetake = Object.assign({}, this.selectedChoiceRetake, choice);
    console.log(this.selectedChoiceRetake);
  }


  onVoteRetake() {

    this.currentPollRetake2Id = JSON.parse(sessionStorage.getItem('poll_opened_retaken_location')).id;
    console.log(this.currentPollRetake2Id);
    this.tripService.createVote(this.selectedChoiceRetake.id, this.currentUserId, this.currentPollRetake2Id, 'done')
      .subscribe(
        data => {
          this.tripService.getVotesPoll(this.currentPollRetake2Id).subscribe(votes => (this.votesRetaken = votes));
          // window.sessionStorage.setItem('poll_nou', JSON.stringify(data));
          this.alertService.success('The vote has been added successfully');
        }, (error) => {
          console.log(error);
          this.alertService.danger('The vote failed to be added');
        });

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

    this.currentPollRetake2Id = JSON.parse(sessionStorage.getItem('poll_opened_retaken_location')).id;
    console.log(this.currentPollRetake2Id);
    console.log(this.winner2);


    this.tripService.updateLocationTrip(this.currentTripId, 'offer', this.winner2)
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






  onCreatePollOffer() {

    this.tripService.createPoll(this.currentUserId, this.currentTripGroup.groupId, this.currentTripId, 'offer', 'opened', 'offer')
      .subscribe(
        data => {
          this.alertService.success('The poll has been added successfully');



          this.tripService.getOffers().subscribe((offers: Offer[]) => {
            for (let i = 0; i <= offers.length - 1; i++) {
              if (offers[i].location == 'Brasov') {
                this.offers = offers;
              }
            }
            console.log(this.offers);

            if (this.offers[0]) {
              this.tripService.createChoice(data.id, this.offers[0].hotelName)
                .subscribe(
                  data => {
                  }, (error) => {
                    console.log(error);
                  });
            }
            if (this.offers[1]) {
              this.tripService.createChoice(data.id, this.offers[1].hotelName)
                .subscribe(
                  data => {
                  }, (error) => {
                    console.log(error);
                  });
            }
            if (this.offers[2]) {
              this.tripService.createChoice(data.id, this.offers[2].hotelName)
                .subscribe(
                  data => {
                  }, (error) => {
                    console.log(error);
                  });
            }



          });



        }, (error) => {
          console.log(error);
          this.alertService.danger('The poll failed to be added');
        });





  }

}


