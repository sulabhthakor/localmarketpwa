export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
    stock: number;
}

export const mockProducts: Product[] = [
    {
        id: 1,
        name: "Wireless Noise Cancelling Headphones",
        description: "Experience premium sound quality with our top-of-the-line wireless headphones. Features active noise cancellation and 30-hour battery life.",
        price: 299.99,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
        stock: 50
    },
    {
        id: 2,
        name: "Classic Cotton T-Shirt",
        description: "A comfortable, breathable cotton t-shirt perfect for everyday wear. Available in multiple colors.",
        price: 24.99,
        category: "fashion",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60",
        stock: 100
    },
    {
        id: 3,
        name: "Modern Ceramic Vase",
        description: "Add a touch of elegance to your home with this easy-to-clean ceramic vase. Perfect for fresh or dried flowers.",
        price: 45.00,
        category: "home",
        image: "https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=500&auto=format&fit=crop&q=60",
        stock: 20
    },
    {
        id: 4,
        name: "Organic Honey Jar",
        description: "Pure, raw organic honey harvested from local farms. Delicious and healthy.",
        price: 15.50,
        category: "groceries",
        image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&auto=format&fit=crop&q=60",
        stock: 75
    },
    {
        id: 5,
        name: "Smart Watch Series 5",
        description: "Stay connected and track your fitness with the latest smart watch functionality.",
        price: 399.00,
        category: "electronics",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60",
        stock: 30
    },
    {
        id: 6,
        name: "Denim Jacket",
        description: "Vintage style denim jacket. Rugged and stylish.",
        price: 89.95,
        category: "fashion",
        image: "https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?w=500&auto=format&fit=crop&q=60",
        stock: 40
    }
];

export const mockCategories = [
    { id: "electronics", name: "Electronics" },
    { id: "fashion", name: "Fashion" },
    { id: "home", name: "Home & Garden" },
    { id: "groceries", name: "Groceries" }
];
