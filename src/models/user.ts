export class User {
  name?: string | null;
  apartment?: string | null;
  phone?: string | null;
  email?: string | null;
  password?: string | null;

  constructor(user: User) {
    this.name = user.name;
    this.apartment = user.apartment;
    this.phone = user.phone;
    this.email = user.email;
    this.password = user.password;
  }
}
