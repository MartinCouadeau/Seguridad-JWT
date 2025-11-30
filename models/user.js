export class User {
  constructor(name, email, role = "user") {
    this.name = name;
    this.email = email;
    this.role = role;
  }
}

export const externalUsers = [];

