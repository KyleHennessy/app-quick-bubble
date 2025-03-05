import {Component, OnDestroy, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LauncherComponent } from './launcher/launcher.component';
import { Subscription } from 'rxjs';
import { FrameComponent } from './frame/frame.component';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    FormsModule,
    LauncherComponent,
    FrameComponent,
    CardModule,
    FloatLabelModule,
    InputTextModule,
    MessagesModule,
    ToastModule
  ],
  providers:[MessageService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'app-quick-bubble';
  receiveBubbleSubscription: Subscription;

  constructor(private primngConfig: PrimeNGConfig){}

  ngOnInit(): void {
    this.primngConfig.ripple = true;
  }

  ngOnDestroy(): void {
    this.receiveBubbleSubscription.unsubscribe();
  }
}
