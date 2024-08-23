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

  /**
   * Handles the mouse movement when dragging the arrow.
   * Calculates the rotation angle based on the cursor position.
   * @param event The MouseEvent object containing cursor position information.
   */
  private calculateArrowAngle(event: MouseEvent) {
    // Get the bounding rectangle of the arrow element
    const arrowRect = this.arrowElem.nativeElement.getBoundingClientRect();

    // Calculate the horizontal distance from the arrow center to the cursor
    const horizontalDistance = event.clientX - arrowRect.left - arrowRect.width / 2;

    // Normalize horizontal distance to ensure it stays within the valid range
    const normalizedHorizontalDistance = Math.min(Math.max(horizontalDistance, -arrowRect.width / 2), arrowRect.width / 2);

    //Calculate the rotation angle in degrees. Max degrees either direction is 80 (hard coded);
    const angleDegrees = (normalizedHorizontalDistance / (arrowRect.width / 2) * 80);

    //Set the CSS tranform property to rotate the arrow
    this.arrowTransform = `rotate(${angleDegrees}deg)`;
  }

  onMoveArrow(event: MouseEvent) {
    if (this.arrowClicked) {
      this.calculateArrowAngle(event)
    }
  }

  onClickArrow(event: MouseEvent) {
    this.arrowClicked = true;
    this.initialMouseX = event.clientX;
    this.initialMouseY = event.clientY;

    this.calculateArrowAngle(event);
  }

  onReleaseArrow() {
    this.arrowClicked = false;
  }
}
