import {TodoPage} from './todo-list.po';
import {browser, protractor, element, by} from 'protractor';
import {Key} from 'selenium-webdriver';

const origFn = browser.driver.controlFlow().execute;

// https://hassantariqblog.wordpress.com/2015/11/09/reduce-speed-of-angular-e2e-protractor-tests/
// browser.driver.controlFlow().execute = function () {
//     let args = arguments;
//
//     // queue 100ms wait between test
//     // This delay is only put here so that you can watch the browser do its thing.
//     // If you're tired of it taking long you can remove this call
//     origFn.call(browser.driver.controlFlow(), function () {
//         return protractor.promise.delayed(100);
//     });
//
//     return origFn.apply(browser.driver.controlFlow(), args);
// };

describe('Todo list', () => {
    let page: TodoPage;

    beforeEach(() => {
        page = new TodoPage();
    });

    it('should get and highlight Todos title attribute ', () => {
        page.navigateTo();
        expect(page.getTodoTitle()).toEqual('Todos');
    });

    it('should type something in filter category box and check that it returned correct element', () => {
        page.navigateTo();
        page.typeACategory('homework');
        expect(page.getUniqueTodo('58af3a600343927e48e87211')).toEqual('Fry');
        page.backspace();
        page.typeACategory('software');
        expect(page.getUniqueTodo('58af3a600343927e48e87212')).toEqual('Blanche');
    });

   /*

    it('should click on the age 27 times and return 3 elements then ', () => {
        page.navigateTo();
        page.getTodoByAge();
        for (let i = 0; i < 27; i++) {
            page.selectUpKey();
        }

        expect(page.getUniqueTodo('stokesclayton@momentia.com')).toEqual('Stokes Clayton');

        expect(page.getUniqueTodo('merrillparker@escenta.com')).toEqual('Merrill Parker');
    });

    */


   /**
    it('Should open the expansion panel and get the category', () => {
        page.navigateTo();
        page.typeACategory('homewo');
        browser.actions().sendKeys(Key.ENTER).perform();

        expect(page.getUniqueTodo('58af3a600343927e48e87211' +
            '')).toEqual('Homework');

        // This is just to show that the panels can be opened
        browser.actions().sendKeys(Key.TAB).perform();
        browser.actions().sendKeys(Key.ENTER).perform();
    });

    it('Should allow us to filter todos based on category', () => {
        page.navigateTo();
        page.getCategory('homework');
        page.getTodos().then(function(todos) {
            expect(todos.length).toBe(4);
        });
        expect(page.getUniqueTodo('58af3a600343927e48e87212')).toEqual('Blanche');
        expect(page.getUniqueTodo('58af3a600343927e48e87217')).toEqual('Fry');
        expect(page.getUniqueTodo('58af3a600343927e48e87216')).toEqual('Blanche');
        expect(page.getUniqueTodo('58af3a600343927e48e87218')).toEqual('Workman');
    });

    it('Should allow us to clear a search for category and then still successfully search again', () => {
        page.navigateTo();
        page.getCategory('homework');
        page.getTodos().then(function(todos) {
            expect(todos.length).toBe(2);
        });
        page.clickClearCompanySearch();
        page.getTodos().then(function(todos) {
            expect(todos.length).toBe(301);
        });
        page.getCategory('soft');
        page.getTodos().then(function(todos) {
            expect(todos.length).toBe(74);
        });
    });

    it('Should allow us to search for category, update that search string, and then still successfully search', () => {
        page.navigateTo();
        page.getCategory('video');
        page.getTodos().then(function(todos) {
            expect(todos.length).toBe(71);
        });
        element(by.id('todoCategory')).sendKeys('groceries');
        element(by.id('submit')).click();
        page.getTodos().then(function(todos) {
            expect(todos.length).toBe(76);
        });
    });

// For examples testing modal dialog related things, see:
// https://code.tutsplus.com/tutorials/getting-started-with-end-to-end-testing-in-angular-using-protractor--cms-29318
// https://github.com/blizzerand/angular-protractor-demo/tree/final

    it('Should have an add todo button', () => {
        page.navigateTo();
        expect(page.buttonExists()).toBeTruthy();
    });

    it('Should open a dialog box when add todo button is clicked', () => {
        page.navigateTo();
        expect(element(by.css('add-todo')).isPresent()).toBeFalsy('There should not be a modal window yet');
        element(by.id('addNewTodo')).click();
        expect(element(by.css('add-todo')).isPresent()).toBeTruthy('There should be a modal window now');
    });

    it('Should actually add the todo with the information we put in the fields', () => {
        page.navigateTo();
        page.clickAddTodoButton();
        element(by.id('ownerField')).sendKeys('Fry');
        // Need to use backspace because the default value is -1. If that changes, this will change too.
        element(by.id('statusField')).sendKeys(protractor.Key.BACK_SPACE).then(function() {
            element(by.id('statusField')).sendKeys(protractor.Key.BACK_SPACE).then(function() {
                element(by.id('statusField')).sendKeys('false');
            });
        });
        element(by.id('categoryField')).sendKeys('Home work, video game');
        element(by.id('_idField')).sendKeys('58af3a600343927e48e8721bb');
        element(by.id('confirmAddTodoButton')).click();
        // This annoying delay is necessary, otherwise it's possible that we execute the `expect`
        // line before the add todo has been fully processed and the new todo is available
        // in the list.
        setTimeout(() => {
            expect(page.getUniqueTodo('58af3a600343927e48e8721bb')).toMatch('Fry.*'); // toEqual('Tracy Kim');
        }, 10000);
    });

    it('Should allow us to put information into the fields of the add todo dialog', () => {
        page.navigateTo();
        page.clickAddTodoButton();
        expect(element(by.id('ownerField')).isPresent()).toBeTruthy('There should be an owner field');
        element(by.id('ownerField')).sendKeys('Dana Jones');
        expect(element(by.id('statusField')).isPresent()).toBeTruthy('There should be a status field');
        // Need to use backspace because the default value is -1. If that changes, this will change too.
        element(by.id('statusField')).sendKeys(protractor.Key.BACK_SPACE).then(function() {
            element(by.id('statusField')).sendKeys(protractor.Key.BACK_SPACE).then(function() {
                element(by.id('statusField')).sendKeys('true');
            });
        });
        expect(element(by.id('categoryField')).isPresent()).toBeTruthy('There should be a category field');
        element(by.id('categoryField')).sendKeys('Awesome Startup, LLC');
        expect(element(by.id('_idField')).isPresent()).toBeTruthy('There should be an _id field');
        element(by.id('_idField')).sendKeys('58af3a600343927e48e8721bb');
        element(by.id('exitWithoutAddingButton')).click();
    });
    **/
});
