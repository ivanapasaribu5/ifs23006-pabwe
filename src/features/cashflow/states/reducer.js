import { ActionType } from "./action";

const initialState = {
  cashflows: [],
  stats: {},
  cashflow: null,
  isCashflow: false,
  isCashflowAdd: false,
  isCashflowAdded: false,
  isCashflowChange: false,
  isCashflowChanged: false,
  isCashflowChangeCover: false,
  isCashflowChangedCover: false,
  isCashflowDelete: false,
  isCashflowDeleted: false,
  labels: [],
  statusDaily: {},
  statusMonthly: {},
};

function cashflowReducer(state = initialState, action = {}) {
  switch (action.type) {
    case ActionType.SET_CASHFLOWS:
      return {
        ...state,
        cashflows: action.payload,
      };
    case ActionType.SET_STATS:
      return {
        ...state,
        stats: action.payload,
      };
    case ActionType.SET_CASHFLOW:
      return {
        ...state,
        cashflow: action.payload,
      };
    case ActionType.SET_IS_CASHFLOW:
      return {
        ...state,
        isCashflow: action.payload,
      };
    case ActionType.SET_IS_CASHFLOW_ADD:
      return {
        ...state,
        isCashflowAdd: action.payload,
      };
    case ActionType.SET_IS_CASHFLOW_ADDED:
      return {
        ...state,
        isCashflowAdded: action.payload,
      };
    case ActionType.SET_IS_CASHFLOW_CHANGE:
      return {
        ...state,
        isCashflowChange: action.payload,
      };
    case ActionType.SET_IS_CASHFLOW_CHANGED:
      return {
        ...state,
        isCashflowChanged: action.payload,
      };
    case ActionType.SET_IS_CASHFLOW_CHANGE_COVER:
      return {
        ...state,
        isCashflowChangeCover: action.payload,
      };
    case ActionType.SET_IS_CASHFLOW_CHANGED_COVER:
      return {
        ...state,
        isCashflowChangedCover: action.payload,
      };
    case ActionType.SET_IS_CASHFLOW_DELETE:
      return {
        ...state,
        isCashflowDelete: action.payload,
      };
    case ActionType.SET_IS_CASHFLOW_DELETED:
      return {
        ...state,
        isCashflowDeleted: action.payload,
      };
    case "SET_LABELS":
      return {
        ...state,
        labels: action.payload,
      };
    case "SET_STATUS_DAILY":
      return {
        ...state,
        statusDaily: action.payload,
      };
    case "SET_STATUS_MONTHLY":
      return {
        ...state,
        statusMonthly: action.payload,
      };
    default:
      return state;
  }
}

export default cashflowReducer;
