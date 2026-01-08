import GoldRateManager from "@/components/admin/GoldRateManager";


const Dashboard = () => {
    return (
        <div>
            <h1 className="text-3xl font-serif font-bold text-primary mb-8">Dashboard</h1>

            {/* Gold Rate Section */}
            <GoldRateManager />



            {/* Stats Overview (Placeholder) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-gray-500 text-sm font-medium">Total Products</h3>
                    <p className="text-3xl font-bold text-primary mt-2">-</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
                    <p className="text-3xl font-bold text-primary mt-2">-</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-gray-500 text-sm font-medium">Revenue</h3>
                    <p className="text-3xl font-bold text-primary mt-2">-</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
