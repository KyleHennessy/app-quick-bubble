import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, finalize, Observable, Subject, tap } from 'rxjs';
import { Bubble } from '../models/bubble.model';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class BubbleService {
  private hubConnection: signalR.HubConnection;
  private bubblesSubject = new BehaviorSubject<Map<string, Bubble>>(new Map<string, Bubble>([]));
  private connectionCountSubject = new BehaviorSubject<number>(1);
  private sendingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new Subject<string>();
  bubbles$ = this.bubblesSubject.asObservable();
  sending$ = this.sendingSubject.asObservable();
  errors$ = this.errorSubject.asObservable();
  connectionCount$ = this.connectionCountSubject.asObservable();
  private hubUrl = environment.api + '/bubblehub';

  constructor(private http: HttpClient, private messageService: MessageService) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.hubUrl, {
        transport: signalR.HttpTransportType.WebSockets,
        withCredentials: false
      })
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('Connected to SignalR hub ' + this.hubConnection.connectionId))
      .catch(err => console.error('Error connecting to SignalR hub:', err));

    this.hubConnection.on('NewBubble', (bubble: Bubble) => {
      this.bubblesSubject.value.set(bubble.id, bubble);
    });

    this.hubConnection.on('ConnectionUpdate', (count: number) => {
      this.connectionCountSubject.next(count);
    })
  }

  removeBubble(id: string): void {
    this.bubblesSubject.value.delete(id);
  }

  sendMessage(message: Bubble): void {
    this.sendingSubject.next(true);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    const endpoint = environment.api + `/api/bubble/send/${this.hubConnection.connectionId}`;

    this.http.post(endpoint, message, { headers }).pipe(tap(), finalize(() => this.sendingSubject.next(false))).subscribe({
      next: (response: Bubble) => {
        response.send = true;
        this.bubblesSubject.value.set(response.id, response);
      },
      error: (err: HttpErrorResponse) => {
        const errorMessage = err?.error?.errors?.Message?.[0] ?? "Something went wrong! Try again later";
        this.errorSubject.next(errorMessage);
      }
    });
  }
}
