// import { data } from "./data";

class Edit{
    id:string
constructor(){
    const urlParams = new URLSearchParams(window.location.search);
const myParam:string = urlParams.get('data');
// var queryStart = url.indexOf("?") + 1,
//         queryEnd   = url.indexOf("#") + 1 || url.length + 1,
//         query = url.slice(queryStart, queryEnd - 1),
const obj = JSON.parse(myParam)
this.setdata(obj)
}
setdata=(obj)=>{
    var keys
    for(keys in obj){
        console.log(keys)
        if(keys!='id'){
       var x= document.getElementById(keys) as HTMLInputElement
       x.value=obj[keys]}
    }
}
}   
const intial = new Edit()