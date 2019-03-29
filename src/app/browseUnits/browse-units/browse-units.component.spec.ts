import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseUnitsComponent } from './browse-units.component';

describe('BrowseUnitsComponent', () => {
  let component: BrowseUnitsComponent;
  let fixture: ComponentFixture<BrowseUnitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowseUnitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseUnitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
