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
            ].find(todo => todo._id === todoId))
        };

        TestBed.configureTestingModule({
            //imports: [PipeModule],
            declarations: [TodoComponent],
            providers: [{provide: TodoListService, useValue: todoListServiceStub}]
        })
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(TodoComponent);
            todoComponent = fixture.componentInstance;
        });
    }));

    it("can retrieve Fry by ID", () => {
        todoComponent.setId("fry_id");
        expect(todoComponent.todo).toBeDefined();
        expect(todoComponent.todo.owner).toBe("Fry");
        expect(todoComponent.todo.category).toBe("homework");
    });

    it("returns undefined for Santa", () => {
        todoComponent.setId("Santa");
        expect(todoComponent.todo).not.toBeDefined();
    });

});


