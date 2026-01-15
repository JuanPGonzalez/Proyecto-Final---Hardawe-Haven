import { Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { UserService } from '../../core/services/entities/user.service.js';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SweetAlertService } from '../../core/services/notifications/sweet-alert.service.js';
import { ToastService } from '../../core/services/notifications/toast.service.js';
import { SessionService } from '../../core/services/share/session.service.js';
import { CommonModule } from '@angular/common';
import { ShareService } from '../../core/services/share/share.service.js';
import { directed, getMaxPrice } from '../../shared/functions/functions.js';
import { ComponentService } from '../../core/services/entities/component.service.js';
import { CategoryService } from '../../core/services/entities/category.service.js';
import { CardComponent } from '../../features/products/components/card/card.component.js';

declare var bootstrap: any;

@Component({
  selector: 'home',
  standalone: true,
  imports: [HttpClientModule, FormsModule, CommonModule, CardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [UserService, ShareService, ComponentService, CategoryService]
})
export class HomeComponent implements OnInit, OnDestroy {

  private user: any;
  public username: string = '';
  public password: string = '';
  public rememberKey: boolean = false;
  private intervalId: any;
  public errorServer: boolean = false;
  public emailOffers: string = '';
  public showWelcomeMessage: boolean = true;

  // Product Logic
  public products: any[] = [];
  public allProducts: any[] = [];
  public categorias: any[] = [];
  sortCriteria: string = '';
  sortCriteriaMenu: string = '';

  constructor(
    private serverUser: UserService,
    private router: Router,
    private sweetAlertService: SweetAlertService,
    private toastService: ToastService,
    private shareServer: ShareService,
    private serverProduct: ComponentService,
    private serverCategori: CategoryService
  ) {}

  ngOnInit(): void {
    this.someFunction();
    this.checkServer();
    const previousUser = SessionService.rememberSession();
    if (previousUser) {
      directed(previousUser.tipoUsuario, this.router);
    }

    this.startCarousel(2500);
    this.getAllProducts();
    this.getAllCategori();
  }

  getAllProducts() {
    this.serverProduct.getAll().subscribe({
      next: (r: any) => {
        try {
          if (r && r.data && Array.isArray(r.data)) {
            this.products = r.data;
            this.allProducts = [...this.products];
          }
        } catch (error) {
          console.error("Error finding products", error);
          this.sweetAlertService.showError("Error al cargar productos");
        }
      },
      error: (e) => {
        console.error("Error finding products", e);
        this.sweetAlertService.showError("Error al cargar productos: " + (e.error?.message || e.message));
      }
    });
  }

  getAllCategori() {
    this.serverCategori.getAll().subscribe({
      next: (r: any) => {
        try {
          if (r && r.data && Array.isArray(r.data)) {
            this.categorias = r.data;
          }
        } catch (error) {
          console.error("Error finding categories", error);
        }
      },
      error: (e) => {
        console.error("Error finding categories", e);
      }
    });
  }

  onSortChangeOrden(event: any) {
    this.sortCriteria = event.target.value;
    this.sortProducts();
  }

  sortProducts() {
    if (this.sortCriteria === 'Or') {
      this.products = [...this.allProducts];
    } else if (this.sortCriteria === 'az') {
      this.products.sort((a, b) => a.name.localeCompare(b.name));
    } else if (this.sortCriteria === 'za') {
      this.products.sort((a, b) => b.name.localeCompare(a.name));
    } else if (this.sortCriteria === 'highPrice') {
      this.products.sort((a, b) => getMaxPrice(b.precios) - getMaxPrice(a.precios));
    } else if (this.sortCriteria === 'lowPrice') {
      this.products.sort((a, b) => getMaxPrice(a.precios) - getMaxPrice(b.precios));
    }
  }

  onSortChangeMenu(event: any) {
    this.sortCriteriaMenu = event.target.value;
    this.sortByCategoria();
  }

  sortByCategoria() {
    if (this.sortCriteriaMenu === 'Or') {
      this.products = [...this.allProducts];
    } else {
      this.products = this.allProducts.filter(p => p.categoria.descripcion === this.sortCriteriaMenu);
    }
  }

  async someFunction() {
    if (!SessionService.rememberOffer()) {
      this.emailOffers = await this.sweetAlertService.receiveOffers();
      SessionService.saveOfferNotice();
    }
  }

  startCarousel(time: number) {
    const myCarousel = document.querySelector('#heroCarousel') as HTMLElement;
    if (myCarousel) {
      const carousel = new bootstrap.Carousel(myCarousel, {
        interval: time,
        ride: 'carousel'
      });

      this.intervalId = setInterval(() => {
        carousel.next();
      }, time);
    }
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  async login() {
    this.serverUser.login({ name: this.username, password: this.password }).subscribe({
      next: (r: any) => {
        try {
          if (r) {
            this.user = SessionService.saveSession(r.jwt, this.rememberKey);
            this.errorServer = false;
            directed(this.user.tipoUsuario, this.router)
          } else {
            this.sweetAlertService.showError("The server response is invalid.");
          }
        } catch (error: any) {
          const errores = error.error.errors || [];
          const messageErrors = errores.join(', ');
          const message = error.error.message || [];
          this.sweetAlertService.showError(messageErrors + ", " + message);
        }
      },
      error: (error: any) => {
        const errores = error.error.errors || [];
        const message = error.error.message || [];
        const messageErrors = errores.join(', ');

        if (messageErrors.length === 0) {
          this.toastService.showToast('Acceso denegado');
        }
        else { this.sweetAlertService.showError(messageErrors + ", " + message); }
      }
    });
  }

  registerUser() {
    this.sweetAlertService.mostrarFormularioRegistro().then(credenciales => {
      if (credenciales) {
        this.serverUser.create({
          name: credenciales.username,
          password: credenciales.password,
          email: credenciales.email,
          tipoUsuario: credenciales.userType,
          fechaNac: credenciales.fechaNac,
          sexo: credenciales.sexo,
          direccion: credenciales.direccion
        }).subscribe({
          next: (r: any) => {
            if (r) {
              this.user = SessionService.saveSession(r.jwt, true);
              directed(this.user.tipoUsuario, this.router);
            } else {
              this.sweetAlertService.showError('Data response not found');
            }
          },
          error: (error: any) => {
            const errores = error.error.errors || [];
            const message = error.error.message || 'An unknown error occurred';
            const messageErrors = errores.join(', ');
            this.sweetAlertService.showError(messageErrors ? messageErrors : message);
          }
        });
      }
    }).catch((error: any) => {
      const errores = error.error.errors || [];
      const message = error.error.message || 'An error occurred while displaying the registration form';
      const messageErrors = errores.join(', ');
      this.sweetAlertService.showError(messageErrors ? messageErrors : message);
    });
  }

  checkServer() {
    this.shareServer.ComeOn().subscribe({
      next: (r: any) => {
        this.errorServer = !(r && r.status);
      },
      error: () => {
        this.errorServer = true;
      }
    });
  }

  hideWelcomeMessage() {
    this.showWelcomeMessage = false;
  }
}
