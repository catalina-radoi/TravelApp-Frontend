import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewGroupModalComponent } from './new-group-modal/new-group-modal.component';
import { DeleteGroupModalComponent } from './delete-group-modal/delete-group-modal.component';
import { EditGroupModalComponent } from './edit-group-modal/edit-group-modal.component';
import { GroupsComponent } from './groups.component';

const routes: Routes = [
  {
    path: '',
    // component: GroupsComponent,
    data: {
      title: 'Groups'
    },


    children: [
      {
        path: '',
        component: GroupsComponent,
        data: {
          title: ''
        }

      },
      {
        path: 'new',
        component: NewGroupModalComponent,
        data: {
          title: 'New Group'
        }
      },
      {
        path: 'delete',
        component: DeleteGroupModalComponent,
        data: {
          title: 'Delete Group'
        }
      },
      {
        path: 'edit',
        component: EditGroupModalComponent,
        data: {
          title: 'Edit Group'
        }
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupsRoutingModule { }
