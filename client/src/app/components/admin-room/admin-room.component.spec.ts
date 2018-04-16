import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRoomComponent } from './admin-room.component';

describe('AdminRoomComponent', () => {
  let component: AdminRoomComponent;
  let fixture: ComponentFixture<AdminRoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminRoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
