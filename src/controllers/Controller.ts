import {HttpServer} from '../server/HttpServer';

export interface Controller {
    initialize(httpServer: HttpServer): void
}