import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateUpdatePeopleComponent } from './create-update-people.component';

describe('CreateUpdatePeopleComponent', () => {
  let component: CreateUpdatePeopleComponent;
  let fixture: ComponentFixture<CreateUpdatePeopleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateUpdatePeopleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateUpdatePeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
