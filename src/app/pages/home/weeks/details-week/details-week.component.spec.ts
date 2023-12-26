import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsWeekComponent } from './details-week.component';

describe('DetailsWeekComponent', () => {
  let component: DetailsWeekComponent;
  let fixture: ComponentFixture<DetailsWeekComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsWeekComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailsWeekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
