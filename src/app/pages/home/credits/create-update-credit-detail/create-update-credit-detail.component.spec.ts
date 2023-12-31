import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdateCreditDetailComponent } from './create-update-credit-detail.component';

describe('CreateUpdateCreditDetailComponent', () => {
  let component: CreateUpdateCreditDetailComponent;
  let fixture: ComponentFixture<CreateUpdateCreditDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateUpdateCreditDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateUpdateCreditDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
