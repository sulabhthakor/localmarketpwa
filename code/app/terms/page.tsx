
export default function TermsPage() {
    return (
        <div className="container mx-auto py-12 px-4 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
            <div className="prose dark:prose-invert">
                <p>Last updated: {new Date().toLocaleDateString()}</p>
                <p>Welcome to LocalMarket. By using our website, you agree to these terms.</p>
                <h3>1. Use of Service</h3>
                <p>Users must be 18 years or older. Sellers are responsible for their product listings.</p>
                <h3>2. Orders & Payments</h3>
                <p>All payments are processed securely. Orders are subject to seller acceptance.</p>
                <h3>3. Prohibited Items</h3>
                <p>Illegal or restricted items are strictly prohibited on the platform.</p>
            </div>
        </div>
    );
}
