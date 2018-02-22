import {ComponentFixture, TestBed, async} from "@angular/core/testing";
import {Todo} from "./todo";
import {TodoListComponent} from "./todo-list.component";
import {TodoListService} from "./todo-list.service";
import {Observable} from "rxjs";
import {FormsModule} from "@angular/forms";
import {CustomModule} from "../custom.module";
import {MATERIAL_COMPATIBILITY_MODE} from "@angular/material";


describe("Todo list", () => {

    let todoList: TodoListComponent;
    let fixture: ComponentFixture<TodoListComponent>;

    let todoListServiceStub: {
        getTodos: () => Observable<Todo[]>
    };

    beforeEach(() => {
        // stub TodoService for test purposes
        todoListServiceStub = {
            getTodos: () => Observable.of([
                {
                    _id : "blanch_id1",
                    owner : "Blanche",
                    status : false,
                    body : "In sunt ex non tempor cillum commodo amet incididunt anim qui commodo quis. Cillum non labore ex sint esse.",
                    category : "software design"

                },

                {   _id : "fry_id",
                    owner : "Fry",
                    status : false,
                    body : "Ipsum esse est ullamco magna tempor anim laborum non officia deserunt veniam commodo. Aute minim incididunt ex commodo.",
                    category : "homework"
                },
                {
                    _id : "blanche_id2",
                    owner : "Blanche",
                    status : true,
                    body : "Incididunt enim ea sit qui esse magna eu. Nisi sunt exercitation est Lorem consectetur incididunt cupidatat laboris commodo veniam do ut sint.",
                    category : "software design"
                }
            ])
        };

        TestBed.configureTestingModule({
            imports: [CustomModule],
            declarations: [TodoListComponent],
            // providers:    [ TodoListService ]  // NO! Don't provide the real service!
            // Provide a test-double instead
            providers: [{provide: TodoListService, useValue: todoListServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        })
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(TodoListComponent);
            todoList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it("contains all the todos", () => {
        expect(todoList.todos.length).toBe(3);
    });

    it("contains a todo named 'Blanche'", () => {
        expect(todoList.todos.some((todo: Todo) => todo.owner === "Blanche")).toBe(true);
    });

    it("contain a todo named 'Fry'", () => {
        expect(todoList.todos.some((todo: Todo) => todo.owner === "Fry")).toBe(true);
    });

    it("doesn't contain a todo named 'Santa'", () => {
        expect(todoList.todos.some((todo: Todo) => todo.owner === "Santa")).toBe(false);
    });

    it("has two todos that have a false status", () => {
        expect(todoList.todos.filter((todo: Todo) => todo.status === false).length).toBe(2);
    });


    it("todo list filters by owner", () => {
        expect(todoList.filteredTodos.length).toBe(3);
        todoList.todoOwner = "Blanche";
        let a : Observable<Todo[]> = todoList.refreshTodos();
        a.do(x => Observable.of(x))
            .subscribe(x =>
            {
                expect(todoList.filteredTodos.length).toBe(2);
            });
    });


    it("todo list filters by owner and status", () => {
        expect(todoList.filteredTodos.length).toBe(3);
        todoList.todoStatus = "incomplete" ;
        todoList.todoOwner = "Fry";
        let a : Observable<Todo[]> = todoList.refreshTodos();
        a.do(x => Observable.of(x))
            .subscribe(x =>
            {
                expect(todoList.filteredTodos.length).toBe(1);
            });
    });


});

describe("Misbehaving Todo List", () => {
    let todoList: TodoListComponent;
    let fixture: ComponentFixture<TodoListComponent>;

    let todoListServiceStub: {
        getTodos: () => Observable<Todo[]>
    };

    beforeEach(() => {
        // stub TodoService for test purposes
        todoListServiceStub = {
            getTodos: () => Observable.create(observer => {
                observer.error("Error-prone observable");
            })
        };

        TestBed.configureTestingModule({
            imports: [FormsModule, CustomModule],
            declarations: [TodoListComponent],
            providers: [{provide: TodoListService, useValue: todoListServiceStub},
                {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
        })
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(TodoListComponent);
            todoList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it("generates an error if we don't set up a TodoListService", () => {
        // Since the observer throws an error, we don't expect todos to be defined.
        expect(todoList.todos).toBeUndefined();
    });
});


