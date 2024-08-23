import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Bubble } from '../models/bubble.model';
import { BubbleService } from '../services/bubble.service';
import { FormsModule } from '@angular/forms';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-launcher',
  standalone: true,
  imports: [
    FormsModule,
    NgStyle
  ],
  templateUrl: './launcher.component.html',
  styleUrl: './launcher.component.scss'
})
export class LauncherComponent {
  message: string = '';
  colour: string = '';

  initialMouseX: number;
  initialMouseY: number;
  // arrowBase: number = 0;
  arrowTransform: string;
  arrowClicked: boolean = false;

  @ViewChild('arrow') arrowElem: ElementRef;

  constructor(private bubbleService: BubbleService) { }

  sendMessage(message: string, colour: string) {
    const bubble = {
      message: message,
      colour: colour
    } as Bubble;

    this.bubbleService.sendMessage(bubble);
  }

  onMoveArrow(event: MouseEvent) {
    console.log(this.arrowElem.nativeElement.getBoundingClientRect());

    const arrowYpos = this.arrowElem.nativeElement.getBoundingClientRect().top;

    if (this.arrowClicked) {
      // const dx = event.clientX - this.initialMouseX;
      // const dy = event.clientY - arrowYpos;


      // if(dx >= 0) {
      //   const angleRadians = Math.atan2(dy, dx);
      //   const angleDegrees = (angleRadians * 180) / Math.PI;
      //   this.arrowTransform = `rotate(${angleDegrees}deg)`;
      // }
      
      const arrowRect = this.arrowElem.nativeElement.getBoundingClientRect();
      const dx = event.clientX - arrowRect.left - arrowRect.width / 2;
      const dy = event.clientY - arrowRect.top - arrowRect.height / 2;
      

      const angleRadians = Math.atan2(dy, dx);
      const angleDegrees = (angleRadians * 180) / Math.PI;

      if(angleDegrees >= -80 && angleDegrees <= 80){
        this.arrowTransform = `rotate(${angleDegrees}deg)`;
      }


      console.log('Mouse movement:', dx, dy)
    }
  }

  onClickArrow(event: MouseEvent) {
    this.arrowClicked = true;
    this.initialMouseX = event.clientX;
    this.initialMouseY = event.clientY;
    console.log('arrow clicked at', this.initialMouseX, this.initialMouseY);
  }

  onReleaseArrow() {
    this.arrowClicked = false;
    console.log('arrow released');
  }
}
