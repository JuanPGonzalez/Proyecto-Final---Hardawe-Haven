import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AiService } from '../../services/ai.service.js';

@Component({
  selector: 'app-ai-recommendation-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ai-recommendation-carousel.component.html',
  styleUrls: ['./ai-recommendation-carousel.component.css']
})
export class AiRecommendationCarouselComponent implements OnInit {
  @Input() tipo: 'recomendados' | 'tambien_compraron' = 'recomendados';
  productos = signal<string[]>([]);
  
  constructor(private aiService: AiService) {}

  ngOnInit() {
    this.aiService.getRecomendaciones().subscribe({
      next: (res: any) => {
        if (this.tipo === 'recomendados') {
          this.productos.set(res.recomendados_para_ti);
        } else {
          this.productos.set(res.tambien_compraron);
        }
      }
    });
  }
}
