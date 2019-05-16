import { UserDetails } from "./types";
export class User {
  userInfo: UserDetails;
  constructor(userInfo: UserDetails) {
  
      this.userInfo = userInfo;
    
  }
  check(userInfo) {
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
