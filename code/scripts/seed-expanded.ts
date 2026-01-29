import dotenv from 'dotenv';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';

dotenv.config({ path: '.env.local' });

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432'),
});

// Helper to get real images via Bing Thumbnails
const getImg = (query: string) => `https://tse2.mm.bing.net/th?q=${encodeURIComponent(query)}&w=800&h=600&c=7&rs=1`;

// Define Sellers
const SELLERS = [
    { name: 'Raju Shakwala', email: 'raju@market.com', business: 'Raju Vegetables' },
    { name: 'Mohan Mithai', email: 'mohan@market.com', business: 'Mohan Sweets & Farsan' },
    { name: 'Amul Center', email: 'amul@market.com', business: 'Amul Parlour' },
    { name: 'Vijay General', email: 'vijay@market.com', business: 'Vijay General Store' }
];

// Define Category Ownership (Maps Category Name -> Seller Index)
const CAT_OWNER_MAP: Record<string, number> = {
    "Fresh Sabzi": 0, // Raju
    "Farsan (Snacks)": 1, // Mohan
    "Gujarati Sweets": 1, // Mohan
    "Dairy & Amul": 2, // Amul
    "Pantry Staples": 3, // Vijay
    "General Store": 3, // Vijay
    "Stationery": 3, // Vijay
    "Textiles & Clothes": 3 // Vijay
};

const CATEGORIES = [
    {
        name: "Farsan (Snacks)",
        image: getImg("Gujarati Farsan Thali"),
        products: [
            { name: "Nylon Khaman", price: 120, desc: "Soft and spongy Nylon Khaman with green chutney. 500g.", image: getImg("Nylon Khaman Gujarati") },
            { name: "Sandwich Dhokla", price: 140, desc: "White sandwich dhokla with spicy filling. 500g.", image: getImg("Sandwich Dhokla") },
            { name: "Fafda", price: 200, desc: "Crispy Fafda, perfect with papaya sambharo. 500g.", image: getImg("Fafda Gathiya") },
            { name: "Khandvi", price: 160, desc: "Soft rolls of gram flour garnished with coconut. 250g.", image: getImg("Gujarati Khandvi") },
            { name: "Sev Mamra", price: 80, desc: "Classic Sev Mamra mix for snacking. 250g.", image: getImg("Sev Mamra") }
        ]
    },
    {
        name: "Dairy & Amul",
        image: getImg("Amul Products"),
        products: [
            { name: "Amul Gold Milk", price: 34, desc: "Full cream Amul Gold milk. 500ml.", image: getImg("Amul Gold Milk 500ml") },
            { name: "Amul Masti Dahi", price: 35, desc: "Thick curd, perfect for meals. 400g cup.", image: getImg("Amul Masti Dahi Cup") },
            { name: "Amul Butter", price: 58, desc: "The taste of India. 100g pack.", image: getImg("Amul Butter 100g") },
            { name: "Amul Chhaas", price: 15, desc: "Refreshing spiced buttermilk. 500ml pouch.", image: getImg("Amul Masti Spiced Buttermilk Pouch") },
            { name: "Amul Shrikhand", price: 120, desc: "Rich Kesar Shrikhand. 500g tub.", image: getImg("Amul Shrikhand Kesar") }
        ]
    },
    {
        name: "Textiles & Clothes",
        image: getImg("Indian Cloth Store"),
        products: [
            { name: "Bandhani Dupatta", price: 350, desc: "Traditional Gujarati Bandhani Dupatta.", image: getImg("Bandhani Dupatta Red") },
            { name: "Cotton Kurti", price: 450, desc: "Daily wear printed Cotton Kurti.", image: getImg("Cotton Kurti For Women") },
            { name: "Cotton Leggings", price: 200, desc: "Stretchable cotton leggings.", image: getImg("Ladies Cotton Leggings") },
            { name: "Men's Formal Shirt", price: 600, desc: "Formal cotton shirt for men.", image: getImg("Men Formal Shirt Folded") },
            { name: "Single Bedsheet", price: 400, desc: "Cotton single bedsheet with pillow cover.", image: getImg("Cotton Single Bedsheet Design") }
        ]
    },
    {
        name: "General Store",
        image: getImg("Indian Kirana Store Items"),
        products: [
            { name: "Nirma Detergent", price: 70, desc: "Nirma washing powder. 1kg.", image: getImg("Nirma Washing Powder Packet") },
            { name: "Vim Bar", price: 20, desc: "Dishwash bar. 300g.", image: getImg("Vim Dishwash Bar") },
            { name: "Colgate Toothpaste", price: 58, desc: "Colgate Strong Teeth. 100g.", image: getImg("Colgate Strong Teeth Toothpaste") },
            { name: "Lux Soap", price: 35, desc: "Lux International creamy soap.", image: getImg("Lux Soap Bar") },
            { name: "Parachute Hair Oil", price: 95, desc: "Pure Coconut Oil. 200ml.", image: getImg("Parachute Coconut Oil Bottle") }
        ]
    },
    {
        name: "Stationery",
        image: getImg("Stationery Items India"),
        products: [
            { name: "Classmate Notebook", price: 50, desc: "Classmate long notebook single line. 172pg.", image: getImg("Classmate Notebook Long") },
            { name: "Cello Gripper Pen", price: 10, desc: "Blue ball pen.", image: getImg("Cello Gripper Pen Blue") },
            { name: "Fevicol MR", price: 45, desc: "Adhesive squeezy bottle. 100g.", image: getImg("Fevicol MR Bottle") },
            { name: "Apsara Pencils", price: 50, desc: "Pack of 10 pencils with eraser.", image: getImg("Apsara Pencil Box") },
            { name: "Calculator", price: 150, desc: "Basic pocket calculator.", image: getImg("Citizen Pocket Calculator") }
        ]
    },
    {
        name: "Gujarati Sweets",
        image: getImg("Indian Sweets Shop"),
        products: [
            { name: "Jalebi", price: 300, desc: "Hot crispy Jalebi made in Ghee.", image: getImg("Jalebi Sweet") },
            { name: "Kaju Katli", price: 450, desc: "Premium cashew fudge.", image: getImg("Kaju Katli") },
            { name: "Mohanthal", price: 400, desc: "Traditional gram flour fudge.", image: getImg("Mohanthal Sweet") },
            { name: "Gulab Jamun", price: 250, desc: "Soft syrup-soaked Gulab Jamun.", image: getImg("Gulab Jamun Bowl") },
            { name: "Soan Papdi", price: 120, desc: "Flaky sweet Soan Papdi.", image: getImg("Soan Papdi Box") }
        ]
    },
    {
        name: "Pantry Staples",
        image: getImg("Indian Spices and Pulses"),
        products: [
            { name: "Wagh Bakri Tea", price: 500, desc: "Strong Wagh Bakri Premium Tea. 1kg.", image: getImg("Wagh Bakri Tea Packet") },
            { name: "Turmeric Powder", price: 150, desc: "Pure Haldi powder. 500g.", image: getImg("Turmeric Powder Bowl") },
            { name: "Basmati Rice", price: 120, desc: "Long grain Daawat Basmati. 1kg.", image: getImg("Daawat Basmati Rice Packet") },
            { name: "Tuver Dal", price: 130, desc: "Oily Tuver Dal.", image: getImg("Tuver Dal Bowl") },
            { name: "Fortune Oil", price: 160, desc: "Fortune Refined Oil pouch. 1L.", image: getImg("Fortune Oil Pouch") }
        ]
    },
    {
        name: "Fresh Sabzi",
        image: getImg("Indian Vegetable Market"),
        products: [
            { name: "Kesar Mango", price: 800, desc: "Premium Gir Kesar Mango box (Seasonal).", image: getImg("Kesar Mango Box") },
            { name: "Desi Tomato", price: 40, desc: "Fresh tomatoes. 1kg.", image: getImg("Fresh Tomato Basket") },
            { name: "Green Chilli", price: 20, desc: "Spicy Indian green chillies.", image: getImg("Green Chilli Heap") },
            { name: "Coriander", price: 15, desc: "Fresh Dhaniya bunch.", image: getImg("Fresh Coriander Bunch") },
            { name: "Potato", price: 30, desc: "Fresh potatoes. 1kg.", image: getImg("Potato Heap") }
        ]
    }
];

