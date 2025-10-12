import apiHelper from "../../../helpers/apiHelper";

const statsApi = (() => {
  const DELCOM_BASEURL = import.meta.env.VITE_DELCOM_BASEURL || 'https://open-api.delcom.org/api/v1';
  const BASE_URL = `${DELCOM_BASEURL}/stats`;

  function _url(path = "") {
    return `${BASE_URL}${path}`;
  }

  async function getMonthlyStats(userId, timeRange) {
    const query = new URLSearchParams({
      user_id: userId,
      time_range: timeRange,
    }).toString();

    const response = await apiHelper.fetchData(_url(`/monthly?${query}`), {
      method: "GET",
      headers: {},
    });

    const { success, message, data } = await response.json();
    if (!success) throw new Error(message);

    return data;
  }

  return {
    getMonthlyStats,
  };
})();

export default statsApi;
