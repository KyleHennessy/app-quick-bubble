import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { MessageService } from 'primeng/api';
import { Toast } from '../models/toast.model';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TooltipModule } from 'primeng/tooltip';

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
    TooltipModule
  ],
  templateUrl: './launcher.component.html',
  styleUrl: './launcher.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class LauncherComponent {
  message: string = '';
  colour: string = '#0d6efd';
  selectedOption = 'move';
  buttonOptions: {icon: string, value: string, tooltip: string}[] = [
    { icon: 'pi pi-arrows-alt', value: 'move', tooltip: 'Tap and hold a bubble to move it'},
    { icon: 'pi pi-clone', value: 'copy', tooltip: 'Tap a bubble to copy it'},
    { icon: 'pi pi-trash', value: 'delete', tooltip: 'Tap a bubble to delete it' },
  ];

  @ViewChild('arrow') arrowElem: ElementRef;

  constructor(private bubbleService: BubbleService, private messageService: MessageService) { }

  sendMessage(message: string, colour: string) {
    const bubble = {
      message: message,
      colour: this.colour
    } as Bubble;

    this.bubbleService.sendMessage(bubble);
    const toast: Toast = {
      severity: 'success',
      summary: 'Success',
      detail: 'Bubble sent successfully'
    }
    this.messageService.add(toast)
  }

  onClickInteractOption(value: string){
    this.selectedOption = value;
    this.bubbleService.setInteractOption(value);
  }
}
