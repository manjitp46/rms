import * as mongodb from "mongodb";
import { Database } from "./Mongodb";

export class DatabaseHandler implements Database {
  hostName: string;
  port: number;
  private protocol: string;
  private db: any;
  private static dbConnection: any;
  private _MongoClient: any;
  constructor(protocol: string, hostName: string, port: number) {
    this.protocol = protocol;
    this.hostName = hostName;
    this.port = port;
    this._MongoClient = mongodb.MongoClient;
  }
  private createDBUrl(): string {
    return `${this.protocol}${this.hostName}:${this.port}`;
  }

  private async createDBConnection() {
    return new Promise((resolve, reject) => {
      this._MongoClient.connect(this.createDBUrl(), (err, client) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          console.log(
            "Successfully connected to database @",
            this.createDBUrl()
          );
          const db = client.db("roomDB");
          resolve(db);
        }
      });
    });
  }
  public async startDBConnection() {
    try {
      DatabaseHandler.dbConnection = await this.createDBConnection();
    } catch (err) {
      console.log(err);
    }
  }
  public static getDBInstance() {
    if (DatabaseHandler.dbConnection) {
      return DatabaseHandler.dbConnection;
    }
  }
}
