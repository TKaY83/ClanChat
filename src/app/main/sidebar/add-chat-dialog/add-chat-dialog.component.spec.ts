import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddChatDialogComponent } from './add-chat-dialog.component';

describe('AddChatDialogComponent', () => {
  let component: AddChatDialogComponent;
  let fixture: ComponentFixture<AddChatDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddChatDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddChatDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
