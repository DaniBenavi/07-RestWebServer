import { Request, Response } from 'express';

const todos = [
  { id: 1, text: 'Buy milk', completedAt: new Date() },
  { id: 2, text: 'Buy bread', completedAt: null },
  { id: 3, text: 'Buy butter', completedAt: new Date() },
];

export class TodosController {
  constructor() {}

  // obtener todos
  public getTodos = (req: Request, res: Response): void => {
    res.json(todos);
  };

  // obtener por id
  public getById = (req: Request, res: Response): void => {
    const id = +req.params.id;
    if (isNaN(id))
      res.status(400).json({ error: 'ID argument is not a number' });

    const todo = todos.find((todo) => todo.id === id);

    todo
      ? res.json(todo)
      : res.status(404).json({ error: `TODO with id ${id} not found` });
  };

  // crear datos
  public createTodo = (req: Request, res: Response): void => {
    const { text } = req.body;
    if (!text) res.status(400).json({ error: 'Text property is required' });
    const newTodo = {
      id: todos.length + 1,
      text: text,
      completedAt: null,
    };

    todos.push(newTodo);

    res.json(newTodo);
  };

  // actualizar datos por id
  public updateTodo = (req: Request, res: Response): void => {
    const id = +req.params.id;
    if (isNaN(id))
      res.status(400).json({ error: 'ID argument is not a number' });

    const todo = todos.find((todo) => todo.id === id);
    if (!todo) {
      res.status(404).json({ error: `Todo with id ${id} not found` });
      return;
    }

    const { text, completedAt } = req.body;

    todo.text = text || todo.text;
    completedAt === 'null'
      ? (todo.completedAt = null)
      : (todo.completedAt = new Date(completedAt || todo.completedAt));

    res.json(todo);
  };
  // eliminar datos por id
  public deleteTodo = (req: Request, res: Response): void => {
    const id = +req.params.id;

    const todo = todos.find((todo) => todo.id === id);
    if (!todo) {
      res.status(404).json({ error: `Todo with id ${id} not found` });
      return;
    }

    todos.splice(todos.indexOf(todo), 1);
    res.json(todo);
  };
}
