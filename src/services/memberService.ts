import { DatabaseHandler } from "../databases";
import * as uuid from "uuid";

export class MemberService {
  private addMandatoryProperty(inputData) {
    inputData["created_at"] = new Date().toISOString();
    inputData["modified_at"] = null;
    inputData["userId"] = uuid.v4();
    inputData["modified_by"] = null;
    inputData["is_deleted"] = false;
    return inputData;
  }
  readonly COLLECTION_NAME: string = "room_members";
  public async list(query: object): Promise<any> {
    const dbInstance = DatabaseHandler.getDBInstance();
    try {
      var data = await dbInstance
        .collection(this.COLLECTION_NAME)
        .find(query || {})
        .toArray();
      console.log("return data is", data);
      return data;
    } catch (err) {
      throw err;
    }
  }
  public async addMember(inputData: object): Promise<any> {
    try {
      const dbInstance = DatabaseHandler.getDBInstance();
      var data = await dbInstance
        .collection(this.COLLECTION_NAME)
        .find(inputData)
        .toArray();
      if (data.length > 0) {
        throw new Error("Member already exists!");
      } else {
        inputData = this.addMandatoryProperty(inputData);
        data = await dbInstance
          .collection(this.COLLECTION_NAME)
          .insertOne(inputData);
        return data.ops;
      }
    } catch (e) {
      throw e;
    }
  }
  public async deleteMember(inputData: string): Promise<any> {
    try {
      const dbInstance = DatabaseHandler.getDBInstance();
      var data = await dbInstance
        .collection(this.COLLECTION_NAME)
        .find({ userId: inputData })
        .toArray();
      console.log(data);
      if (data.length) {
        await dbInstance
          .collection(this.COLLECTION_NAME)
          .deleteOne({ userId: inputData });
      }
      return data;
    } catch (e) {
      throw e;
    }
  }
  public async updateMember(inputData: object): Promise<any> {
    try {
      inputData["modified_at"] = new Date().toISOString();
      const dbInstance = DatabaseHandler.getDBInstance();
      var data = await dbInstance
        .collection(this.COLLECTION_NAME)
        .find({ userId: inputData["userId"] })
        .toArray();
      if (data.length === 0) {
        throw new Error("Invalid userId");
      }
      data = await dbInstance
        .collection(this.COLLECTION_NAME)
        .updateOne({ userId: inputData["userId"] }, { $set: inputData });
      return data;
    } catch (e) {
      throw e;
    }
  }
}
