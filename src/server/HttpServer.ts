import {RequsetHandler} from 'restify';

export interface HttpServer {
    get(url: string, requestHandler: RequsetHandler): void

    post(url: string, requestHandler: RequsetHandler): void

    put(url: string, requestHandler: RequsetHandler): void

    delete(url: string, requestHandler: RequsetHandler): void
}