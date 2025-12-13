import { dashboardService } from './../../../core/services/dashboard/dashboard';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { StartDashBoardComponent } from '../../../features/dashboard/start-dash-board/start-dash-board.component';
import { CommonModule } from '@angular/common';
import { TimeChartComponent } from '../../../features/dashboard/charts/time-chart/time-chart.component';
import { BarLateralChartComponent } from '../../../features/dashboard/charts/bar-lateral-chart/bar-lateral-chart.component';
import { PieChartComponent } from '../../../features/dashboard/charts/pie-chart/pie-chart.component';
import { Router } from '@angular/router';
import { UserNavComponent } from '../../../shared/user-nav/user-nav.component';
import { SessionService } from '../../../core/services/share/session.service';
import { SweetAlertService } from '../../../core/services/notifications/sweet-alert.service';

import { catchError, map } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [UserNavComponent, StartDashBoardComponent, CommonModule, TimeChartComponent, BarLateralChartComponent, PieChartComponent ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy  {
  dashes: any[] = [];
  dash: any = {};
  originaldash: any[] = [];




private intervaloId: any;

  public currentView:string = 'start';
  public currentDetail:string = 'view';
  public usuario:any;
  public today: Date = new Date();
  constructor(
    private router:Router,
    private serverDashBoard: dashboardService ,
     private sweetAlertService: SweetAlertService,


  ){}
ngOnInit(): void {
   this.usuario = SessionService.rememberSession();
  this.getAll();


  this.intervaloId = setInterval(() => {
    this.getAll();
  }, 6 * 60 * 1000);
}

ngOnDestroy(): void {

  if (this.intervaloId) {
    clearInterval(this.intervaloId);
  }
}

  setView(view: string) {
    this.currentView = view;
    this.currentDetail="view"
  }

  setDetail(view:string){
    this.currentDetail=view;
  }

  gotoHome(){
    this.router.navigate(['home']);
  }


 getAll(): void {
  this.serverDashBoard.getAll().pipe(
    map((response: any) => response?.data || []),
    catchError((error) => {
      this.sweetAlertService.showError("Error al obtener los datos");
      return of([]);
    })
  ).subscribe((dash: any[]) => {
    this.dash = dash;
    this.updateDashboardValues();
    console.log(dash)
  });
}

public startData: any;
public timelineData: any;
public timelineData2: any;
public productData: any;
public BestCustomers: any;
public clienteData: any;
public payData: any;
public analysisData: any;
public dataPieAnalysis: any;
public SalesMonthIn:any;
public TopProducts:any;

private updateDashboardValues(): void {

this.startData = {
      Total_Revenue: {
        tittle: 'Total Revenue',
        reference: `+${this.dash.TotalRevenueLM || 0}% from last month`,
        value: `${this.dash.TotalResvenue || 0}`
      },
      New_Orders: {
        tittle: 'New Orders',
        reference: `+${this.dash.NewOrdersLM || 0}% from last month`,
        value: `${this.dash.NewOrders || 0}`
      },
      Customers: {
        tittle: 'Customers',
        reference: 'They prefer us',
        value: `${this.dash.Customers|| 0}`
      },
      Active_Products: {
        tittle: 'Active Products',
        reference: 'Available now',
        value: `${this.dash.ActiveProducts|| 0}`
      }
    };


 this.SalesMonthIn= [
    { name: 'Jan', value: 1000 },
    { name: 'Feb', value: 2500 },
    { name: 'Mar', value: 3000 },
    { name: 'Apr', value: 2800 },
    { name: 'May', value: 3200 },
    { name: 'Jun', value: 3500 },
    { name: 'Jul', value: 3700 },
    { name: 'Aug', value: 3400 },
    { name: 'Sep', value: 4000 },
    { name: 'Oct', value: 4200 },
    { name: 'Nov', value: 4500 },
    { name: 'Dec', value: 4800 },
  ];

  for (const key in this.SalesMonthIn) {
    if (!Object.hasOwn(this.SalesMonthIn, key)) continue;

    this.SalesMonthIn[key].name = this.dash.SalesMonthIN[key].month
    this.SalesMonthIn[key].value = this.dash.SalesMonthIN[key].amount
  }


  this.TopProducts= this.dash.TopProducts || undefined;
//-------------------------------------------------------------------------

const sales = this.dash?.SalesMonth ?? [];
const series = sales.length > 0
  ? sales.map((item: { day: any, total: number }) => ({
      name: item.day?.toString() || '-',
      value: item.total ?? 0
    }))
  : Array.from({ length: 31 }, (_, i) => ({
      name: (i + 1).toString().padStart(2, '0'), // "01", "02", ...
      value: 0
    }));
this.timelineData = [
  {
    name: 'Sales about this month',
    series
  }
];






  this.timelineData2 = [
    {
      "name": "Compras de este mes",
      "series": [
        { "name": "1", "value": 90 },
        { "name": "2", "value": 75 },
        { "name": "3", "value": 82 },
        { "name": "4", "value": 60 },
        { "name": "5", "value": 95 },
        { "name": "6", "value": 88 },
        { "name": "7", "value": 72 },
        { "name": "8", "value": 99 },
        { "name": "9", "value": 65 },
        { "name": "10", "value": 80 },

      ]
    }
  ];

 this.productData = [
    { name: 'Procesadores', value: 250 },
    { name: 'Fuentes de Poder', value: 200 },
    { name: 'Memorias RAM', value: 180 },
    { name: 'Almacenamiento SSD', value: 130 },
    { name: 'Tarjetas Gráficas', value: 120 },
  ];

   this.BestCustomers = (this.dash.BestCustomers)||[
  {name: 'Usuario1', email: 'Usuario1@gmail.com', totalIn: '4933798.000'},
  {name: 'Usuario2', email: 'Usuario2@gmail.com', totalIn: '400.000'}
  ];
//////////////////////////////////////////////////////////////////////////////////////////////////////
 const defaultClientes = [
  { name: "Username 1", value: 90 },
  { name: "Username 2", value: 75 },
  { name: "Username 3", value: 30 },
  { name: "Username 4", value: 10 },
  { name: "Username 5", value: 7 }
];


this.clienteData = (this.dash?.SPCustomers?.length)
  ? this.dash.SPCustomers.map((c: any) => ({
      name: c.userName,
      value: c.TotalSales
    }))
  : defaultClientes;






this.payData = [
    { name: "Cash", value: `${this.dash.Payments["cash"] || 0}` },
    { name: "Card", value: 0 },
    { name: "Electronic payment", value: 0 },

  ];



  this.analysisData = [
    { name: "Usuarios Activos", value: 1200 },
    { name: "Memoria Usada (MB)", value: 2048 },
    { name: "Solicitudes por Minuto", value: 450 },
    { name: "Tiempo de Respuesta del Servidor (ms)", value: 230 },
    { name: "Latencia Promedio (ms)", value: 120 },
    { name: "Carga Promedio del CPU (%)", value: 65 },
    { name: "Tasa de Retención (%)", value: 78 },
    { name: "Tiempo Promedio de Sesión (min)", value: 15 },
    { name: "Conversiones (%)", value: 12 },
    { name: "Errores Críticos Mensuales", value: 5 }
];

this.dataPieAnalysis = [
  { name: "Usuarios Activos", value: 1200 },
  { name: "Memoria Usada (MB)", value: 2048 },
  { name: "Solicitudes por Minuto", value: 450 },
];



}


async downloadReport(): Promise<void> {

  const confirmed = await this.sweetAlertService.confirmBox(
    '¿Desea descargar el informe?',
    'Descargar'
  );

  if (!confirmed) {
    return;
  }

  const jsonContent = JSON.stringify(this.dash, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `Reporte_Dashboard_${new Date().toISOString().slice(0, 10)}.json`;
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}



}
