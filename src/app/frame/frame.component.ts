import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Bubble } from '../models/bubble.model';
import { BubbleService } from '../services/bubble.service';
import { BubbleComponent } from '../bubble/bubble.component';
import { Subscription } from 'rxjs';
import { BadgeModule } from 'primeng/badge';

@Component({
  selector: 'app-frame',
  standalone: true,
  imports: [
    BubbleComponent,
    BadgeModule
  ],
  templateUrl: './frame.component.html',
  styleUrl: './frame.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class FrameComponent implements OnInit, OnDestroy {
  bubbles: Map<string, Bubble>;
  bubbleSubscription: Subscription;
  connectionCounterSubscription: Subscription;
  connectionCount: number = 1;
  
  constructor(private bubbleService: BubbleService){}

  ngOnInit(): void {
    this.bubbleSubscription = this.bubbleService.bubbles$.subscribe((bubbles) => {
      this.bubbles = bubbles;
    });

    this.connectionCounterSubscription = this.bubbleService.connectionCount$.subscribe((count) => {
      this.connectionCount = count;
    })
  }
  
  ngOnDestroy(): void {
    this.bubbleSubscription.unsubscribe();
  }
}
