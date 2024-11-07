import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Bubble } from '../models/bubble.model';

@Injectable({
  providedIn: 'root'
})
export class BubbleService {
  private hubConnection: signalR.HubConnection;
  private bubbles = new BehaviorSubject<Map<string, Bubble>>(new Map<string, Bubble>([]));

  pushBubble(bubble: Bubble) {
    this.bubbles.value.set(bubble.id, bubble);
  }

  getBubbles() : Observable<Map<string, Bubble>>{
    return this.bubbles;
  }

  removeBubble(id: string) : void{
    this.bubbles.value.delete(id);
  }

  constructor() { 
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7016/bubblehub', {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .build();
  }

  startConnection(): Observable<void>{
    return new Observable<void>((observer) => {
      this.hubConnection
        .start()
        .then(() => {
          console.log('Connection established with SignalR hub');
          observer.next();
          observer.complete();
        })
        .catch((error) => {
          console.error('Error connecting to SignalR hub:', error);
          observer.error(error);
        })
    })
  }

  receiveMessage(): Observable<Bubble> {
    return new Observable<Bubble>((observer) => {
      this.hubConnection.on('ReceiveMessage', (message: Bubble) => {
        observer.next(message);
      });
    });
  }

  sendMessage(message: Bubble): void {
    this.hubConnection.invoke('SendMessage', message);
  }
}
