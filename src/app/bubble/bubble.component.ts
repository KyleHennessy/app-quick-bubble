import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, HostListener, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { interval, Subscription, timer } from 'rxjs';
import { Bubble } from '../models/bubble.model';
import { NgStyle } from '@angular/common';
import { BubbleService } from '../services/bubble.service';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';

export enum InteractOptions {
  Move = "move",
  Copy = "copy",
  Delete = "delete"
}

@Component({
  selector: 'app-bubble',
  standalone: true,
  imports: [
    NgStyle,
    ButtonModule,
    TooltipModule,
  ],
  templateUrl: './bubble.component.html',
  styleUrl: './bubble.component.scss',
  animations: [
    trigger('moveBubble', [
      state('default', style({ transform: `translate3d(${window.innerWidth / 2}px, -10000px, 0)` })),
      state('moved', style({ transform: '{{transform}}' }), { params: { transform: 'translateY(10000px)' } }),
      transition('default => moved', animate('1s ease-out'))
    ]),
    trigger('sendBubble', [
      state('default', style({ transform: `translate3d(${window.innerWidth / 2}px, 10000px, 0)` })),
      state('moved', style({ transform: '{{transform}}' }), { params: { transform: 'translateY(10000px)' } }),
      transition('default => moved', animate('1s ease-out'))
    ])
  ]
})
export class BubbleComponent implements OnInit {
  @Input() model?: Bubble;
  @Input() send = false;
  id: string;
  pos = [window.innerWidth / 2.6, window.innerHeight / 2 - 80];
  transform: string;
  state = 'default';
  mouseDown = false;
  velocity = [0, 0];
  decay = 0.95;
  animationSubscription: Subscription;
  idleSubscription: Subscription;
  autoMoveSubscription: Subscription;
  interactOptionSubscription: Subscription;
  cursor = 'auto';
  @ViewChild('bubble') bubbleRef: ElementRef;
  lastTap = 0;

  constructor(private bubbleService: BubbleService, private renderer: Renderer2, private messageService: MessageService) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.state = 'moved';
      this.transform = `translate3d(${this.pos[0]}px, ${this.pos[1]}px, 0)`;
      this.startIdleTimer();
    }, 0);

    timer(30000).subscribe(() => {
      this.onDelete();
    });
  }

  onMouseDown(event: any) {
    event.preventDefault();
    const currentTime = new Date().getTime();
    const tapGap = currentTime - this.lastTap;

    if (tapGap < 300 && tapGap > 0) {
      this.onCopy();
    } else {
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
      this.lastTap = currentTime;
    }
  }

  @HostListener('document:touchmove', ['$event'])
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: any) {
    if (this.mouseDown) {
      const { clientX, clientY } = event.touches ? event.touches[0] : event;

      // Clamp x to stay within the screen width
      const x = Math.max(0, Math.min(window.innerWidth - 200, clientX - 200 / 2));

      // Clamp y to stay within the screen height
      const y = Math.max(0, Math.min(window.innerHeight - 200, clientY - 200 / 2));

      this.velocity = [x - this.pos[0], y - this.pos[1]];
      this.pos = [x, y];
      this.transform = `translate3d(${x}px, ${y}px, 0)`;
      this.state = 'moved';
    }
  }

  @HostListener('document:touchend')
  @HostListener('document:mouseup')
  onMouseUp() {
    if (this.mouseDown) {
      this.mouseDown = false;
      this.startDeceleration();
      this.startIdleTimer();
      this.cursor = 'auto';
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

  onCopy() {
    const message = this.model.message;
    if (message) {
      navigator.clipboard.writeText(message);
      this.messageService.add({
        severity: 'info',
        summary: 'Info',
        detail: 'Message copied to clipboard',
        closable: false
      });
    }
  }

  onDelete() {
    const bubbleElement = this.bubbleRef.nativeElement;
    bubbleElement.classList.add('fade-out');
    bubbleElement.addEventListener('animationend', () => {
      this.bubbleService.removeBubble(this.model?.id);
    });
  }
}

