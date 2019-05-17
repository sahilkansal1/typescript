import { usersData } from "./data";
import { userDetails } from "./types";
/**
 * Creates an instance of Users.
 * @constructor
 * @this {Users}
 * @exports Users
 */
export class Users {
  data: userDetails[];
  constructor() {
    this.data = usersData;
  }
  /**
   * Creates an instance of DeleteUser
   * @param {string} userid gives id of that user which needs to deleted
   */
  DeleteUser(Userid: string): void {
    for (let i = 0; i < this.data.length; i++) {
      if (Userid === this.data[i].id) {
        let place = i;
        this.data.splice(place, 1); //removing user from array
      }
    }
  }
  /**
   * Creates an instance of UserSave.
   * @constructor
   * @param {userDetails} userDetails is given full info of user which is needed to added in array
   
   */
  UserSave(userInfo: userDetails): void {
    const id: string = userInfo.id;
    let flag: number = 0; //flag to check if id exist or not

    for (let i = 0; i < this.data.length; i++) {
      if (id === this.data[i].id) {
        flag = 1; //for existing user
        this.data[i] = userInfo;
      }
    }
    if (flag !== 1) {
      this.data.push(userInfo); //for new user
    }
  }
  /**
   * Creates an instance of getData.
   *@returns {[Array<userDetails>]} return array of all the users data
   */
  getData(): Array<userDetails> {
    return this.data;
  }
}
