import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScripthackComponent } from './scripthack.component';

describe('ScripthackComponent', () => {
  let component: ScripthackComponent;
  let fixture: ComponentFixture<ScripthackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScripthackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScripthackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
