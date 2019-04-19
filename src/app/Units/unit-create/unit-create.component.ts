import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { UnitsService } from '../units.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Unit } from '../unit.model';
import { mimeType } from '../../posts/post-create/mime-type.validator';

@Component ({
  selector: 'app-unit-create',
  templateUrl: './unit-create.component.html',
  styleUrls: ['./unit-create.component.css']
})
export class UnitCreateComponent implements OnInit {
  unit: Unit;
  isLoading = false;
  unitForm: FormGroup;
  imagePreview: string;
  private mode = 'create';
  private unitId: string;

  constructor(
    public unitsService: UnitsService,
    public route: ActivatedRoute
  ) { }

  ngOnInit() {
    this .unitForm = new FormGroup({
      unitName: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      orientation: new FormControl(null, { validators: [Validators.required] }),
      floor: new FormControl(null, { validators: [Validators.required] }),
      bedroom: new FormControl(null, { validators: [Validators.required] }),
      washroom: new FormControl(null, { validators: [Validators.required] }),
      area: new FormControl(null, { validators: [Validators.required] }),
      rent: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      }),
      hostId: new FormControl(null, { }),
      status: new FormControl(null, { })
    });
    this .route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('unitId')) {
        // console.log('Begin to edit..');
        this .mode = 'edit';
        this .unitId = paramMap.get('unitId');
        this .isLoading = true;
        this .unitsService.getUnit(this .unitId).subscribe(unitData => {
          // console.log('imagePath is ' + unitData.imagePath);
          this .isLoading = false;
          this .unit = {
            id: unitData._id,
            unitName: unitData.unitName,
            orientation: unitData.orientation,
            floor: unitData.floor,
            bedroom: unitData.bedroom,
            washroom: unitData.washroom,
            area: unitData.area,
            rent: unitData.rent,
            imagePath: unitData.imagePath,
            hostId: '',  // can't be null
            status: unitData.status,
            createDate: unitData.createDate
          };
          // console.log('imagepath is ' + unitData.imagePath);
          this .unitForm.setValue({
            'unitName': this .unit.unitName,
            'orientation': this .unit.orientation,
            'floor': this .unit.floor,
            'bedroom': this .unit.bedroom,
            'washroom': this .unit.washroom,
            'area': this .unit.area,
            'rent': this .unit.rent,
            image: this .unit.imagePath,
            'hostId': this .unit.hostId,
            'status': this.unit.status
          });
        });
      } else {
        this .mode = 'create';
        this .unitId = null;
        this .unit = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this .unitForm.patchValue({image: file});
    this .unitForm.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this .imagePreview = reader.result.toString(); // toString() is added by me
      // console.log('imagePreview is ' + this.imagePreview);
    };
    reader.readAsDataURL(file);
  }

  onSaveUnit() {
    if ( this .unitForm.invalid) {
      console.log('form is invalid. ');
      return;
    }
    console.log('the form is valid. ');
    this .isLoading = true;
    if (this . mode === 'create') {
      console.log('mode = ' + this .mode);
      this . unitsService.addUnit(
        this .unitForm.value.unitName,
        this .unitForm.value.orientation,
        this .unitForm.value.floor,
        this.unitForm.value.bedroom,
        this .unitForm.value.washroom,
        this. unitForm.value.area,
        this.unitForm.value.rent,
        this .unitForm.value.image,
        this.unitForm.value.hostId);
    } else {
      // console.log('id = ' + this .unitId);
      this .unitsService.updateUnit(
        this .unitId,
        this .unitForm.value.unitName,
        this .unitForm.value.orientation,
        this .unitForm.value.floor.toString(),
        this.unitForm.value.bedroom.toString(),
        this .unitForm.value.washroom.toString(),
        this. unitForm.value.area.toString(),
        this.unitForm.value.rent.toString(),
        this .unitForm.value.image,
        this.unitForm.value.hostId,
        this.unit.status,
        this.unit.createDate
      );
      // console.log('image = ' + this .unitForm.value.image);
    }
    this .unitForm.reset();
  }
}
