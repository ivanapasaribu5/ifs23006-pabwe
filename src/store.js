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
import cashflowReducer from "./features/cashflow/states/reducer";

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

    // Cashflow reducer
    cashflow: cashflowReducer,
  },
});

export default store;