async function seedExpanded() {
    const client = await pool.connect();
    try {
        console.log('Seeding Multi-Seller Revenue Data with Bcrypt...');
        await client.query('BEGIN');

        // Cleanup
        console.log('Cleaning up old data...');
        await client.query('TRUNCATE TABLE users, businesses, products, categories, orders, order_items, payments CASCADE');

        // Generate valid hash for "password"
        const hash = await bcrypt.hash('password', 10);

        // 1. Create Admins
        console.log(' Creating Admins...');
        // Schema only allows 'buyer', 'business_owner', 'admin'. 'super_admin' is invalid.
        await client.query(`INSERT INTO users (name, email, password_hash, role) VALUES ('Super Admin', 'super@market.com', $1, 'admin') ON CONFLICT (email) DO NOTHING`, [hash]);
        await client.query(`INSERT INTO users (name, email, password_hash, role) VALUES ('General Admin', 'admin@market.com', $1, 'admin') ON CONFLICT (email) DO NOTHING`, [hash]);

        // 2. Create Sellers and Businesses
        const sellerIds = [];
        const businessIds = [];

        for (const seller of SELLERS) {
            // Upsert User
            let uid;
            // IMPORTANT: Using $3 which is the hash
            const uRes = await client.query(`INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, 'business_owner') ON CONFLICT (email) DO UPDATE SET name=EXCLUDED.name, password_hash=$3 RETURNING id`, [seller.name, seller.email, hash]);
            if (uRes.rows.length > 0) uid = uRes.rows[0].id;
            else uid = (await client.query("SELECT id FROM users WHERE email=$1", [seller.email])).rows[0].id;
            sellerIds.push(uid);

            // Upsert Business
            let bid;
            const bRes = await client.query(`INSERT INTO businesses (owner_id, name, address) VALUES ($1, $2, 'Ahmedabad') ON CONFLICT DO NOTHING RETURNING id`, [uid, seller.business]);
            if (bRes.rows.length > 0) bid = bRes.rows[0].id;
            else bid = (await client.query("SELECT id FROM businesses WHERE owner_id=$1", [uid])).rows[0].id;
            businessIds.push(bid);
        }

        // 3. Insert Categories and Products with Ownership
        const allProductIds: number[] = [];
        const productBusinessMap: Record<number, number> = {};

        for (const cat of CATEGORIES) {
            // Direct lookup or default to Vijay (3)
            // Ensure precise matching
            let ownerIdx = 3;
            if (cat.name === "Fresh Sabzi") ownerIdx = 0;
            else if (cat.name === "Farsan (Snacks)" || cat.name === "Gujarati Sweets") ownerIdx = 1;
            else if (cat.name === "Dairy & Amul") ownerIdx = 2;
            else ownerIdx = 3;

            const businessId = businessIds[ownerIdx];

            const res = await client.query("INSERT INTO categories (name, image_url) VALUES ($1, $2) RETURNING id", [cat.name, cat.image]);
            const catId = res.rows[0].id;

            for (const prod of cat.products) {
                const pRes = await client.query(`
                    INSERT INTO products (business_id, category_id, name, description, price, stock, image_url)
                    VALUES ($1, $2, $3, $4, $5, $6, $7)
                    RETURNING id
                 `, [businessId, catId, prod.name, prod.desc, prod.price, 50, prod.image]);

                const pid = pRes.rows[0].id;
                allProductIds.push(pid);
                productBusinessMap[pid] = businessId;
            }
        }

        // 4. Create Fake Buyers
        const buyerIds = [];
        for (let i = 1; i <= 5; i++) {
            // Use valid hash
            const uRes = await client.query(`INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, 'buyer') ON CONFLICT (email) DO NOTHING RETURNING id`, [`Buyer ${i}`, `buyer${i}@test.com`, hash]);
            let uid;
            if (uRes.rows.length > 0) uid = uRes.rows[0].id;
            else uid = (await client.query("SELECT id FROM users WHERE email=$1", [`buyer${i}@test.com`])).rows[0].id;
            buyerIds.push(uid);
        }

        // 5. Generate Fake Orders
        console.log(' Generating Fake Orders...');
        for (let i = 0; i < 50; i++) {
            const buyerId = buyerIds[Math.floor(Math.random() * buyerIds.length)];
            const numItems = Math.floor(Math.random() * 3) + 1;
            const selectedPids = [];
            for (let j = 0; j < numItems; j++) {
                selectedPids.push(allProductIds[Math.floor(Math.random() * allProductIds.length)]);
            }

            const itemsByBusiness: Record<number, number[]> = {};
            selectedPids.forEach(pid => {
                const bid = productBusinessMap[pid];
                if (!itemsByBusiness[bid]) itemsByBusiness[bid] = [];
                itemsByBusiness[bid].push(pid);
            });

            for (const [bidStr, pids] of Object.entries(itemsByBusiness)) {
                const bid = parseInt(bidStr);
                const status = Math.random() > 0.2 ? 'completed' : 'pending';

                const oRes = await client.query(`
                    INSERT INTO orders (user_id, business_id, status, total_amount)
                    VALUES ($1, $2, $3, 0) RETURNING id
                `, [buyerId, bid, status]);
                const orderId = oRes.rows[0].id;

                let realTotal = 0;
                for (const pid of pids) {
                    const pRow = await client.query("SELECT price FROM products WHERE id = $1", [pid]);
                    const price = parseFloat(pRow.rows[0].price);
                    realTotal += price;

                    await client.query(`
                        INSERT INTO order_items (order_id, product_id, quantity, price)
                        VALUES ($1, $2, 1, $3)
                    `, [orderId, pid, price]);
                }

                await client.query("UPDATE orders SET total_amount = $1 WHERE id = $2", [realTotal, orderId]);

                if (status === 'completed') {
                    await client.query(`
                        INSERT INTO payments (order_id, amount, method, status)
                        VALUES ($1, $2, 'upi', 'success')
                    `, [orderId, realTotal]);
                }
            }
        }

        await client.query('COMMIT');
        console.log("Seeding Complete: Valid BCrypt Hashes & Distributed Data!");
    } catch (e) {
        await client.query('ROLLBACK');
        console.error(e);
    } finally {
        client.release();
        process.exit();
    }
}

seedExpanded();
