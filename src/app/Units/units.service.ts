import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Unit } from './unit.model';

@ Injectable({providedIn: 'root'})
export class UnitsService {
  private units: Unit[] = [];
  private unitsUpdated = new Subject< {units: Unit[], unitCount: number}>();

  constructor(private http: HttpClient, private router: Router) {}

  getUnits(unitsPerPage: number, currentPage: number) {
    // console.log('posts.services was run.');
    const queryParams = `?pagesize=${unitsPerPage}&page=${currentPage}`;
    this .http
      .get< { message: string; units: any; maxUnits: number }>(
        'http://localhost:3000/api/units' + queryParams
      )
      .pipe(
        map(unitData => {
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
                imagePath: unit.imagepath,
                hostId: unit.hostId
              };
          }),
          maxUnits: unitData.maxUnits
        };
      })
    )
    .subscribe(transformedPostData => {
      console.log(transformedPostData);
      this .units = transformedPostData.units;
      this .unitsUpdated.next({
         units: [...this .units],
         unitCount: transformedPostData.maxUnits
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
      hostId: string}>(
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
      console.log('addUnit eas executed');
    const unitData = new FormData();
      unitData.append('unitName', unitName);
      unitData.append('orientation', orientation);
      unitData.append('floor', floor.toString());
      unitData.append('bedroom', bedroom.toString());
      unitData.append('washroom', washroom.toString());
      unitData.append('area', area.toString());
      unitData.append('rent', rent.toString());
      unitData.append('image', image, unitName);
      console.log('addUnit was executed ' + unitData.toString() );
      console.log('addUnit ws executed ' + unitData.get('area'));
      console.log('addUnit was executed ' + unitData.get('floor'));
      console.log('addUnit was executed id ' + unitData.get('id'));
      console.log('addUnit was executed id ' + unitData.get('image'));
    this .http
      .post< { message: string, unit: Unit}>(
        'http://localhost:3000/api/units',
        unitData
      )
      .subscribe((responseData) => {
        console.log('correct.');
        this .router.navigate(['/listUnit']);
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
      hostId: string
    ) {
    let unitData: Unit | FormData;
    if (typeof(image) === 'object') {
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
      // unitData.append('hostId', hostId);
    } else {
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
        hostId: hostId
      };
    }
    this .http
      .put('http://localhost:3000/api/units/' + id, unitData)
      .subscribe(response => {
        this .router.navigate(['/']);
      });
  }

  deletePost(unitId: string) {
    return this .http
      .delete( 'http://localhost:3000/api/units/' + unitId);
  }
}
