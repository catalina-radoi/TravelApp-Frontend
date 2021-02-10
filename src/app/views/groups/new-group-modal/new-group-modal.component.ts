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
  selector: 'app-new-group-modal',
  templateUrl: './new-group-modal.component.html',
  styleUrls: ['./new-group-modal.component.css']
})
export class NewGroupModalComponent implements OnInit {


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
  groupForm: FormGroupDirective;

  constructor(
    private alertService: AlertService,
    private userService: UserServiceService,
    public bsModalRef: BsModalRef,
    private filterPipe: FilterPipe,
  ) {


  }

  ngOnInit() {
    this.roles = JSON.parse(sessionStorage.getItem('auth-user')).roles;
    this.currentUserId = JSON.parse(sessionStorage.getItem('auth-user')).userId;
    // this.currentGroupId = JSON.parse(sessionStorage.getItem('grup_selectat')).groupId;

    console.log(this.currentUserId);

    ///member/{id}/group/{groupId} --- ADD MEMBRU LA GRUP

    //ia toti userii si ii baga in lista de useri
    this.userService.getUsers().subscribe(users => (this.users = users));


    this.userService.getMembersGroup(this.selectedGroup.groupId).subscribe(members => (this.members = members));

    console.log(this.selectedGroup);

    this.onClose = new Subject();
    if (!this.selectedGroup) {
      this.selectedGroup = new Group();
    }
  }
  RowSelected(user: User) {
    this.selectedUser = user;
    //salvam in session storage userul selectat din tabel
    window.sessionStorage.setItem(MEMBER, JSON.stringify(user));
    console.log(user);
  }

  RowSelected1(member: User) {
    this.selectedMember = member;
    window.sessionStorage.setItem(MEMBER2, JSON.stringify(member));
    console.log(member);
  }

  onAdd() {
    //user selectat

    this.member1 = JSON.parse(sessionStorage.getItem('user_selectat')).userId;
    console.log(this.member1);
    console.log(this.selectedGroup);

    this.userService.addMembersGroup(this.selectedGroup.groupId, this.member1)
      .subscribe(
        (user: User) => {
          // (1) add user to list or (2) !!! getUsers form server

          this.users.push(user);
          this.userService.getMembersGroup(this.selectedGroup.groupId).subscribe(members => (this.members = members));
          this.alertService.success('The user has been added successfully');
        }, (error) => {
          // keep old list
          console.log(error);
          this.alertService.danger('The user failed to be added');
        });

  }

  onAdd2() {
    //user selectat

    this.member1 = JSON.parse(sessionStorage.getItem('user_selectat')).userId;
    console.log(this.member1);

    // iau id group nou creat
    this.currentGroup = JSON.parse(sessionStorage.getItem(GROUP2));
    console.log(this.currentGroup);


    this.userService.addMembersGroup(this.currentGroup.groupId, this.member1)
      .subscribe(
        (user: User) => {
          // (1) add user to list or (2) !!! getUsers form server

          this.users.push(user);
          this.userService.getMembersGroup(this.currentGroup.groupId).subscribe(members => (this.members = members));
          this.alertService.success('The user has been added successfully');
        }, (error) => {
          // keep old list
          console.log(error);
          this.alertService.danger('The user failed to be added');
        });

  }


  onCreate(groupForm: NgForm) {

    this.userService.createGroup2(this.currentUserId, groupForm.value)
      .subscribe(
        data => {
          window.sessionStorage.setItem(GROUP2, JSON.stringify(data));
          this.alertService.success('The group has been added successfully');
        }, (error) => {
          console.log(error);
          this.alertService.danger('The group failed to be added');
        });

    this.currentGroupId = JSON.parse(sessionStorage.getItem('grup_selectat')).groupId;
    console.log(this.currentGroupId);

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

  onDelete() {
    this.member1 = JSON.parse(sessionStorage.getItem('user_selectat_2')).userId;
    console.log(this.member1);

    this.userService.deleteMemberGroup(this.selectedGroup.groupId, this.member1)
      .subscribe(

      );
    this.userService.getMembersGroup(this.selectedGroup.groupId).subscribe(members => (this.members = members));


  }
  onDelete2() {
    this.currentGroup = JSON.parse(sessionStorage.getItem(GROUP2));
    console.log(this.currentGroup);

    this.member1 = JSON.parse(sessionStorage.getItem('user_selectat_2')).userId;
    console.log(this.member1);

    this.userService.deleteMemberGroup(this.currentGroup.groupId, this.member1)
      .subscribe(

      );
    this.userService.getMembersGroup(this.currentGroup.groupId).subscribe(members => (this.members = members));


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
