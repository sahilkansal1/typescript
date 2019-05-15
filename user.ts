import { data } from "./data";
import { DataType } from "./types";
enum role {
  manager,
  admin
}
export class User {
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  id: string;
  phone_no: number;
  address: string;
  role: role = role.manager;
  constructor(userInfo?: DataType) {
    if (userInfo) {
      this.first_name = userInfo.first_name;
      this.middle_name = userInfo.middle_name;
      this.last_name = userInfo.last_name;
      this.email = userInfo.email;
      this.id = userInfo.id;
      this.address = userInfo.address;
      this.role = userInfo.role;
      this.phone_no = userInfo.phone_no;
    }
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
        this.email
      )
    ) {
      throw "invalid email";
    }
    if (!/^\d{10}$/.test(String(this.phone_no))) {
      throw "phone no. invalid";
    }
  }
  deleteUser(id) {
    for (let i = 0; i < data.length; i++) {
      if (id === data[i].id) {
        let place = i;
        data.splice(place, 1);
      }
    }
  }
  save(userInfo) {
    const id: string = userInfo.id;
    let flag: number = 0; //flag to check if id exist or not

    for (let i = 0; i < data.length; i++) {
      if (id === data[i].id) {
        flag = 1;
        data[i] = userInfo;
      }
    }
    if (flag !== 1) {
      data.push(userInfo);
    }
  }
}
