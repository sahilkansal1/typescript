import { UserDetails } from "./types";
import { Usersdata } from "./data";
import { User } from "./user";
let button = document.getElementById("myButton1") as HTMLButtonElement;
export class Main {
  col: Array<string>;
  data: UserDetails[];
  role: string[];
  constructor() {
    this.data = Usersdata,
      this.role = ['admin', 'manager'],
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
  html = () =>{
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
    <a href ='/edit.html?data=${JSON.stringify(user)}'>
    <button class='btn btn-info'>edit</button></a>
    </td>
    <td>
    <button id=delete-${user.id} class="btn btn-danger">delete</button>
    </td>
    </tr>`;
      })
      .join("")}</tbody>`;
  }
  render = () => {
    button.value = "refresh data";
    let element = document.getElementById("table") as HTMLElement;
    element.innerHTML = this.html()
    for (let i = 0; i < this.data.length; i++) {
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
      if ("role" === this.col[i]) {
        const newcell = row.insertCell(i);
        newcell.innerHTML = `<td><select class="form-control">
                 <option class="btn btn-primary dropdown-toggle" value="manager">manager</option>
                 <option class="btn btn-primary dropdown-toggle" value="admin">admin</option>
               </select></td>`;
      } else {
        const newcell = row.insertCell(i);
        newcell.innerHTML = `<td><input type='text' id='new'class="form-control"></input></td>`;
      }
    }
    const newcell = row.insertCell(this.col.length - 1);
    newcell.innerHTML = `<td><button id=save-${
      row.id
    } class="btn btn-info" >add</button></td><tr>`;
    let add = document.getElementById(`save-${row.id}`) as HTMLButtonElement;
    add.addEventListener("click", this.save);
  };
  deleteUser = (e: MouseEvent) => {
    let event = e.target as HTMLButtonElement;
    const id: string = event.id.slice(7);
    let element = document.getElementById(id) as HTMLElement;
   
    this.DeleteUser(id);
    let edit = document.getElementById(`edit-${id}`);
    edit.removeEventListener("click", this.deleteUser);
    let deleteUser = document.getElementById(`delete-${id}`);
    deleteUser.removeEventListener("click", this.deleteUser);
    element.remove();
  };
  
  save = (e: MouseEvent): void => {
    let event = e.target as HTMLButtonElement;
    const id: string = event.id.slice(5);
    const tab = document.getElementById(id); 
    let data: UserDetails = {};
    for (let i = 0; i < this.col.length - 1; i++) {
      const td = tab.getElementsByTagName("td")[i];
      const tablerow = td.childNodes[0] as HTMLInputElement;
      let txtVal = tablerow.value;
        data[this.col[i]] = txtVal;
        data.id = id;  
    }
    try{console.log(data)
      const user = new User()
      console.log(user)
      this.UserSave(data)
      this.render();
    }
    catch(err){
      alert(err)
    }  
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
button.addEventListener("click", start.render);
