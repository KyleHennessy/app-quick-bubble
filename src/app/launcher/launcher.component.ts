import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Bubble } from '../models/bubble.model';
import { BubbleService } from '../services/bubble.service';
import { FormsModule } from '@angular/forms';
import { NgStyle } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ColorPickerModule } from 'primeng/colorpicker';
import { RippleModule } from 'primeng/ripple';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SpeedDialModule } from 'primeng/speeddial';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageService } from 'primeng/api';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TooltipModule } from 'primeng/tooltip';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-launcher',
  standalone: true,
  imports: [
    FormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    ColorPickerModule,
    ButtonModule,
    RippleModule,
    InputGroupModule,
    InputGroupAddonModule,
    RadioButtonModule,
    SpeedDialModule,
    FloatLabelModule,
    SelectButtonModule,
    TooltipModule,
    FileUploadModule,
    RadioButtonModule
  ],
  templateUrl: './launcher.component.html',
  styleUrl: './launcher.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class LauncherComponent implements OnInit, OnDestroy {
  message: string = '';
  colour: string = '#0d6efd';
  selectedOption = 'move';
  backgroundType = 'colour';
  uploadedFile: string;
  sending: boolean;
  sendingSubscription: Subscription;
  errorSubscription: Subscription;

  @ViewChild('arrow') arrowElem: ElementRef;
  @ViewChild('messageInput') messageInput: ElementRef<HTMLInputElement>;

  constructor(private bubbleService: BubbleService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.sendingSubscription = this.bubbleService.sending$.subscribe((sending) => {
      this.sending = sending;
      if (this.sending === false) {
        this.message = null;
        this.uploadedFile = null;
      }
    });

    this.errorSubscription = this.bubbleService.errors$.subscribe((message) => {
      if (message) {
        this.messageService.add(
          {
            severity: 'error',
            summary: 'Uh Oh!',
            detail: message,
            closable: false
          }
        );
      }
    })
  }

  sendMessage(message: string) {
    const bubble = {
      message: message,
      colour: this.colour,
    } as Bubble;

    if (this.uploadedFile) {
      bubble.background = this.uploadedFile;
    }

    if (message) {
      this.bubbleService.sendMessage(bubble);
      let isMobile = window.matchMedia('(max-width: 768px)').matches

      if(isMobile){
        this.messageInput.nativeElement.blur();
      }
      else{
        this.messageInput.nativeElement.focus();
      }
    } else {
      this.messageService.add(
        {
          severity: 'error',
          summary: 'Uh Oh!',
          detail: 'Message is required',
          closable: false
        }
      );
    }
  }

  onFileSelect(event: FileSelectEvent) {
    const file = event.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      this.uploadedFile = base64String
    };
    reader.readAsDataURL(file)
  }

  onClearUploadedFile() {
    if (!this.sending) {
      this.uploadedFile = null;
    }
  }

  ngOnDestroy(): void {
    this.sendingSubscription?.unsubscribe();
    this.errorSubscription?.unsubscribe();
  }
}
