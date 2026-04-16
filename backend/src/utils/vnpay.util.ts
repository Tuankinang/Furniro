import crypto from "crypto";
import qs from "qs";

// Hàm sắp xếp object theo thứ tự bảng chữ cái (Bắt buộc của VNPAY)
export const sortObject = (obj: any) => {
  let sorted: any = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
};

// Hàm tạo chữ ký bảo mật HMAC SHA512
export const generateVnpaySignature = (signData: string, secretKey: string) => {
  const hmac = crypto.createHmac("sha512", secretKey);
  return hmac.update(new Buffer(signData, "utf-8")).digest("hex");
};
