import Cookies from "universal-cookie";
import CryptoJS from "crypto-js";

const baseURL = 'http://localhost:8000'
;

const checkPath = [
  "login",
  "register"
];

const decrypt = (cipherText) => {
  try {
    const bytes = CryptoJS.AES.decrypt(
      cipherText,
      "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblU"
    );
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    return cipherText;
  }
};

const isEncrypted = (value) => {
  try {
    const decrypted = decrypt(value);
    return decrypted !== "";
  } catch (e) {
    return false;
  }
};

const processObject = (obj) => {
  const result = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      if (typeof value === "object" && value !== null) {
        result[key] = processObject(value);
      } else if (value == null || value === "" || value === undefined) {
        result[key] = value;
      } else if (isEncrypted(value)) {
        result[key] = decrypt(value);
      } else {
        result[key] = value;
      }
    }
  }

  return result;
};

export default async function fetchAction(
  path,
  sendData = undefined,
  method,
  Img = false,
  setPassToken = "",
  DecriptData = false
) {
  const url = `${baseURL}${path}`;
  const cookies = new Cookies();
  const token = cookies.get("token");

  const headers = {
    "Content-Type": "application/json",
  };

  if (!checkPath.includes(path) && token) {
    headers["Authorization"] = `Bearer ${token}`;
  } else if (setPassToken) {
    headers["Token"] = `${setPassToken}`;
  }

  const fetchObj = {
    method,
    headers,
    body: sendData !== undefined ? JSON.stringify(sendData) : undefined,
  };

  if (Img) {
    delete headers["Content-Type"];
    fetchObj.body = sendData;
  }

  try {
    const response = await fetch(url, fetchObj);
    if (!response.ok) {
      throw new Error(`Fetch Error: HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (data.code === 401 && !checkPath.includes(path)) {
      document.cookie = "token=; max-age=0; path=/;";
      window.location.href = "/login";
    }
    if (path.includes("/contact/list") && DecriptData) {
      data.data = data.data.map((item) => processObject(item));
    }
    return data;
  } catch (error) {
    throw new Error("An error occurred during the fetch.");
  }
}
