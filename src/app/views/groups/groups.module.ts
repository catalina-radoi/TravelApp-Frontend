import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FilterPipeModule } from 'ngx-filter-pipe';


import { NewGroupModalComponent } from './new-group-modal/new-group-modal.component';
import { DeleteGroupModalComponent } from './delete-group-modal/delete-group-modal.component';
import { EditGroupModalComponent } from './edit-group-modal/edit-group-modal.component';


import { GroupsComponent } from './groups.component';
import { GroupsRoutingModule } from './groups-routing.module';



@NgModule({
  declarations: [
    NewGroupModalComponent,
    DeleteGroupModalComponent,
    EditGroupModalComponent,
    GroupsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    GroupsRoutingModule,
    ModalModule.forRoot(),
    FilterPipeModule

  ],
  entryComponents: [
    NewGroupModalComponent,
    DeleteGroupModalComponent,
    EditGroupModalComponent,

  ]
})
export class GroupsModule { }
