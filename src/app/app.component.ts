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
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { WelcomeComponent } from './welcome/welcome.component';

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
  providers:[
    MessageService,
    DialogService
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'app-quick-bubble';
  newBubbleSubscription: Subscription;
  ref: DynamicDialogRef;

  constructor(private primengConfig: PrimeNGConfig, public dialogService: DialogService){}

  ngOnInit(): void {
    let isMobile = window.matchMedia('(max-width: 768px)').matches
    
    this.primengConfig.ripple = true;
    const isFirstTime = localStorage.getItem('isFirstTime') === null;
    if(isFirstTime){
      this.ref = this.dialogService.open(WelcomeComponent, {
        width: 'auto',
        header: 'Welcome to Quick Bubble!'
      })
    }
  }

  ngOnDestroy(): void {
    this.newBubbleSubscription.unsubscribe();
  }
}
