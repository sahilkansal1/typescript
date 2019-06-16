/**
 * Creates an instance of User.
 *id: string;
 *first_name: string;
 *middle_name: string;
 *last_name: string;
 *address: string;
 *email: string;
 *phone_no: number;
 *role: any;
 @exports User class 
 */
export class User {
  id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  address: string;
  email: string;
  phone_no: number;
  role: string;
  constructor(userInfo) {
    this.id = userInfo.id;
    this.first_name = userInfo.firstName;
    this.middle_name = userInfo.middleName;
    this.last_name = userInfo.lastName;
    this.address = userInfo.address;
    this.email = userInfo.email;
    this.phone_no = userInfo.phoneNo;
    this.role = userInfo.role;
  }
  /**
   * @description check validates email , phone_no and check if a paticular field id empty or not
   * @param {userDetails} userinfo takes user details of a paticular person
   */
  check(): void {
    for (let key in this) {
      if (key !== "middle_name") {
        if (this[key as string] === "") {
          throw "all fields are needed";
        }
      }
    }

    if (
      !/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]{2,5})\.([a-zA-Z]{2,5})$/.test(
        //checking email
        this.email
      )
    ) {
      throw "invalid email";
    }
    if (!/^\d{10}$/.test(String(this.phone_no))) {
      throw "phone no. invalid"; //checking phone_no
    }
  }
}
