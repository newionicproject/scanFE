import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.scss";
import "./root.scss";
// import { ConfigProvider } from "./config/config.tsx";
//disable logs globally...
console.log = () => {};
ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
    <>
     {/* <ConfigProvider> */}
      <App />
      {/* </ConfigProvider> */}
    </>
  // </React.StrictMode>
);
