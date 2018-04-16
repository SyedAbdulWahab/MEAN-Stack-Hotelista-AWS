import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReviewComponent } from './admin-review.component';

describe('AdminReviewComponent', () => {
  let component: AdminReviewComponent;
  let fixture: ComponentFixture<AdminReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
