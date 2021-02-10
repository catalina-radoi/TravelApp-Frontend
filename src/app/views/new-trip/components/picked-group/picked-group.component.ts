
import { Component, TemplateRef, OnInit } from '@angular/core';
import { AlertService } from 'ngx-alerts';
import { FilterPipe } from 'ngx-filter-pipe';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { Group } from '../../../../@types/Group';

import { User } from '../../../../@types/User';
import { UserServiceService } from '../../../../_services/user-service.service';
import { DetailsComponent } from './details/details.component';

import { NewEditGroupModalComponent } from '../picked-group/new-edit-group-modal/new-edit-group-modal.component';
import { TripService } from '../../../../_services/trip.service';
import { Trip } from '../../../../@types/Trip';

@Component({
  selector: 'app-picked-group',
  templateUrl: './picked-group.component.html',
  styleUrls: ['./picked-group.component.css']
})
export class PickedGroupComponent implements OnInit {

  public selectedGroup: Group;

  public groups: Group[];
  public groupsAdmin: Group[];
  public users: User[];
  public bsModalRef: BsModalRef;
  public groupFilter: any = { groupName: null };
  public currentUser: String;
  public currentUserId: number;
  public currentTripId: number;
  public tripsAdmin: Trip;

  onPick(group: Group) {
    this.selectedGroup = group;
    console.log(group);

    if (JSON.parse(sessionStorage.getItem('created_trip'))) {
      this.currentTripId = JSON.parse(sessionStorage.getItem('created_trip')).tripId;
      console.log(this.currentTripId);
    } else {
      //TRIPS OPENED WHERE ADMIN
      this.tripService.getTripsWhereAdmin(this.currentUserId).subscribe((tripsAdmin: Trip[]) => {

        for (var i = 0; i <= (tripsAdmin.length - 1); i++) {
          if (tripsAdmin[i].status == "opened") {
            console.log(tripsAdmin[i]);
            this.tripsAdmin = tripsAdmin[i];
            window.sessionStorage.setItem('trip_opened', JSON.stringify(this.tripsAdmin));
          }
        }
      });
      this.currentTripId = JSON.parse(sessionStorage.getItem('trip_opened')).tripId;
      console.log(this.currentTripId);

    }


    this.tripService.setGroupTrip(this.selectedGroup.groupId, this.currentTripId)
      .subscribe(
        (group1: Group) => {
          this.groups.push(group1);
          window.sessionStorage.setItem('grup_trip', JSON.stringify(group1));
          this.alertService.success('The group has been added successfully');
        }, (error) => {
          console.log(error);
          this.alertService.danger('The group failed to be added');
        });


  }


  onDelete(groupId: number) {
    console.log(groupId);
    this.userService.deleteGroup(groupId).subscribe(
      (success) => {
        for (let i = 0; i < this.groups.length; i++) {
          if (this.groups[i].groupId == groupId) {
            this.groups.splice(i, 1);
          }
        }
        this.alertService.success("The group has been deleted successfully");
      },
      (error) => {
        console.log(error);
        this.alertService.danger(error.error.message);
      }
    );
  }
  onChange(group: Group) {
    this.selectedGroup = group;
    this.openModalWithComponent3(group);
  }

  onDetails(group: Group) {
    this.selectedGroup = group;
    this.openModalWithComponent4(group);
  }

  constructor(
    private tripService: TripService,
    private userService: UserServiceService,
    private modalService: BsModalService,
    private alertService: AlertService,
    private filterPipe: FilterPipe,
  ) { }
  // openModal(template: TemplateRef<any>) {
  //   this.bsModalRef = this.modalService.show(template);
  // }

  openModalWithComponent3(pSelectedGroup: Group) {
    const tempState = {
      selectedGroup: { ...pSelectedGroup }
    };
    this.bsModalRef = this.modalService.show(NewEditGroupModalComponent, {
      initialState: tempState,
      class: "modal-lg"
    });
    this.bsModalRef.content.onClose.subscribe(
      (result: Group) => {
        // set details to selected user from table
        this.selectedGroup.groupName = result.groupName;

      }
    );
  }
  openModalWithComponent4(pSelectedGroup: Group) {
    const tempState = {
      selectedGroup: { ...pSelectedGroup }
    };
    this.bsModalRef = this.modalService.show(DetailsComponent, {
      initialState: tempState,
      class: "modal-lg"
    });
    this.bsModalRef.content.onClose.subscribe(
      (result: Group) => {
        // set details to selected user from table
        this.selectedGroup.groupName = result.groupName;

      }
    );
  }

  ngOnInit(): void {


    //GET USER FROM LOGIN SESSION
    this.currentUser = sessionStorage.getItem('auth-user');

    console.log(this.currentUser);
    this.currentUserId = JSON.parse(sessionStorage.getItem('auth-user')).userId;

    console.log(this.currentUserId);


    this.userService.getGroups(this.currentUserId).subscribe(groups => (this.groups = groups));

    this.userService.getGroupsWhereAdmin(this.currentUserId).subscribe(groupsAdmin => (this.groupsAdmin = groupsAdmin));
    // this.userService.getUsers().subscribe(users => (this.users = users));

    // this.userService.getGroups(5).subscribe((groups: Group[]) => {
    //   console.log(groups);
    // });

  }

  updateTrip() {

    ///
    //        GET CURRENT TRIP
    //
    if (JSON.parse(sessionStorage.getItem('created_trip'))) {
      this.currentTripId = JSON.parse(sessionStorage.getItem('created_trip')).tripId;
      console.log(this.currentTripId);
    } else {
      //TRIPS OPENED WHERE ADMIN
      this.tripService.getTripsWhereAdmin(this.currentUserId).subscribe((tripsAdmin: Trip[]) => {

        for (var i = 0; i <= (tripsAdmin.length - 1); i++) {
          if (tripsAdmin[i].status == "opened") {
            console.log(tripsAdmin[i]);
            this.tripsAdmin = tripsAdmin[i];
            window.sessionStorage.setItem('trip_opened', JSON.stringify(this.tripsAdmin));
          }
        }
      });
      this.currentTripId = JSON.parse(sessionStorage.getItem('trip_opened')).tripId;
      console.log(this.currentTripId);

    }
    ///
    //

    //UPDATE STATUS TRIP

    this.tripService.updateStepTrip(this.currentTripId, 'pick-interval')
      .subscribe(
        data => {


          this.alertService.success('The user has been updated successfully');
        }, (error) => {
          console.log(error);
          this.alertService.danger('The user failed to be updated');
        }
      );
  }


}
