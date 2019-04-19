import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';

import { Unit } from '../../Units/unit.model';
import { UnitsService } from '../../Units/units.service';
import { AuthService } from '../../auth/auth.service';
import { User } from 'src/app/users/user.model';

@Component({
  selector: 'app-browse-units',
  templateUrl: './browse-units.component.html',
  styleUrls: ['./browse-units.component.css']
})
export class BrowseUnitsComponent implements OnInit {

  units: Unit[] = [];
  isLoading = false;
  role = 0;
  ui: string;
  user: User;
  unitHost: User;
  unit: Unit;
  userId: string;
  totalUnits = 0;
  unitsPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [5, 10, 15, 20];
  userIsAuthenticated = false;
  private unitsSub: Subscription;
  private authStatusSub: Subscription;
  private roleUpdateListenerSubs: Subscription;

 constructor(public unitsService: UnitsService, private authService: AuthService) {}

 ngOnInit() {
   // console.log('user role is ' + ur);
   this .isLoading = true;
   this.userId = this.authService.getUserId();
   this.role = this.authService.getUserRole();
   console.log('userId is ' + this.userId);
   console.log('user role is ' + this.role);
   this .unitsService.getUnits(this .unitsPerPage, this .currentPage, this.userId, this.role);
   this .unitsSub = this .unitsService
     .getUnitUpdateListener()
     .subscribe((unitData: {units: Unit[], unitCount: number}) => {
         this .isLoading = false;
         this .totalUnits = unitData.unitCount;
         this .units = unitData.units;
         // console.log('status[0] is ' + this.units[0].status);
         // console.log('rent[0] is ' + this.units[0].rent);
         // console.log('imagePath[0] is ' + this.units[0].imagePath);
         // console.log('imagePath[1] is ' + unitData.units[1].imagePath);
     });
     this .userIsAuthenticated = this .authService.getIsAuth();
     this .authStatusSub = this.authService
       .getAuthStatusListener()
       .subscribe(isAuthenticated => {
         this .userIsAuthenticated = isAuthenticated;
         this.userId = this.authService.getUserId();
         this.role = this.authService.getUserRole();
     });
 }

 onChangedPage(pageData: PageEvent) {
   // console.log(pageData);
   this .isLoading = true;
   this .currentPage = pageData.pageIndex + 1;
   this .unitsPerPage = pageData.pageSize;
   console.log('changed.');
   this .unitsService.getUnits(this .unitsPerPage, this .currentPage, this.userId, this.role);
 }

 onBook(unitId: string) {
    this .isLoading = true;
    this .unitsService.getUnit(unitId).subscribe(unitData => {
      // console.log('imagePath is ' + unitData.imagePath);
      // console.log('unitName is ' + unitData.unitName);
      this .isLoading = false;
      this.unit = {
        id: unitData._id,
        unitName: unitData.unitName,
        orientation: unitData.orientation,
        floor: unitData.floor,
        bedroom: unitData.bedroom,
        washroom: unitData.washroom,
        area: unitData.area,
        rent: unitData.rent,
        imagePath: unitData.imagePath,
        hostId: this.userId,  // can't be null
        status: 20,
        createDate: unitData.createDate
      };
      this.unitsService.updateUnit(unitId, // can't write outside this subscribe
        this.unit.unitName,
        this.unit.orientation,
        this.unit.floor,
        this.unit.bedroom,
        this.unit.washroom,
        this.unit.area,
        this.unit.rent,
        this.unit.imagePath,
        this.unit.hostId,
        20,
        this.unit.createDate
      );
    });
    this .isLoading = true;
    this.authService.getUserById(this .userId);
    this .authService.getUserThroughIdUpdated().subscribe(userData => {
       console.log('userData email really is ' + userData.email);
      this .isLoading = false;
      this.user = userData;

      console.log('this.unitHost.email is ' + this.user.email);
      this .authService.updateUser(this.userId, this.user.email, this.user.password, 15);
      this.role = 15;
      this .unitsService.getUnits(this .unitsPerPage, this .currentPage, this.userId, this.role);
      this .authService.navigate(15);

    });

  // console.log('this.unitHost.email is ' + this.unitHost.email);
  // console.log('this.unitHost.password is ' + this.unitHost.password);

 }

 onCancel(unitId: string){
  this .isLoading = true;
    this .unitsService.getUnit(unitId).subscribe(unitData => {
       console.log('imagePath is ' + unitData.imagePath);
       console.log('unitName is ' + unitData.unitName);
      this .isLoading = false;
      this.unit = {
        id: unitData._id,
        unitName: unitData.unitName,
        orientation: unitData.orientation,
        floor: unitData.floor,
        bedroom: unitData.bedroom,
        washroom: unitData.washroom,
        area: unitData.area,
        rent: unitData.rent,
        imagePath: unitData.imagePath,
        hostId: null,  // can't be null
        status: 0,
        createDate: unitData.createDate
      };
      this.unitsService.updateUnit(unitId, // can't write outside this subscribe
        this.unit.unitName,
        this.unit.orientation,
        this.unit.floor,
        this.unit.bedroom,
        this.unit.washroom,
        this.unit.area,
        this.unit.rent,
        this.unit.imagePath,
        null,
        0,
        this.unit.createDate
      );
    });

    this .isLoading = true;
    this.authService.getUserById(this .userId);
    this .authService.getUserThroughIdUpdated().subscribe(userData => {
       console.log('userData email really is ' + userData.email);
      this .isLoading = false;
      this.user = userData;

      console.log('this.unitHost.email is ' + this.user.email);
      this .authService.updateUser(this.userId, this.user.email, this.user.password, 11);
      this.role = 11;
      this .unitsService.getUnits(this .unitsPerPage, this .currentPage, this.userId, this.role);
      this .authService.navigate(11);

    });
 }

