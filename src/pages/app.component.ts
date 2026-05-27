import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TestApiService } from '../api/test-api-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private itemService = inject(TestApiService);
  title = 'emprestimo-condominio';
  items: any[] = [];

  ngOnInit(): void {
    this.listar();
  }

  criar(): void {
    this.itemService.criar({ nome: 'Teste', descricao: 'Teste deu certo', disponivel: true }).subscribe(() => this.listar())
  }

  listar(): void {
    this.itemService.listar()
      .subscribe((response: any) => {
        this.items = response;
      });
  }
}
