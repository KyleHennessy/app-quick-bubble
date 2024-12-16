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
  private bubblesSubject = new BehaviorSubject<Map<string, Bubble>>(new Map<string, Bubble>([]));
  private selectedInteractOption = new BehaviorSubject<string>('move');
  bubbles$ = this.bubblesSubject.asObservable();
  interactOption$ = this.selectedInteractOption.asObservable();
  private hubUrl = environment.api + '/bubblehub';

  constructor(private http: HttpClient) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.hubUrl, {
        transport: signalR.HttpTransportType.WebSockets,
        withCredentials: true
      })
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('Connected to SignalR hub ' + this.hubConnection.connectionId))
      .catch(err => console.error('Error connecting to SignalR hub:', err));

    this.hubConnection.on('ReceiveBubble', (bubble: Bubble) => {
      this.bubblesSubject.value.set(bubble.id, bubble);
    });
  }

  removeBubble(id: string): void {
    this.bubblesSubject.value.delete(id);
  }

  setInteractOption(option: string): void {
    this.selectedInteractOption.next(option);
  }

  sendMessage(message: Bubble): void {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    const endpoint = environment.api + `/api/bubble/send/${this.hubConnection.connectionId}`;

    this.http.post(endpoint, message, { headers }).subscribe({
      next: () => { }
    });
  }
}
