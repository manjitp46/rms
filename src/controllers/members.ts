import { Controller } from "./controller";
import { Request, Response } from "restify";
import { HttpServer } from "../server/HttpServer";
import { DatabaseHandler } from "../databases";
import { MemberService } from "../services/memberService";
import { HTTP_STATUS_CODES } from "../http-codes/HttpCodes";
const urlPrefix = "/members";
export class MembersController implements Controller {
  initialize(httpServer: HttpServer): void {
    httpServer.get(`${urlPrefix}/list`, this.list.bind(this));
    httpServer.post(`${urlPrefix}/add`, this.addMember.bind(this));
    httpServer.delete(`${urlPrefix}/delete`, this.deleteMember.bind(this));
  }
  /**
   * @swagger
   *
   * /members/list:
   *   tags:
   *     - name: Login
   *       description: Login
   *   get:
   *     description: Get list of availabe room members
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: list of availabe room members
   *       500:
   *         description: Internal server error
   */
  private async list(req: Request, res: Response) {
    const mm = new MemberService();
    var dataToReturn = {};
    try {
      dataToReturn["Data"] = await mm.list({});
      dataToReturn["Message"] = "List of members";
      dataToReturn["ErrorCode"] = 0;
    } catch (err) {
      throw err;
    }
    res.send(dataToReturn);
  }

  private async addMember(req: Request, res: Response) {
    const inputData = req.body && req.body.data;
    var result = null;
    var dataToReturn = {};
    dataToReturn["ErrorCode"] = 0;
    if (!inputData) {
      dataToReturn["ErrorCode"] = -1;
      dataToReturn["Message"] = "Please pass data in request body!";
      dataToReturn["Data"] = null;
      res.send(HTTP_STATUS_CODES.BAD_REQUEST, dataToReturn);
    } else if (inputData.name && inputData.age && inputData.sex) {
      const memberService = new MemberService();
      dataToReturn["ErrorCode"] = 0;
      dataToReturn["Message"] = "Member successfully added";
      try {
        result = await memberService.addMember(inputData);
        dataToReturn["Data"] = result;
        res.send(HTTP_STATUS_CODES.HTTP_RESOURCE_CREATED, dataToReturn);
      } catch (e) {
        dataToReturn["Data"] = null;
        dataToReturn["Message"] = e.message;
        res.send(HTTP_STATUS_CODES.DUPLICATE_RESOURCE, dataToReturn);
      }
    } else {
      dataToReturn["ErrorCode"] = -1;
      dataToReturn["Message"] = "Mandatoy params are name|age|sex";
      dataToReturn["Data"] = null;
      res.send(HTTP_STATUS_CODES.BAD_REQUEST, dataToReturn);
    }
  }
  private async deleteMember(req: Request, res: Response) {
    var dataToReturn = {};
    dataToReturn["ErrorCode"] = 0;
    var inputData = req.query && req.query.user_id;
    if (!inputData) {
      dataToReturn["ErrorCode"] = -1;
      dataToReturn["Message"] = "Please pass user_id in query string!";
      dataToReturn["Data"] = null;
      res.send(HTTP_STATUS_CODES.BAD_REQUEST, dataToReturn);
    }else {
      const memberService = new MemberService();
      dataToReturn["ErrorCode"] = 0;
      dataToReturn["Message"] = "Resource deleted successfully!";
      dataToReturn["Data"] = await memberService.deleteMember(inputData);
      res.send(HTTP_STATUS_CODES.HTTP_OK, dataToReturn);
    }
  }
}
