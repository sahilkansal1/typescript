"use strict";
exports.__esModule = true;
var data_1 = require("./data");
var user_1 = require("./user");
var button = document.getElementById("myButton1");
var DATA = /** @class */ (function () {
    function DATA(data) {
        var _this = this;
        this.html = function () {
            return "<thead><tr>\n    <th>first name</th>\n    <th>middle name</th>\n    <th>last name</th>\n    <th>address</th>\n    <th>email</th>\n    <th>phone no</th>\n    <th>role</th>\n    <th colspan=2>actions</th></thead><tbody>" + _this.data
                .map(function (user) {
                return "<tr id=" + user.id + ">\n    <td>" + user.first_name + "</td>\n    <td>" + user.middle_name + "</td>\n    <td>" + user.last_name + "</td>\n    <td>" + user.address + "</td>\n    <td>" + user.email + "</td>\n    <td>" + user.phone_no + "</td>\n    <td>" + user.role + "</td>\n    <td>\n    <button value='edit' id=edit-" + user.id + " class='btn btn-info'>edit</button>\n    </td>\n    <td>\n    <button id=delete-" + user.id + " class=\"btn btn-danger\">delete</button>\n    </td>\n    </tr>";
            })
                .join("") + "</tbody>";
        };
        this.render = function () {
            button.value = "refresh data";
            var element = document.getElementById("table");
            element.innerHTML = _this.html();
            // for (let i = 0; i < this.data.length; i++) {
            //   let edit = document.getElementById(
            //     `edit-${this.data[i].id}`
            //   ) as HTMLButtonElement;
            //   edit.addEventListener("click", this.edit);
            //   let deleteUser = document.getElementById(
            //     `delete-${this.data[i].id}`
            //   ) as HTMLButtonElement;
            //   deleteUser.addEventListener("click", this.deleteUser);
            // }
            var table = document.getElementById("table");
            var rowCount = table.rows.length;
            var row = table.insertRow(rowCount);
            row.id = String(Date.now());
            for (var i = 0; i < _this.col.length - 1; i++) {
                if ("role" === _this.col[i]) {
                    var newcell_1 = row.insertCell(i);
                    newcell_1.innerHTML = "<td><select class=\"form-control\">\n                 <option class=\"btn btn-primary dropdown-toggle\" value=\"manager\">manager</option>\n                 <option class=\"btn btn-primary dropdown-toggle\" value=\"admin\">admin</option>\n               </select></td>";
                }
                else {
                    var newcell_2 = row.insertCell(i);
                    newcell_2.innerHTML = "<td><input type='text' id='new'class=\"form-control\"></input></td>";
                }
            }
            var newcell = row.insertCell(_this.col.length - 1);
            newcell.innerHTML = _this.button('save', row.id, 'btn btn-info');
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
                td_1.innerHTML = _this.data[index][_this.col[i]];
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
            var tab = document.getElementById(id);
            var data = {};
            for (var i = 0; i < _this.col.length - 1; i++) {
                var td = tab.getElementsByTagName("td")[i];
                var tablerow = td.childNodes[0];
                var txtVal = tablerow.value;
                data[_this.col[i]] = txtVal;
                data.id = id;
            }
            try {
                console.log(data);
                var user = new user_1.User(data);
                console.log(user);
                var flag = 0; //flag to check if id exist or not
                var place = void 0;
                for (var i = 0; i < _this.data.length; i++) {
                    if (id === _this.data[i].id) {
                        (flag = 1), (place = i);
                        _this.data[place] = data;
                    }
                }
                if (flag !== 1) {
                    _this.data.push(data);
                }
                _this.render();
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
                var td = tab.getElementsByTagName("td")[i];
                if ("role" === _this.col[i]) {
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
            tab.getElementsByTagName("td")[_this.col.length - 1].innerHTML = _this.button('save', id, 'btn btn-success') + _this.button('discard', id, 'btn btn-warning');
            var save = document.getElementById("save-" + id);
            save.addEventListener("click", _this.save);
            var discard = document.getElementById("discard-" + id);
            discard.addEventListener("click", _this.discard);
        };
        this.button = function (type, id, color) {
            return "<button id=" + type + "-" + id + " class=\"" + color + "\">" + type + "</button>";
        };
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
    return DATA;
}());
exports.DATA = DATA;
var start = new DATA(data_1.data);
button.addEventListener("click", start.render);
