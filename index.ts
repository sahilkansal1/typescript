import { Users } from "./users";
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
  data: User[];
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
   * @description returns template literal 
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
   * @description render prints all the html on the page
   */
  render = () => {
    const button = document.getElementById("myButton1") as HTMLButtonElement;
    button.value = "refresh data";
    const table = document.getElementById("table") as HTMLTableElement;
    table.innerHTML = this.html();
    //addEventListener to all edit and delete button
    this.addeventlistner();
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
   * @description delete user from dom and array
   * @param {MouseEvent} e is event fired from that button from where we extract userid
   */
  deleteUser = (e: MouseEvent): void => {
    const event = e.target as HTMLButtonElement;
    const userid: string = event.id.slice(7);
    const element = document.getElementById(userid) as HTMLElement;
    //remove user from array
    this.users.deleteUser(userid);
    //if edit button is on
    try {
      const edit = document.getElementById(`edit-${userid}`);
      edit.removeEventListener("click", this.deleteUser);
    } catch (e) {
      const save = document.getElementById(`save-${userid}`);
      save.removeEventListener("click", this.save);
      const discard = document.getElementById(`discard-${userid}`);
      discard.removeEventListener("click", this.discard);
    }
    const deleteUser = document.getElementById(`delete-${userid}`);
    deleteUser.removeEventListener("click", this.deleteUser);
    element.remove();
  };
  /**
   * @description discard changes and move back input field to td 
   * @param {MouseEvent} e is event fired from that button from where we extract userid
   */
  discard = (e: MouseEvent): void => {
    const event = e.target as HTMLButtonElement;
    let index: number;
    const userid: string = event.id.slice(8);
    for (let i = 0; i < this.data.length; i++) {
      if (userid === this.data[i].id) {
        //index of user details of that user
        index = i;
      }
    }
    const tab = document.getElementById(userid) as HTMLElement;
    for (let i = 0; i < this.col.length - 1; i++) {
      // coverting back input field to td
      const td = tab.getElementsByTagName("td")[i];
      td.innerHTML = this.data[index][this.col[i]];
    }
    const save = document.getElementById(`save-${userid}`);
    save.removeEventListener("click", this.save);
    const discard = document.getElementById(`discard-${userid}`);
    discard.removeEventListener("click", this.discard);
    const td = tab.getElementsByTagName("td")[this.col.length - 1];
    td.innerHTML = `<button value='edit' id=edit-${userid} class='btn btn-info'>edit</button>`;
    const edit = document.getElementById(`edit-${userid}`) as HTMLButtonElement;
    edit.addEventListener("click", this.edit);
  };
  /**
   * @param {MouseEvent} e is event fired from that button from where we extract userid
   * @description saves new user
   */
  save = (e: MouseEvent): void => {
    const event = e.target as HTMLButtonElement;
    const userid: string = event.id.slice(5);
    const row = document.getElementById(userid);
    let userdata = new User({}); // user data of paticular person
    for (let i = 0; i < this.col.length - 1; i++) {
      const td = row.getElementsByTagName("td")[i];
      const tablerow = td.childNodes[0] as HTMLInputElement;
      let txtVal = tablerow.value; //contains value of td
      userdata[this.col[i]] = txtVal;
      userdata.id = userid;
    }
    try {
      //create new user here
      // const user = new User(userdata);
      userdata.check();
      this.users.userSave(userdata);
      this.render();
    } catch (err) {
      alert(err);
    }
  };
  /**
   * @param {MouseEvent} e is event fired from that button from where we extract userid
   * @description makes row editable (converts them to input fields)
   */
  edit = (e: MouseEvent): void => {
    const event = e.target as HTMLButtonElement;
    const userid: string = event.id.slice(5);
    const row = document.getElementById(userid) as HTMLElement;
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
    const edit = document.getElementById(`edit-${userid}`);
    edit.removeEventListener("click", this.edit);
    row.getElementsByTagName("td")[this.col.length - 1].innerHTML =
      this.button("save", userid, "btn btn-success") +
      this.button("discard", userid, "btn btn-warning"); //creating button from button function
    const save = document.getElementById(`save-${userid}`) as HTMLButtonElement;
    save.addEventListener("click", this.save);
    const discard = document.getElementById(
      `discard-${userid}`
    ) as HTMLButtonElement;
    discard.addEventListener("click", this.discard);
  };
  /**
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
   * @description helps to create event listner for edit and delete button
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
