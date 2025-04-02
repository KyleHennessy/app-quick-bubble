import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrameComponent } from './frame.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';
import { BubbleService } from '../services/bubble.service';
import { of } from 'rxjs';

describe('FrameComponent', () => {
  let component: FrameComponent;
  let fixture: ComponentFixture<FrameComponent>;
  let messageService: jasmine.SpyObj<MessageService>;
  // let bubbleService: jasmine.SpyObj<BubbleService>;

  beforeEach(async () => {
    messageService = jasmine.createSpyObj(['add']);
    // bubbleService = jasmine.createSpyObj(['sending$']);
    await TestBed.configureTestingModule({
      imports: [FrameComponent, HttpClientTestingModule],
      providers:[
        { provide: MessageService, useValue: messageService},
        // { provide: BubbleService, useValue: bubbleService}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
