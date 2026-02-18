import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SweetAlertService } from '../../core/services/notifications/sweet-alert.service';
import { suministroService } from '../../core/services/suministros/suministros';
import { SessionService } from '../../core/services/share/session.service';
import { catchError, map, of } from 'rxjs';
import { UserNavComponent } from '../../shared/user-nav/user-nav.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlusButtonComponent } from '../../features/inventory/share/plus-button/plus-button.component';
import { SuministroComponent } from '../../features/suministro/suministro.component';
@Component({
  selector: 'app-suministros',
  templateUrl: './suministros.component.html',
  standalone: true,
  imports: [
    UserNavComponent,
    CommonModule,
    FormsModule,
    PlusButtonComponent,
    SuministroComponent

  ],
  styleUrls: ['./suministros.component.css']
})
export class SuministrosPageComponent implements OnInit {

  constructor(
     private router:Router,
        private serverSuministro: suministroService,
         private sweetAlertService: SweetAlertService,


  ) { }
  carga:string = ""
 public usuario:any;
 private intervaloId: any;
 searchQuery: string = '';
 auxsearchQuery: string = '';
 sumis: any = {};
  ngOnInit(): void {
     this.usuario = SessionService.rememberSession();

  }

 gotoHome(){
    this.router.navigate(['home']);
  }
 onSearch(event: Event): void {
    event.preventDefault();
   this.searchQuery = this.auxsearchQuery
  }

   getplusbuttonChange(e: string): void {
    this.carga = "Cargando...";
    setTimeout(() => {
      this.carga = '';
    }, 2000);
  }

}
