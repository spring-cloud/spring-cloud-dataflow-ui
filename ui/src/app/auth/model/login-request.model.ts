/**
 * The LoginRequest object is used during login
 * and holds the username and the password.
 *
 * @author Gunnar Hillert
 */
export class LoginRequest {
    constructor(
      public username: string,
      public password: string,
    ) {}
}
