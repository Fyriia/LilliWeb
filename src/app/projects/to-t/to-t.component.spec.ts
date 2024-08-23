import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToTComponent } from './to-t.component';

describe('ToTComponent', () => {
  let component: ToTComponent;
  let fixture: ComponentFixture<ToTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToTComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
