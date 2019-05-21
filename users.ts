import { usersData } from "./data";
import { User } from "./user";

/**
 * Creates an instance of Users.
 * @constructor
 * @this {Users}
 * @exports Users class 
 */
export class Users {
  data: User[] = usersData as User[];

  /**
   * Creates an instance of DeleteUser
   * @description deletes the the user from array
   * @param {string} userid gives id of that user which needs to deleted
   */
  deleteUser(Userid: string): void {
    for (let i = 0; i < this.data.length; i++) {
      if (Userid === this.data[i].id) {
        let place = i;
        this.data.splice(place, 1); //removing user from array
      }
    }
  }
  /**
   * Creates an instance of UserSave.
   * @description add users in array
   * @param {userDetails} userDetails is given full info of user which is needed to added in array
   */
  userSave(userInfo: User): void {
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
   * @description give all user's data 
   *@returns {[Array<User>]} return array of all the users data
   */
  getData(): Array<User> {
    return this.data;
  }
}
