import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

import { SweetAlertService } from '../../core/services/notifications/sweet-alert.service';
import { capitalizeFirstLetterOfEachWord, getErrorMessage, specialFilter } from '../../shared/functions/functions';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';
import { suministroService } from '../../core/services/suministros/suministros';


@Component({
  selector: 'app-suministro',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './suministro.component.html',
  styleUrl: './suministro.component.css',
  providers: [suministroService, SweetAlertService]
})
export class SuministroComponent implements OnInit {
  @Input() searchQuery: string| undefined;
  suministros: any[] = [];
  suministro: any = {};
  inventarioVacio = false;
  columns: string[] = [];
  columnsLw: string[] = [];
  isLoading = false;
  originalSuministro: any[] = [];


  constructor(
    private serverSuministro: suministroService,
    private sweetAlertService: SweetAlertService,

  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['searchQuery']) {
      const currentValue = changes['searchQuery'].currentValue;
      this.searchQuery = currentValue || '';

      if (this.searchQuery === '') {

        this.suministros = [...this.originalSuministro];
      } else {

        this.suministros = this.originalSuministro.filter(x =>
          x.descripcion.toLowerCase().includes(this.searchQuery?.toLowerCase())
        );
      }
    }
  }



  ngOnInit(): void {
    this.loadEntity();
  }


  loadEntity(): void {
    this.getAll();
  }

  loadColumns(): void {
    if (this.suministros.length > 0) {
      this.inventarioVacio = false;
      this.columnsLw = Object.keys(this.suministros[0]);
      this.columns = this.columnsLw.map(capitalizeFirstLetterOfEachWord);
      this.columns.push("Editar", "Eliminar");
    } else {
      this.columns = [];
      this.inventarioVacio = true;
    }
  }



  getAll(): void {
    this.isLoading = true;
    this.serverSuministro.getAll().pipe(
      map((response: any) => response?.data || []),
      catchError((error) => {
        this.sweetAlertService.showError("Error to obtain categories")
        return of([]);
      })
    ).subscribe((suministros: any[]) => {
      this.suministros = suministros;

      this.originalSuministro = [...suministros];

      this.loadColumns();
      this.isLoading = false;
    });
  }


  eliminarItem(suministro: any): void {
    this.delete(suministro.id);
    this.loadEntity();
  }

  editarItem(suministro: any): void {
    this.update(suministro);
    this.loadEntity();
  }

  public delete(id: number) {
    this.sweetAlertService.confirmBox('¿Estás seguro?', 'No podrás revertir esta acción.').then((result) => {
      if (result.isConfirmed) {
        this.serverSuministro.delete(id).pipe(
          map((response: any) => {
            if (response && response.data) {
              return response.data;
            } else {
              return null;
            }
          }),
          catchError((error) => {
            this.isLoading = false;
            const errorMessage = getErrorMessage(error);
            this.sweetAlertService.showError(errorMessage);
            return of(null);
          })
        ).subscribe((suministro: any) => {
          if (suministro) {
            this.suministro = suministro;
            this.loadEntity();
          }
        });
      } else if (result.isDismissed) {
      }
    });
  }



  async insertarSuministro() {
    const credenciales = await this.sweetAlertService.InsertSuministro();
    if (credenciales) {
      this.serverSuministro.create({
        cantidad: credenciales.cantidad,
        idComponente: credenciales.idComponente,
        idUsuario: credenciales.idUsuario
      }).pipe(
        map((response: any) => {
          if (response && response.data) {
            return response.data;
          } else {
            return null;
          }
        }),
        catchError((error) => {
          this.isLoading = false;
          const errorMessage = getErrorMessage(error);
          this.sweetAlertService.showError(errorMessage);
          return of(null);
        })
      ).subscribe({
        next: (suministro: any) => {
            if (suministro) {
                this.suministro = suministro;
                this.loadEntity();
            }
        },
        error: (e) => {
            const errores = e.error?.errors || [];
            const message = e.error?.message || [];
            const mensajeErrores = errores.join(', ');
            this.sweetAlertService.showError(mensajeErrores +", "+ message);
        }
    });

    }
  }


  async update(suministro: any) {
    const credenciales = await this.sweetAlertService.updateSuministro(suministro);
    if (credenciales) {
      this.serverSuministro.update(suministro.id, {
        cantidad: credenciales.cantidad,
        idComponente: credenciales.idComponente,
        idUsuario: credenciales.idUsuario,
        fechaEntrega: credenciales.fechaEntrega
      }).pipe(
        map((response: any) => {
          if (response && response.data) {
            return response.data;
          } else {
            return null;
          }
        }),
        catchError((error) => {
          this.isLoading = false;
          const errorMessage = getErrorMessage(error);
          this.sweetAlertService.showError(errorMessage);
          return of(null);
        })
      ).subscribe(
        {
        next:(suministro: any) => {
        if (suministro) {
          this.suministro = suministro;
          this.loadEntity();
        }
      },
      error: (e) => {
        const errores = e.error?.errors || [];
        const message = e.error?.message || [];
        const mensajeErrores = errores.join(', ');
        this.sweetAlertService.showError(mensajeErrores +", "+ message);
    }
      });
    }
  }



  specialFilter(nombre: string, dato: any): string {
    return specialFilter(nombre,dato);
  }
}
