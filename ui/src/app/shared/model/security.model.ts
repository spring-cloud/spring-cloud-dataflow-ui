export interface Security {
  authenticationEnabled: boolean;
  authenticated: boolean;
  username: string;
  roles: string[];
}
