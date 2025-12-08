import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OpenClassService } from '../../core/services/share/open-class.service';

@Component({
  selector: 'app-chat-bot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.css']
})
export class ChatBotComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  constructor(private router: Router, private openClassService: OpenClassService) {}

  public currentTime: Date = new Date();
  userInput: string = '';
  chat: string[] = [];
  isTyping: boolean = false;

  ngOnInit(): void {
    this.initialChat();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  sendMessage() {
    if (!this.userInput.trim()) return;

    this.currentTime = new Date();
    const userMsg = this.userInput;
    this.chat.push("Tú: " + userMsg);
    this.userInput = '';
    
    this.respondBot(userMsg);
  }

  respondBot(userMessage: string) {
    this.isTyping = true;
    
    // Simulate network delay for better UX if response is too fast
    const minDelay = 1000;
    const startTime = Date.now();

    this.openClassService.chat({ message: userMessage }).subscribe({
      next: (res: any) => {
        const elapsedTime = Date.now() - startTime;
        const remainingDelay = Math.max(0, minDelay - elapsedTime);

        setTimeout(() => {
          this.isTyping = false;
          this.chat.push("Bot: " + (res.response || "No hay respuesta del bot."));
        }, remainingDelay);
      },
      error: (err: any) => {
        console.error('Chatbot error:', err);
        this.isTyping = false;
        this.chat.push("Bot: Por el momento, nuestros servidores están fuera de servicio. No podemos ayudarte en este momento. Por favor, contactá a tu proveedor");
      }
    });
  }

  closeChat() {
    this.chat = [];
    this.initialChat();
  }

  initialChat() {
    this.chat = [];
    this.chat.push("Bot: Hola, ¿Cómo puedo ayudarte hoy?");
  }

  gotoHome() {
    this.router.navigate(['home']);
  }
}
