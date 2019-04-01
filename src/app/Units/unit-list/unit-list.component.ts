import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';

import { Unit } from '../unit.model';
import { UnitsService } from '../units.service';
import { AuthService } from '../../auth/auth.service';
import { User } from 'src/app/users/user.model';

@Component({
  selector: 'app-unit-list',
  templateUrl: './unit-list.component.html',
  styleUrls: ['./unit-list.component.css']
})
export class UnitListComponent implements OnInit {

   units: Unit[] = [];
   isLoading = false;
   totalUnits = 0;
   role: number;
   user: User;
   userId: string;
   unitsPerPage = 5;
   currentPage = 1;
   pageSizeOptions = [5, 10, 15, 20];
   userIsAuthenticated = false;
   private unitsSub: Subscription;
   private authStatusSub: Subscription;
   private roleUpdateListenerSubs: Subscription;

  constructor(public unitsService: UnitsService, private authService: AuthService) {}

  ngOnInit() {
    this .isLoading = true;
    this.userId = this.authService.getUserId();
    this.role = this.authService.getUserRole();
    this .unitsService.getUnits(this .unitsPerPage, this .currentPage, this.userId, this.role);
    this .unitsSub = this .unitsService
      .getUnitUpdateListener()
      .subscribe((unitData: {units: Unit[], unitCount: number}) => {
          this .isLoading = false;
          this .totalUnits = unitData.unitCount;
          this .units = unitData.units;
          // console.log('rent[0] is ' + this.units[0].rent);
          // console.log('imagePath[0] is ' + this.units[0].imagePath);
          // console.log('imagePath[1] is ' + unitData.units[1].imagePath);
      });
      this .userIsAuthenticated = this .authService.getIsAuth();
      this .authStatusSub = this.authService
        .getAuthStatusListener()
        .subscribe(isAuthenticated => {
          this .userIsAuthenticated = isAuthenticated;
      });
  }

  onChangedPage(pageData: PageEvent) {
    // console.log(pageData);
    this .isLoading = true;
    this .currentPage = pageData.pageIndex + 1;
    this .unitsPerPage = pageData.pageSize;
    this .unitsService.getUnits(this .unitsPerPage, this .currentPage, this.userId, this.role);
  }

  onDelete(unitId: string) {
    this .isLoading = true;
    this .unitsService.deletePost(unitId).subscribe(() => {
      this.totalUnits --;
      console.log('current page is ' + this.currentPage);
      if(this.totalUnits % this.unitsPerPage === 0 && this.currentPage === 1 + this.totalUnits / this.unitsPerPage) {
        this.currentPage --;
      }
      console.log('current page is ' + this.currentPage);
      console.log('total page is ' + this.totalUnits);
      console.log('posts per page is ' + this.unitsPerPage);
      this .unitsService.getUnits(this .unitsPerPage, this .currentPage, this.userId, this.role);
    });
  }

  ngOnDestroy() {
   this .unitsSub.unsubscribe();
   this .authStatusSub.unsubscribe();
  }
}
