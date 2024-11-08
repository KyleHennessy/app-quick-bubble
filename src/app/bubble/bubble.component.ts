import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, HostListener, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { interval, Subscription, timer } from 'rxjs';
import { Bubble } from '../models/bubble.model';
import { NgStyle } from '@angular/common';
import { BubbleService } from '../services/bubble.service';

@Component({
  selector: 'app-bubble',
  standalone: true,
  imports: [
    NgStyle,
  ],
  templateUrl: './bubble.component.html',
  styleUrl: './bubble.component.scss',
  animations: [
    trigger('moveBubble', [
      state('default', style({ transform: `translate3d(${window.innerWidth / 2 -150}px, -10000px, 0)` })),
      state('moved', style({ transform: '{{transform}}' }), { params: { transform: 'translateY(10000px)' } }),
      transition('default => moved', animate('1s ease-out'))
    ]),
  ]
})
export class BubbleComponent implements OnInit {
  @Input() model?: Bubble;
  id: string;
  pos = [window.innerWidth / 2 - 150, window.innerHeight / 2];
  transform = `translate3d(${window.innerWidth / 2 -150}px, -10000px, 0)`;
  state = 'default';
  mouseDown = false;
  velocity = [0, 0];
  decay = 0.95;
  animationSubscription: Subscription;
  idleSubscription: Subscription;
  autoMoveSubscription: Subscription;
  cursor = 'grab';

  constructor(private bubbleService: BubbleService, private renderer: Renderer2){}

  ngOnInit(): void {
    setTimeout(() => {
      this.state = 'moved';
      this.transform = `translate3d(${this.pos[0]}px, ${this.pos[1]}px, 0)`;
      this.startIdleTimer();
    }, 0);

    // timer(20000).subscribe(() => {
    //   console.log(this.model?.id)
    //   this.bubbleService.removeBubble(this.model?.id);
    // })
  }

  onMouseDown() {
    this.mouseDown = true;
    this.cursor = 'grabbing';
    this.renderer.setStyle(document.body, 'cursor', this.cursor);
    this.resetIdleTimer();
    if (this.animationSubscription) {
      this.animationSubscription.unsubscribe();
    }
    if (this.autoMoveSubscription) {
      this.autoMoveSubscription.unsubscribe();
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.mouseDown) {
      const { clientX, clientY } = event;
      this.velocity = [clientX - this.pos[0], clientY - this.pos[1]];
      this.pos = [clientX, clientY];
      this.transform = `translate3d(${clientX - 150}px, ${clientY}px, 0)`;
      this.state = 'moved';
    }
  }

  @HostListener('document:mouseup')
  onMouseUp(event: MouseEvent) {
    if (this.mouseDown) {
      this.mouseDown = false;
      this.pos = [event.clientX, event.clientY]
      this.startDeceleration();
      this.startIdleTimer();
      this.cursor = 'grab';
      this.renderer.setStyle(document.body, 'cursor', 'auto');
    }
  }

  startDeceleration() {
    this.animationSubscription = interval(16).subscribe(() => {
      this.velocity = [this.velocity[0] * this.decay, this.velocity[1] * this.decay];
      this.pos = [this.pos[0] + this.velocity[0], this.pos[1] + this.velocity[1]];

      // Check for collisions with window boundaries
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      if (this.pos[0] <= 0 || this.pos[0] >= windowWidth) {
        this.velocity[0] = -this.velocity[0];
        this.pos[0] = Math.max(0, Math.min(this.pos[0], windowWidth));
      }

      if (this.pos[1] <= 0 || this.pos[1] >= windowHeight) {
        this.velocity[1] = -this.velocity[1];
        this.pos[1] = Math.max(0, Math.min(this.pos[1], windowHeight));
      }

      this.transform = `translate3d(${this.pos[0]}px, ${this.pos[1]}px, 0)`;
      this.state = 'moved';

      if (Math.abs(this.velocity[0]) < 0.1 && Math.abs(this.velocity[1]) < 0.1) {
        this.animationSubscription.unsubscribe();
        // Keep the bubble in the final position
        this.velocity = [0, 0];
      }
    });
  }

  startIdleTimer() {
    this.idleSubscription = timer(1000).subscribe(() => {
      this.startAutoMove();
    });
  }

  resetIdleTimer() {
    if (this.idleSubscription) {
      this.idleSubscription.unsubscribe();
    }
  }

  startAutoMove() {
    if (this.autoMoveSubscription) {
      this.autoMoveSubscription.unsubscribe();
    }
    // Set a random direction for the bubble to move
    this.velocity = [Math.random() * 4 - 2, Math.random() * 4 - 2];

    this.autoMoveSubscription = interval(33).subscribe(() => {
      this.pos = [this.pos[0] + this.velocity[0], this.pos[1] + this.velocity[1]];

      // Check for collisions with window boundaries
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      if (this.pos[0] <= 0 || this.pos[0] >= windowWidth) {
        this.velocity[0] = -this.velocity[0];
        this.pos[0] = Math.max(0, Math.min(this.pos[0], windowWidth));
      }

      if (this.pos[1] <= 0 || this.pos[1] >= windowHeight) {
        this.velocity[1] = -this.velocity[1];
        this.pos[1] = Math.max(0, Math.min(this.pos[1], windowHeight));
      }

      // Check if velocity is too small and reset if necessary
      if (Math.abs(this.velocity[0]) < 0.1 && Math.abs(this.velocity[1]) < 0.1) {
        this.velocity = [Math.random() * 4 - 1, Math.random() * 4 - 1];
      }

      this.transform = `translate3d(${this.pos[0]}px, ${this.pos[1]}px, 0)`;
      this.state = 'moved';
    });
  }

  onCopy(message: string){
    if(message){
      navigator.clipboard.writeText(message);
    }
  }
}

