"use strict";
exports.__esModule = true;
var data_1 = require("./data");
var user_1 = require("./user");
var button = document.getElementById("myButton1");
var DATA = /** @class */ (function () {
    //let data: Array=[]
    function DATA(data) {
        var _this = this;
        this.render = function () {
            button.value = "refresh data";
            var element = document.getElementById("table");
            element.innerHTML = "<thead><tr>\n             <th>first name</th>\n             <th>middle name</th>\n             <th>last name</th>\n             <th>address</th>\n             <th>email</th>\n             <th>phone no</th>\n             <th>role</th>\n             <th colspan=2>actions</th></thead><tbody>" + _this.data
                .map(function (user) {
                return "<tr id=" + user.id + ">\n             <td>" + user.first_name + "</td>\n             <td>" + user.middle_name + "</td>\n             <td>" + user.last_name + "</td>\n             <td>" + user.address + "</td>\n             <td>" + user.email + "</td>\n             <td>" + user.phone_no + "</td>\n             <td>" + user.role + "</td>\n             <td>\n             <button value='edit' id=edit-" + user.id + " class='btn btn-info'>edit</button>\n             </td>\n             <td>\n             <button id=delete-" + user.id + " class=\"btn btn-danger\">delete</button>\n             </td>\n             </tr>";
            })
                .join("") + "</tbody>";
            for (var i = 0; i < _this.data.length; i++) {
                var edit = document.getElementById("edit-" + _this.data[i].id);
                edit.addEventListener("click", _this.edit);
                var deleteUser = document.getElementById("delete-" + _this.data[i].id);
                deleteUser.addEventListener("click", _this.deleteUser);
            }
            var table = document.getElementById("table");
            var rowCount = table.rows.length;
            var row = table.insertRow(rowCount);
            row.id = String(Date.now());
            for (var i = 0; i < _this.col.length - 1; i++) {
                if ("select" === _this.col[i].type) {
                    var newcell_1 = row.insertCell(i);
                    newcell_1.innerHTML = "<td><select class=\"form-control\">\n                 <option class=\"btn btn-primary dropdown-toggle\" value=\"manager\">manager</option>\n                 <option class=\"btn btn-primary dropdown-toggle\" value=\"admin\">admin</option>\n               </select></td>";
                }
                else {
                    var newcell_2 = row.insertCell(i);
                    newcell_2.innerHTML = "<td><input type='text' id='new'class=\"form-control\"></input></td>";
                }
            }
            var newcell = row.insertCell(_this.col.length - 1);
            newcell.innerHTML = "<td><button id=save-" + row.id + " class=\"btn btn-info\" >add</button></td><tr>";
            var add = document.getElementById("save-" + row.id);
            add.addEventListener("click", _this.save);
        };
        this.deleteUser = function (e) {
            var event = e.target;
            var id = event.id.slice(7);
            // console.log(id);
            var place;
            var element = document.getElementById(id);
            for (var i = 0; i < _this.data.length; i++) {
                if (id === _this.data[i].id) {
                    place = i;
                    _this.data.splice(place, 1);
                }
            }
            // User.removeUser(id);
            var edit = document.getElementById("edit-" + id);
            edit.removeEventListener("click", _this.deleteUser);
            var deleteUser = document.getElementById("delete-" + id);
            deleteUser.removeEventListener("click", _this.deleteUser);
            element.remove();
        };
        this.discard = function (e) {
            var event = e.target;
            console.log(event);
            var index;
            var id = event.id.slice(8);
            for (var i = 0; i < _this.data.length; i++) {
                if (id === _this.data[i].id) {
                    index = i;
                }
            }
            var tab = document.getElementById(id);
            for (var i = 0; i < _this.col.length - 1; i++) {
                var td_1 = tab.getElementsByTagName("td")[i];
                td_1.innerHTML = _this.data[index][_this.col[i].colname];
            }
            var save = document.getElementById("save-" + id);
            save.removeEventListener("click", _this.save);
            var discard = document.getElementById("discard-" + id);
            discard.removeEventListener("click", _this.discard);
            var td = tab.getElementsByTagName("td")[_this.col.length - 1];
            td.innerHTML = "<button value='edit' id=edit-" + id + " class='btn btn-info'>edit</button>";
            var edit = document.getElementById("edit-" + id);
            edit.addEventListener("click", _this.edit);
        };
        this.save = function (e) {
            var event = e.target;
            var id = event.id.slice(5);
            //  console.log(id);
            var tab = document.getElementById(id);
            var data = {};
            var emptydata = 1;
            for (var i = 0; i < _this.col.length - 1; i++) {
                var td = tab.getElementsByTagName("td")[i];
                var tablerow = td.childNodes[0];
                var txtVal = tablerow.value;
                if (txtVal !== "" || _this.col[i].required === "no") {
                    //  console.log(emptydata, txtVal);
                    data[_this.col[i].colname] = txtVal;
                    data.id = id;
                }
                else {
                    emptydata = 0;
                    alert("all fields are compulsory");
                    break;
                }
            }
            try {
                var user = new user_1.User(data);
                var flag = 0; //flag to check if id exist or not
                var place = void 0;
                for (var i = 0; i < _this.data.length; i++) {
                    if (id === _this.data[i].id) {
                        (flag = 1), (place = i);
                        _this.data[place] = data;
                        //   const user = new User(data)
                    }
                    if (flag !== 1) {
                        _this.data.push(data);
                    }
                    _this.render();
                }
            }
            catch (err) {
                alert(err);
            }
        };
        this.edit = function (e) {
            var event = e.target;
            var id = event.id.slice(5);
            var tab = document.getElementById(id);
            for (var i = 0; i < _this.col.length - 1; i++) {
                if ("email" === _this.col[i].type) {
                    var td = tab.getElementsByTagName("td")[i];
                    var ele = document.createElement("input");
                    ele.setAttribute("type", "email");
                    ele.setAttribute("value", td.innerText);
                    ele.setAttribute("class", "form-control");
                    td.innerText = "";
                    td.appendChild(ele);
                }
                else if ("select" === _this.col[i].type) {
                    var td = tab.getElementsByTagName("td")[i];
                    var val = td.innerHTML;
                    console.log(val);
                    var ele = document.createElement("select"); // DROPDOWN LIST.
                    ele.setAttribute("class", "form-control");
                    ele.innerHTML = "<option class=\"btn btn-primary dropdown-toggle\" value=\"" + val + "\n           \">" + val;
                    for (var k = 0; k < _this.role.length; k++) {
                        ele.innerHTML =
                            ele.innerHTML +
                                '<option class="btn btn-primary dropdown-toggle" value="' +
                                _this.role[k] +
                                '">' +
                                _this.role[k] +
                                "</option>";
                    }
                    td.innerText = "";
                    td.appendChild(ele);
                }
                else {
                    var td = tab.getElementsByTagName("td")[i];
                    var ele = document.createElement("input");
                    ele.setAttribute("type", "text");
                    ele.setAttribute("value", td.innerText);
                    ele.setAttribute("class", "form-control");
                    td.innerText = "";
                    td.appendChild(ele);
                }
            }
            var edit = document.getElementById("edit-" + id);
            edit.removeEventListener("click", _this.edit);
            tab.getElementsByTagName("td")[_this.col.length - 1].innerHTML = "<button id=save-" + id + " class=\"btn btn-success\">save</button><button id='discard-" + id + "'  style='margin-left: 3px'class=\"btn btn-warning\">discard</button>";
            var save = document.getElementById("save-" + id);
            save.addEventListener("click", _this.save);
            var discard = document.getElementById("discard-" + id);
            discard.addEventListener("click", _this.discard);
        };
        this.data = data,
            this.role = ['admin', 'guest'],
            this.col = [
                { colname: "first_name", type: "text", required: "yes" },
                { colname: "middle_name", type: "text", required: "no" },
                { colname: "last_name", type: "text", required: "yes" },
                { colname: "address", type: "text", required: "yes" },
                { colname: "email", type: "email", required: "yes" },
                { colname: "phone_no", type: "number", required: "yes" },
                { colname: "role", type: "select", required: "yes" },
                { colname: "id", type: "id", required: "yes" }
            ];
    }
    return DATA;
}());
exports.DATA = DATA;
var s = new DATA(data_1.data);
//user.load()
button.addEventListener("click", s.render);
