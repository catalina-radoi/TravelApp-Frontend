import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { HttpHeaders } from '@angular/common/http';
import { User } from '../@types/User';
import { Group } from '../@types/Group';
import { Poll } from '../@types/Poll';
import { Offer } from '../@types/Offer';

const API_URL = 'http://localhost:8080/api/v1/';
const httpOptions = {
  headers: new HttpHeaders({

    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    responseType: 'json',

  })
};
@Injectable({
  providedIn: 'root'
})
export class TripService {

  constructor(private http: HttpClient,) { }

  getTrips(): Observable<any> {
    return this.http.get(API_URL + `trips`, httpOptions);
  }
  getOffers(): Observable<any> {
    return this.http.get(API_URL + `offers`, httpOptions);
  }

  getTrip(tripId: number): Observable<any> {
    return this.http.get(API_URL + `trips/${tripId}`, httpOptions);
  }
  getPoll(pollId: number): Observable<Poll> {
    return this.http.get<Poll>(API_URL + `poll/${pollId}`, httpOptions);
  }

  getTripsWhereAdmin(userId: number): Observable<any> {
    return this.http.get(API_URL + `user-trips/${userId}`, httpOptions);
  }
  getTripsForGroup(groupId: number): Observable<any> {
    return this.http.get(API_URL + `group-trips/${groupId}`, httpOptions);
  }

  getTripsWhereMemberGroup(userId: number): Observable<any> {
    return this.http.get(API_URL + `member-trips/${userId}`, httpOptions);
  }
  getPollsForGroup(groupId: number): Observable<any> {
    return this.http.get(API_URL + `group-polls/${groupId}`, httpOptions);
  }


  createTrip(status1: String, step1: String): Observable<any> {
    return this.http.post(API_URL + 'trip', {
      status: status1,
      step: step1,

    }, httpOptions);
  }


  setAdminTrip(userId: number, tripId: number): Observable<User> {
    return this.http.post<User>(API_URL + `admin/${userId}/trips/${tripId}`, { responseType: 'json' });
  }
  setGroupTrip(groupId: number, tripId: number): Observable<Group> {
    return this.http.post<Group>(API_URL + `group/${groupId}/trips/${tripId}`, { responseType: 'json' });
  }
  getVoteUserForPoll(userId: number, pollId: number): Observable<any> {
    return this.http.get(API_URL + `votes-user/${userId}/poll/${pollId}`, httpOptions);
  }



  createPoll(userId: number, groupId: number, tripId: number, question1: String, status1: String, type1: String): Observable<any> {
    return this.http.post(API_URL + `poll/admin/${userId}/group/${groupId}/trip/${tripId}`, {
      question: question1,
      status: status1,
      type: type1


    }, httpOptions);
  }
  createTrip2(userId: number, status1: String, step1: String): Observable<any> {
    return this.http.post(API_URL + `trip/admin/${userId}`, {
      status: status1,
      step: step1,

    }, httpOptions);
  }
  createChoice(pollId: number, text1: String): Observable<any> {
    return this.http.post(API_URL + `choice/poll/${pollId}`, {
      text: text1,


    }, httpOptions);
  }

  getChoices(pollId: number): Observable<any> {
    return this.http.get(API_URL + `choices-poll/${pollId}`, httpOptions);
  }

  // /vote/choice/{choiceId}/user/{userId}/poll/{pollId}

  createVote(choiceId: number, userId: number, pollId: number, status1: String): Observable<any> {
    return this.http.post(API_URL + `vote/choice/${choiceId}/user/${userId}/poll/${pollId}`, {
      status: status1,


    }, httpOptions);
  }

  getVotesPoll(pollId: number): Observable<any> {
    return this.http.get(API_URL + `votes-poll/${pollId}`, httpOptions);
  }

  getPollsWhereAdmin(userId: number): Observable<any> {
    return this.http.get(API_URL + `user-polls/${userId}`, httpOptions);
  }
  getPollsForTrip(tripId: number): Observable<any> {
    return this.http.get(API_URL + `trip-polls/${tripId}`, httpOptions);
  }
  getLocationForTrip(tripId: number): Observable<any> {
    return this.http.get(API_URL + `trip-location/${tripId}`, httpOptions);
  }


  getOffersForLocation(location: any): Observable<any> {
    return this.http.get(API_URL + `offers-location/${location}`, httpOptions);
  }
  getOffersForHotelName(location: any): Observable<any> {
    return this.http.get(API_URL + `offers-hotelname/${location}`, httpOptions);
  }

  getGroupTrip(tripId: number): Observable<any> {
    return this.http.get(API_URL + `trip-group/${tripId}`, httpOptions);
  }

  updateStepTrip(tripId: number, step1: String): Observable<any> {
    return this.http.put<any>(API_URL + `trips/${tripId}`, {
      step: step1,


    }, httpOptions)
  }
  updateLocationTrip(tripId: number, step1: String, location1: String,): Observable<any> {
    return this.http.put<any>(API_URL + `trips-location/${tripId}`, {
      step: step1,
      location: location1,


    }, httpOptions)
  }

  updateOfferTrip(tripId: number, step1: String): Observable<any> {
    return this.http.put<any>(API_URL + `trips-offer/${tripId}`, {
      status: step1,



    }, httpOptions)
  }


  setOfferTrip(offerId: number, tripId: number): Observable<Offer> {
    return this.http.post<Offer>(API_URL + `trip-offer/${offerId}/trip/${tripId}`, { responseType: 'json' });
  }

  updateDatesTrip(tripId: number, step1: String, startDate1: Date, endDate1: Date): Observable<any> {
    return this.http.put<any>(API_URL + `trips-dates/${tripId}`, {
      step: step1,
      startDate: startDate1,
      endDate: endDate1,


    }, httpOptions)
  }

  updateIntervalTrip(tripId: number, startInterval1: String, endInterval1: String, step1: String,): Observable<any> {
    return this.http.put<any>(API_URL + `trips-interval/${tripId}`, {
      startInterval: startInterval1,
      endInterval: endInterval1,
      step: step1,


    }, httpOptions)
  }


  updateStatusPoll(pollId: number, status1: String): Observable<any> {
    return this.http.put<any>(API_URL + `poll-update-status/${pollId}`, {
      status: status1,


    }, httpOptions)
  }
}
