import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDetailWeekComponent } from './create-detail-week.component';

describe('CreateDetailWeekComponent', () => {
  let component: CreateDetailWeekComponent;
  let fixture: ComponentFixture<CreateDetailWeekComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateDetailWeekComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateDetailWeekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
