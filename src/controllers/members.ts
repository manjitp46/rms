import { Controller } from "./controller";
import { Request, Response } from "restify";
import { HttpServer } from "../server/HttpServer";
import { DatabaseHandler } from "../databases";
import { MemberService } from "../services/memberService";
const urlPrefix = "/members";
export class MembersController implements Controller {
  initialize(httpServer: HttpServer): void {
    httpServer.get(`${urlPrefix}/list`, this.list.bind(this));
  }
/**
 * @swagger
 *
 * /members/list:
 *   tags: ["Members"]
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
      dataToReturn['Data'] = await mm.list({});
      dataToReturn['Message'] = "List of members";
      dataToReturn['ErrorCode'] = 0;
    }catch(err) {
      throw err;
    }
    res.send(dataToReturn);
  }
}
