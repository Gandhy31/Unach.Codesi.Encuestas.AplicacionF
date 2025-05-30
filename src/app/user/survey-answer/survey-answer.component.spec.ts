import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyAnswerComponent } from './survey-answer.component';

describe('SurveyAnswerComponent', () => {
  let component: SurveyAnswerComponent;
  let fixture: ComponentFixture<SurveyAnswerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SurveyAnswerComponent]
    });
    fixture = TestBed.createComponent(SurveyAnswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
