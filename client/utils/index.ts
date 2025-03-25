import AES from "../../common/aes";
import { encrypt, decrypt } from "../../common/rsa";
export const generateString = () => {
  return Math.random().toString(36).substring(2, 15);
};
export const encryptMessage = (
  message: any,
  publicKeyA: string,
  publicKeyB: string
) => {
  const key = generateString();
  const encryptedText = AES.encrypt(message.text, key);

  return {
    ...message,
    text: encryptedText,
    ivA: encrypt(key, publicKeyA),
    ivB: encrypt(key, publicKeyB),
  };
};

export const decryptMessage = (
  message: any,
  iv: string,
  privateKey: string
) => {
  const key = decrypt(iv, privateKey);
  const decryptedText = AES.decrypt(message.text, key);

  let newMessage = {
    ...message,
    text: decryptedText,
  };
  return newMessage;
};
