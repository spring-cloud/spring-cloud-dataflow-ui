/**
 * Contains common Object/JSON related helper methods.
 *
 * @author Gunnar Hillert
 */
export class ObjectUtils {

  /**
   * Convert a JSON object notation to a Map.
   */
  public static convertJsonToMap(json: any): Map<string, string> {
    if (!json) {
      return undefined;
    }
    const map = new Map<string, string>();
    Object.keys(json).forEach(key => {
      map.set(key, json[key]);
    });
    return map;
  }
}
