import { animate, state, style, transition, trigger } from '@angular/animations';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { NgStyle } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Bubble } from '../models/bubble.model';

@Component({
  selector: 'app-bubble',
  standalone: true,
  imports: [CdkDrag, NgStyle],
  animations: [
    trigger('boxAnimation', [
      state('initial', style({ opacity: 0, transform: 'translate({{initialX}}, 1000px)' }) ,{params :{
        initialX: `-0%`,
        initialY: `-0%`
        ,
      }}),
      state('final', style({ opacity: 1, transform: 'translate({{finalX}}, {{finalY}})' }), {params: {
        finalX: `100%`,
        finalY: `100%`
      }}),
      transition('initial => final', animate('500ms ease-in')),
    ]),
  ],
  templateUrl: './bubble.component.html',
  styleUrl: './bubble.component.scss'
})
export class BubbleComponent implements OnInit, OnChanges{
  @Input() model?: Bubble;
  boxState = 'initial'

  ngOnInit(): void {
    setTimeout(() => {
      this.boxState = 'final';
    }, 1000);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.boxState = 'initial';
    this.ngOnInit();
  }
}

