import {ComponentFixture, TestBed, async} from "@angular/core/testing";
import {Todo} from "./todo";
import {TodoComponent} from "./todo.component";
import {TodoListService} from "./todo-list.service";
import {Observable} from "rxjs";
//import { PipeModule } from "../../pipe.module";

describe("Todo component", () => {

    let todoComponent: TodoComponent;
    let fixture: ComponentFixture<TodoComponent>;

    let todoListServiceStub: {
        getTodoById: (todoId: string) => Observable<Todo>
    };

    beforeEach(() => {
        // stub TodoService for test purposes
        todoListServiceStub = {
            getTodoById: (todoId: string) => Observable.of([
                {
                    _id: "chris_id",
                    name: "Chris",
                    age: 25,
                    company: "UMM",
                    email: "chris@this.that"
                },
                {
                    _id: "pat_id",
                    name: "Pat",
                    age: 37,
                    company: "IBM",
                    email: "pat@something.com"
                },
                {
                    _id: "jamie_id",
                    name: "Jamie",
                    age: 37,
                    company: "Frogs, Inc.",
                    email: "jamie@frogs.com"
                }
            ].find(user => user._id === userId))
        };

        TestBed.configureTestingModule({
            //imports: [PipeModule],
            declarations: [UserComponent],
            providers: [{provide: UserListService, useValue: userListServiceStub}]
        })
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(UserComponent);
            userComponent = fixture.componentInstance;
        });
    }));

    it("can retrieve Pat by ID", () => {
        userComponent.setId("pat_id");
        expect(userComponent.user).toBeDefined();
        expect(userComponent.user.name).toBe("Pat");
        expect(userComponent.user.email).toBe("pat@something.com");
    });

    it("returns undefined for Santa", () => {
        userComponent.setId("Santa");
        expect(userComponent.user).not.toBeDefined();
    });

});
