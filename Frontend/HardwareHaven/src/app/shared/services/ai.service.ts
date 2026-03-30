import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SessionService } from '../../core/services/share/session.service.js';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private apiUrl = 'http://localhost:3000/api/ai';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    SessionService.rememberSession();
    const token = SessionService.jwt;
    if (token) {
      return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }
    return new HttpHeaders();
  }

  interactuarChatbot(mensaje: string, usuario_id?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/chatbot`, 
      { mensaje_usuario: mensaje, usuario_id }, 
      { headers: this.getAuthHeaders() }
    );
  }

  getRecomendaciones(usuario_id?: string, producto_actual_id?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/recomendaciones`, 
      { usuario_id, producto_actual_id },
      { headers: this.getAuthHeaders() }
    );
  }

  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dashboard/stats`, { headers: this.getAuthHeaders() });
  }
}
