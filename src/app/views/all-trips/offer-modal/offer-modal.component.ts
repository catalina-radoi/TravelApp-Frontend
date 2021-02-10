import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { Trip } from '../../../@types/Trip';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Offer } from '../../../@types/Offer';
import { TripService } from '../../../_services/trip.service';
import { MapsModalComponent } from '../../new-trip/components/final-offer/maps-modal/maps-modal.component';
import { Poll } from '../../../@types/Poll';
import { Choice } from '../../../@types/Choice';
import { AlertService } from 'ngx-alerts';
import { Vote } from '../../../@types/Vote';

@Component({
  selector: 'app-offer-modal',
  templateUrl: './offer-modal.component.html',
  styleUrls: ['./offer-modal.component.css']
})
export class OfferModalComponent implements OnInit {


  public selectedTrip: Trip;
  public onClose: Subject<Trip>;
  offers: Offer[];
  selectedOffer: Offer;
  currentUser: string;
  currentUserId: any;
  pollsAdmin: Poll;
  currentPoll: any;
  choices: Choice;
  votes: any;
  personalVote: any;




  constructor(
    public bsModalRef: BsModalRef,
    private tripService: TripService,
    private modalService: BsModalService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.onClose = new Subject();


    this.currentUser = sessionStorage.getItem('auth-user');

    console.log(this.currentUser);
    this.currentUserId = JSON.parse(sessionStorage.getItem('auth-user')).userId;

    // IA OFERTE PT LOCATIE
    this.tripService.getOffersForLocation(this.selectedTrip.location).subscribe((offers: Offer[]) => {
      this.offers = offers;
      console.log(this.offers);
    });


    this.tripService.getPollsForTrip(this.selectedTrip.tripId).subscribe((pollsAdmin: Poll[]) => {
      for (let i = 0; i <= (pollsAdmin.length - 1); i++) {
        if ((pollsAdmin[i].status == 'opened') && (pollsAdmin[i].type == 'offer')) {
          this.pollsAdmin = pollsAdmin[i];
          window.sessionStorage.setItem('poll_opened_offers', JSON.stringify(this.pollsAdmin));
          console.log(this.pollsAdmin);


        }

      }
    });


    this.currentPoll = JSON.parse(sessionStorage.getItem('poll_opened_offers')).id;
    console.log(this.currentPoll);

    // GET PERSONAL VOTE

    this.tripService.getVoteUserForPoll(this.currentUserId, this.currentPoll).subscribe((personalVote: Vote) => {
      this.personalVote = personalVote;
      console.log(this.personalVote.choice.text);
    });



  }


  public onCancel(): void {
    this.onClose.next();
    this.bsModalRef.hide();
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

    this.tripService.getChoices(this.currentPoll).subscribe((choices: Choice[]) => {
      for (let i = 0; i <= choices.length - 1; i++) {
        if (choices[i].text === offer.hotelName) {
          this.choices = choices[i];

        }
      }
      console.log(this.choices);

      this.tripService.createVote(this.choices.id, this.currentUserId, this.currentPoll, 'done')
        .subscribe(
          data => {

            this.tripService.getVotesPoll(this.currentPoll).subscribe(votes => (this.votes = votes));
            this.alertService.success('The vote has been added successfully');
          }, (error) => {
            console.log(error);
            this.alertService.danger('The vote failed to be added');
          });

    });

  }
}
