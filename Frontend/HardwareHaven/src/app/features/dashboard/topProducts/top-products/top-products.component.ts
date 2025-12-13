import { Component, Input, OnInit } from '@angular/core';
import { capitalizeFirstLetterOfEachWord } from '../../../../shared/functions/functions';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-top-products',
  standalone: true,
   imports: [CommonModule, FormsModule],
  templateUrl: './top-products.component.html',
  styleUrl: './top-products.component.css'
})
export class TopProductsComponent implements OnInit {

  @Input() TopProducts: any;

columnsLw: string[] = [];
columns: string[] = [];



inventarioVacio = false;
  ngOnInit(): void {
if (!this.TopProducts) {
    this.TopProducts=[
    {
        "id": 2,
        "name": "Corsair Vengeance LPX 16GB",
        "category": "Memorias RAM",
        "total": "8720000.000",
        "sales": 51
    },
    {
        "id": 3,
        "name": "ASUS ROG Strix Z790-E",
        "category": "Motherboards",
        "total": "3360000.000",
        "sales": 35
    }
]}
this.loadColumns();
  }

  loadColumns(): void {
      if (this.TopProducts.length > 0) {
        this.inventarioVacio = false;
        this.columnsLw = Object.keys(this.TopProducts[0]);
        this.columns = this.columnsLw.map(capitalizeFirstLetterOfEachWord);
      } else {
        this.columns = [];
         this.inventarioVacio = true;
      }
    }
}
