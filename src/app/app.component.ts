import {Component, HostBinding, OnDestroy, OnInit} from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { RouterOutlet } from '@angular/router';
import { OpenCloseComponent } from './open-close/open-close.component';
import { BubbleComponent } from './bubble/bubble.component';
import { FormsModule } from '@angular/forms';
import { BubbleService } from './services/bubble.service';
import { Bubble } from './models/bubble.model';
import { LauncherComponent } from './launcher/launcher.component';
import { Subscription } from 'rxjs';
import { FrameComponent } from './frame/frame.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    OpenCloseComponent,
    BubbleComponent,
    FormsModule,
    LauncherComponent,
    FrameComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'app-quick-bubble';
  receiveBubbleSubscription: Subscription;

  constructor(private bubbleService: BubbleService){}

  ngOnInit(): void {
    this.receiveBubbleSubscription = this.bubbleService.startConnection().subscribe(() => {
      this.bubbleService.receiveMessage().subscribe((message) => {
        this.bubbleService.pushBubble(message);
      })
    })
  }

  ngOnDestroy(): void {
    this.receiveBubbleSubscription.unsubscribe();
  }
}
