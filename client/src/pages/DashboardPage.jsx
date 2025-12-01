import { AccountSection } from "../components/AccountSection";
import { AnalyticsSection } from "../components/AnalyticsSection";
import { Header } from "../components/Header";
import { RecentOrdersTable } from "../components/RecentOrdersTable";

function DashboardPage() {
    return (
        <div className="min-h-screen bg-[#F5F5FA]">
            <Header />

            <main className="max-w-7xl mx-auto px-6 py-8">
                <AccountSection />
                <AnalyticsSection />
                <RecentOrdersTable />
            </main>
        </div>
    );
}

export default DashboardPage;
