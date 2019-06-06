import { browser, element, ElementFinder, ProtractorBy, ElementArrayFinder } from 'protractor';
import { protractor } from 'protractor/built/ptor';
import { By } from 'selenium-webdriver';

const EC = protractor.ExpectedConditions;

const defaultTimeout = 30000;

export class ElementHelper {

  public static async u(e: By): Promise<number> {
    return element.all(await ElementHelper.getElementOrWait(e)).count();
  }

  public static async getElementOrWait(byValue: By): Promise<By> {
    const conditionA = EC.visibilityOf(element(byValue));
    const conditionB = EC.invisibilityOf(element(By.css('.app-blocker')));
    const conditionC = EC.invisibilityOf(element(By.css('modal-body')));
    return browser.wait(
      EC.and(conditionA, conditionB, conditionC), defaultTimeout)
      .then(() => byValue, () => {
        fail(`No visible emelement for '${byValue}'.`);
        return byValue;
      });
  }

  public static getClickableElementOrWait(by: By) {
    const conditionA = EC.visibilityOf(element(by));
    const conditionB = EC.invisibilityOf(element(By.css('.app-blocker')));
    const conditionC = EC.invisibilityOf(element(By.css('modal-body')));
    return browser.wait(
      EC.and(conditionA, conditionB, conditionC), defaultTimeout, 'getClickableElementOrWait failed.')
      .then(() => element(by));
  }

  public static async waitForSpinners() {
    const conditionB = EC.invisibilityOf(element(By.css('.app-blocker')));
    const conditionC = EC.invisibilityOf(element(By.css('modal-body')));
    await browser.wait(() => {
      return EC.and(conditionB, conditionC);
    }, defaultTimeout, 'waitForSpinners failed.');
  }


  public static async clickElement(by: By, clickFirst: boolean, parent: ElementFinder): Promise<boolean> {

    console.log('Clicking ' + by);

    let returnValue = false;
    let attempt = 0;

    await new Promise(resolve => {
      let timeout = setTimeout(async function tt() {
        await foo();
        if (!returnValue) {
          timeout = setTimeout(tt, 2000);
        } else {
          resolve();
        }
      }, 2000);

      setTimeout(() => {
        console.log('Cancelling');
        clearTimeout(timeout);
        resolve();
      }, 20000);

      async function foo(): Promise<void> {
        attempt++;
        let clickableElement;

        if (clickFirst) {
          const t = parent.all(by);
          if (await t.count() > 0) {
            clickableElement = t.first();
          } else {
            returnValue = false;
          }
        } else {
          clickableElement = element(by);
        }

        console.log(`Attempt ${attempt} for clickableElement:` + clickableElement);

        await clickableElement.click().then(() => {
          console.log(`Successfully Clicked: ${by} (Attempt: ${attempt})`);
          clearTimeout(timeout);
          returnValue = true;
        }, () => {
          console.log(`Failed click: ${by} (Attempt: ${attempt})`);
          returnValue = false;
        });

      }
    });

    console.log('Clicked ' + by + '; ' + returnValue);
    return returnValue;
  }

  public static async clickElementByProvidingElementFinder(el: ElementFinder) {
    const clickableElement = await el;
    await browser.wait(EC.elementToBeClickable(clickableElement), 15000);
    await clickableElement.click();
  }

}
