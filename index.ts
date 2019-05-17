import { userDetails } from "./types";
import { Users } from "./Users";
import { User } from "./user";
enum roles {
  admin = "admin",
  manager = "manager"
}
/**
 * Creates an instance of Main.
 * @constructor
 */
export class Main {
  col: Array<string>;
  data: userDetails[];
  roles: string[];
  users: Users;
  constructor() {
    this.users = new Users();
    this.data = this.users.getData();
    this.roles = [roles.admin, roles.manager];
    this.col = [
      "first_name",
      "middle_name",
      "last_name",
      "address",
      "email",
      "phone_no",
      "role",
      "id"
    ];
  }
  /**
   * Creates an instance of html.
   * @returns {string} which is template literals
   */
  html = (): string => {
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
  /**
   * Creates an instance of render.
   * render prints all the html on the page
   */
  render = () => {
    const button = document.getElementById("myButton1") as HTMLButtonElement;
    button.value = "refresh data";
    const Table = document.getElementById("table") as HTMLTableElement;
    Table.innerHTML = this.html();
    //addEventListener to all edit and delete button
    this.addeventlistner();
    const table = document.getElementById("table") as HTMLTableElement;
    const rowCount = table.rows.length;
    const row = table.insertRow(rowCount);
    row.id = String(Date.now());
    //create new row for new user
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
  /**
   * Creates an instance of render.
   * @constructor
   * @param {MouseEvent} e is event fired from that button from where we extract userid
   * delete user from dom and array
   */
  deleteUser = (e: MouseEvent): void => {
    const event = e.target as HTMLButtonElement;
    const Userid: string = event.id.slice(7);
    const element = document.getElementById(Userid) as HTMLElement;
    //remove user from array
    this.users.DeleteUser(Userid);
    //if edit button is on
    try {
      const edit = document.getElementById(`edit-${Userid}`);
      edit.removeEventListener("click", this.deleteUser);
    } catch (e) {
      const save = document.getElementById(`save-${Userid}`);
      save.removeEventListener("click", this.save);
      const discard = document.getElementById(`discard-${Userid}`);
      discard.removeEventListener("click", this.discard);
    }
    const deleteUser = document.getElementById(`delete-${Userid}`);
    deleteUser.removeEventListener("click", this.deleteUser);
    element.remove();
  };
  /**
   * Creates an instance of discard.
   * @constructor
   * @param {MouseEvent} e is event fired from that button from where we extract userid
   */
  discard = (e: MouseEvent): void => {
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
  /**
   * Creates an instance of discard.
   * @param {MouseEvent} e is event fired from that button from where we extract userid
   * saves new user
   */
  save = (e: MouseEvent): void => {
    const event = e.target as HTMLButtonElement;
    const Userid: string = event.id.slice(5);
    const row = document.getElementById(Userid);
    const userdata: userDetails = {}; // user data of paticular person
    for (let i = 0; i < this.col.length - 1; i++) {
      const td = row.getElementsByTagName("td")[i];
      const tablerow = td.childNodes[0] as HTMLInputElement;
      let txtVal = tablerow.value; //contains value of td
      userdata[this.col[i]] = txtVal;
      userdata.id = Userid;
    }
    try {
      //create new user here
      const user = new User(userdata);
      user.check(userdata);
      this.users.UserSave(userdata);
      this.render();
    } catch (err) {
      alert(err);
    }
  };
  /**
   * Creates an instance of edit.
   * @param {MouseEvent} e is event fired from that button from where we extract userid
   * makes row editable (converts them to input fields)
   */
  edit = (e: MouseEvent): void => {
    const event = e.target as HTMLButtonElement;
    const Userid: string = event.id.slice(5);
    const row = document.getElementById(Userid) as HTMLElement;
    //to make entire row editable
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
  /**
   * Creates an instance of discard.
   * @param {string} name can have save,edit,delete,discard
   *
   * @also
   *
   * @param {string} userid is rowid of that row
   *
   * @also
   *
   * @param {string} bootstrapclass is decided on bases of what user passes
   *
   * @returns {string} returns template string
   */
  button = (type: string, id: string, color: string): string => {
    return `<button id=${type}-${id} class="${color}">${type}</button>`;
  };
  /**
   * Creates an instance of addeventlistner.
   * helps to create event listner for edit and delete button
   */
  addeventlistner(): void {
    for (let i = 0; i < this.data.length; i++) {
      let edit = document.getElementById(
        `edit-${this.data[i].id}`
      ) as HTMLButtonElement;
      edit.addEventListener("click", this.edit);
      let deleteUser = document.getElementById(
        `delete-${this.data[i].id}`
      ) as HTMLButtonElement;
      deleteUser.addEventListener("click", this.deleteUser);
    }
  }
}

const start = new Main();
document.getElementById("myButton1").addEventListener("click", start.render);
