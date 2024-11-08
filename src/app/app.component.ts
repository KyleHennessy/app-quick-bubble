import {Component, OnDestroy, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BubbleService } from './services/bubble.service';
import { LauncherComponent } from './launcher/launcher.component';
import { Subscription } from 'rxjs';
import { FrameComponent } from './frame/frame.component';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormsModule,
    LauncherComponent,
    FrameComponent,
    CardModule,
    FloatLabelModule,
    InputTextModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'app-quick-bubble';
  receiveBubbleSubscription: Subscription;

  constructor(private bubbleService: BubbleService, private primngConfig: PrimeNGConfig){}

  ngOnInit(): void {
    this.receiveBubbleSubscription = this.bubbleService.startConnection().subscribe(() => {
      this.bubbleService.receiveMessage().subscribe((message) => {
        this.bubbleService.pushBubble(message);
      })
    })

    this.primngConfig.ripple = true;
  }

  ngOnDestroy(): void {
    this.receiveBubbleSubscription.unsubscribe();
  }
}
