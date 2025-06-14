//AppParameters.ts

//AppParameters.ts
import type { IAppParametersState } from "./appcarcass/redux/slices/appParametersSlice";

export const appParameters: IAppParametersState = {
    appName: import.meta.env.VITE_REACT_APP_NAME as string, //"ენის მოდელის რედაქტორი",
    baseUrl: import.meta.env.VITE_REACT_APP_API_URI as string,
    // import.meta.env.MODE === "development"
    //   ? //? window.location.origin + '/api'
    //     // ? 'http://localhost:5022/api/v1'
    //     "https://devapp.grammar.ge/api/v1"
    //   : "https://app.grammar.ge/api/v1",
};
