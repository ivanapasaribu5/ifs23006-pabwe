import {
  showErrorDialog,
  showSuccessDialog,
} from "../../../helpers/toolsHelper";
import cashflowApi from "../api/cashflowApi";

export const ActionType = {
  SET_CASHFLOWS: "SET_CASHFLOWS",
  SET_CASHFLOW: "SET_CASHFLOW",
  SET_IS_CASHFLOW: "SET_IS_CASHFLOW",
  SET_IS_CASHFLOW_ADD: "SET_IS_CASHFLOW_ADD",
  SET_IS_CASHFLOW_ADDED: "SET_IS_CASHFLOW_ADDED",
  SET_IS_CASHFLOW_CHANGE: "SET_IS_CASHFLOW_CHANGE",
  SET_IS_CASHFLOW_CHANGED: "SET_IS_CASHFLOW_CHANGED",
  SET_IS_CASHFLOW_CHANGE_COVER: "SET_IS_CASHFLOW_CHANGE_COVER",
  SET_IS_CASHFLOW_CHANGED_COVER: "SET_IS_CASHFLOW_CHANGED_COVER",
  SET_IS_CASHFLOW_DELETE: "SET_IS_CASHFLOW_DELETE",
  SET_IS_CASHFLOW_DELETED: "SET_IS_CASHFLOW_DELETED",
};

export function setCashflowsActionCreator(cashflows) {
  return {
    type: ActionType.SET_CASHFLOWS,
    payload: cashflows,
  };
}

export function asyncSetCashflows(
  type = "",
  source = "",
  label = "",
  start_date = "",
  end_date = ""
) {
  return async (dispatch) => {
    try {
      const cashflows = await cashflowApi.getCashflows(
        type,
        source,
        label,
        start_date,
        end_date
      );
      dispatch(setCashflowsActionCreator(cashflows));
    } catch (error) {
      dispatch(setCashflowsActionCreator([]));
    }
  };
}

export function setCashflowActionCreator(cashflow) {
  return {
    type: ActionType.SET_CASHFLOW,
    payload: cashflow,
  };
}

export function setIsCashflowActionCreator(status) {
  return {
    type: ActionType.SET_IS_CASHFLOW,
    payload: status,
  };
}

export function asyncSetCashflow(cashflowId) {
  return async (dispatch) => {
    try {
      const cashflow = await cashflowApi.getCashflowById(cashflowId);
      dispatch(setCashflowActionCreator(cashflow));
    } catch (error) {
      dispatch(setCashflowActionCreator(null));
    }
    dispatch(setIsCashflowActionCreator(true));
  };
}

export function setIsCashflowAddActionCreator(isCashflowAdd) {
  return {
    type: ActionType.SET_IS_CASHFLOW_ADD,
    payload: isCashflowAdd,
  };
}

export function setIsCashflowAddedActionCreator(isCashflowAdded) {
  return {
    type: ActionType.SET_IS_CASHFLOW_ADDED,
    payload: isCashflowAdded,
  };
}

export function asyncSetIsCashflowAdd(type, source, label, description, nominal, date) {
  return async (dispatch) => {
    try {
      await cashflowApi.postCashflow(type, source, label, description, nominal, date);
      dispatch(setIsCashflowAddedActionCreator(true));
    } catch (error) {
      console.error("Error response dari server:", error.response?.data);
      showErrorDialog(error.response?.data?.message || error.message);
      dispatch(setIsCashflowAddedActionCreator(false));
    }
    dispatch(setIsCashflowAddActionCreator(true));
  };
}

export function setIsCashflowChangeActionCreator(isCashflowChange) {
  return {
    type: ActionType.SET_IS_CASHFLOW_CHANGE,
    payload: isCashflowChange,
  };
}

export function setIsCashflowChangedActionCreator(isCashflowChanged) {
  return {
    type: ActionType.SET_IS_CASHFLOW_CHANGED,
    payload: isCashflowChanged,
  };
}

export function asyncSetIsCashflowChange(
  cashflowId,
  type,
  source,
  label,
  description,
  nominal
) {
  return async (dispatch) => {
    try {
      const message = await cashflowApi.putCashflow(
        cashflowId,
        type,
        source,
        label,
        description,
        nominal
      );
      showSuccessDialog(message || "Berhasil mengubah data cash flow");
      dispatch(setIsCashflowChangedActionCreator(true));
      // Refetch cashflows to update the table
      dispatch(asyncSetCashflows());
    } catch (error) {
      showErrorDialog(error.message);
    }
    dispatch(setIsCashflowChangeActionCreator(true));
  };
}

export function setIsCashflowChangeCoverActionCreator(isCashflowChangeCover) {
  return {
    type: ActionType.SET_IS_CASHFLOW_CHANGE_COVER,
    payload: isCashflowChangeCover,
  };
}

export function setIsCashflowChangedCoverActionCreator(status) {
  return {
    type: ActionType.SET_IS_CASHFLOW_CHANGED_COVER,
    payload: status,
  };
}

export function asyncSetIsCashflowChangeCover(cashflowId, cover) {
  return async (dispatch) => {
    try {
      const message = await cashflowApi.postCashflowCover(cashflowId, cover);
      showSuccessDialog(message);
      dispatch(setIsCashflowChangedCoverActionCreator(true));
    } catch (error) {
      showErrorDialog(error.message);
    }
    dispatch(setIsCashflowChangeCoverActionCreator(true));
  };
}

export function setIsCashflowDeleteActionCreator(isCashflowDelete) {
  return {
    type: ActionType.SET_IS_CASHFLOW_DELETE,
    payload: isCashflowDelete,
  };
}

export function setIsCashflowDeletedActionCreator(isCashflowDeleted) {
  return {
    type: ActionType.SET_IS_CASHFLOW_DELETED,
    payload: isCashflowDeleted,
  };
}

export function setLabelsActionCreator(labels) {
  return {
    type: "SET_LABELS",
    payload: labels,
  };
}

export function asyncGetLabels() {
  return async (dispatch) => {
    try {
      const labels = await cashflowApi.getLabels();
      dispatch(setLabelsActionCreator(labels));
    } catch (error) {
      dispatch(setLabelsActionCreator([]));
    }
  };
}

export function setStatusDailyActionCreator(status) {
  return { type: "SET_STATUS_DAILY", payload: status };
}

export function asyncGetStatusDaily(start_date = "", end_date = "") {
  return async (dispatch) => {
    try {
      const status = await cashflowApi.getStatusDaily(start_date, end_date);
      dispatch(setStatusDailyActionCreator(status));
    } catch (error) {
      dispatch(setStatusDailyActionCreator({}));
    }
  };
}

export function setStatusMonthlyActionCreator(status) {
  return { type: "SET_STATUS_MONTHLY", payload: status };
}

export function asyncGetStatusMonthly(start_date = "", end_date = "") {
  return async (dispatch) => {
    try {
      const status = await cashflowApi.getStatusMonthly(start_date, end_date);
      dispatch(setStatusMonthlyActionCreator(status));
    } catch (error) {
      dispatch(setStatusMonthlyActionCreator({}));
    }
  };
}

export function asyncSetIsCashflowDelete(cashflowId) {
  return async (dispatch) => {
    try {
      const message = await cashflowApi.deleteCashflow(cashflowId);
      showSuccessDialog(message);
      dispatch(setIsCashflowDeletedActionCreator(true));
    } catch (error) {
      showErrorDialog(error.message);
    }
    dispatch(setIsCashflowDeleteActionCreator(true));
  };
}
