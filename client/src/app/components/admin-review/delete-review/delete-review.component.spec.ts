import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteReviewComponent } from './delete-review.component';

describe('DeleteReviewComponent', () => {
  let component: DeleteReviewComponent;
  let fixture: ComponentFixture<DeleteReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
