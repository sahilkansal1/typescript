import { User } from "./user";
import { Roles, UserInterface } from "./types";
const axios = require("axios");
/**
 * Creates an instance of Users.
 * @constructor
 * @this {Users}
 * @exports Users class
 */
enum Role {
  manager = 2,
  admin = 1
}
export class Users {
  // data: User[] = usersData as User[];
  col: Array<string>;
  users: Array<UserInterface>;
  roles: Roles[];
  constructor(roles) {
    this.col = [
      "firstName",
      "middleName",
      "lastName",
      "roles",
      "email",
      "address",
      "phoneNo"
    ];
    this.roles = roles;
  }

  async getUsers(userid) {
    const alluser = await axios.get(`http://[::1]:3000/customers/${userid}`);
    console.log(alluser);
    this.users = alluser.data.user;
    this.render();
  }
  render() {
    let role: string;
    if (this.users.length > 0) {
      let content = this.users
        .map(users => {
          for (let i = 0; i < this.roles.length; i++) {
            if (users.roles === this.roles[i].id) {
              role = this.roles[i].role;
            }
          }
          return `<tr id=user${users.id}>
     <td>${users.firstName}</td>
    <td>${users.middleName}</td>
     <td>${users.lastName}</td>
    <td>${role}</td>
    <td>${users.email}</td>
     <td>${users.address}</td>
     <td>${users.phoneNo}</td>
     <td>
     <button value='edit' id=useredit-${
       users.id
     } class='btn btn-info'>edit</button>
     </td>
     <td>
     <button id=userdelete-${users.id} class="btn btn-danger">delete</button>
     </td>
     </tr>
     `;
        })
        .join("");
      let table = `<table><thead><th>first name</th><th>middle name</th><th>last name</th><th>role</th><th>email</th><th>address</th><th>phone no</th></thead><tbody>${content}</tbody></table>`;
      document.getElementById("userdata").innerHTML = table;
      this.eventlistner(this.users);
    } else {
      let content = "no user found";
      document.getElementById("userdata").innerHTML = content;
    }
  }
  eventlistner = users => {
    for (let i = 0; i < users.length; i++) {
      let edit = document.getElementById(
        `useredit-${users[i].id}`
      ) as HTMLButtonElement;
      edit.addEventListener("click", this.edit);
      let deleteUser = document.getElementById(
        `userdelete-${users[i].id}`
      ) as HTMLButtonElement;
      deleteUser.addEventListener("click", this.deleteUser);
    }
  };
  async deleteUser(e: MouseEvent) {
    const event = e.target as HTMLButtonElement;
    const userid: string = event.id.slice(11);
    //remove user from array
    let res = await axios.delete(`http://[::1]:3000/users/${userid}`);
    const element = document.getElementById(`user${userid}`) as HTMLElement;
    try {
      const edit = document.getElementById(`useredit-${userid}`);
      edit.removeEventListener("click", this.deleteUser);
    } catch (e) {
      const save = document.getElementById(`usersave-${userid}`);
      save.removeEventListener("click", this.save);
      const discard = document.getElementById(`discard-${userid}`);
      discard.removeEventListener("click", this.discard);
    }
    const deleteUser = document.getElementById(`userdelete-${userid}`);
    deleteUser.removeEventListener("click", this.deleteUser);
    element.remove();
  }
  /**
   * @description discard changes and move back input field to td
   * @param {MouseEvent} e is event fired from this button from where we extract userid
   */
  discard = (e: MouseEvent): void => {
    const event = e.target as HTMLButtonElement;
    let index: number;
    const userid: string = event.id.slice(12);
    for (let i = 0; i < this.users.length; i++) {
      if (Number(userid) === Number(this.users[i].id)) {
        //index of user details of this user
        index = i;
      }
    }
    let role: string;
    const tab = document.getElementById(`user${userid}`) as HTMLElement;
    for (let i = 0; i < this.col.length; i++) {
      // coverting back input field to td
      const td = tab.getElementsByTagName("td")[i];
      if (this.col[i] === "roles") {
        for (let i = 0; i < this.roles.length; i++) {
          if (this.users[index].roles === this.roles[i].id) {
            role = this.roles[i].role;
          }
        }
        td.innerHTML = role;
      } else {
        td.innerHTML = this.users[index][this.col[i]];
      }
    }
    const save = document.getElementById(`usersave-${userid}`);
    save.removeEventListener("click", this.save);
    const discard = document.getElementById(`userdiscard-${userid}`);
    discard.removeEventListener("click", this.discard);
    const td = tab.getElementsByTagName("td")[this.col.length];
    td.innerHTML = `<button value='edit' id=useredit-${userid} class='btn btn-info'>edit</button>`;
    const edit = document.getElementById(
      `useredit-${userid}`
    ) as HTMLButtonElement;
    edit.addEventListener("click", this.edit);
  };
  edit = (e: MouseEvent): void => {
    const event = e.target as HTMLButtonElement;
    const userid: string = event.id.slice(9);
    const row = document.getElementById(`user${userid}`) as HTMLElement;
    //to make entire row editable
    for (let i = 0; i < this.col.length; i++) {
      let td = row.getElementsByTagName("td")[i];
      const ele = document.createElement("input");
      ele.setAttribute("type", "text");
      ele.setAttribute("value", td.innerText);
      ele.setAttribute("class", "form-control");
      td.innerText = "";
      td.appendChild(ele);
    }
    const edit = document.getElementById(`useredit-${userid}`);
    edit.removeEventListener("click", this.edit);
    row.getElementsByTagName("td")[this.col.length].innerHTML =
      this.button("save", userid, "btn btn-success") +
      this.button("discard", userid, "btn btn-warning"); //creating button from button function
    const save = document.getElementById(
      `usersave-${userid}`
    ) as HTMLButtonElement;
    save.addEventListener("click", this.save);
    const discard = document.getElementById(
      `userdiscard-${userid}`
    ) as HTMLButtonElement;
    discard.addEventListener("click", this.discard);
  };
  button = (type: string, id: string, color: string): string => {
    return `<button id=user${type}-${id} class="${color}">${type}</button>`;
  };
  save = (e: MouseEvent) => {
    const event = e.target as HTMLButtonElement;
    const userid: string = event.id.slice(9);
    const row = document.getElementById(`user${userid}`);
    let userdata = {}; // user data of paticular person
    for (let i = 0; i < this.col.length; i++) {
      const td = row.getElementsByTagName("td")[i];
      const tablerow = td.childNodes[0] as HTMLInputElement;
      let txtVal = tablerow.value; //contains value of td
      if (this.col[i] === "phoneNo") {
        userdata[this.col[i]] = Number(txtVal);
      } else if (this.col[i] === "roles") {
        userdata[this.col[i]] = Role[txtVal];
      } else userdata[this.col[i]] = txtVal;
    }
    const user = new User(userdata);
    try {
      user.check();
      this.patchUser(userdata, userid);
    } catch (err) {
      alert(err);
    }
  };
  async patchUser(userdata, userid) {
    let edituser = await axios({
      method: "patch",
      url: `http://[::1]:3000/users/${userid}`,
      data: userdata,
      config: { headers: { "Content-Type": "application/json" } }
    });

    let role: string;
    const tab = document.getElementById(`user${userid}`) as HTMLElement;
    for (let i = 0; i < this.col.length; i++) {
      // coverting back input field to td
      const td = tab.getElementsByTagName("td")[i];
      if (this.col[i] === "roles") {
        for (let i = 0; i < this.roles.length; i++) {
          if (userdata["roles"] === this.roles[i].id) {
            role = this.roles[i].role;
          }
        }
        td.innerHTML = role;
      } else td.innerHTML = userdata[this.col[i]];
    }
    const save = document.getElementById(`usersave-${userid}`);
    save.removeEventListener("click", this.save);
    const discard = document.getElementById(`userdiscard-${userid}`);
    discard.removeEventListener("click", this.discard);
    const td = tab.getElementsByTagName("td")[this.col.length];
    td.innerHTML = `<button value='edit' id=useredit-${userid} class='btn btn-info'>edit</button>`;
    const edit = document.getElementById(
      `useredit-${userid}`
    ) as HTMLButtonElement;
    edit.addEventListener("click", this.edit);
  }
}
