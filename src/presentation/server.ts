import express, { Router } from 'express';
import path from 'path';

interface Options {
  routes: Router;
  port: number;
  public_path?: string;
}

export class Server {
  private app = express();

  private readonly port: number;
  private readonly publicPath: string;
  private readonly routes: Router;

  constructor(options: Options) {
    const { port, routes, public_path = 'public' } = options;
    this.port = port;
    this.publicPath = public_path;
    this.routes = routes;
  }
  async start() {
    // middleware
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // public
    this.app.use(express.static(this.publicPath));

    // * Routes

    this.app.use(this.routes);

    // * SPA
    this.app.get('/*', (req, res) => {
      console.log(req.url);

      const indexPath = path.join(
        __dirname,
        `../../${this.publicPath}/index.html`
      );
      res.sendFile(indexPath);

      // otra manera de hacerlo mas simplificado
      // res.sendFile('index.html', { root: `${this.publicPath}` });
      // return;
    });

    this.app.listen(this.port, () => {
      console.log(`Server running on port ${this.port}`);
    });
  }
}
