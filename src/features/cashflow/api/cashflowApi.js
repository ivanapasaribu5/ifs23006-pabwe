import apiHelper from "../../../helpers/apiHelper";

const cashflowApi = (() => {
  const BASE_URL = `${DELCOM_BASEURL}/cash-flows`;

  // Utility untuk buat URL endpoint
  function _url(path = "") {
    return `${BASE_URL}${path}`;
  }

  // 🟢 GET: Ambil semua data cash flow (dengan filter opsional)
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
      headers: {},
    });

    const { success, message, data } = await response.json();
    if (!success) throw new Error(message);

    return data.cash_flows || [];
  }

  // 🟢 GET: Ambil 1 cash flow berdasarkan ID
  async function getCashflowById(cashflowId) {
    const response = await apiHelper.fetchData(_url(`/${cashflowId}`), {
      method: "GET",
      headers: {},
    });

    const { success, message, data } = await response.json();
    if (!success) throw new Error(message);

    return data.cash_flow;
  }

async function postCashflow(type, source, label, description, nominal, date) {
  const validSources = {
    cash: "cash",
    transfer: "transfer",
    savings: "savings",
  };
  const mappedSource = validSources[source] || "cash";

  const params = new URLSearchParams({
    type,
    source: mappedSource,
    source_type: mappedSource,
    payment_method: mappedSource,
    label,
    description,
    nominal,
    date,
  });

  // 🔍 Tambahkan log ini
  console.log("📦 Payload dikirim ke API:", Object.fromEntries(params));

  const response = await apiHelper.fetchData(`${DELCOM_BASEURL}/cash-flows`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });


    const { success, message, data } = await response.json();
    if (!success) throw new Error(message);

    return data;
  }

  // 🟢 PUT: Ubah data cash flow berdasarkan ID
  async function putCashflow(
    cashflowId,
    type,
    source,
    label,
    description,
    nominal
  ) {
    // ✅ mapping sumber dana agar sesuai backend
    const validSources = {
      cash: "cash",
      transfer: "transfer",
      savings: "savings",
    };
    const mappedSource = validSources[source] || "cash";

    const params = new URLSearchParams({
      type,
      source: mappedSource,
      label,
      description,
      nominal,
    });

    const response = await apiHelper.fetchData(_url(`/${cashflowId}`), {
      method: "PUT",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    const { success, message } = await response.json();
    if (!success) throw new Error(message);

    return message;
  }

  // 🟢 POST: Ubah cover cash flow
  async function postCashflowCover(cashflowId, coverFile) {
    const formData = new FormData();
    formData.append("cover", coverFile, coverFile.name);

    const response = await apiHelper.fetchData(_url(`/${cashflowId}/cover`), {
      method: "POST",
      headers: {},
      body: formData,
    });

    const { success, message } = await response.json();
    if (!success) throw new Error(message);

    return message;
  }

  // 🟢 DELETE: Hapus cash flow berdasarkan ID
  async function deleteCashflow(cashflowId) {
    const response = await apiHelper.fetchData(_url(`/${cashflowId}`), {
      method: "DELETE",
      headers: {},
    });

    const { success, message } = await response.json();
    if (!success) throw new Error(message);

    return message;
  }

  // 🧩 Tambahan: label & statistik
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
        headers: {},
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
        _url(`/status/daily${query ? `?${query}` : ""}`),
        {
          method: "GET",
          headers: {},
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
        _url(`/status/monthly${query ? `?${query}` : ""}`),
        {
          method: "GET",
          headers: {},
        }
      );
      const { success, message, data } = await response.json();
      if (!success) throw new Error(message);
      return data || {};
    },
  };
})();

export default cashflowApi;
