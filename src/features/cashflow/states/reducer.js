import { ActionType } from "./action";

export function cashflowsReducer(states = [], action) {
  switch (action.type) {
    case ActionType.SET_CASHFLOWS:
      return action.payload;
    default:
      return states;
  }
}

export function cashflowReducer(state = null, action) {
  switch (action.type) {
    case ActionType.SET_CASHFLOW:
      return action.payload;
    default:
      return state;
  }
}

export function isCashflowReducer(state = false, action) {
  switch (action.type) {
    case ActionType.SET_IS_CASHFLOW:
      return action.payload;
    default:
      return state;
  }
}

export function isCashflowAddReducer(state = false, action) {
  switch (action.type) {
    case ActionType.SET_IS_CASHFLOW_ADD:
      return action.payload;
    default:
      return state;
  }
}

export function isCashflowAddedReducer(state = false, action) {
  switch (action.type) {
    case ActionType.SET_IS_CASHFLOW_ADDED:
      return action.payload;
    default:
      return state;
  }
}

export function isCashflowChangeReducer(state = false, action) {
  switch (action.type) {
    case ActionType.SET_IS_CASHFLOW_CHANGE:
      return action.payload;
    default:
      return state;
  }
}

export function isCashflowChangedReducer(state = false, action) {
  switch (action.type) {
    case ActionType.SET_IS_CASHFLOW_CHANGED:
      return action.payload;
    default:
      return state;
  }
}

export function isCashflowChangeCoverReducer(state = false, action) {
  switch (action.type) {
    case ActionType.SET_IS_CASHFLOW_CHANGE_COVER:
      return action.payload;
    default:
      return state;
  }
}

export function isCashflowChangedCoverReducer(state = false, action) {
  switch (action.type) {
    case ActionType.SET_IS_CASHFLOW_CHANGED_COVER:
      return action.payload;
    default:
      return state;
  }
}

export function isCashflowDeleteReducer(state = false, action) {
  switch (action.type) {
    case ActionType.SET_IS_CASHFLOW_DELETE:
      return action.payload;
    default:
      return state;
  }
}

export function isCashflowDeletedReducer(state = false, action) {
  switch (action.type) {
    case ActionType.SET_IS_CASHFLOW_DELETED:
      return action.payload;
    default:
      return state;
  }
}

// Labels for cashflow
export function labelsReducer(state = [], action) {
  switch (action.type) {
    case "SET_LABELS":
      return action.payload;
    default:
      return state;
  }
}

// Status aggregations
export function statusDailyReducer(state = {}, action) {
  switch (action.type) {
    case "SET_STATUS_DAILY":
      return action.payload;
    default:
      return state;
  }
}

export function statusMonthlyReducer(state = {}, action) {
  switch (action.type) {
    case "SET_STATUS_MONTHLY":
      return action.payload;
    default:
      return state;
  }
}
