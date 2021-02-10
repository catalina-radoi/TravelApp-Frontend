
import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroupDirective, FormGroup, NgForm } from '@angular/forms';
import { FilterPipe } from 'ngx-filter-pipe';

import { Group } from '../../../@types/Group';

import { User } from '../../../@types/User';

import { UserServiceService } from '../../../_services/user-service.service';
import { AlertService } from 'ngx-alerts';
import { TokenStorageService } from '../../../_services/token-storage.service';

const MEMBER = 'user_selectat';
const MEMBER2 = 'user_selectat_2';
const GROUP2 = 'grup_selectat';



@Component({
  selector: 'app-edit-group-modal',
  templateUrl: './edit-group-modal.component.html',
  styleUrls: ['./edit-group-modal.component.css']
})


export class EditGroupModalComponent implements OnInit {


  public currentGroup: Group;
  public currentGroupId: number;
  public group1: Group;
  public groups: Group[];
  private tokenStorage: TokenStorageService;
  public currentUser: String;

  public currentUserId: number;
  public users: User[];
  public admins: User[];
  public members: User[];
  public member1: number;
  public selectedGroup: Group;
  public selectedMember: User;
  public selectedUser: User;
  public onClose: Subject<Group>;
  public userFilter: any = { userName: null };
  roles: string[] = [];

  submitted = false;

  @ViewChild('groupForm', { static: false })
  userForm: FormGroupDirective;

  constructor(
    private alertService: AlertService,
    private userService: UserServiceService,
    public bsModalRef: BsModalRef,
    private filterPipe: FilterPipe,
  ) {


  }

  ngOnInit() {



    this.userService.getMembersGroup(this.selectedGroup.groupId).subscribe(members => (this.members = members));

    console.log(this.selectedGroup);

    this.onClose = new Subject();
    if (!this.selectedGroup) {
      this.selectedGroup = new Group();
    }
  }

  public onSave(): void {

    this.onClose.next(this.selectedGroup);
    this.bsModalRef.hide();
  }

  public onCancel(): void {
    this.onClose.next();
    this.bsModalRef.hide();
  }

}
