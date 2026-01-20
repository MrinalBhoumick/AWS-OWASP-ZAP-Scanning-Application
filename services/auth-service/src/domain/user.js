export class User {
  constructor(id, email, password, created_at = null) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.created_at = created_at;
  }

  isValid() {
    return this.email && this.password;
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      created_at: this.created_at
    };
  }
}
