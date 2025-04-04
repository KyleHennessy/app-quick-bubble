import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BubbleComponent } from './bubble.component';
import { MessageService } from 'primeng/api';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Bubble } from '../models/bubble.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';

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
      imports: [BubbleComponent, NoopAnimationsModule, HttpClientTestingModule],
      providers: [MessageService]
    }).compileComponents();

    fixture = TestBed.createComponent(BubbleComponent);
    component = fixture.componentInstance;
    component.model = bubble;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should grab bubble if not double-tap', () => {
    //Arrange
    const event = { preventDefault: jasmine.createSpy(), timeStamp: 1000 };
    component.lastTap = new Date().getTime();

    //Act
    component.onMouseDown(event);

    //Assert
    expect(event.preventDefault).toHaveBeenCalled();
    expect(component.mouseDown).toBeTrue();
    expect(component.cursor).toBe('grabbing');
  });

  it('should call onCopy if double-tap detected', () => {
    //Arrange
    const event = { preventDefault: jasmine.createSpy(), timeStamp: 600 };
    component.lastTap = new Date().getTime() - 100;
    spyOn(component, 'onCopy');

    //Act
    component.onMouseDown(event);

    //Assert
    expect(component.onCopy).toHaveBeenCalled();
    expect(component.mouseDown).toBeFalse();
  });

  it('should copy text to clipboard', async () => {
    //Arrange
    const mockWriteText = spyOn(navigator.clipboard, 'writeText').and.resolveTo();

    //Act
    component.onCopy();

    //Assert
    expect(mockWriteText).toHaveBeenCalled();
  });

  it('should start decelerating and idle timer if the mouse was down', () => {
    //Arrange
    component.mouseDown = true;
    spyOn(component, 'startDeceleration');
    spyOn(component, 'startIdleTimer');

    //Act
    component.onMouseUp();

    //Assert
    expect(component.mouseDown).toBeFalse();
    expect(component.startDeceleration).toHaveBeenCalled();
    expect(component.startIdleTimer).toHaveBeenCalled();
    expect(component.cursor).toBe('auto');
  });

  it('should do nothing if mouse was not down', () => {
    //Arrange
    component.mouseDown = false;
    spyOn(component, 'startDeceleration');
    spyOn(component, 'startIdleTimer');

    //Act
    component.onMouseUp();

    //Assert
    expect(component.mouseDown).toBeFalse();
    expect(component.startDeceleration).toHaveBeenCalledTimes(0);
    expect(component.startIdleTimer).toHaveBeenCalledTimes(0);
  });

  it('should update velocity and position over time when decelerating', (done) => {
    //Arrange
    component.decay = 0.9;
    component.velocity = [10, 10];
    component.pos = [100, 100];

    //Act
    component.startDeceleration();

    // Wait for a few intervals to pass
    setTimeout(() => {
      //Assert
      expect(component.velocity[0]).toBeLessThan(10);
      expect(component.velocity[1]).toBeLessThan(10);
      expect(component.pos[0]).toBeGreaterThan(100);
      expect(component.pos[1]).toBeGreaterThan(100);

      // Cleanup
      component.animationSubscription.unsubscribe();
      done();
    }, 50); 
  });

  it('should update velocity and position over time when auto moving', (done) => {
    //Arrange
    component.decay = 0.9;
    component.velocity = [10, 10];
    component.pos = [100, 100];

    //Act
    component.startAutoMove();

    // Wait for a few intervals to pass
    setTimeout(() => {
      //Assert
      expect(component.velocity[0]).not.toEqual(10);
      expect(component.velocity[1]).not.toEqual(10);
      expect(component.pos[0]).not.toEqual(100);
      expect(component.pos[1]).not.toEqual(100);

      // Cleanup
      component.autoMoveSubscription.unsubscribe();
      done();
    }, 50); 
  });
});
