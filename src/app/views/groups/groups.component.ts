import { Component, TemplateRef, OnInit } from '@angular/core';
import { AlertService } from 'ngx-alerts';
import { FilterPipe } from 'ngx-filter-pipe';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { Group } from '../../@types/Group';
import { DeleteGroupModalComponent } from '../groups/delete-group-modal/delete-group-modal.component';
import { NewGroupModalComponent } from './new-group-modal/new-group-modal.component';
import { User } from '../../@types/User';
import { UserServiceService } from '../../_services/user-service.service';
import { EditGroupModalComponent } from './edit-group-modal/edit-group-modal.component';


@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})


export class GroupsComponent implements OnInit {



  public selectedGroup: Group;

  public groups: Group[];
  public groupsAdmin: Group[];
  public users: User[];
  public bsModalRef: BsModalRef;
  public groupFilter: any = { groupName: null };
  public currentUser: String;
  public currentUserId: number;



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
    this.bsModalRef = this.modalService.show(NewGroupModalComponent, {
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
    this.bsModalRef = this.modalService.show(EditGroupModalComponent, {
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

    // GRUPURI unde utilizatorul e MEMBRU
    this.userService.getGroups(this.currentUserId).subscribe(groups => (this.groups = groups));

    this.userService.getGroupsWhereAdmin(this.currentUserId).subscribe(groupsAdmin => (this.groupsAdmin = groupsAdmin));


  }


}
