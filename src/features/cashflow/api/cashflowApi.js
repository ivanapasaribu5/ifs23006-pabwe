import apiHelper from "../../../helpers/apiHelper";

const cashflowApi = (() => {
  const DELCOM_BASEURL =
    import.meta.env.VITE_DELCOM_BASEURL || "https://open-api.delcom.org/api/v1";
  const BASE_URL = `${DELCOM_BASEURL}/cash-flows`;

  function _url(path = "") {
    return `${BASE_URL}${path}`;
  }

  // 🔁 Normalisasi dari API → UI
  function _normalizeSourceFromApi(src) {
    // Tidak perlu konversi lagi, karena UI dan API sama-sama menggunakan 'loans'
    return src;
  }

  // 🔁 Mapping dari UI → API
  function _mapSourceToApi(src) {
    // Tidak perlu konversi lagi
    const allowedSources = ["cash", "savings", "loans"];
    return allowedSources.includes(src) ? src : "cash";
  }

  // 🟢 GET all
  async function getCashflows(
    type = "",
    source = "",
    label = "",
    start_date = "",
    end_date = ""
  ) {
    const query = new URLSearchParams({
      ...(type && { type }),
      ...(source && { source }),
      ...(label && { label }),
      ...(start_date && { start_date }),
      ...(end_date && { end_date }),
    }).toString();

    const response = await apiHelper.fetchData(_url(query ? `?${query}` : ""), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const { success, message, data } = await response.json();
    if (!success) throw new Error(message);

    const mappedCashflows = (data.cash_flows || []).map((cf) => ({
      ...cf,
      source: _normalizeSourceFromApi(cf.source),
    }));

    return {
      cash_flows: mappedCashflows,
      stats: data.stats || {},
    };
  }

  // 🟢 GET by ID
  async function getCashflowById(cashflowId) {
    const response = await apiHelper.fetchData(_url(`/${cashflowId}`), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const { success, message, data } = await response.json();
    if (!success) throw new Error(message);

    const cf = data.cash_flow;
    return { ...cf, source: _normalizeSourceFromApi(cf.source) };
  }

  // 🟢 POST
  async function postCashflow(type, source, label, description, nominal, created_at = null) {
    const mappedSource = _mapSourceToApi(source);

    const payload = {
      type,
      source: mappedSource,
      label,
      description,
      nominal,
    };

    if (created_at) {
      payload.created_at = created_at;
    }

    console.log("📦 POST Payload:", payload);

    const response = await apiHelper.fetchData(_url(), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const { success, message, data } = await response.json();
    if (!success) throw new Error(message);

    return data;
  }

  // 🟢 PUT
  async function putCashflow(
    cashflowId,
    type,
    source,
    label,
    description,
    nominal
  ) {
    const mappedSource = _mapSourceToApi(source);

    const params = new URLSearchParams({
      type,
      source: mappedSource,
      label,
      description,
      nominal,
    });

    console.log("📦 PUT Payload:", Object.fromEntries(params));

    const response = await apiHelper.fetchData(_url(`/${cashflowId}`), {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    const { success, message } = await response.json();
    if (!success) throw new Error(message);

    return message;
  }

  // 🟢 POST cover
  async function postCashflowCover(cashflowId, coverFile) {
    const formData = new FormData();
    formData.append("cover", coverFile, coverFile.name);

    const response = await apiHelper.fetchData(_url(`/${cashflowId}/cover`), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });

    const { success, message } = await response.json();
    if (!success) throw new Error(message);

    return message;
  }

  // 🟢 DELETE
  async function deleteCashflow(cashflowId) {
    const response = await apiHelper.fetchData(_url(`/${cashflowId}`), {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const { success, message } = await response.json();
    if (!success) throw new Error(message);

    return message;
  }

  return {
    getCashflows,
    getCashflowById,
    postCashflow,
    putCashflow,
    postCashflowCover,
    deleteCashflow,

    async getLabels() {
      const response = await apiHelper.fetchData(_url(`/labels`), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const { success, message, data } = await response.json();
      if (!success) throw new Error(message);
      return data.labels || [];
    },

    async getStatusDaily(start_date = "", end_date = "") {
      const query = new URLSearchParams({
        ...(start_date && { start_date }),
        ...(end_date && { end_date }),
      }).toString();
      const response = await apiHelper.fetchData(
        _url(`/stats/daily${query ? `?${query}` : ""}`),
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const { success, message, data } = await response.json();
      if (!success) throw new Error(message);
      return data || {};
    },

    async getStatusMonthly(start_date = "", end_date = "") {
      const query = new URLSearchParams({
        ...(start_date && { start_date }),
        ...(end_date && { end_date }),
      }).toString();
      const response = await apiHelper.fetchData(
        _url(`/stats/monthly${query ? `?${query}` : ""}`),
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const { success, message, data } = await response.json();
      if (!success) throw new Error(message);
      return data || {};
    },
  };
})();

export default cashflowApi;
