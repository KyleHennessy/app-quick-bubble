import { Component, OnInit } from '@angular/core';
import { Bubble } from '../models/bubble.model';
import { BubbleService } from '../services/bubble.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-launcher',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './launcher.component.html',
  styleUrl: './launcher.component.scss'
})
export class LauncherComponent {
  message: string = '';
  colour: string = '';

  constructor(private bubbleService: BubbleService){}
  
  sendMessage(message: string, colour: string){
    const bubble = {
      message: message,
      colour: colour
    } as Bubble;

    this.bubbleService.sendMessage(bubble);
  }
}
