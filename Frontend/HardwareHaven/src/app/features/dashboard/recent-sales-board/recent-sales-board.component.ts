import { CommonModule } from '@angular/common';
import { RecentSalesCardComponent } from './recent-sales-card/recent-sales-card.component';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-recent-sales-board',
  standalone: true,
  imports: [RecentSalesCardComponent, CommonModule],
  templateUrl: './recent-sales-board.component.html',
  styleUrl: './recent-sales-board.component.css'
})
export class RecentSalesBoardComponent implements OnInit {

  @Input() BestCustomers: any;




  ngOnInit(): void {}



}
