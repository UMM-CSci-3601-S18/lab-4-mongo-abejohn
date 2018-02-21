import {browser, element, by} from 'protractor';
import {Key} from "selenium-webdriver";

export class TodoPage {
    navigateTo() {
        return browser.get('/todos');
    }

    //http://www.assertselenium.com/protractor/highlight-elements-during-your-protractor-test-run/
    highlightElement(byObject) {
        function setStyle(element, style) {
            const previous = element.getAttribute('style');
            element.setAttribute('style', style);
            setTimeout(() => {
                element.setAttribute('style', previous);
            }, 200);
            return "highlighted";
        }

        return browser.executeScript(setStyle, element(byObject).getWebElement(), 'color: red; background-color: yellow;');
    }

    getTodoTitle() {
        let title = element(by.id('todo-list-title')).getText();
        this.highlightElement(by.id('todo-list-title'));

        return title;
    }

    typeAnOwner(owner: string) {
        let input = element(by.id('todoOwner'));
        input.click();
        input.sendKeys(owner);
    }

    backspace(){
        browser.actions().sendKeys(Key.BACK_SPACE).perform();
    }

    getStatus(status:string){
        let input = element(by.id('todoStatus'));
        input.click();
        input.sendKeys(status);
        let selectButton = element(by.id('submit'));
        selectButton.click();
    }

    getUserByAge() {
        let input = element(by.id('userName'));
        input.click();
        input.sendKeys(Key.TAB);
    }

    getUniqueUser(email:string) {
        let user = element(by.id(email)).getText();
        this.highlightElement(by.id(email));

        return user;
    }

    getUsers() {
        return element.all(by.className('users'));
    }

    clickClearCompanySearch() {
        let input = element(by.id('companyClearSearch'));
        input.click();
    }
}
