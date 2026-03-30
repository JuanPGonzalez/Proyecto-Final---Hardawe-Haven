import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../services/ai.service.js';

@Component({
  selector: 'app-ai-chatbot-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-chatbot-widget.component.html',
  styleUrls: ['./ai-chatbot-widget.component.css']
})
export class AiChatbotWidgetComponent {
  isOpen = signal(false);
  messages = signal<{sender: 'user'|'bot', text: string}[]>([]);
  userInput = '';

  constructor(private aiService: AiService) {
    this.messages.set([{sender: 'bot', text: '¡Hola! Soy el asistente virtual. ¿En qué puedo ayudarte hoy?'}]);
  }

  toggleChat() {
    this.isOpen.update(v => !v);
  }

  sendMessage() {
    if(!this.userInput.trim()) return;
    const msg = this.userInput;
    this.messages.update(prev => [...prev, {sender: 'user', text: msg}]);
    this.userInput = '';

    this.aiService.interactuarChatbot(msg).subscribe({
      next: (res: any) => {
        this.messages.update(prev => [...prev, {sender: 'bot', text: res.respuesta_bot}]);
      },
      error: () => {
        this.messages.update(prev => [...prev, {sender: 'bot', text: 'Error de conexión. Intenta luego.'}]);
      }
    });
  }
}
