import {browser, element, by, promise, ElementFinder} from 'protractor';
import {Key} from 'selenium-webdriver';

export class TodoPage {
    navigateTo(): promise.Promise<any> {
        return browser.get('/todos');
    }

    getTodoTitle() {
        const title = element(by.id('todo-list-title')).getText();
        this.highlightElement(by.id('todo-list-title'));

        return title;
    }

    typeACategory(category: string) {
        const input = element(by.id('todoCategory'));
        input.click();
        input.sendKeys(category);
    }

    typeAStatus(status: string) {
        const input = element(by.id('todoStatus'));
        input.click();
        input.sendKeys(status);
    }

    typeABody(body: string) {
        const input = element(by.id('todoBody'));
        input.click();
        input.sendKeys(body);
    }

    backspace() {
        browser.actions().sendKeys(Key.BACK_SPACE).perform();
    }

    getOwner(owner: string) {
        const input = element(by.id('todoOwner'));
        input.click();
        input.sendKeys(owner);
        const selectButton = element(by.id('submit'));
        selectButton.click();
    }


    getUniqueTodo(todo_id: string) {
        const todo = element(by.id(todo_id)).getText();
        this.highlightElement(by.id(todo_id));

        return todo;
    }

/**
    getUniqueTodo(todo_id:string) {
    let todo = null;
    try {
            todo = element(by.id(todo_id['$oid'])).getText();
            this.highlightElement(by.id(todo_id));
        } catch (e) {
            console.log(e);
            todo = null;
        }
    }
**/

    // http://www.assertselenium.com/protractor/highlight-elements-during-your-protractor-test-run/
    highlightElement(byObject) {
        function setStyle(element, style) {
            const previous = element.getAttribute('style');
            element.setAttribute('style', style);
            setTimeout(() => {
                element.setAttribute('style', previous);
            }, 200);
            return 'highlighted';
        }

        return browser.executeScript(setStyle, element(byObject).getWebElement(), 'color: red; background-color: yellow;');
    }

    getTodos() {
        return element.all(by.className('todos'));
    }

    clickClearOwnerSearch() {
        const input = element(by.id('ownerClearSearch'));
        input.click();
    }

    buttonExists(): promise.Promise<boolean> {
        this.highlightElement(by.id('addNewTodo'));
        return element(by.id('addNewTodo')).isPresent();
    }

    clickAddTodoButton(): promise.Promise<void> {
        this.highlightElement(by.id('addNewTodo'));
        return element(by.id('addNewTodo')).click();
    }

}
