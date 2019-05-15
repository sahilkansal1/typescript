import { UserDetails } from "./types";
import { Usersdata } from "./data";
import { User } from "./user";
enum roles {
  admin = "admin",
  manager = "manager"
}
export class Main {
  col: Array<string>;
  data: UserDetails[];
  roles: string[];
  constructor() {
    (this.data = Usersdata),
      (this.roles = [roles.admin, roles.manager]),
      (this.col = [
        "first_name",
        "middle_name",
        "last_name",
        "address",
        "email",
        "phone_no",
        "role",
        "id"
      ]);
  }
  html = () => {
    return `<thead><tr>
    <th>first name</th>
    <th>middle name</th>
    <th>last name</th>
    <th>address</th>
    <th>email</th>
    <th>phone no</th>
    <th>role</th>
    <th colspan=2>actions</th></thead><tbody>${this.data
      .map(user => {
        return `<tr id=${user.id}>
    <td>${user.first_name}</td>
    <td>${user.middle_name}</td>
    <td>${user.last_name}</td>
    <td>${user.address}</td>
    <td>${user.email}</td>
    <td>${user.phone_no}</td>
    <td>${user.role}</td>
    <td>
    <button value='edit' id=edit-${user.id} class='btn btn-info'>edit</button>
    </td>
    <td>
    <button id=delete-${user.id} class="btn btn-danger">delete</button>
    </td>
    </tr>`;
      })
      .join("")}</tbody>`;
  };
  render = () => {
    const button = document.getElementById("myButton1") as HTMLButtonElement;
    button.value = "refresh data";
    const element = document.getElementById("table") as HTMLTableElement;
    element.innerHTML = this.html();
    for (let i = 0; i < this.data.length; i++) {
      //addEventListener to all edit and delete button
      let edit = document.getElementById(
        `edit-${this.data[i].id}`
      ) as HTMLButtonElement;
      edit.addEventListener("click", this.edit);
      let deleteUser = document.getElementById(
        `delete-${this.data[i].id}`
      ) as HTMLButtonElement;
      deleteUser.addEventListener("click", this.deleteUser);
    }
    const table = document.getElementById("table") as HTMLTableElement;
    const rowCount = table.rows.length;
    const row = table.insertRow(rowCount);
    row.id = String(Date.now());
    for (let i = 0; i < this.col.length - 1; i++) {
      //for dropdown
      if ("role" === this.col[i]) {
        const newcell = row.insertCell(i);
        newcell.innerHTML = `<td><select class="form-control">
                 <option class="btn btn-primary dropdown-toggle" value="manager">manager</option>
                 <option class="btn btn-primary dropdown-toggle" value="admin">admin</option>
               </select></td>`;
      } else {
        // empty cells for new user
        const newcell = row.insertCell(i);
        newcell.innerHTML = `<td><input type='text' id='new'class="form-control"></input></td>`;
      }
    }
    const newcell = row.insertCell(this.col.length - 1);
    newcell.innerHTML = this.button("save", row.id, "btn btn-info");
    let add = document.getElementById(`save-${row.id}`) as HTMLButtonElement;
    add.addEventListener("click", this.save);
  };
  deleteUser = (e: MouseEvent) => {
    const event = e.target as HTMLButtonElement;
    const Userid: string = event.id.slice(7);
    const element = document.getElementById(Userid) as HTMLElement;
    this.DeleteUser(Userid);
    const edit = document.getElementById(`edit-${Userid}`);
    edit.removeEventListener("click", this.deleteUser);
    const deleteUser = document.getElementById(`delete-${Userid}`);
    deleteUser.removeEventListener("click", this.deleteUser);
    element.remove();
  };
  discard = (e: MouseEvent) => {
    const event = e.target as HTMLButtonElement;
    let index: number;
    const Userid: string = event.id.slice(8);
    for (let i = 0; i < this.data.length; i++) {
      if (Userid === this.data[i].id) {
        //index of user details of that user
        index = i;
      }
    }
    const tab = document.getElementById(Userid) as HTMLElement;
    for (let i = 0; i < this.col.length - 1; i++) {
      // coverting back input field to td
      const td = tab.getElementsByTagName("td")[i];
      td.innerHTML = this.data[index][this.col[i]];
    }
    const save = document.getElementById(`save-${Userid}`);
    save.removeEventListener("click", this.save);
    const discard = document.getElementById(`discard-${Userid}`);
    discard.removeEventListener("click", this.discard);
    const td = tab.getElementsByTagName("td")[this.col.length - 1];
    td.innerHTML = `<button value='edit' id=edit-${Userid} class='btn btn-info'>edit</button>`;
    const edit = document.getElementById(`edit-${Userid}`) as HTMLButtonElement;
    edit.addEventListener("click", this.edit);
  };
  save = (e: MouseEvent): void => {
    const event = e.target as HTMLButtonElement;
    const Userid: string = event.id.slice(5);
    const row = document.getElementById(Userid);
    const data: UserDetails = {};
    for (let i = 0; i < this.col.length - 1; i++) {
      const td = row.getElementsByTagName("td")[i];
      const tablerow = td.childNodes[0] as HTMLInputElement;
      let txtVal = tablerow.value; //contains value of td
      data[this.col[i]] = txtVal;
      data.id = Userid;
    }
    try {
      const user = new User(data);
      user.check(data);
      this.UserSave(data);
      this.render();
    } catch (err) {
      alert(err);
    }
  };
  edit = (e: MouseEvent) => {
    const event = e.target as HTMLButtonElement;
    const Userid: string = event.id.slice(5);
    const row = document.getElementById(Userid) as HTMLElement;
    for (let i = 0; i < this.col.length - 1; i++) {
      let td = row.getElementsByTagName("td")[i];
      if ("role" === this.col[i]) {
        // DROPDOWN LIST.
        const tdval = td.innerHTML;
        console.log(tdval);
        const ele = document.createElement("select");
        ele.setAttribute("class", "form-control");
        ele.innerHTML = `<option class="btn btn-primary dropdown-toggle" value="${tdval}
           ">${tdval}`;
        for (let k = 0; k < this.roles.length; k++) {
          if (tdval !== this.roles[k]) {
            ele.innerHTML =
              ele.innerHTML +
              '<option class="btn btn-primary dropdown-toggle" value="' + //dropdown values
              this.roles[k] +
              '">' +
              this.roles[k] +
              "</option>";
          }
        }
        td.innerText = "";
        td.appendChild(ele);
      } else {
        //empty input field
        const ele = document.createElement("input");
        ele.setAttribute("type", "text");
        ele.setAttribute("value", td.innerText);
        ele.setAttribute("class", "form-control");
        td.innerText = "";
        td.appendChild(ele);
      }
    }
    const edit = document.getElementById(`edit-${Userid}`);
    edit.removeEventListener("click", this.edit);
    row.getElementsByTagName("td")[this.col.length - 1].innerHTML =
      this.button("save", Userid, "btn btn-success") +
      this.button("discard", Userid, "btn btn-warning"); //creating button from button function
    const save = document.getElementById(`save-${Userid}`) as HTMLButtonElement;
    save.addEventListener("click", this.save);
    const discard = document.getElementById(
      `discard-${Userid}`
    ) as HTMLButtonElement;
    discard.addEventListener("click", this.discard);
  };
  button = (type, id, color) => {
    return `<button id=${type}-${id} class="${color}">${type}</button>`;
  };
  DeleteUser(Userid) {
    for (let i = 0; i < this.data.length; i++) {
      if (Userid === this.data[i].id) {
        let place = i;
        this.data.splice(place, 1); //removing user from array
      }
    }
  }
  UserSave(userInfo) {
    const id: string = userInfo.id;
    let flag: number = 0; //flag to check if id exist or not

    for (let i = 0; i < Usersdata.length; i++) {
      if (id === Usersdata[i].id) {
        flag = 1;
        Usersdata[i] = userInfo;
      }
    }
    if (flag !== 1) {
      Usersdata.push(userInfo);
    }
  }
}

const start = new Main();
document.getElementById("myButton1").addEventListener("click", start.render);
