import { Component, OnDestroy, OnInit } from '@angular/core';
import { Bubble } from '../models/bubble.model';
import { BubbleService } from '../services/bubble.service';
import { BubbleComponent } from '../bubble/bubble.component';
import { Subscription } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-frame',
  standalone: true,
  imports: [
    BubbleComponent,
  ],
  templateUrl: './frame.component.html',
  styleUrl: './frame.component.scss',
  animations:[
    trigger('fadeOut', [
      state('void', style({ opacity: 1 })),
      transition(':leave', [
        style({ position: 'absolute'}),
        animate('0.5s', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class FrameComponent implements OnInit, OnDestroy {
  bubbles: Map<string, Bubble>;
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
