import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OriginPlaceComponent } from './origin-place.component';

describe('OriginPlaceComponent', () => {
  let component: OriginPlaceComponent;
  let fixture: ComponentFixture<OriginPlaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OriginPlaceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OriginPlaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
