import { MainLayout } from "./components/layouts/Main/MainLayout";
import "./App.scss";
import { HashRouter } from "react-router-dom";
import { FormDataProvider } from "./components/Items/stateManagement/FormDataContext";
import { ConfigProvider } from "./config/config";
import { TenantFormDataProvider } from "./components/payment/stateManagement/FormDataContext";
function App() {
  return (
    <HashRouter>
       <ConfigProvider>
      <FormDataProvider>
        <TenantFormDataProvider>
    <div className="App" data-test-id="app-component">
      <MainLayout />
    </div>
    </TenantFormDataProvider>
    </FormDataProvider>
    </ConfigProvider>
    </HashRouter>
  );
}

export default App;