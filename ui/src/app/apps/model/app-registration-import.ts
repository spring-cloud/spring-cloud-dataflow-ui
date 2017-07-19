/**
 * AppRegistrationImport is used in order
 * to register new Applications.
 *
 * @author Gunnar Hillert
 */
export class AppRegistrationImport {
  constructor(
    public force: boolean,
    public appsProperties: string[],
    public uri: string,
   ) { }
}
