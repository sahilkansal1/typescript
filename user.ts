import { userDetails } from "./types";
/**
 * Creates an instance of User.
 * @constructor
 * @this {User}
 * @exports User
 */
export class User {
  userInfo: userDetails;
  constructor(userInfo: userDetails) {
    this.userInfo = userInfo;
  }
  /**
   * Creates an instance of edit.
   * @param {userDetails} userinfo takes user details of a paticular person
   */
  check(userInfo: userDetails): void {
    for (let key in userInfo) {
      if (key !== "middle_name") {
        if (userInfo[key] === "") {
          throw "all fields are needed";
        }
      }
    }

    if (
      !/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]{2,5})\.([a-zA-Z]{2,5})$/.test(
        //checking email
        this.userInfo.email
      )
    ) {
      throw "invalid email";
    }
    if (!/^\d{10}$/.test(String(this.userInfo.phone_no))) {
      throw "phone no. invalid"; //checking phone_no
    }
  }
}
