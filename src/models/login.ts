export class Login {
  nome: string;
  token: string;
  usuarioId: string;

  constructor(login: Login) {
    this.nome = login.nome;
    this.token = login.token;
    this.usuarioId = login.usuarioId;
  }
}
