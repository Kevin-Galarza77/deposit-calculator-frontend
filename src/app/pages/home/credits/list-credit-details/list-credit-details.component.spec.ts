import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCreditDetailsComponent } from './list-credit-details.component';

describe('ListCreditDetailsComponent', () => {
  let component: ListCreditDetailsComponent;
  let fixture: ComponentFixture<ListCreditDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListCreditDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListCreditDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
