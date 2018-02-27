import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';

import {Todo} from './todo';
import {TodoListService} from './todo-list.service';

describe('Todo list service: ', () => {
    // A small collection of test todos
    const testTodos: Todo[] = [
        {
            _id : 'blanch_id1',
            owner : 'Blanche',
            status : false,
            body : 'In sunt ex non tempor cillum commodo amet ' +
            'incididunt anim qui commodo quis. Cillum non labore ex sint esse.',
            category : 'software design'

        },

        {   _id : 'fry_id',
            owner : 'Fry',
            status : false,
            body : 'Ipsum esse est ullamco magna tempor anim laborum non' +
            ' officia deserunt veniam commodo. Aute minim incididunt ex commodo.',
            category : 'homework'
        },
        {
            _id : 'blanche_id2',
            owner : 'Blanche',
            status : true,
            body : 'Incididunt enim ea sit qui esse magna eu. Nisi sunt exercitation ' +
            'est Lorem consectetur incididunt cupidatat laboris commodo veniam do ut sint.',
            category : 'software design'
        }
];
    const mTodos: Todo[] = testTodos.filter(todo =>
        todo.owner.toLowerCase().indexOf('Blanche') !== -1
    );
    let todoListService: TodoListService;
    // These are used to mock the HTTP requests so that we (a) don't have to
    // have the server running and (b) we can check exactly which HTTP
    // requests were made to ensure that we're making the correct requests.
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        // Set up the mock handling of the HTTP requests
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        });
        httpClient = TestBed.get(HttpClient);
        httpTestingController = TestBed.get(HttpTestingController);
        // Construct an instance of the service with the mock
        // HTTP client.
        todoListService = new TodoListService(httpClient);
    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });

    it('getTodos() calls api/todos', () => {
        // Assert that the todos we get from this call to getToods()
        // should be our set of test todos. Because we're subscribing
        // to the result of getTodos(), this won't actually get
        // checked until the mocked HTTP request 'returns' a response.
        // This happens when we call req.flush(testTodos) a few lines
        // down.
        todoListService.getTodos().subscribe(
            todos => expect(todos).toBe(testTodos)
        );

        // Specify that (exactly) one request will be made to the specified URL.
        const req = httpTestingController.expectOne(todoListService.baseUrl);
        // Check that the request made to that URL was a GET request.
        expect(req.request.method).toEqual('GET');
        // Specify the content of the response to that request. This
        // triggers the subscribe above, which leads to that check
        // actually being performed.
        req.flush(testTodos);
    });

    it('getTodos(todoOwner) adds appropriate param string to called URL', () => {
        todoListService.getTodos('Blanche').subscribe(
            todos => expect(todos).toEqual(mTodos)

        );

        const req = httpTestingController.expectOne(todoListService.baseUrl + '?owner=Blanche&');
        expect(req.request.method).toEqual('GET');
        req.flush(mTodos);
    });

    it('getTodoById() calls api/todos/id', () => {
        const targetTodo: Todo = testTodos[1];
        const targetId: string = targetTodo._id;
        todoListService.getTodoById(targetId).subscribe(
            todo => expect(todo).toBe(targetTodo)
        );

        const expectedUrl: string = todoListService.baseUrl + '/' + targetId;
        const req = httpTestingController.expectOne(expectedUrl);
        expect(req.request.method).toEqual('GET');
        req.flush(targetTodo);
    });
});


