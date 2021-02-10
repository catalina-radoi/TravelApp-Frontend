import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';

import { MapsAPILoader, MouseEvent } from '@agm/core';
import { TripService } from '../../../../_services/trip.service';
import { Offer } from '../../../../@types/Offer';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { MapsModalComponent } from './maps-modal/maps-modal.component';
import { Group } from '../../../../@types/Group';
import { Trip } from '../../../../@types/Trip';
import { Poll } from '../../../../@types/Poll';
import { Choice } from '../../../../@types/Choice';
import { AlertService } from 'ngx-alerts';
import { Vote } from '../../../../@types/Vote';

@Component({
  selector: 'app-final-offer',
  templateUrl: './final-offer.component.html',
  styleUrls: ['./final-offer.component.css']
})

export class FinalOfferComponent implements OnInit {

  public bsModalRef: BsModalRef;

  public offers: Offer[];
  public currentUser: String;
  public currentUserId: number;
  public winner_arr: String[] = new Array(10);

  @ViewChild('search')
  public searchElementRef: ElementRef;
  public selectedOffer: Offer;
  public currentTrip: Trip;
  currentTripGroupId: any;
  currentTripGroup: Group;
  user1: string;
  tripsAdmin: Trip;
  public location: any;
  public trip: Trip;
  pollsAdmin: Poll;
  pollCurent: string;
  currentPoll: any;
  choices: any;
  votes: any;
  votes2: any;
  winner: any;
  personalVote: any;
  choices2: any;
  selectedChoice: any;
  offerFinal: Offer;
  trips: any;


  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private tripService: TripService,
    private modalService: BsModalService,
    private alertService: AlertService
  ) { }





  ngOnInit(): void {

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

    // if (JSON.parse(sessionStorage.getItem('created_trip'))) {
    //   this.currentTrip = JSON.parse(sessionStorage.getItem('created_trip'));
    //   console.log(this.currentTrip);

    //   this.user1 = 'admin-poll';


    // } else
    if (JSON.parse(sessionStorage.getItem('trip_opened'))) {
      this.currentTrip = JSON.parse(sessionStorage.getItem('trip_opened'));
      console.log(this.currentTrip);

      this.user1 = 'admin-poll';

      // ia grup trip curent

      // this.tripService.getGroupTrip(this.currentTripId).subscribe((group: Group) => {
      //   this.currentTripGroup = group;
      //   this.currentTripGroupId = this.currentTripGroup.groupId;
      //   console.log(this.currentTripGroup);
      // });


    }



    // IA OFERTE PT LOCATIE
    this.tripService.getOffersForLocation(this.currentTrip.location).subscribe((offers: Offer[]) => {
      this.offers = offers;
      console.log(this.offers);
    });




    //IA POLL

    this.tripService.getPollsForTrip(this.currentTrip.tripId).subscribe((pollsAdmin: Poll[]) => {
      for (let i = 0; i <= (pollsAdmin.length - 1); i++) {
        if ((pollsAdmin[i].status == 'opened') && (pollsAdmin[i].type == 'offer')) {
          this.pollsAdmin = pollsAdmin[i];
          window.sessionStorage.setItem('poll_opened_offer', JSON.stringify(this.pollsAdmin));
          console.log(this.pollsAdmin);
          this.pollCurent = 'opened';



        }
      }



      this.currentPoll = JSON.parse(sessionStorage.getItem('poll_opened_offer'));
      console.log(this.currentPoll);


      // GET VOTES
      this.tripService.getVotesPoll(this.currentPoll.id).subscribe(votes2 => (this.votes2 = votes2));
      console.log(this.votes2);

      // ia choices poll
      this.tripService.getChoices(this.currentPoll.id).subscribe(choices2 => (this.choices2 = choices2));
      console.log(this.choices2);

      // GET PERSONAL VOTE
      this.tripService.getVoteUserForPoll(this.currentUserId, this.currentPoll.id).subscribe((personalVote: Vote) => {
        if (personalVote) {
          this.personalVote = personalVote;
          console.log(this.personalVote.choice.text);
        }
      });
    });

    this.tripService.getTrips().subscribe(trips => (this.trips = trips));
    console.log(this.trips);



  }



  findWinner() {


    let count = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let max: number;
    let poz: number;
    let counter = 0;

    let winner_arr: String[] = new Array(10);
    console.log(this.choices2);

    this.winner = this.votes2[0].choice.text;
    for (let j = 0; j <= this.choices2.length - 1; j++) {
      for (let i = 0; i <= this.votes2.length - 1; i++) {

        if (this.votes2[i].choice.text == this.choices2[j].text) {
          count[j]++;
        }
      }
    }
    max = 0;
    for (let j = 0; j <= this.choices2.length - 1; j++) {
      if (max < count[j]) {
        max = count[j];
        poz = j;
        console.log(poz);
      }

    }
    for (let i = 0; i <= this.choices2.length - 1; i++) {
      if (count[i] == max) {
        counter = counter + 1;

      }
    }

    console.log(this.choices2);
    console.log(count);
    console.log(counter);
    console.log(max);
    console.log(poz);



    if (counter == 1) {
      this.winner = this.choices2[poz].text;
      console.log(this.winner);
    }
    else {
      this.winner = null;
    }

    if (counter >= 2) {
      let p = 0;
      for (let i = 0; i <= this.choices2.length - 1; i++) {
        if (count[i] == max) {
          this.winner_arr[p] = this.choices2[i].text;
          counter = counter + 1;
          p++
        }
      }
      console.log(this.winner_arr);
    }

  }


  mapLocation(offer1: Offer) {
    this.selectedOffer = offer1;
    this.openModalWithComponent3(offer1);
  }


  openModalWithComponent3(pSelectedOffer: Offer) {
    const tempState = {
      selectedOffer: { ...pSelectedOffer }
    };
    this.bsModalRef = this.modalService.show(MapsModalComponent, {
      initialState: tempState,
      class: "modal-lg"
    });
    this.bsModalRef.content.onClose.subscribe(
      (result: Offer) => {
        // set details to selected user from table
        this.selectedOffer.latitude = result.latitude;
        this.selectedOffer.longitude = result.longitude;


      }
    );
  }



  onVote(offer) {
    console.log(offer.hotelName);
    this.currentPoll = JSON.parse(sessionStorage.getItem('poll_opened_offer'));
    console.log(this.currentPoll);
    this.tripService.getChoices(this.currentPoll.id).subscribe((choices: Choice[]) => {

      for (let i = 0; i <= choices.length - 1; i++) {
        console.log(choices[i]);
        if (choices[i].text === offer.hotelName) {
          this.choices = choices[i];

        }
      }
      console.log(this.choices);

      this.tripService.createVote(this.choices.id, this.currentUserId, this.currentPoll.id, 'done')
        .subscribe(
          data => {

            this.tripService.getVotesPoll(this.currentPoll.id).subscribe(votes => (this.votes = votes));
            this.alertService.success('The vote has been added successfully');
          }, (error) => {
            console.log(error);
            this.alertService.danger('The vote failed to be added');
          });

    });






  }




  onSelectionChange(offer) {
    this.selectedChoice = offer;
    console.log(this.selectedChoice);
  }


  updateOffer() {

    console.log(this.selectedChoice);

    this.tripService.getOffersForHotelName(this.selectedChoice).subscribe((offerFinal: Offer) => {
      this.offerFinal = offerFinal;
      console.log(this.offerFinal[0].offerId);

      this.tripService.setOfferTrip(this.offerFinal[0].offerId, this.currentTrip.tripId)
        .subscribe(
          () => {
            // (1) add user to list or (2) !!! getUsers form server


            this.alertService.success('The offer has been added successfully to the trip');
          }, (error) => {
            // keep old list
            console.log(error);
            this.alertService.danger('The offer failed to be added');
          });



    });


    this.tripService.updateOfferTrip(this.currentTrip.tripId, 'closed')
      .subscribe(
        data => {


          this.alertService.success('The location to poll has been updated successfully');
        }, (error) => {
          console.log(error);
          this.alertService.danger('The location to poll failed to be updated');
        }
      );
    this.tripService.updateStatusPoll(this.currentPoll.id, 'closed')
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
