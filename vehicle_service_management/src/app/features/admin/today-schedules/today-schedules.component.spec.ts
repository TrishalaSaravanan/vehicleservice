import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodaySchedulesComponent } from './today-schedules.component';

describe('TodaySchedulesComponent', () => {
  let component: TodaySchedulesComponent;
  let fixture: ComponentFixture<TodaySchedulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodaySchedulesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodaySchedulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
