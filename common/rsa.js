// Triển khai thuật toán RSA từ đầu
// Không sử dụng thư viện mã hóa

// Hàm kiểm tra số nguyên tố
function isPrime(num) {
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;

  let i = 5;
  while (i * i <= num) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
    i += 6;
  }
  return true;
}

// Hàm tìm số nguyên tố ngẫu nhiên trong khoảng
function findRandomPrime(min, max) {
  let num;
  do {
    num = Math.floor(Math.random() * (max - min + 1)) + min;
  } while (!isPrime(num));
  return num;
}

// Tính GCD (ước chung lớn nhất)
function gcd(a, b) {
  while (b !== 0) {
    let t = b;
    b = a % b;
    a = t;
  }
  return a;
}

// Tính extended GCD: ax + by = gcd(a,b)
function extendedGcd(a, b) {
  if (a === 0) {
    return { gcd: b, x: 0, y: 1 };
  }

  const { gcd: gcdValue, x: x1, y: y1 } = extendedGcd(b % a, a);

  const x = y1 - Math.floor(b / a) * x1;
  const y = x1;

  return { gcd: gcdValue, x, y };
}

// Tìm modular multiplicative inverse
function modInverse(a, m) {
  const { gcd: g, x } = extendedGcd(a, m);

  if (g !== 1) {
    throw new Error("Modular inverse không tồn tại");
  } else {
    return ((x % m) + m) % m;
  }
}

// Tính (base^exponent) % modulus
function modPow(base, exponent, modulus) {
  if (modulus === 1) return 0;

  let result = 1;
  base = base % modulus;

  while (exponent > 0) {
    if (exponent % 2 === 1) {
      result = (result * base) % modulus;
    }
    exponent = Math.floor(exponent / 2);
    base = (base * base) % modulus;
  }

  return result;
}

// Chuyển khóa thành chuỗi text
function keyToString(key) {
  return Object.entries(key)
    .map(([k, v]) => `${k}:${v}`)
    .join(";");
}

// Chuyển chuỗi text thành khóa
function stringToKey(keyString) {
  const keyObj = {};
  keyString.split(";").forEach((pair) => {
    const [key, value] = pair.split(":");
    keyObj[key] = parseInt(value, 10);
  });
  return keyObj;
}

// Tạo cặp khóa RSA
function generateKeyPair() {
  // Trong triển khai thực tế, nên sử dụng các số nguyên tố lớn hơn
  // Đây chỉ là ví dụ với số nhỏ để dễ hiểu
  const p = findRandomPrime(11, 100);
  const q = findRandomPrime(11, 100);

  const n = p * q;
  const phi = (p - 1) * (q - 1);

  // Chọn số e: 1 < e < phi, gcd(e, phi) = 1
  let e;
  do {
    e = Math.floor(Math.random() * (phi - 3)) + 3;
  } while (gcd(e, phi) !== 1);

  // Tính d: e * d ≡ 1 (mod phi)
  const d = modInverse(e, phi);

  // Chuyển khóa thành chuỗi text
  const publicKeyStr = keyToString({ e, n });
  const privateKeyStr = keyToString({ d, n });

  return {
    publicKey: publicKeyStr,
    privateKey: privateKeyStr,
  };
}

// Mã hóa tin nhắn sử dụng public key
function encrypt(message, publicKeyStr) {
  // Chuyển public key từ chuỗi thành object
  const publicKey = stringToKey(publicKeyStr);
  const { e, n } = publicKey;

  // Chuyển đổi tin nhắn thành số
  const numbers = [];
  for (let i = 0; i < message.length; i++) {
    const charCode = message.charCodeAt(i);
    numbers.push(charCode);
  }

  // Mã hóa từng số
  const encrypted = numbers.map((num) => modPow(num, e, n));

  // Chuyển dạng mảng số thành chuỗi text, cách nhau bằng dấu phẩy
  return encrypted.join(",");
}

// Giải mã tin nhắn sử dụng private key
function decrypt(encryptedStr, privateKeyStr) {
  // Chuyển private key từ chuỗi thành object
  const privateKey = stringToKey(privateKeyStr);
  const { d, n } = privateKey;

  // Chuyển chuỗi mã hóa thành mảng số
  const encrypted = encryptedStr.split(",").map((num) => parseInt(num, 10));

  // Giải mã từng số
  const decrypted = encrypted.map((num) => modPow(num, d, n));

  // Chuyển đổi các số thành ký tự
  let message = "";
  for (let i = 0; i < decrypted.length; i++) {
    message += String.fromCharCode(decrypted[i]);
  }

  return message;
}

// Sử dụng các hàm
function demo() {
  // Tạo cặp khóa dạng chuỗi text
  const { publicKey, privateKey } = generateKeyPair();
  console.log("Public Key (Text):", publicKey);
  console.log("Private Key (Text):", privateKey);

  // Tin nhắn cần mã hóa
  const message = "Hello World! áda am,snd a ápl;k;al dkqp m;alsmda;lsm";
  console.log("Tin nhắn gốc:", message);

  // Mã hóa tin nhắn
  const encrypted = encrypt(message, publicKey);
  console.log("Tin nhắn đã mã hóa:", encrypted);

  // Giải mã tin nhắn
  const decrypted = decrypt(encrypted, privateKey);
  console.log("Tin nhắn đã giải mã:", decrypted);
}

// Chạy demo
demo();
module.exports = { encrypt, decrypt, generateKeyPair };
