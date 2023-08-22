//AppParameters.ts

import { IAppParametersState } from "./appcarcass/redux/slices/appParametersSlice";

export const appParameters: IAppParametersState = {
  appName: process.env.REACT_APP_NAME as string, //"ენის მოდელის რედაქტორი",
  baseUrl: process.env.REACT_APP_API_URI as string,
  // process.env.NODE_ENV === "development"
  //   ? //? window.location.origin + '/api'
  //     // ? 'http://localhost:5022/api/v1'
  //     "https://devapp.grammar.ge/api/v1"
  //   : "https://app.grammar.ge/api/v1",
};
