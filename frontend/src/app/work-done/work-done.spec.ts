import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkDone } from './work-done';

describe('WorkDone', () => {
  let component: WorkDone;
  let fixture: ComponentFixture<WorkDone>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkDone],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkDone);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
