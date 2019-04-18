import { DatabaseHandler } from "../databases";

export class MemberService {
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
}