 onGrant(unitId: string) {
  this .isLoading = true;
  let hostId: string; // local variable
  this .unitsService.getUnit(unitId).subscribe(unitData => {
     console.log('imagePath is ' + unitData.imagePath);
     console.log('unitName is ' + unitData.unitName);
    this .isLoading = false;
    hostId = unitData.hostId;
    this.unit = {
      id: unitData._id,
      unitName: unitData.unitName,
      orientation: unitData.orientation,
      floor: unitData.floor,
      bedroom: unitData.bedroom,
      washroom: unitData.washroom,
      area: unitData.area,
      rent: unitData.rent,
      imagePath: unitData.imagePath,
      hostId: unitData.hostId,  // can't be null
      status: 10,
      createDate: unitData.createDate
    };
    this.unitsService.updateUnit(unitId, // can't write outside this subscribe
      this.unit.unitName,
      this.unit.orientation,
      this.unit.floor,
      this.unit.bedroom,
      this.unit.washroom,
      this.unit.area,
      this.unit.rent,
      this.unit.imagePath,
      this.unit.hostId,
      10,
      this.unit.createDate
    );

    this .isLoading = true;
    console.log(' hostId is ' + hostId);
    this.authService.getUserById(hostId);
    this .authService.getUserThroughIdUpdated().subscribe(userData => {
      console.log('userData email really is ' + userData.email);
      this .isLoading = false;
      this.user = userData;

      console.log('this.unitHost.email is ' + this.user.email);
      this .authService.updateUser(hostId, this.user.email, this.user.password, 11);
      this .unitsService.getUnits(this .unitsPerPage, this .currentPage, this.userId, this.role);
      this .authService.navigate(11);
    });

  });

 }

 onDecline(unitId: string) {
  this .isLoading = true;
  let hostId: string; // local variable
  this .unitsService.getUnit(unitId).subscribe(unitData => {
     console.log('imagePath is ' + unitData.imagePath);
     console.log('unitName is ' + unitData.unitName);
    this .isLoading = false;
    hostId = unitData.hostId;
    this.unit = {
      id: unitData._id,
      unitName: unitData.unitName,
      orientation: unitData.orientation,
      floor: unitData.floor,
      bedroom: unitData.bedroom,
      washroom: unitData.washroom,
      area: unitData.area,
      rent: unitData.rent,
      imagePath: unitData.imagePath,
      hostId: unitData.hostId,  // can't be null
      status: 0,
      createDate: unitData.createDate
    };
    this.unitsService.updateUnit(unitId, // can't write outside this subscribe
      this.unit.unitName,
      this.unit.orientation,
      this.unit.floor,
      this.unit.bedroom,
      this.unit.washroom,
      this.unit.area,
      this.unit.rent,
      this.unit.imagePath,
      null,
      0,
      this.unit.createDate
    );

    this .isLoading = true;
    console.log(' hostId is ' + hostId);
    this.authService.getUserById(hostId);
    this .authService.getUserThroughIdUpdated().subscribe(userData => {
      console.log('userData email really is ' + userData.email);
      this .isLoading = false;
      this.user = userData;

      console.log('this.unitHost.email is ' + this.user.email);
      this .authService.updateUser(hostId, this.user.email, this.user.password, 11);
      this .unitsService.getUnits(this .unitsPerPage, this .currentPage, this.userId, this.role);
      this .authService.navigate(11);
    });
  });
 }

 onClearTenant(unitId: string) {
  this .isLoading = true;
  let hostId: string; // local variable
  this .unitsService.getUnit(unitId).subscribe(unitData => {
     console.log('imagePath is ' + unitData.imagePath);
     console.log('unitName is ' + unitData.unitName);
    this .isLoading = false;
    hostId = unitData.hostId;
    this.unit = {
      id: unitData._id,
      unitName: unitData.unitName,
      orientation: unitData.orientation,
      floor: unitData.floor,
      bedroom: unitData.bedroom,
      washroom: unitData.washroom,
      area: unitData.area,
      rent: unitData.rent,
      imagePath: unitData.imagePath,
      hostId: unitData.hostId,  // can't be null
      status: 0,
      createDate: unitData.createDate
    };
    this.unitsService.updateUnit(unitId, // can't write outside this subscribe
      this.unit.unitName,
      this.unit.orientation,
      this.unit.floor,
      this.unit.bedroom,
      this.unit.washroom,
      this.unit.area,
      this.unit.rent,
      this.unit.imagePath,
      null,
      0,
      this.unit.createDate
    );
    this .unitsService.getUnits(this .unitsPerPage, this .currentPage, this.userId, this.role);
  });
 }

 ngOnDestroy() {
  this .unitsSub.unsubscribe();
  this .authStatusSub.unsubscribe();
 }
}
