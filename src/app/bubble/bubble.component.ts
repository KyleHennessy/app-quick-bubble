import { animate, state, style, transition, trigger } from '@angular/animations';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { NgStyle } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-bubble',
  standalone: true,
  imports: [CdkDrag, NgStyle],
  animations: [
    trigger('boxAnimation', [
      state('initial', style({ opacity: 0, transform: 'translate({{initialX}}, 1000px' }) ,{params :{
        initialX: `-${Math.floor(Math.random() * 100)}%`,
        initialY: `-${Math.floor(Math.random() * 100)}%`
        ,
      }}),
      state('final', style({ opacity: 1, transform: 'translate({{finalX}}, {{finalY}})' }), {params: {
        finalX: `${Math.floor(Math.random() * 100)}%`,
        finalY: `${Math.floor(Math.random() * 100)}%`
      }}),
      transition('initial => final', animate('500ms ease-in')),
    ]),
  ],
  templateUrl: './bubble.component.html',
  styleUrl: './bubble.component.scss'
})
export class BubbleComponent implements OnInit, OnChanges{
  boxState = 'initial'
  @Input() style: string = 'red';
  @Input() initialX: string = `-${Math.floor(Math.random() * 100)}%`; // Customize initial X coordinate
  @Input() initialY: string = `${Math.floor(Math.random() * 100)}%`; // Customize initial Y coordinate
  @Input() finalX: string = `${Math.floor(Math.random() * 100)}%`; // Customize final X coordinate
  @Input() finalY: string = `${Math.floor(Math.random() * 100)}%`; // Customize final Y coordinate

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

