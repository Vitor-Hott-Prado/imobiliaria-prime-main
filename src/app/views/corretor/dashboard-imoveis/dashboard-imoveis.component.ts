import { Component, OnInit } from '@angular/core';
import { ImoveisService } from 'src/app/core/services/imoveis.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-dashboard-imoveis',
  templateUrl: './dashboard-imoveis.component.html',
  styleUrls: ['./dashboard-imoveis.component.scss']
})
export class DashboardImoveisComponent implements OnInit {
  imoveis: any[] = [];
  carregando: boolean = true;
  erro: string | null = null;
  exibindoForm: boolean = false;
  imovelEditando: any = null;
  corretorId!: number;

  constructor(
    private imoveisService: ImoveisService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    this.corretorId = Number(usuario.id);
    this.carregarImoveis();
  }

  carregarImoveis(): void {
    this.carregando = true;
    this.imoveisService.getImoveis().subscribe({
      next: (data) => {
        const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
        const corretorId = Number(usuario.id);

        const imoveisFiltrados = data
          .map(imovel => ({
            ...imovel,
            id: Number(imovel.id),
            corretorId: Number(imovel.corretorId)
          }))
          .filter(imovel => imovel.corretorId === corretorId);

        this.imoveis = imoveisFiltrados;
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao carregar imóveis:', err);
        this.erro = 'Erro ao carregar imóveis.';
        this.carregando = false;
      }
    });
  }

  novoImovel(): void {
    this.imovelEditando = {
      titulo: '',
      tipo: '',
      cidade: '',
      preco: 0,
      descricao: '',
      imagemUrl: '',
      corretorId: this.corretorId
    };
    this.exibindoForm = true;
  }

  editarImovel(imovel: any): void {
    // Garante que o id seja numérico para evitar duplicação
    this.imovelEditando = { ...imovel, id: Number(imovel.id) };
    this.exibindoForm = true;
  }

  salvarImovel(): void {
    if (this.imovelEditando.id) {
      this.imoveisService.updateImovel(this.imovelEditando.id, this.imovelEditando).subscribe({
        next: () => this.voltarParaLista(),
        error: () => alert('Erro ao atualizar imóvel.')
      });
    } else {
      this.imoveisService.createImovel(this.imovelEditando).subscribe({
        next: () => this.voltarParaLista(),
        error: () => alert('Erro ao salvar imóvel.')
      });
    }
  }

  deletarImovel(id: number): void {
    if (confirm('Tem certeza que deseja excluir este imóvel?')) {
      this.imoveisService.deleteImovel(Number(id)).subscribe({
        next: () => this.carregarImoveis(),
        error: () => alert('Erro ao excluir imóvel.')
      });
    }
  }

  voltarParaLista(): void {
    this.exibindoForm = false;
    this.imovelEditando = null;
    this.carregarImoveis();
  }

  cancelarForm(): void {
    this.voltarParaLista();
  }
}
