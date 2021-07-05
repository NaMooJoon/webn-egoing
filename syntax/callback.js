/*
function a(){
    console.log('A');
}
*/
// JavaScript에서는 함수가 값이다.
var a = function(){
    console.log('A');
}


function slowfunc(callback){
    callback();
}

slowfunc(a);