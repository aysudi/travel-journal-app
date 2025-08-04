class User {
  fullName: string;
  username: string;
  email: string;
  password: string;
  constructor(
    fullName: string,
    username: string,
    email: string,
    password: string
  ) {
    this.fullName = fullName;
    this.username = username;
    this.email = email;
    this.password = password;
  }
}

export default User;
