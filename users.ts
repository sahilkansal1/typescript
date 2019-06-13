import { User } from "./user";
import { roles,user } from "./types";
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
  col:Array<string>;
  users : Array<user>;
  roles:roles[];
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
    console.log(this.roles);
  }

  getUsers(userid) {
    // return this.data;
    const ref = this;
    console.log(this.roles);
    let role:string;

    axios
      .get(`http://[::1]:3000/customers/${userid}`)
      .then(function(response) {
        console.log(response.data.user);

        if (response.data.user.length > 0) {
          ref.users = response.data.user;

          // return response.data;
          let x = response.data.user;
          let content = x
            .map(users => {
              // debugger;
              for (let i = 0; i < ref.roles.length; i++) {
                // console.log("roles",ref.roles[i].id);
                console.log("roles", users.role, ref.roles.length);
                // console.log(ref.roles[i].id,users.roles)
                if (users.roles === ref.roles[i].id) {
                  role = ref.roles[i].role;
                 
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
         <button id=userdelete-${
           users.id
         } class="btn btn-danger">delete</button>
         </td>
         </tr>
         `;
            })
            .join("");
          let table = `<table><thead><th>first name</th><th>middle name</th><th>last name</th><th>role</th><th>email</th><th>address</th><th>phone no</th></thead><tbody>${content}</tbody></table>`;
          document.getElementById("userdata").innerHTML = table;
          ref.eventlistner(x.length, x);
        } else {
          let content = "no user found";
          document.getElementById("userdata").innerHTML = content;
        }
      })
      .catch(function(response) {
        //handle error
        console.log("ss", response);
      });
  }
  eventlistner = (number, x) => {
    console.log(number, x[2].id);
    for (let i = 0; i < x.length; i++) {
      let edit = document.getElementById(
        `useredit-${x[i].id}`
      ) as HTMLButtonElement;
      edit.addEventListener("click", this.edit);
      let deleteUser = document.getElementById(
        `userdelete-${x[i].id}`
      ) as HTMLButtonElement;
      deleteUser.addEventListener("click", this.deleteUser);
    }
  };
  deleteUser = (e: MouseEvent): void => {
    const event = e.target as HTMLButtonElement;
    const userid: string = event.id.slice(11);
    //remove user from array
    axios.delete(`http://[::1]:3000/users/${userid}`);
    const element = document.getElementById(`user${userid}`) as HTMLElement;
    // this.users.deleteUser(userid);
    //if edit button is on
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
  };
  /**
   * @description discard changes and move back input field to td
   * @param {MouseEvent} e is event fired from ref button from where we extract userid
   */
  discard = (e: MouseEvent): void => {
    const event = e.target as HTMLButtonElement;
    let index: number;
    const userid: string = event.id.slice(12);
    console.log(userid);
    for (let i = 0; i < this.users.length; i++) {
      if (Number(userid) === Number(this.users[i].id)) {
        //index of user details of ref user
        index = i;
      }
    }
let role:string
    // console.log(this.users[userid]);
    const tab = document.getElementById(`user${userid}`) as HTMLElement;
    console.log(tab);
    for (let i = 0; i < this.col.length; i++) {
      // coverting back input field to td
      const td = tab.getElementsByTagName("td")[i];
      if(this.col[i]==='roles'){
        for (let i = 0; i < this.roles.length; i++) {
          // console.log("roles",ref.roles[i].id);
          console.log("roles", this.users[index].id, this.roles.length);
          // console.log(ref.roles[i].id,users.roles)
          if (this.users[index].roles === this.roles[i].id) {
            role = this.roles[i].role;
            console.log("ref role", this.roles[i].role);
            console.log(role);
          }
        }
        td.innerHTML = role;
      }else
      {td.innerHTML = this.users[index][this.col[i]];}
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
    // console.log(userid)
    const row = document.getElementById(`user${userid}`) as HTMLElement;
    // console.log("edit", this);
    // console.log('hello')
    //to make entire row editable
    for (let i = 0; i < this.col.length; i++) {
      let td = row.getElementsByTagName("td")[i];
      // console.log(td)
      const ele = document.createElement("input");
      ele.setAttribute("type", "text");
      ele.setAttribute("value", td.innerText);
      ele.setAttribute("class", "form-control");
      td.innerText = "";
      td.appendChild(ele);
      //   }
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
    let ref = this;
    console.log("this is save", this);
    const event = e.target as HTMLButtonElement;
    const userid: string = event.id.slice(9);
    const row = document.getElementById(`user${userid}`);
    console.log("save", userid);
    let userdata = {}; // user data of paticular person
    console.log(this.col);

    for (let i = 0; i < this.col.length; i++) {
      const td = row.getElementsByTagName("td")[i];
      const tablerow = td.childNodes[0] as HTMLInputElement;
      console.log("table row", tablerow);
      let txtVal = tablerow.value; //contains value of td
      if (this.col[i] === "phoneNo") {
        userdata[this.col[i]] = Number(txtVal);
      } else if (this.col[i] === "roles") {
        userdata[this.col[i]] = Role[txtVal];
      } else userdata[this.col[i]] = txtVal;
      // userdata.id = userid;
      // console.log(txtVal)
    }
    const user = new User(userdata)
    try{
      user.check()
      console.log(userdata);
    axios({
      method: "patch",
      url: `http://[::1]:3000/users/${userid}`,
      data: userdata,
      config: { headers: { "Content-Type": "application/json" } }
    })
      .then(function(response) {
        //handle success
        console.log(response);
       
        let role
        const tab = document.getElementById(`user${userid}`) as HTMLElement;
        for (let i = 0; i < ref.col.length; i++) {
          // coverting back input field to td
          const td = tab.getElementsByTagName("td")[i];
          if(ref.col[i]==='roles'){
            for (let i = 0; i < ref.roles.length; i++) {
              console.log("roles",ref.roles[i].id);
            //  console.log("roles", ref.users[index].id, this.roles.length);
            console.log(ref.roles[i].id,userdata[ref.col[i]],ref.roles[i].id)
              if (userdata['roles'] === ref.roles[i].id) {
                role = ref.roles[i].role;
                console.log("ref role", ref.roles[i].role);
                console.log(role);
              }
            }
            td.innerHTML = role;
          } else
          td.innerHTML = userdata[ref.col[i]];
        }
        const save = document.getElementById(`usersave-${userid}`);
        save.removeEventListener("click", ref.save);
        const discard = document.getElementById(`userdiscard-${userid}`);
        discard.removeEventListener("click", ref.discard);
        const td = tab.getElementsByTagName("td")[ref.col.length];
        td.innerHTML = `<button value='edit' id=useredit-${userid} class='btn btn-info'>edit</button>`;
        const edit = document.getElementById(
          `useredit-${userid}`
        ) as HTMLButtonElement;
        edit.addEventListener("click", ref.edit);
        // console.log(response);
      })
      .catch(function(response) {
        //handle error
        console.log(response);
      })
    }
    catch(err) {alert(err)}
    }
  
  

}