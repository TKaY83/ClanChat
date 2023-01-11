import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChannelMainComponent } from './channel-main.component';

describe('ChannelComponent', () => {
  let component: ChannelMainComponent;
  let fixture: ComponentFixture<ChannelMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChannelMainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChannelMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
