import { Component, OnInit } from '@angular/core';
import { navItems } from '../../_nav';
import { UserService } from '../../_services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements OnInit {
  public sidebarMinimized = false;
  public navItems = navItems;
  content: string;

  constructor(private userService: UserService) { }
  toggleMinimize(e) {
    this.sidebarMinimized = e;



  }
  ngOnInit() {
    this.userService.getPublicContent().subscribe(
      data => {
        this.content = data;
      },
      err => {
        this.content = JSON.parse(err.error).message;
      }
    );
  }
}
