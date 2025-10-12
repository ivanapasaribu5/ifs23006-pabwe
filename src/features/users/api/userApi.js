import apiHelper from "../../../helpers/apiHelper";

const userApi = (() => {
  const DELCOM_BASEURL = import.meta.env.VITE_DELCOM_BASEURL || 'https://open-api.delcom.org/api/v1';
  const BASE_URL = `${DELCOM_BASEURL}/users`;

  function _url(path) {
    return BASE_URL + path;
  }

  async function getUsers() {
    const response = await apiHelper.fetchData(_url("/"), {
      method: "GET",
    });

    const { success, message, data } = await response.json();
    if (!success) {
      throw new Error(message);
    }

    return data.users || [];
  }

  async function getUserById(userId) {
    const response = await apiHelper.fetchData(_url(`/${userId}`), {
      method: "GET",
    });

    const { success, message, data } = await response.json();
    if (!success) {
      throw new Error(message);
    }

    return data.user;
  }

  async function getProfile() {
    const response = await apiHelper.fetchData(_url("/me"), {
      method: "GET",
    });

    const { success, message, data } = await response.json();
    if (!success) {
      throw new Error(message);
    }

    return data.user;
  }

  async function putProfile(name, email) {
    const response = await apiHelper.fetchData(_url("/me"), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
      }),
    });

    const { success, message, data } = await response.json();
    if (!success) {
      throw new Error(message);
    }

    return data.user;
  }

  async function postProfilePhoto(photo) {
    const formData = new FormData();
    formData.append("photo", photo, "profile.png");
    const response = await apiHelper.fetchData(_url("/photo"), {
      method: "POST",
      body: formData,
    });

    const { success, message } = await response.json();
    if (!success) {
      throw new Error(message);
    }

    return message;
  }

  async function putProfilePassword(password, new_password) {
    const response = await apiHelper.fetchData(_url("/password"), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
        new_password,
      }),
    });

    const { success, message } = await response.json();
    if (!success) {
      throw new Error(message);
    }

    return message;
  }

  return {
    getUsers,
    getUserById,
    getProfile,
    putProfile,
    postProfilePhoto,
    putProfilePassword,
  };
})();

export default userApi;