import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWeekComponent } from './create-week.component';

describe('CreateWeekComponent', () => {
  let component: CreateWeekComponent;
  let fixture: ComponentFixture<CreateWeekComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateWeekComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateWeekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
