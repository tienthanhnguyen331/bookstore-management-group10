import { BrowserRouter, Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import BookPage from "./pages/BookPage";
import SalesPage from "./pages/SalesPage";
import InventoryPage from "./pages/InventoryPage";
import PageNotFound from "./pages/PageNotFound";
import CustomerDebtPage from "./pages/CustomerDebtPage";
import CustomerListPage from "./pages/CustomerPage";
import SettingsPage from "./pages/SettingsPage";
function App() {
    return (
        <BrowserRouter>
            
            <Routes>
                
                <Route index element={<DashboardPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/book" element={<BookPage />} />
                <Route path="/sale" element={<SalesPage />} />
                <Route path="/inventory" element={<InventoryPage />} />
                <Route path="/finance" element={<CustomerDebtPage />} />
                <Route path="/customer" element={<CustomerListPage />} />
                <Route path="/setting" element={<SettingsPage />} />
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
