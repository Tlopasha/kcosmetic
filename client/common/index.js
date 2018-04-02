const randomIntFromInterval = (min,max) =>
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

 /**
 * phoneNumber is String
 * return boolean
 * prefix 09, 08 then length is 10
 * prefix 01 then length is 11
 * * */
const checkValidPhoneNumber = (phoneNumber) => {
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
 * return boolean
 * prefix 09, 08 then length is 10
 * prefix 01 then length is 11
 * * */
const checkValidIdentify = (phoneNumber) => {
    let flag = false;
    if(phoneNumber){
        let filter = /^[0-9-+]+$/;
        if (filter.test(phoneNumber)) {
            let phone = phoneNumber.trim();
            if (phone != '') {
                if (phone.match(/^\d{9}/) || phone.match(/^\d{12}/)) {
                    flag = true;
                }
            }
        }
    }
    return flag;
}

const urlBase = 'http://creditscore.vn';

export {
  randomIntFromInterval,
  checkValidPhoneNumber,
  checkValidIdentify,
  urlBase
};
