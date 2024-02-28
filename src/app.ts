import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import { StatusCodes } from 'http-status-codes';
import ErrorHandler from './configs/ErrorHandler.config';
import { errorResponse } from './helpers/response.helper';
import routes from './routes';

class App {
  private app: express.Application;
  readonly port: number | string;

  constructor(port: number | string) {
    this.app = express();
    this.port = port;

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares() {
    // set security HTTP headers
    this.app.use(helmet());

    // parse json request body
    this.app.use(express.json());

    // parser cookies
    this.app.use(cookieParser());

    // parse urlencoded request body
    this.app.use(express.urlencoded({ extended: true }));

    // gzip compression
    this.app.use(compression());

    // enable cors
    this.app.use(cors({ credentials: true, origin: 'http://localhost:5173' }));
    this.app.options('*', cors());

    // jwt authentication

    // Attach the second Error handling Middleware
    this.app.use(ErrorHandler);
  }

  private initializeRoutes() {
    // v1 api routes
    this.app.use('/v1', routes);
  }

  private initializeErrorHandling() {
    // send back a 404 error for any unknown api request
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      res
        .status(StatusCodes.NOT_FOUND)
        .send(errorResponse(StatusCodes.NOT_FOUND, 'Not Found'));
    });
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on port ${this.port}`);
    });
  }
}

export default App;
