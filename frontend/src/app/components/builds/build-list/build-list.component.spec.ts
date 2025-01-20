import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildListComponent } from './build-list.component';

describe('BuildListComponent', () => {
  let component: BuildListComponent;
  let fixture: ComponentFixture<BuildListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuildListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuildListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
