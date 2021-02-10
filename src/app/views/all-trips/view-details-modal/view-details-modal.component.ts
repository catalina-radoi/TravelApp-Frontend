import { Component, ViewChild, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FilterPipe } from 'ngx-filter-pipe';
import { AlertService } from 'ngx-alerts';
import { FormGroupDirective, FormGroup } from '@angular/forms';

import { TRIPS } from '../../../mockups/mock-Trips';
import { Trip } from '../../../@types/Trip';
import { Subject } from 'rxjs';
import { UserServiceService } from '../../../_services/user-service.service';
import { Group } from '../../../@types/Group';
import { User } from '../../../@types/User';


@Component({
  selector: 'app-view-details-modal',
  templateUrl: './view-details-modal.component.html',
  styleUrls: ['./view-details-modal.component.css']
})
export class ViewDetailsModalComponent implements OnInit {

  public trips = TRIPS;
  public selectedTrip: Trip;
  public onClose: Subject<Trip>;
  groups: Group;
  grupId: number;
  members: User[];




  constructor(
    public bsModalRef: BsModalRef,
    private userService: UserServiceService,
  ) { }

  ngOnInit(): void {

    this.userService.getAllGroups().subscribe(groups => {

      for (let i = 0; i <= groups.length - 1; i++) {

        if (groups[i].groupName === this.selectedTrip.groupTrip.groupName) {
          this.groups = groups[i];

        }

      }
      console.log(this.groups);
      this.userService.getMembersGroup(this.groups.groupId).subscribe(members => (this.members = members));
      console.log(this.members);

    });




    // this.userService.getMembersGroup(this.groups.groupId).subscribe(members => (this.members = members));
    // console.log(this.members);


    this.onClose = new Subject();
  }
  public onCancel(): void {
    this.onClose.next();
    this.bsModalRef.hide();
  }

}
