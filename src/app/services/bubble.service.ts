import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';
import { Bubble } from '../models/bubble.model';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BubbleService {
  private hubConnection: signalR.HubConnection;
  private bubbles = new BehaviorSubject<Map<string, Bubble>>(new Map<string, Bubble>([]));
  private selectedInteractOption = new BehaviorSubject<string>('move');
  private hubUrl = environment.api + '/bubblehub';
  private connectionId;

  constructor(private http: HttpClient) { 
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.hubUrl, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .build();
  }

  pushBubble(bubble: Bubble) {
    this.bubbles.value.set(bubble.id, bubble);
  }

  getBubbles() : Observable<Map<string, Bubble>>{
    return this.bubbles;
  }

  removeBubble(id: string) : void{
    this.bubbles.value.delete(id);
  }

  setInteractOption(option: string): void {
    this.selectedInteractOption.next(option);
  }

  getInteractOption(): Observable<string>{
    return this.selectedInteractOption.asObservable();
  }

  startConnection(): Observable<void>{
    this.hubConnection.on('Connected', (connectionId) => {
      this.connectionId = connectionId;
    })
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
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    const endpoint = environment.api + `/api/bubble/send/${this.connectionId}`;
    
    this.http.post(endpoint, message, { headers }).subscribe({
      next: () => {}
    });
  }
}
