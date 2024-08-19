import { Component, OnDestroy, OnInit } from '@angular/core';
import { Bubble } from '../models/bubble.model';
import { BubbleService } from '../services/bubble.service';
import { BubbleComponent } from '../bubble/bubble.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-frame',
  standalone: true,
  imports: [
    BubbleComponent
  ],
  templateUrl: './frame.component.html',
  styleUrl: './frame.component.scss'
})
export class FrameComponent implements OnInit, OnDestroy {
  bubbles: Bubble[] = [];
  bubbleSubscription: Subscription;
  

  constructor(private bubbleService: BubbleService){}
  ngOnInit(): void {
    this.bubbleSubscription = this.bubbleService.getBubbles().subscribe((bubbles) => {
      this.bubbles = bubbles;
    });
  }

  ngOnDestroy(): void {
    this.bubbleSubscription.unsubscribe();
  }
}
