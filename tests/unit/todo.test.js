const ToDoController = require('../../controllers/todo')
const ToDoModel = require('../../model/todo')
const httpMocks = require('node-mocks-http')
const createToDoMock = require('../mocks/createToDoMock')
const toDoMock = require('../mocks/toDoMock')

ToDoModel.create = jest.fn()
ToDoModel.find = jest.fn()

let req, res, next;

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
})

describe('ToDoController.getToDo', () => {

  it('should have getToDo function', () => {
    expect(typeof ToDoController.getToDo).toBe('function')
  })

  it('should call the find method on todo Model', async () => {
    await ToDoController.getToDo(req, res, next);
    expect(ToDoModel.find).toHaveBeenCalledWith({})
  })
})

describe('ToDoController.createToDo', () => {

  beforeEach(() => {
    req.body = createToDoMock;
  })

  it('should have a createToDo function', () => {
    expect(typeof ToDoController.createToDo).toBe('function')
  })
  it('should call the create method from todo model', () => {
    ToDoController.createToDo(req, res, next)
    expect(ToDoModel.create).toBeCalledWith(createToDoMock)
  })
  it('should return a status code of 201', async () => {
    await ToDoController.createToDo(req, res, next)
    expect(res.statusCode).toBe(201);
    expect(res._isEndCalled()).toBeTruthy()
  })
  it('should return Json body in response', async () => {
    ToDoModel.create.mockReturnValue(createToDoMock);
    await ToDoController.createToDo(req, res, next);
    expect(res._getJSONData()).toStrictEqual(createToDoMock)
  })
  it('should be able to handle error message', async () => {
    const errorMessage = { message: "Done property missing" };
    const rejectPromise = Promise.reject(errorMessage)
    ToDoModel.create.mockReturnValue(rejectPromise)
    await ToDoController.createToDo(req, res, next);
    expect(next).toBeCalledWith(errorMessage)
  })
} )