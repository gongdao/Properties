import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Unit } from './unit.model';
import { User } from 'src/app/users/user.model';

@ Injectable({providedIn: 'root'})
export class UnitsService {
  private units: Unit[] = [];
  private unitsUpdated = new Subject< {units: Unit[], unitCount: number}>();

  constructor(private http: HttpClient, private router: Router) {}

  getUnits(unitsPerPage: number, currentPage: number, currentUserId: string, currentUserRole: number) {
    // console.log('posts.services was run.');
    const userId: string = currentUserId;
    const role: number = currentUserRole;
    console.log('eath user id is ' + userId);
    let queryParams;
    if (role !== NaN && userId !== null) {
      queryParams = `?pagesize=${unitsPerPage}&page=${currentPage}&currentRole=${role}&currentUserId=${userId}`;
    }  else {
      queryParams = `?pagesize=${unitsPerPage}&page=${currentPage}`;
    }
    console.log('queryParams is ' + queryParams);
    this .http
      .get< { message: string; units: any; maxUnits: number }>(
        'http://localhost:3000/api/units' + queryParams
      )
      .pipe(
        map(unitData => {
          // console.log('unitData is ' + unitData);
          // console.log('imagePath[0] is ' + unitData.units[0].imagePath);
          return {
            units: unitData.units.map(unit => {
              return {
                id: unit._id,
                unitName: unit.unitName,
                orientation: unit.orientation,
                floor: unit.floor,
                bedroom: unit.bedroom,
                washroom: unit.washroom,
                area: unit.area,
                rent: unit.rent,
                imagePath: unit.imagePath,
                hostId: unit.hostId,
                status: unit.status
              };
          }),
          maxUnits: unitData.maxUnits
        };
      })
    )
    .subscribe(transformedUnitData => {
      console.log(transformedUnitData);
      this .units = transformedUnitData.units;
      this .unitsUpdated.next({
         units: [...this .units],
         unitCount: transformedUnitData.maxUnits
      });
    });
  }

  getUnitUpdateListener() {
    return this .unitsUpdated.asObservable();
  }

  getUnit(id: string) {
    return this .http.get< {
      _id: string,
      unitName: string,
      orientation: string,
      floor: number,
      bedroom: number,
      washroom: number,
      area: number,
      rent: number,
      imagePath: string,
      hostId: string,
      status: number
    }>(
      'http://localhost:3000/api/units/' + id
    );
  }

  addUnit(
      unitName: string,
      orientation: string,
      floor: number,
      bedroom: number,
      washroom: number,
      area: number,
      rent: number,
      image: File,
      hostId: string
    ) {
      // console.log('addUnit eas executed');
    const unitData = new FormData();
      unitData.append('unitName', unitName);
      unitData.append('orientation', orientation);
      unitData.append('floor', floor.toString());
      unitData.append('bedroom', bedroom.toString());
      unitData.append('washroom', washroom.toString());
      unitData.append('area', area.toString());
      unitData.append('rent', rent.toString());
      unitData.append('image', image, unitName);
      // console.log('addUnit was executed ' + unitData.toString() );
      // console.log('addUnit ws executed ' + unitData.get('area'));
      // console.log('addUnit was executed ' + unitData.get('floor'));
      // console.log('addUnit was executed id ' + unitData.get('id'));
      // console.log('addUnit was executed id ' + unitData.get('image'));
    this .http
      .post< { message: string, unit: Unit}>(
        'http://localhost:3000/api/units',
        unitData
      )
      .subscribe((responseData) => {
        console.log('correct.');
        // this .router.navigate(['/listUnit']);
      });
  }

  updateUnit(
      id: string,
      unitName: string,
      orientation: string,
      floor: number,
      bedroom: number,
      washroom: number,
      area: number,
      rent: number,
      image: File | string,
      hostId: string,
      status: number
    ) {
      console.log('id is ' + id);
    let unitData: Unit | FormData;
    if (typeof(image) === 'object') {
      // console.log('this is from image');
      unitData = new FormData();
      unitData.append('id', id);
      unitData.append('unitName', unitName);
      unitData.append('orientation', orientation);
      unitData.append('floor', floor.toString());
      unitData.append('bedroom', bedroom.toString());
      unitData.append('washroom', washroom.toString());
      unitData.append('area', area.toString());
      unitData.append('rent', rent.toString());
      unitData.append('image', image, unitName);
      unitData.append('hostId', hostId);
      unitData.append('status', status.toString());
    } else {
      // console.log('this is from no image');
      unitData = {
        id: id,
        unitName: unitName,
        orientation: orientation,
        floor: floor,
        bedroom: bedroom,
        washroom: washroom,
        area: area,
        rent: rent,
        imagePath: image,
        hostId: hostId,
        status: status
      };
    }
    this .http
      .put('http://localhost:3000/api/units/' + id, unitData)
      .subscribe(response => {
        // this .router.navigate(['/listUnit']);
      });
  }

  deletePost(unitId: string) {
    return this .http
      .delete( 'http://localhost:3000/api/units/' + unitId);
  }
}
