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
  let messageService;
  let errorSubject: BehaviorSubject<string>;
  let sendingSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    sendingSubject = new BehaviorSubject<boolean>(false);
    errorSubject = new BehaviorSubject<string>(null);
    bubbleService = jasmine.createSpyObj(['sendBubble'], {
      sending$: sendingSubject.asObservable(),
      errors$: errorSubject.asObservable()
    });

    messageService = jasmine.createSpyObj(['add']);

    await TestBed.configureTestingModule({
      imports: [LauncherComponent, HttpClientTestingModule],
      providers: [
        { provide: MessageService, useValue: messageService },
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
    component.uploadedFile = 'File';
    let button = fixture.debugElement.query(By.css('button')).nativeElement


    //Act
    fixture.detectChanges();

    //Assert
    expect(component.message).toEqual('Test');
    expect(component.uploadedFile).toEqual('File');
    expect(component.sending).toBeTrue();
    expect(button).toBeTruthy();
    expect(button.hasAttribute('disabled')).toBeTrue();
  });

  it('should disable button when sending is finished and message should be cleared', () => {
    //Arrange
    component.message = 'Test';
    component.uploadedFile = 'File';
    sendingSubject.next(false);
    let button = fixture.debugElement.query(By.css('button')).nativeElement;

    //Act
    fixture.detectChanges();

    //Assert
    expect(component.message).toBeNull();
    expect(component.uploadedFile).toBeNull();
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
  });

  it('should add a toast if an error was present', () => {
    //Arrange
    const errorMessage = 'Error';
    errorSubject.next(errorMessage);

    //Act
    fixture.detectChanges();

    //Assert
    expect(messageService.add).toHaveBeenCalledOnceWith({
      severity: 'error',
      summary: 'Uh Oh!',
      detail: errorMessage,
      closable: false
    })
  });

  it('should not add a toast if no error is present', () => {
    //Arrange
    errorSubject.next(null);

    //Act
    fixture.detectChanges();

    //Assert
    expect(messageService.add).toHaveBeenCalledTimes(0);
  });

  it('should send bubble if message is present', () => {
    //Arrange
    const message = 'Test Message';

    //Act
    component.sendMessage(message);

    //Assert
    expect(bubbleService.sendBubble).toHaveBeenCalledWith({
      message: message,
      colour: '#0d6efd',
    });
  });

  it('should send bubble with uploaded file if message and uploaded file is present', () => {
    //Arrange
    const message = 'Test Message';
    component.uploadedFile = 'File'

    //Act
    component.sendMessage(message);

    //Assert
    expect(bubbleService.sendBubble).toHaveBeenCalledWith({
      message: message,
      colour: '#0d6efd',
      background: 'File'
    });
  });

  it('should not send bubble if message is not present', () => {
    //Act
    component.sendMessage(null);

    //Assert
    expect(bubbleService.sendBubble).toHaveBeenCalledTimes(0);
    expect(messageService.add).toHaveBeenCalledOnceWith({
      severity: 'error',
      summary: 'Uh Oh!',
      detail: 'Message is required',
      closable: false
    })
  });

  it('should clear uploaded file if not sending', () => {
    //Arrange
    const uploadedFile = 'File';
    component.uploadedFile = uploadedFile;
    sendingSubject.next(false);

    //Act
    component.onClearUploadedFile();

    //Assert
    expect(component.uploadedFile).toBeNull();
  });

  it('should not clear uploaded file if sending', () => {
    //Arrange
    const uploadedFile = 'File';
    component.uploadedFile = uploadedFile;
    sendingSubject.next(true);

    //Act
    component.onClearUploadedFile();

    //Assert
    expect(component.uploadedFile).toEqual(uploadedFile);
  });
});
