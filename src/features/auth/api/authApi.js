import apiHelper from "../../../helpers/apiHelper";

const authApi = (() => {
  const DELCOM_BASEURL = import.meta.env.VITE_DELCOM_BASEURL || 'https://open-api.delcom.org/api/v1';
  const BASE_URL = `${DELCOM_BASEURL}/auth`;

  function _url(path) {
    return BASE_URL + path;
  }

  async function postRegister(name, email, password) {
    const response = await apiHelper.fetchData(_url("/register"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const { success, message } = await response.json();
    if (!success) {
      throw new Error(message);
    }

    return message;
  }

  async function postLogin(email, password) {
    const response = await apiHelper.fetchData(_url("/login"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const { success, message, data } = await response.json();
    if (!success) {
      throw new Error(message);
    }

    return data;
  }

  return {
    postRegister,
    postLogin,
  };
})();

export default authApi;