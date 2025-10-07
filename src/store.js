import { configureStore } from "@reduxjs/toolkit";
import {
  isAuthLoginReducer,
  isAuthRegisterReducer,
} from "./features/auth/states/reducer";
import {
  isChangeProfilePasswordReducer,
  isChangeProfileReducer,
  isChangeProfilePhotoActionCreator,
  profileReducer,
  usersReducer,
  userReducer,
  isProfileReducer,
} from "./features/users/states/reducer";
import * as cashflowReducer from "./features/cashflow/states/reducer";

const store = configureStore({
  reducer: {
    // Auth reducers
    isAuthLogin: isAuthLoginReducer,
    isAuthRegister: isAuthRegisterReducer,

    // Users reducers
    users: usersReducer,
    user: userReducer,
    profile: profileReducer,
    isProfile: isProfileReducer,
    isChangeProfile: isChangeProfileReducer,
    isChangeProfilePhoto: isChangeProfilePhotoActionCreator,
    isChangeProfilePassword: isChangeProfilePasswordReducer,

    // Cashflows reducers
    cashflows: cashflowReducer.cashflowsReducer,
    cashflow: cashflowReducer.cashflowReducer,
    isCashflow: cashflowReducer.isCashflowReducer,
    isCashflowAdd: cashflowReducer.isCashflowAddReducer,
    isCashflowAdded: cashflowReducer.isCashflowAddedReducer,
    isCashflowChange: cashflowReducer.isCashflowChangeReducer,
    isCashflowChanged: cashflowReducer.isCashflowChangedReducer,
    isCashflowChangeCover: cashflowReducer.isCashflowChangeCoverReducer,
    isCashflowChangedCover: cashflowReducer.isCashflowChangedCoverReducer,
    isCashflowDeleted: cashflowReducer.isCashflowDeletedReducer,
    labels: cashflowReducer.labelsReducer,
    statusDaily: cashflowReducer.statusDailyReducer,
    statusMonthly: cashflowReducer.statusMonthlyReducer,
  },
});

export default store;
