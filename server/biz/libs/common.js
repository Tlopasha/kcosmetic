const fs = require('fs');
const mkdirp = require('mkdirp');


/**
 * phoneNumber is String
 * return boolean
 * prefix 09, 08 then length is 10
 * prefix 01 then length is 11
 * * */
function checkValidPhoneNumber(phoneNumber) {
  let flag = false;
  if(phoneNumber){
    let filter = /^[0-9-+]+$/;
    if (filter.test(phoneNumber)) {
      let phone = phoneNumber.trim();
      let firstNumber = phone.substring(0, 2);
      if(firstNumber == '84')
        phone = phone.replace('84', '0');
      if (phone != '') {
          firstNumber = phone.substring(0, 2);
          //Đầu số 09 và 08 => 10 Sô
          if ((firstNumber == '09' || firstNumber == '08') && phone.length == 10) {
              if (phone.match(/^\d{10}/)) {
                  flag = true;
              }
          //Đầu số 01 => 11 Số
          } else if (firstNumber == '01' && phone.length == 11) {
              if (phone.match(/^\d{11}/)) {
                  flag = true;
              }
          }
      }
    }
}
return flag;
}

/**
 * phoneNumber is String
 * return phoneNumber was replace the first rezo
 * check phoneNumber valid before change refix number
 */
function changePhoneNumberTo84(phoneNumber) {
  let returnStr = '';
  if(phoneNumber){
    returnStr = phoneNumber.trim();
    if('0' == returnStr.substring(0, 1))
      returnStr = returnStr.replace('0', '84');
  }
  return returnStr;
}


const mkdirSync = (path) => {
  try {
    if (!fs.existsSync(path)) {
      return mkdirp.sync(path);
    }
  } catch (e) {
    if (e.code != 'EEXIST') throw e;
  }
}

function code_generator( len ) {
  let length = (len)?(len):(5);
  let string = 'abcdefghijklmnopqrstuvwxyz'; //to upper
  let numeric = '0123456789';
  //let punctuation = '!@#$%^&*()_+~`|}{[]\:;?><,./-=';
  let password = '';
  let character = '';
  let crunch = true;
  while( password.length<length ) {
      let entity1 = Math.ceil(string.length * Math.random()*Math.random());
      let entity2 = Math.ceil(numeric.length * Math.random()*Math.random());
      //entity3 = Math.ceil(punctuation.length * Math.random()*Math.random());
      let hold = string.charAt( entity1 );
      hold = (entity1%2==0)?(hold.toUpperCase()):(hold);
      character += hold;
      character += numeric.charAt( entity2 );
      //character += punctuation.charAt( entity3 );
      password = character;
  }
  return password;
}

const randomIntFromInterval = (min,max) =>
{
  console.log('min', min)
  console.log('max', max)
    return Math.floor(Math.random()*(max-min+1)+min);
}

module.exports = {
  checkValidPhoneNumber,
  changePhoneNumberTo84,
  mkdirSync,
  code_generator,
  randomIntFromInterval
};
