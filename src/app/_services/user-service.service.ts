import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

import { User } from '.././@types/User';
import { Group } from '.././@types/Group';

import { HttpHeaders } from '@angular/common/http';

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
export class UserServiceService {
  selectedUser: User;



  constructor(private http: HttpClient) { }
  getAllGroups(): Observable<any> {
    return this.http.get(API_URL + `groups`, httpOptions);
  }
  getGroups(userId: number): Observable<any> {
    return this.http.get(API_URL + `member-groups/${userId}`, httpOptions);
  }


  getGroupsWhereAdmin(userId: number): Observable<any> {
    return this.http.get(API_URL + `user-groups/${userId}`, httpOptions);
  }


  getUserDetails(userId: number): Observable<User> {
    return this.http.get<User>(API_URL + `user/${userId}`, { responseType: 'json' });
  }
  getUsers(): Observable<any> {
    return this.http.get(API_URL + "users", httpOptions);
  }

  getMembersGroup(groupId: number): Observable<any> {
    return this.http.get(API_URL + `members-group/${groupId}`, { responseType: 'json' });
  }

  ///member/{id}/group/{groupId} --- ADD MEMBRU LA GRUP
  addMembersGroup(groupId: number, userId: number): Observable<User> {
    return this.http.post<User>(API_URL + `member/${userId}/group/${groupId}`, { responseType: 'json' });
  }
  deleteMemberGroup(groupId: number, userId: number) {
    return this.http.delete(API_URL + `delete-member/${userId}/group/${groupId}`, { responseType: 'json' });
  }

  createGroup(group): Observable<any> {
    return this.http.post(API_URL + 'group', {
      groupName: group.groupName,

    }, httpOptions);
  }
  updateUser(userId: number, user): Observable<User> {
    return this.http.put<User>(API_URL + `users/${userId}`, user, httpOptions)
  }
  deleteGroup(groupId: number) {
    return this.http.delete(API_URL + `groups-delete/${groupId}`, { responseType: 'json' });
  }


  setAdminGroup(userId: number, groupId: number): Observable<User> {
    return this.http.post<User>(API_URL + `users-admin/${userId}/groups/${groupId}`, { responseType: 'json' });
  }

  createGroup2(userId: number, group): Observable<any> {
    return this.http.post(API_URL + `group/admin/${userId}`, {
      groupName: group.groupName,

    }, httpOptions);
  }

}
