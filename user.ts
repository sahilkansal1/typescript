enum role {
  manager ,
  admin 
}
export class User {
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  id: string;
  phone_no: string;
  address: string;
  role: role = role.manager;
  constructor(id) {
    this.first_name = id.first_name;
    this.middle_name = id.middle_name;
    this.last_name = id.last_name;
    this.email = id.email;
    this.id = id.id;
    this.address = id.address;
    this.role = id.role;
    this.phone_no = id.phone_no;
    
    this.check(id);
  }
  check(id) {
    for (let key in id) {
        if (key !== "middle_name") {
          if (id[key] === "") {
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
    if (!/^\d{10}$/.test(this.phone_no)) {
      throw "phone no. invalid";
    }   
  }
}
