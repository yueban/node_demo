var bin = new Buffer([0x68, 0x65, 0x6c, 0x6c, 0x6f]);
var str = bin.toString('utf-8');
console.log(str);

var bin = new Buffer('hello', 'utf-8');
console.log(bin);
bin.slice(2)[0] = 0x99;
console.log(bin);

var duplicate = new Buffer(bin.length);
// console.log(bin);
console.log(duplicate);
bin.copy(duplicate);
console.log(duplicate);