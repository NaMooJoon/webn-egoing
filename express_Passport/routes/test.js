const bcrypt = require('bcrypt');
const saltRounds = 8;
const myPlaintextPassword = 'shk121';
const someOtherPlaintextPassword = 'not_bacon';




var Hash = "";
bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
    // Store hash in your password DB.
    Hash = hash;
    console.log(hash);
    bcrypt.compare(myPlaintextPassword, Hash, function(err, result){
        console.log('1' + result);
    })
    bcrypt.compare(someOtherPlaintextPassword, Hash, function(err, result){
        console.log('2' + result);
    })
});

console.log('Hash: ', Hash);
function a(){
    bcrypt.compare(myPlaintextPassword, Hash, function(err, result){
        console.log('3' + result);
    })
    bcrypt.compare(someOtherPlaintextPassword, Hash, function(err, result){
        console.log('4' + result);
    })
}
setTimeout(a, 1000);
a();
