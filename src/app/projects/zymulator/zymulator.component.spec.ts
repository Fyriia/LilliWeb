import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZymulatorComponent } from './zymulator.component';

describe('ZymulatorComponent', () => {
  let component: ZymulatorComponent;
  let fixture: ComponentFixture<ZymulatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZymulatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZymulatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
