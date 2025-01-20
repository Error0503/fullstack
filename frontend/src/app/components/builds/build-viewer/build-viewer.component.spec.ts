import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildViewerComponent } from './build-viewer.component';

describe('BuildViewerComponent', () => {
  let component: BuildViewerComponent;
  let fixture: ComponentFixture<BuildViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuildViewerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuildViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
