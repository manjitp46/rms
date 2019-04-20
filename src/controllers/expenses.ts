import { Controller } from "./controller";
import { Request, Response } from "restify";
import { HttpServer } from "../server/HttpServer";
import { HTTP_STATUS_CODES } from "../http-codes/HttpCodes";
import { ExpenseService } from "../services/expenseService";
const urlPrefix = "/expenses";
export class ExpenseController implements Controller {
  initialize(httpServer: HttpServer): void {
    httpServer.post(`${urlPrefix}/add`, this.addExpence.bind(this));
    httpServer.get(`${urlPrefix}/list`, this.listExpense.bind(this));
  }

  /**
   * input data format
   * {
   * category:"",
   * "amount":"",
   * purpose:"",
   * userId:"",
   *
   * }
   *
   */

  private async addExpence(req: Request, res: Response) {
    var dataToReturn = {};
    dataToReturn["ErrorCode"] = 0;
    const inputData = req.body && req.body.data;
    if (!inputData) {
      dataToReturn["ErrorCode"] = -1;
      dataToReturn["Message"] = "Please pass data in request body!";
      dataToReturn["Data"] = null;
      res.send(HTTP_STATUS_CODES.BAD_REQUEST, dataToReturn);
    } else if (
      inputData.category &&
      inputData.amount &&
      inputData.purpose &&
      inputData.userId
    ) {
      var expenseService = new ExpenseService();
      try {
        dataToReturn["Message"] = "Expense success fully added";
        dataToReturn["Data"] = await expenseService.addExpense(inputData);
        res.send(HTTP_STATUS_CODES.HTTP_RESOURCE_CREATED, dataToReturn);
      } catch (e) {
        dataToReturn["ErrorCode"] = -1;
        dataToReturn["Message"] = "Failed to add expense | " + e.message;
        dataToReturn["Data"] = null;
        res.send(HTTP_STATUS_CODES.BAD_REQUEST, dataToReturn);
      }
    } else {
      dataToReturn["ErrorCode"] = -1;
      dataToReturn["Message"] =
        "Please pass data in request body &category |amount| purpose| userId are mandatory params";
      dataToReturn["Data"] = null;
      res.send(HTTP_STATUS_CODES.BAD_REQUEST, dataToReturn);
    }
  }
  private async listExpense(req: Request, res: Response) {
    var dataToReturn = {};
    dataToReturn["ErrorCode"] = 0;
    var inputData = req.query && req.query.user_id;
    if(inputData) {
      inputData = {userId:inputData};
    }else {
      inputData = {}
    }
    try {
      var expenseService = new ExpenseService();
      dataToReturn["Message"] = "List of expenses";
      dataToReturn["Data"] = await expenseService.listExpense(inputData);
      res.send(HTTP_STATUS_CODES.HTTP_OK, dataToReturn);
    }catch(e) {
      dataToReturn["ErrorCode"] = -1;
      dataToReturn["Message"] = "Failed to list expense | Error is " + e.message;
      dataToReturn["Data"] = null;
      res.send(HTTP_STATUS_CODES.HTTP_OK, dataToReturn);
    }
  }
}
