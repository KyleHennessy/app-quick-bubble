import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BubbleComponent } from './bubble.component';
import { MessageService } from 'primeng/api';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Bubble } from '../models/bubble.model';

describe('BubbleComponent', () => {
  let component: BubbleComponent;
  let fixture: ComponentFixture<BubbleComponent>;
  let bubble: Bubble = {
    id: '1',
    message: 'test',
    colour: '#ffffff'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BubbleComponent, NoopAnimationsModule],
      providers: [MessageService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BubbleComponent);
    component = fixture.componentInstance;
    component.model = bubble;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
