import { Request, Response } from 'express';
import { prisma } from '../../data/postgres';
import { CreateTodoDto } from '../../domain/dtos/todos/create-todo-dto';
import { UpdateTodoDto } from '../../domain/dtos/todos/update-todo-dto';
import { TodoRepository } from '../../domain/repositories/todo.repository';

export class TodosController {
  constructor(private readonly todoRepository: TodoRepository) {}

  // obtener todos
  public getTodos = async (req: Request, res: Response) => {
    const todos = await this.todoRepository.getAll();

    res.json(todos);
  };

  // obtener por id
  public getById = async (req: Request, res: Response) => {
    const id = +req.params.id;

    try {
      const todo = await this.todoRepository.findById(id);
      res.json(todo);
    } catch (error) {
      res.status(404).json({ error: error });
    }
  };

  // crear datos
  public createTodo = async (req: Request, res: Response) => {
    const [error, createTodoDto] = CreateTodoDto.create(req.body);
    if (error) res.status(400).json({ error });

    const todo = await this.todoRepository.create(createTodoDto!);
    console.log(todo);
    res.json(todo);
  };

  // actualizar datos por id
  public updateTodo = async (req: Request, res: Response) => {
    const id = +req.params.id;
    const [error, updateTodoDto] = UpdateTodoDto.create({ ...req.body, id });
    if (error) res.status(400).json({ error });

    const todo = await this.todoRepository.updateById(updateTodoDto!);
    res.json(todo);
  };
  // eliminar datos por id
  public deleteTodo = async (req: Request, res: Response) => {
    const id = +req.params.id;
    const todoDeleted = await this.todoRepository.deleteById(id);
    res.json(todoDeleted);
  };
}
