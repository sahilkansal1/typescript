import { Data } from "./interface";
import { data } from "./data";
import { User } from "./user";
let button = document.getElementById("myButton1") as HTMLButtonElement;
export class DATA {
  col: Array<string>;
  data: Data[];
  role: string[];
  constructor(data: Data[]) {
    this.data = data,
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
    <button value='edit' id=edit-${
      user.id
    } class='btn btn-info'>edit</button>
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
    newcell.innerHTML = this.button('save',row.id,'btn btn-info');
    let add = document.getElementById(`save-${row.id}`) as HTMLButtonElement;
    add.addEventListener("click", this.save);
  };
  deleteUser = (e: MouseEvent) => {
    let event = e.target as HTMLButtonElement;
    const id: string = event.id.slice(7);
    // console.log(id);
    let place: number;
    let element = document.getElementById(id) as HTMLElement;
    for (let i = 0; i < this.data.length; i++) {
      if (id === this.data[i].id) {
        place = i;
        this.data.splice(place, 1);
      }
    }
   // User.removeUser(id);
    let edit = document.getElementById(`edit-${id}`);
    edit.removeEventListener("click", this.deleteUser);
    let deleteUser = document.getElementById(`delete-${id}`);
    deleteUser.removeEventListener("click", this.deleteUser);
    element.remove();
  };
  discard = (e: MouseEvent) => {
    let event = e.target as HTMLButtonElement;
    let index: number;
    const id: string = event.id.slice(8);
    for (let i = 0; i < this.data.length; i++) {
      if (id === this.data[i].id) {
        index = i;
      }
    }
    let tab = document.getElementById(id) as HTMLElement;
    for (let i = 0; i < this.col.length - 1; i++) {
      const td = tab.getElementsByTagName("td")[i];
      td.innerHTML = this.data[index][this.col[i]];
    }
    let save = document.getElementById(`save-${id}`);
    save.removeEventListener("click", this.save);
    let discard = document.getElementById(`discard-${id}`);
    discard.removeEventListener("click", this.discard);
    let td = tab.getElementsByTagName("td")[this.col.length - 1];
    td.innerHTML = `<button value='edit' id=edit-${id} class='btn btn-info'>edit</button>`;
    let edit = document.getElementById(`edit-${id}`) as HTMLButtonElement;
    edit.addEventListener("click", this.edit);
  };
  save = (e: MouseEvent): void => {
    let event = e.target as HTMLButtonElement;
    const id: string = event.id.slice(5);
    const tab = document.getElementById(id); 
    let data: Data = {};
    for (let i = 0; i < this.col.length - 1; i++) {
      const td = tab.getElementsByTagName("td")[i];
      const tablerow = td.childNodes[0] as HTMLInputElement;
      let txtVal = tablerow.value;
        data[this.col[i]] = txtVal;
        data.id = id;  
    }
    try{console.log(data)
      const user = new User(data)
      console.log(user)
      let flag: number = 0; //flag to check if id exist or not
      let place: number;      
        for (let i = 0; i < this.data.length; i++) {
          if (id === this.data[i].id) {
            (flag = 1), (place = i);
            this.data[place] = data;
          }     
      }
      if (flag !== 1) {      
        this.data.push(data);
      }
      this.render();
    }
    catch(err){
      alert(err)
    }  
  };
  edit = (e: MouseEvent) => {
    let event = e.target as HTMLButtonElement;
    const id: string = event.id.slice(5);
    let tab = document.getElementById(id) as HTMLElement;
    for (let i = 0; i < this.col.length - 1; i++) {
      let td = tab.getElementsByTagName("td")[i];
   if ("role" === this.col[i]) {
        
        const val = td.innerHTML;
        console.log(val);
        const ele = document.createElement("select"); // DROPDOWN LIST.
        ele.setAttribute("class", "form-control");
        ele.innerHTML = `<option class="btn btn-primary dropdown-toggle" value="${val}
           ">${val}`;
        for (let k = 0; k < this.role.length; k++) {
          ele.innerHTML =
            ele.innerHTML +
            '<option class="btn btn-primary dropdown-toggle" value="' +
            this.role[k] +
            '">' +
            this.role[k] +
            "</option>";
        }
        td.innerText = "";
        td.appendChild(ele);
      } else {  
        const ele = document.createElement("input");
        ele.setAttribute("type", "text");
        ele.setAttribute("value", td.innerText);
        ele.setAttribute("class", "form-control");
        td.innerText = "";
        td.appendChild(ele);
      }
    }
    let edit = document.getElementById(`edit-${id}`);
    edit.removeEventListener("click", this.edit);
    tab.getElementsByTagName("td")[
      this.col.length - 1
    ].innerHTML = this.button('save',id,'btn btn-success')+this.button('discard',id,'btn btn-warning')
    let save = document.getElementById(`save-${id}`) as HTMLButtonElement;
    save.addEventListener("click", this.save);
    let discard = document.getElementById(`discard-${id}`) as HTMLButtonElement;
    discard.addEventListener("click", this.discard);
  };
  button = (type,id,color)=>{
    return `<button id=${type}-${id} class="${color}">${type}</button>`
  }
}
const start = new DATA(data);
button.addEventListener("click", start.render);
