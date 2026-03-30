import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AiService } from '../../shared/services/ai.service.js';

@Component({
  selector: 'app-ai-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ai-admin-dashboard.component.html',
  styleUrls: ['./ai-admin-dashboard.component.css']
})
export class AiAdminDashboardComponent implements OnInit {
  stats = signal<any>(null);

  constructor(private aiService: AiService) {}

  ngOnInit() {
    this.aiService.getDashboardStats().subscribe({
      next: (res: any) => {
        this.stats.set(res);
      }
    });
  }
}
