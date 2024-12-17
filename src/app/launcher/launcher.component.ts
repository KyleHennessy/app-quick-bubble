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
import { MessageService } from 'primeng/api';
import { Toast } from '../models/toast.model';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TooltipModule } from 'primeng/tooltip';
import { FileSelectEvent, FileUploadModule } from 'primeng/fileupload';

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
export class LauncherComponent {
  message: string = '';
  colour: string = '#0d6efd';
  selectedOption = 'move';
  backgroundType = 'colour';
  uploadedFile: string;
  buttonOptions: {icon: string, value: string, tooltip: string}[] = [
    { icon: 'pi pi-arrows-alt', value: 'move', tooltip: 'Move'},
    { icon: 'pi pi-clone', value: 'copy', tooltip: 'Copy'},
    { icon: 'pi pi-trash', value: 'delete', tooltip: 'Delete' },
  ];

  @ViewChild('arrow') arrowElem: ElementRef;

  constructor(private bubbleService: BubbleService) { }

  sendMessage(message: string) {
    const bubble = {
      message: message,
      colour: this.colour,
    } as Bubble;

    if(this.uploadedFile){
      bubble.background = this.uploadedFile;
    }

    this.bubbleService.sendMessage(bubble);
  }

  onClickInteractOption(value: string){
    this.selectedOption = value;
    this.bubbleService.setInteractOption(value);
  }

  onFileSelect(event: FileSelectEvent){
    const file = event.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      this.uploadedFile = base64String
    };
    reader.readAsDataURL(file)
  }
}
