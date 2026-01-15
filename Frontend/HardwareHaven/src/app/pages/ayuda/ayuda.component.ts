import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ayuda',
  standalone: true,
  imports: [HttpClientModule, FormsModule],
  templateUrl: './ayuda.component.html',
  styleUrl: './ayuda.component.css'
})
export class HelpComponent {
  contactName: string = '';
  contactSubject: string = '';
  contactMessage: string = '';

  constructor(private router: Router){

  }

  gotoHome(){
    this.router.navigate(['home']);
  }

  sendEmail() {
    if (!this.contactName || !this.contactSubject || !this.contactMessage) return;

    const email = 'ignacio.rodriguez.sistemas@gmail.com'; // Or your support email
    const subject = encodeURIComponent(`[Consulta Web] ${this.contactSubject}`);
    const body = encodeURIComponent(`Nombre: ${this.contactName}\n\nMensaje:\n${this.contactMessage}`);
    
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  }
}
