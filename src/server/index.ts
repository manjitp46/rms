import { RequestHandler, Server } from "restify";
import * as restify from "restify";
import * as ConfigParser from "configparser";
import * as path from "path";
import * as restifySwaggerJsdoc from "restify-swagger-jsdoc";
import * as corsMiddleware from "restify-cors-middleware";
import { HttpServer } from "./HttpServer";
import { CONTROLLERS } from "../controllers";
import { DatabaseHandler } from "../databases";
import { ConfigManager } from "../configs/configManager";

export class ApiServer implements HttpServer {
  private restify: Server;
  private config: ConfigParser;
  private serverHost: string;
  private serverPort: number;
  private urlPrefix: string;
  private dbHandler: DatabaseHandler;
  private allowedHosts: Array<String>;
  get(url: string, requestHandler: any): void {
    this.addRoute("get", url, requestHandler);
  }
  post(url: string, requestHandler: any): void {
    this.addRoute("post", url, requestHandler);
  }
  put(url: string, requestHandler: any): void {
    this.addRoute("put", url, requestHandler);
  }
  delete(url: string, requestHandler: any): void {
    this.addRoute("del", url, requestHandler);
  }

  public start(): void {
    this.initializeConfig();
    this.dbHandler = new DatabaseHandler("mongodb://", "localhost", 27017);
    this.dbHandler.startDBConnection();
    const serverOptions = {
      name: "myapi"
    };
    this.restify = restify.createServer(serverOptions);
    // Setting cors here
    this.setupCors(this.restify);
    // Setting cors here ends
    this.restify.use(restify.plugins.queryParser());
    this.restify.use(restify.plugins.bodyParser());
    this.addControllers();
    // setting up swagger docs here
    this.setupSwagger(this.restify);
    // starting restify Server here on port
    this.restify.listen(
      this.serverPort || +process.env.PORT,
      this.serverHost || "localhost",
      () => {
        console.log(`Server is listening on url ${this.restify.url}`);
      }
    );
  }

  private setupCors(server): void {
    const cors = corsMiddleware({
      origins: ["*"],
      allowHeaders: ["Authorization"],
      exposeHeaders: ["Authorization"]
    });
    server.pre(cors.preflight);
    server.use(cors.actual);
  }

  private addRoute(
    method: "get" | "post" | "put" | "del",
    url: string,
    requestHandler: RequestHandler
  ): void {
    //   configuring url prefix
    if (this.urlPrefix) {
      url = this.urlPrefix + url;
    }
    this.restify[method](url, async (req, res, next) => {
      try {
        await requestHandler(req, res, next);
      } catch (e) {
        console.log(e);
        res.send(500, e);
      }
    });
    console.log(`Added route ${method.toUpperCase()} ${url}`);
  }
  private addControllers(): void {
    CONTROLLERS.forEach(controller => controller.initialize(this));
  }

  private initializeConfig(): void {
    const configManager = new ConfigManager();
    this.config = configManager.loadConfig("ServerConfig.conf");
    this.serverHost = this.config.get("RESTServer", "Host");
    this.serverPort = this.config.get("RESTServer", "Port");
    this.urlPrefix = this.config.get("RESTServer", "URLPrefix");
    this.allowedHosts = this.config.get("RestServer", "AllowedHosts")
    console.log(this.allowedHosts)
    console.log("url prfix is ", this.urlPrefix);
  }

  private setupSwagger(server: Server) {
    restifySwaggerJsdoc.createSwaggerPage({
      title: "API for room management", // Page title (required)
      version: "1.0.0", // Server version (required)
      server: server, // Restify server instance created with restify.createServer() (required)
      path: "/docs/swagger", // Public url where the swagger page will be available (required)
      description: "Docs for showing all available api for room management", // A short description of the application. (default: '')
      tags: [
        {
          // A list of tags used by the specification with additional metadata (default: [])
          name: "Members",
          description: "Manages room members"
        }
      ],
      host: `${this.serverHost}:${this.serverPort}`, // The host (name or ip) serving the API. This MUST be the host only and does not include the scheme nor sub-paths.
      schemes: ["http", "https"], // The transfer protocol of the API. Values MUST be from the list: "http", "https", "ws", "wss". (default: [])
      apis: [
        path.join(__dirname, "../controllers/*.ts"),
        path.join(__dirname, "../controllers/*.js")
      ], // Path to the API docs (default: [])
      // definitions: { myObject: require("../docs/swagger-docs.json") }, // External definitions to add to swagger (default: [])
      routePrefix: this.urlPrefix, // prefix to add for all routes (default: '')
      forceSecure: false // force swagger-ui to use https protocol to load JSON file (default: false)
    });
  }
}
