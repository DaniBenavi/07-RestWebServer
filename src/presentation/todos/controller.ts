import { Request, RequestHandler, Response } from 'express';
import { prisma } from '../../data/postgres';
import { GetAllTodo } from '../../domain/use-cases/todo/getAll-todo';
import { TodoRepository } from '../../domain/repositories/todo.repository';
import { GetByIdTodo } from '../../domain/use-cases/todo/getById-todo';
import { CreateTodoDto } from '../../domain/dtos/todos/create-todo-dto';
import { CreateTodo } from '../../domain/use-cases/todo/create-todo';
import { UpdateTodoDto } from '../../domain/dtos/todos/update-todo-dto';
import { UpdateTodo } from '../../domain/use-cases/todo/update-todo';
import { DeleteTodo } from '../../domain/use-cases/todo/delete-todo';

export class TodosController {
  //* Inyección de dependencias
  constructor(private readonly todoRepository: TodoRepository) {
    this.getTodos = this.getTodos.bind(this);
    this.getById = this.getById.bind(this);
    this.createTodo = this.createTodo.bind(this);
    this.updateTodo = this.updateTodo.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);
  }

  public getTodos(req: Request, res: Response) {
    new GetAllTodo(this.todoRepository)
      .execute()
      .then((todos) => res.json(todos))
      .catch((error) => res.status(400).json({ error }));
  }

  public getById(req: Request, res: Response) {
    const id = +req.params.id;
    new GetByIdTodo(this.todoRepository)
      .execute(id)
      .then((todo) => res.json(todo))
      .catch((error) => res.status(400).json({ error }));
  }

  public createTodo: RequestHandler = async (req, res) => {
    const [error, createTodoDto] = CreateTodoDto.create(req.body);
    if (error) {
      res.status(400).json({ error });
      return;
    }

    try {
      const todo = await new CreateTodo(this.todoRepository).execute(
        createTodoDto!
      );
      res.json(todo);
    } catch (error) {
      res.status(400).json({ error });
    }
  };

  public updateTodo: RequestHandler = async (req, res) => {
    const id = +req.params.id;
    const [error, updateTodoDto] = UpdateTodoDto.create({ ...req.body, id });

    if (error || !updateTodoDto) {
      res.status(400).json({ error: error || 'Invalid data' });
      return;
    }

    try {
      const todo = await new UpdateTodo(this.todoRepository).execute(
        updateTodoDto!
      );
      res.json(todo);
    } catch (error) {
      res.status(400).json({ error });
    }
  };

  public deleteTodo(req: Request, res: Response) {
    const id = +req.params.id;
    new DeleteTodo(this.todoRepository)
      .execute(id)
      .then((todo) => res.json(todo))
      .catch((error) => res.status(400).json({ error }));
  }
}
