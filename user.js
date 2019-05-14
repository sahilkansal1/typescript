"use strict";
exports.__esModule = true;
var role;
(function (role) {
    role[role["manager"] = 0] = "manager";
    role[role["admin"] = 1] = "admin";
})(role || (role = {}));
var User = /** @class */ (function () {
    function User(id) {
        this.role = role.manager;
        this.first_name = id.first_name;
        this.middle_name = id.middle_name;
        this.last_name = id.last_name;
        this.email = id.email;
        this.id = id.id;
        this.address = id.address;
        this.role = id.role;
        this.phone_no = id.phone_no;
        this.check(id);
    }
    User.prototype.check = function (id) {
        for (var key in id) {
            // console.log(key);
            if (key != "middle_name") {
                if (id[key] === "") {
                    throw "all fields are needed";
                }
            }
        }
        if (!/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]{2,5})\.([a-zA-Z]{2,5})$/.test(this.email)) {
            throw "invalid email";
        }
        if (!/^\d{10}$/.test(this.phone_no)) {
            throw "phone no. invalid";
        }
    };
    return User;
}());
exports.User = User;
