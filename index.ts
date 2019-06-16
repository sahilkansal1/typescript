import { Users } from "./users";
import { Customer } from "./types";
const axios = require("axios");
/**
 * Creates an instance of Main.
 * @constructor
 */
export class Main {
  col: Array<string>;
  data: Customer[];

  users: Users;
  constructor() {
    this.getRoles();
    this.col = ["customerName", "website", "address"];
  }
  async getRoles() {
    let user = await axios.get("http://[::1]:3000/roles");
    this.users = new Users(user.data);
    console.log("ss", user);
  }
  /**
   * @description returns template literal
   * @returns {string} which is template literals
   */

  html = (): string => {
    console.log(this.data);
    return `<thead>${this.col
      .map(col => {
        return `<th>${col}</th>`;
      })
      .join("")}
    <th colspan=2>actions</th></thead><tbody>${this.data
      .map(customer => {
        return `<tr id=${customer.id}>
    <td>${customer.customerName}</td>
   <td>${customer.website}</td>
    <td>${customer.address}</td>
    
    <td>
    <button value='edit' id=edit-${
      customer.id
    } class='btn btn-info'>edit</button>
    </td>
    <td>
    <button id=delete-${customer.id} class="btn btn-danger">delete</button>
    </td>
    <td>
    <button id=users-${customer.id} class="btn btn-danger">users</button>
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
    for (let i = 0; i < this.col.length; i++) {
      // empty cells for new user
      const newcell = row.insertCell(i);
      newcell.innerHTML = `<td><input type='text' id='new'class="form-control"></input></td>`;
    }
    const newcell = row.insertCell(this.col.length);
    newcell.innerHTML = this.button("add", row.id, "btn btn-info");
    let add = document.getElementById(`add-${row.id}`) as HTMLButtonElement;
    add.addEventListener("click", this.add);
  };
  /**
   * @description delete user from dom and array
   * @param {MouseEvent} e is event fired from this button from where we extract userid
   */
  deleteCustomer = (e: MouseEvent): void => {
    const event = e.target as HTMLButtonElement;
    const userid: string = event.id.slice(7);
    let index;
    const element = document.getElementById(userid) as HTMLElement;
    //remove user from array
    for (let i = 0; i < this.data.length; i++) {
      if (Number(userid) === Number(this.data[i].id)) {
        index = i;
      }
    }
    this.data.splice(index, 1);
    axios.delete(`http://[::1]:3000/customers/${userid}`);
    //this.users.deleteUser(userid);
    //if edit button is on
    try {
      const edit = document.getElementById(`edit-${userid}`);
      edit.removeEventListener("click", this.deleteCustomer);
    } catch (e) {
      const save = document.getElementById(`save-${userid}`);
      save.removeEventListener("click", this.save);
      const discard = document.getElementById(`discard-${userid}`);
      discard.removeEventListener("click", this.discard);
    }
    const deleteUser = document.getElementById(`delete-${userid}`);
    deleteUser.removeEventListener("click", this.deleteCustomer);
    element.remove();
  };
  /**
   * @description discard changes and move back input field to td
   * @param {MouseEvent} e is event fired from this button from where we extract userid
   */
  discard = (e: MouseEvent): void => {
    const event = e.target as HTMLButtonElement;
    let index: number;
    const userid: string = event.id.slice(8);
    for (let i = 0; i < this.data.length; i++) {
      if (Number(userid) === Number(this.data[i].id)) {
        //index of user details of this user
        index = i;
      }
    }
    const tab = document.getElementById(userid) as HTMLElement;
    for (let i = 0; i < this.col.length; i++) {
      // coverting back input field to td
      const td = tab.getElementsByTagName("td")[i];
      td.innerHTML = this.data[index][this.col[i]];
    }
    const save = document.getElementById(`save-${userid}`);
    save.removeEventListener("click", this.save);
    const discard = document.getElementById(`discard-${userid}`);
    discard.removeEventListener("click", this.discard);
    const td = tab.getElementsByTagName("td")[this.col.length];
    td.innerHTML = `<button value='edit' id=edit-${userid} class='btn btn-info'>edit</button>`;
    const edit = document.getElementById(`edit-${userid}`) as HTMLButtonElement;
    edit.addEventListener("click", this.edit);
  };
  /**
   * @param {MouseEvent} e is event fired from this button from where we extract userid
   * @description saves new user
   */
  add = (e: MouseEvent): void => {
    const event = e.target as HTMLButtonElement;
    const userid: string = event.id.slice(4);
    const row = document.getElementById(userid);
    let userdata = {}; // user data of paticular person
    console.log(this.col);
    for (let i = 0; i < this.col.length; i++) {
      const td = row.getElementsByTagName("td")[i];
      const tablerow = td.childNodes[0] as HTMLInputElement;
      let txtVal = tablerow.value; //contains value of td
      userdata[this.col[i]] = txtVal;
    }
    try {
      this.validation(userdata as Customer);
      this.postcustomer(userdata);
    } catch (err) {
      alert(err);
    }
  };
  save = (e: MouseEvent) => {
    console.log("this is save", this);
    const event = e.target as HTMLButtonElement;
    const userid: string = event.id.slice(5);
    const row = document.getElementById(userid);
    let userdata = {}; // user data of paticular person
    console.log(this.col);
    for (let i = 0; i < this.col.length; i++) {
      const td = row.getElementsByTagName("td")[i];
      const tablerow = td.childNodes[0] as HTMLInputElement;
      let txtVal = tablerow.value; //contains value of td
      userdata[this.col[i]] = txtVal;
    }
    try {
      this.validation(userdata as Customer);
      this.patchcustomer(userdata, userid);
    } catch (err) {
      alert(err);
    }
  };
  /**
   * @param {MouseEvent} e is event fired from this button from where we extract userid
   * @description makes row editable (converts them to input fields)
   */
  edit = (e: MouseEvent): void => {
    const event = e.target as HTMLButtonElement;
    const userid: string = event.id.slice(5);
    const row = document.getElementById(userid) as HTMLElement;
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
    const edit = document.getElementById(`edit-${userid}`);
    edit.removeEventListener("click", this.edit);
    row.getElementsByTagName("td")[this.col.length].innerHTML =
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
   * @param {string} userid is rowid of this row
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
  getusers = (e: MouseEvent): void => {
    const event = e.target as HTMLButtonElement;
    const userid: string = event.id.slice(6);
    this.users.getUsers(userid);
  };
  async patchcustomer(userdata, userid) {
    let editCustomer = await axios({
      method: "patch",
      url: `http://[::1]:3000/customers/${userid}`,
      data: userdata,
      config: { headers: { "Content-Type": "application/json" } }
    });
    const tab = document.getElementById(userid) as HTMLElement;
    for (let i = 0; i < this.col.length; i++) {
      // coverting back input field to td
      const td = tab.getElementsByTagName("td")[i];
      td.innerHTML = userdata[this.col[i]];
    }
    const save = document.getElementById(`save-${userid}`);
    save.removeEventListener("click", this.save);
    const discard = document.getElementById(`discard-${userid}`);
    discard.removeEventListener("click", this.discard);
    const td = tab.getElementsByTagName("td")[this.col.length];
    td.innerHTML = `<button value='edit' id=edit-${userid} class='btn btn-info'>edit</button>`;
    const edit = document.getElementById(`edit-${userid}`) as HTMLButtonElement;
    edit.addEventListener("click", this.edit);
  }
  /**
   * @description helps to create event listner for edit , delete and users button
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
      deleteUser.addEventListener("click", this.deleteCustomer);
      let getusers = document.getElementById(
        `users-${this.data[i].id}`
      ) as HTMLButtonElement;
      getusers.addEventListener("click", this.getusers);
    }
  }
  validation(customerdata: Customer) {
    if (
      customerdata.customerName.trim() === "" ||
      customerdata.address.trim() === ""
    ) {
      throw "empty fields";
    }
  }
  async postcustomer(userdata) {
    let newCustomer = await axios({
      method: "post",
      url: "http://[::1]:3000/customers",
      data: userdata,
      config: { headers: { "Content-Type": "application/json" } }
    });
    //handle success
    console.log(newCustomer.data);
    userdata["id"] = newCustomer.data.id;
    this.data.push(userdata as Customer);
    this.render();
  }
}

const start = new Main();

async function getCustomer() {
  let getCustomer = await axios.get("http://[::1]:3000/customers");
  start.data = getCustomer.data;
  start.render();
}

document.getElementById("myButton1").addEventListener("click", getCustomer);
