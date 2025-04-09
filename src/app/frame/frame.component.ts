import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Bubble } from '../models/bubble.model';
import { BubbleService } from '../services/bubble.service';
import { BubbleComponent } from '../bubble/bubble.component';
import { Subscription } from 'rxjs';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { WelcomeComponent } from '../welcome/welcome.component';

@Component({
  selector: 'app-frame',
  standalone: true,
  imports: [
    BubbleComponent,
    BadgeModule,
    ButtonModule
  ],
  providers: [
    DialogService
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
  ref: DynamicDialogRef;
  
  constructor(private bubbleService: BubbleService, private dialogService: DialogService){}

  ngOnInit(): void {
    this.bubbleSubscription = this.bubbleService.bubbles$.subscribe((bubbles) => {
      this.bubbles = bubbles;
    });

    this.connectionCounterSubscription = this.bubbleService.connectionCount$.subscribe((count) => {
      this.connectionCount = count;
    });
  }
  
  ngOnDestroy(): void {
    this.bubbleSubscription.unsubscribe();
  }

  onShowHelpModal(){
    this.ref = this.dialogService.open(WelcomeComponent, {
      width: 'auto',
      header: 'Need help?'
    });
  }
}
