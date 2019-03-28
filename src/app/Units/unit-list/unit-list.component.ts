import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';

import { Unit } from '../unit.model';
import { UnitsService } from '../units.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-unit-list',
  templateUrl: './unit-list.component.html',
  styleUrls: ['./unit-list.component.css']
})
export class UnitListComponent implements OnInit {

   units: Unit[] = [];
   isLoading = false;
   totalUnits = 0;
   unitsPerPage = 2;
   currentPage = 1;
   pageSizeOptions = [1, 2, 5, 10];
   userIsAuthenticated = false;
   private unitsSub: Subscription;
   private authStatusSub: Subscription;

  constructor(public unitsService: UnitsService, private authService: AuthService) {}

  ngOnInit() {
    this .isLoading = true;
    this .unitsService.getUnits(this .unitsPerPage, this .currentPage);
    this .unitsSub = this .unitsService
      .getUnitUpdateListener()
      .subscribe((unitData: {units: Unit[], unitCount: number}) => {
          this .isLoading = false;
          this .totalUnits = unitData.unitCount;
          this .units = unitData.units;
          console.log('imagePath[1] is ' + unitData.units[1].imagePath.toString());
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
    this .unitsService.getUnits(this .unitsPerPage, this .currentPage);
  }

  onDelete(unitId: string) {
    this .isLoading = true;
    this .unitsService.deletePost(unitId).subscribe(() => {
      this.totalUnits --;
      console.log('current page is ' + this.currentPage);
      if(this.totalUnits % this.unitsPerPage === 0 && this.currentPage === 1 + this.totalUnits / this.unitsPerPage){
        this.currentPage --;
      }
      console.log('current page is ' + this.currentPage);
      console.log('total page is ' + this.totalUnits);
      console.log('posts per page is ' + this.unitsPerPage);
      this .unitsService.getUnits(this .unitsPerPage, this .currentPage);
    });
  }

  ngOnDestroy() {
   this .unitsSub.unsubscribe();
   this .authStatusSub.unsubscribe();
  }
}
