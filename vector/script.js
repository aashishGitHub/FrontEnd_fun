
function isValidBase64(base64String) {
    // This regex checks for valid Base64 characters and padding rules
    const regex = /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/;
    return regex.test(base64String);
}

isValidBase64('SGVsbG8gV29ybGQ='); // true
const result = isValidBase64('KnojPP9hJzx/Rdu87s'); // false
console.log(result); // false

const isBase64 = value => /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/.test(value);

const result1 =  isBase64('MIQKuhftkDwxfZU7pve/OoaXS7wO4R...'); // true
console.log(result1); // true


function isPartOfBase64(str) {
    return str.length % 4 == 0 && /^[A-Za-z0-9+/]+[=]{0,2}$/.test(str);
}


const result2 = isPartOfBase64('MIQKuhftkDwxfZU7pve/OoaXS7wO4R...'); // false
console.log(result2); // false


const result3 = isValidBase64('MIQKuhftkDwxfZU7pve/OoaXS7wO4R=='); // false
console.log(result3); // false


let input = "This is a sample string with three dots...";
let output = input.replace(/\.\.\.$/, "==");
console.log(output);