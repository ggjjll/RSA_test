let primeMap = [2];    // 素数集合
primeMap.max = 2;
let publicKey = {};
let privateKey = {};
const STANDARD = 20;
const START = 65;

// 更新素数集合
function updatePrimeMap(max) {
  let lastMax = primeMap.max;
  if (lastMax >= max) {
    return ;
  }
  primeMap.max = max;
  let num = lastMax + 1;
  while (num <= max) {
    let flag = true; // 是否为素数的标记
    for (let i = 2; i <= Math.sqrt(num); i ++) {
      if (!(num % i)) {
        // 不是素数
        flag = false;
        break;
      }
    }
    if (flag) {
      // 是素数
      primeMap.push(num);
    }
    num ++;
  }
}

// 判断一个数是否为素数
function isPrimeNum (num) {
  return primeMap.indexOf(num) >= 0;
}

// 获得次方模  即：m^n / k 的余数
function getPowAndModNum(m, n, k) {
  let num = 1;
  for (let i = 0; i < n; i ++) {
    num *= m;
    num %= k;
  }
  return num;
}

// 获得随机数
function getRandomNum (min, max) {
  let d = max - min;
  return parseInt(d * Math.random() + min);
}

// 产生秘钥
const BIT = 16;   // 32位密码需求
function makeKey() {
  primeMap = [2];    // 素数集合
  primeMap.max = 2;
  let bit1 = parseInt(BIT / 2) -1;
  let bit2 = BIT - bit1;
  updatePrimeMap(Math.pow(2, bit1));
  let start = primeMap.length - 1;
  updatePrimeMap(Math.pow(2, bit2));
  let end = primeMap.length - 1;
  let p1 = 1;
  let p2 = 1;
  let n = 1;
  do {
    let num1 = getRandomNum(start, end);
    let num2 = num1;
    while (num2 == num1) {
      num2 = getRandomNum(start, end);
    }
    p1 = primeMap[num1];
    p2 = primeMap[num2];
    n = p1 * p2;
  } while (n < Math.pow(2, BIT) || n > Math.pow(2, BIT + 1));
  let fn = (p1 - 1) * (p2 - 1);
  // 生成e
  let e = 1;
  do {
    e = primeMap[getRandomNum(0, getRandomNum.length)];
  } while (e >= fn || !(fn % e));
  // 得到d
  let d = 1;
  for (let k = 0; ; k ++) {
    if (!((k * fn + 1) % e)) {
      d = (k * fn + 1) / e;
      break;
    }
  }
  // 组装秘钥
  publicKey = {n, e};
  privateKey = {n, d};
  console.log(publicKey, privateKey);
  return publicKey;
}

// 加密
function encryption(password) {
  // 字符拆分
  let chars = password.split('');
  let text = '';
  for (let char of chars) {
    let key = getPowAndModNum(char.charCodeAt(), publicKey.e, publicKey.n);
    while (key) {
      console.log(key % STANDARD);
      let ch = String.fromCharCode(key % STANDARD + START);
      text += ch;
      key = parseInt(key / STANDARD);
    }
    // 分割
    text += String.fromCharCode(getRandomNum(STANDARD + START, 126));
  }
  console.log(text);
  return text;
}

// 解密
function decrypted(text) {
  // 字符拆分
  let chars = text.split('');
  let password = '';
  let num = 0;
  let index = 0;
  for (let char of chars) {
    if (char.charCodeAt() < STANDARD + START) {
      let key = (char.charCodeAt() - START) * Math.pow(STANDARD, index ++);
      num += key;
    } else {
      // 解码
      let ch = String.fromCharCode(getPowAndModNum(num, privateKey.d, privateKey.n));
      password += ch;
      num = 0;
      index = 0;
    }
  }
  return password;
}

//makeKey();
//decrypted(encryption('nobook'));
