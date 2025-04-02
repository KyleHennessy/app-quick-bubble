import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LauncherComponent } from './launcher.component';
import { MessageService } from 'primeng/api';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BehaviorSubject, of } from 'rxjs';
import { BubbleService } from '../services/bubble.service';
import { By } from '@angular/platform-browser';

describe('LauncherComponent', () => {
  let component: LauncherComponent;
  let fixture: ComponentFixture<LauncherComponent>;
  let bubbleService;
  let sendingSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    sendingSubject = new BehaviorSubject<boolean>(false);
    bubbleService = jasmine.createSpyObj([], {
      sending$: sendingSubject.asObservable(),
      errors$: of()
    });
    await TestBed.configureTestingModule({
      imports: [LauncherComponent, HttpClientTestingModule],
      providers: [
        MessageService,
        { provide: BubbleService, useValue: bubbleService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LauncherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disable button when sending is starting and message should be present', () => {
    //Arrange
    sendingSubject.next(true);
    component.message = 'Test';
    let button = fixture.debugElement.query(By.css('button')).nativeElement
    

    //Act
    fixture.detectChanges();

    //Assert
    expect(component.message).toEqual('Test');
    expect(component.sending).toBeTrue();
    expect(button).toBeTruthy();
    expect(button.hasAttribute('disabled')).toBeTrue();
    
  });

  it('should disable button when sending is finished and message should be cleared', () => {
    //Arrange
    component.message = 'Test';
    sendingSubject.next(false);
    let button = fixture.debugElement.query(By.css('button')).nativeElement;

    //Act
    fixture.detectChanges();

    //Assert
    expect(component.message).toBeNull();
    expect(component.sending).toBeFalse();
    expect(button).toBeTruthy();
    expect(button.hasAttribute('disabled')).toBeTrue();
  });

  it('should enable button when not sending and message is present', () => {
    //Arrange
    component.message = 'Test';
    let button = fixture.debugElement.query(By.css('button')).nativeElement;

    //Act
    fixture.detectChanges();

    //Assert
    expect(component.message).toEqual('Test');
    expect(button).toBeTruthy();
    expect(button.hasAttribute('disabled')).toBeFalse();
  })
});
