import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ImoveisService } from 'src/app/core/services/imoveis.service';
import { Location } from '@angular/common'; // 👈 importa Location

@Component({
  selector: 'app-detalhes-imovel',
  templateUrl: './detalhes-imovel.component.html',
  styleUrls: ['./detalhes-imovel.component.scss']
})
export class DetalhesImovelComponent implements OnInit {
  imovel: any = null;
  erro: string | null = null;
  carregando: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private imoveisService: ImoveisService,
    private location: Location // 👈 injeta o Location
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      const id = Number(idParam);

      if (isNaN(id)) {
        this.erro = 'ID inválido.';
        return;
      }

      this.carregarImovel(id);
    } else {
      this.erro = 'ID não encontrado.';
    }
  }

  carregarImovel(id: number): void {
    this.carregando = true;
    this.imoveisService.getImovel(id).subscribe({
      next: (data) => {
        this.imovel = data;
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao carregar imóvel:', err);
        this.erro = 'Erro ao carregar imóvel.';
        this.carregando = false;
      }
    });
  }

  voltar(): void {
    this.location.back(); // 👈 volta para a página anterior
  }
}
