import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { UserServiceService } from '../../../_services/user-service.service';
import { Group } from '../../../@types/Group';


@Component({
  selector: 'app-delete-group-modal',
  templateUrl: './delete-group-modal.component.html',
  styleUrls: ['./delete-group-modal.component.css']
})
export class DeleteGroupModalComponent implements OnInit {
  public onClose: Subject<boolean>;
  groupId: number;


  constructor(public bsModalRef: BsModalRef,
    private userService: UserServiceService) { }

  ngOnInit(): void {
    this.onClose = new Subject();
    console.log(this.groupId);
  }

  confirm(): void {
    this.onClose.next(true);
    this.bsModalRef.hide();
  }
  decline(): void {
    this.userService.deleteGroup(this.groupId)
      .subscribe(

      );
    this.onClose.next(false);
    this.bsModalRef.hide();
  }

}
