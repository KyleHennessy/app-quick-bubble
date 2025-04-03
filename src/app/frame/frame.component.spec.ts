import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrameComponent } from './frame.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';
import { BubbleService } from '../services/bubble.service';
import { BehaviorSubject, of } from 'rxjs';
import { Bubble } from '../models/bubble.model';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('FrameComponent', () => {
  let component: FrameComponent;
  let fixture: ComponentFixture<FrameComponent>;
  let bubbleService;
  let bubbleSubject: BehaviorSubject<Map<string, Bubble>>;
  let connectionCountSubject: BehaviorSubject<number>;

  beforeEach(async () => {
    bubbleSubject = new BehaviorSubject(new Map<string, Bubble>());
    connectionCountSubject = new BehaviorSubject(0);
    bubbleService = jasmine.createSpyObj([], {
      bubbles$: bubbleSubject.asObservable(),
      connectionCount$: connectionCountSubject.asObservable()
    });

    await TestBed.configureTestingModule({
      imports: [FrameComponent, HttpClientTestingModule, NoopAnimationsModule],
      providers:[
        MessageService,
        { provide: BubbleService, useValue: bubbleService}
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

  it('should add bubbles to bubble map when received from subscription', () => {
    //Arrange
    const bubbles: Bubble[] = [
      {
        id: '1',
        message: 'Test 1',
        colour: '#ffffff'
      },
      {
        id: '2',
        message: 'Test 2',
        colour: '#ffffff'
      },
    ]

    const map = new Map<string, Bubble>();

    bubbles.forEach(bubble => {
      map.set(bubble.id, bubble)
    });

    //Act
    bubbleSubject.next(map);
    fixture.detectChanges();

    //Assert
    expect(component.bubbles).toBeTruthy();
    expect(component.bubbles.size).toEqual(2);
    expect(component.bubbles.get(bubbles[0].id)).toBeTruthy();
    expect(component.bubbles.get(bubbles[1].id)).toBeTruthy();
  });

  it('should decrease bubbles when bubble is removed', () =>{
    //Arrange
    const bubbles: Bubble[] = [
      {
        id: '1',
        message: 'Test 1',
        colour: '#ffffff'
      },
      {
        id: '2',
        message: 'Test 2',
        colour: '#ffffff'
      },
    ]

    const map = new Map<string, Bubble>();

    bubbles.forEach(bubble => {
      map.set(bubble.id, bubble)
    });

    //Act
    bubbleSubject.next(map);
    fixture.detectChanges();
    expect(component.bubbles.size).toEqual(2);
    
    map.delete(bubbles[0].id);
    bubbleSubject.next(map);

    //Assert
    expect(component.bubbles).toBeTruthy();
    expect(component.bubbles.size).toEqual(1);
    expect(component.bubbles.get(bubbles[1].id)).toBeTruthy();
  });

  it('should update connection count when new connection is established', () =>{
    expect(component.connectionCount).toEqual(0);
    //Act
    connectionCountSubject.next(1);
    fixture.detectChanges();

    //Assert
    expect(component.connectionCount).toEqual(1);
  });
});
