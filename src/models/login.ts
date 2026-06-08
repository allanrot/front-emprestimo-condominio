export class Login {
  name: string;
  token: string;
  userId: string;
  apartment: string;

  constructor(login: Login) {
    this.name = login.name;
    this.token = login.token;
    this.userId = login.userId;
    this.apartment = login.apartment;
  }
}
