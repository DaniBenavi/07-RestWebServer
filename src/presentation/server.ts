import express from 'express';
import path from 'path';

interface Options {
  port: number;
  public_path?: string;
}

export class Server {
  private app = express();

  private readonly port: number;
  private readonly publicPath: string;

  constructor(options: Options) {
    const { port, public_path = 'public' } = options;
    this.port = port;
    this.publicPath = public_path;
  }
  async start() {
    // middleware

    // public

    this.app.use(express.static(this.publicPath));

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
