import {Component, HostBinding, OnInit} from '@angular/core';
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

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    OpenCloseComponent,
    BubbleComponent,
    FormsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  // bubbles: string[] = ['red', 'blue'];
  bubbles: Bubble[] = [];
  title = 'app-quick-bubble';
  style = 'red';

  constructor(private bubbleService: BubbleService){}

  ngOnInit(): void {
    this.bubbleService.startConnection().subscribe(() => {
      this.bubbleService.receiveMessage().subscribe((message) => {
        this.bubbleService.pushBubble(message);
      })
    })

    this.bubbleService.getBubbles().subscribe((bubbles) => {
      this.bubbles = bubbles;
      console.log(this.bubbles);
    });
  }

  sendMessage(message: string){
    const bubble = {
      Message: message
    } as Bubble;
    this.bubbleService.sendMessage(bubble)
  }
}
