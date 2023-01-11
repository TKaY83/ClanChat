import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobilComponent } from './mobil.component';

describe('MobilComponent', () => {
  let component: MobilComponent;
  let fixture: ComponentFixture<MobilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobilComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
