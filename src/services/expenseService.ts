import { DatabaseHandler } from "../databases";
import * as uuid from "uuid";
export class ExpenseService {
  readonly COLLECTION_NAME: string = "expenses";
  readonly MEMBERS_COLLECTION_NAME: string = "room_members";

  private addMandatoryProperty(inputData) {
    inputData["created_at"] = new Date().toISOString();
    inputData["modified_at"] = null;
    inputData["expenseId"] = uuid.v4();
    inputData["modified_by"] = null;
    return inputData;
  }

  private async isUserIdIsValid(userId): Promise<boolean> {
    const dbInstance = DatabaseHandler.getDBInstance();
    var data = await dbInstance
      .collection(this.MEMBERS_COLLECTION_NAME)
      .find({ userId: userId })
      .toArray();
    console.log(data);
    return data.length > 0 ? true : false;
  }

  public async addExpense(inputData: object): Promise<any> {
    const dbInstance = DatabaseHandler.getDBInstance();
    if (!(await this.isUserIdIsValid(inputData["userId"]))) {
      throw new Error("Please provide valid userId");
    } else {
      inputData = this.addMandatoryProperty(inputData);
      try {
        var data = await dbInstance
          .collection(this.COLLECTION_NAME)
          .insertOne(inputData);
        return data.ops;
      } catch (e) {
        throw e;
      }
    }
  }
  public async listExpense(inputData: object): Promise<any> {
    const dbInstance = DatabaseHandler.getDBInstance();
    try {
      var data = await dbInstance
        .collection(this.COLLECTION_NAME)
        .aggregate([
          { $match: inputData },
          {
            $lookup: {
              from: this.MEMBERS_COLLECTION_NAME,
              localField: "userId",
              foreignField: "userId",
              as: "user"
            }
          },
          {
            $unwind: "$user"
          }
        ])
        .toArray();
      console.log(data);
      return data;
    } catch (e) {
      throw e;
    }
  }
}
