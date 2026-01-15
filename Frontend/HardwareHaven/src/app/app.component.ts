import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ CommonModule,  RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public errorServer:boolean = false;
  title = 'HardwareHaven';
  showFloatingIcons: boolean = true;

  constructor(private router:Router){
  }

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Ocultar iconos si la ruta es '/chatbot'
      this.showFloatingIcons = !event.urlAfterRedirects.includes('/chatbot');
    });
  }

  goToChatBot(){
    this.router.navigate(['chatbot']);
  }

  gotoHelp(){
    this.router.navigate(['help']);
  }
}

