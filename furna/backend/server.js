import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, "data");
const dataFile = path.join(dataDir, "store.json");

const defaultImage =
  "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=80";

const productImages = {
  sofas:
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80",
  recliners:
    "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=900&q=80",
  beds:
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
  dining:
    "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=900&q=80",
  chairs:
    "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=900&q=80",
  storage:
    "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=900&q=80",
};

const brands = ["Furna Living", "Urban Oak", "CasaWood", "Nilkamal"];
const discounts = ["8%", "10%", "12%", "15%"];
const warranties = ["1 Year", "2 Years", "3 Years"];

const makeProductType = (productId, productName, typeName, basePrice, index) => ({
  productId: `${productId}-${String(index + 1).padStart(2, "0")}`,
  productName,
  typeOfProduct: typeName,
  brand: brands[index % brands.length],
  price: basePrice + index * 3500,
  discount: discounts[index % discounts.length],
  warranty: warranties[index % warranties.length],
});

const makeProduct = (
  productId,
  productName,
  image,
  price,
  stock,
  productTypes,
) => ({
  productId,
  productName,
  image,
  price,
  stock,
  productTypes: productTypes.map((typeName, index) =>
    makeProductType(productId, productName, typeName, price, index),
  ),
});

const todayLabel = () =>
  new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date());

const nextId = (prefix, ids) => {
  const nextNumber =
    ids.reduce((highest, id) => {
      const value = Number(String(id).replace(`${prefix}-`, ""));
      return Number.isNaN(value) ? highest : Math.max(highest, value);
    }, 0) + 1;

  return `${prefix}-${String(nextNumber).padStart(3, "0")}`;
};

const normalizeCategories = (categories) =>
  categories.map((category, index) => {
    const products = category.products ?? [];

    return {
      ...category,
      products,
      srNo: index + 1,
      productCount: products.reduce(
        (total, product) => total + Number(product.stock || 0),
        0,
      ),
      productNames: products.map((product) => product.productName),
    };
  });

const normalizeBanners = (banners) =>
  banners.map((banner, index) => ({
    ...banner,
    srNo: index + 1,
    bannerId: banner.bannerId || `BNR-${String(index + 1).padStart(3, "0")}`,
  }));

const normalizeRows = (rows) =>
  rows.map((row, index) => ({
    ...row,
    srNo: index + 1,
  }));

const createSeedData = () => {
  const categories = normalizeCategories([
    {
      categoryId: "CAT-001",
      categoryName: "Living Room",
      status: "Active",
      updatedAt: "12 Apr 2026",
      products: [
        makeProduct("PRD-001", "Sofas", productImages.sofas, 42999, 18, [
          "L Shape Sectional",
          "Three Seater Sofa",
          "Sofa Cum Bed",
        ]),
        makeProduct("PRD-002", "Recliners", productImages.recliners, 34999, 9, [
          "Manual Recliner",
          "Motorized Recliner",
          "Rocking Recliner",
        ]),
      ],
    },
    {
      categoryId: "CAT-002",
      categoryName: "Bedroom",
      status: "Active",
      updatedAt: "10 Apr 2026",
      products: [
        makeProduct("PRD-003", "Beds", productImages.beds, 55999, 16, [
          "Queen Storage Bed",
          "King Hydraulic Bed",
          "Platform Bed",
        ]),
        makeProduct("PRD-004", "Wardrobes", productImages.storage, 61999, 11, [
          "Two Door Wardrobe",
          "Sliding Wardrobe",
          "Four Door Wardrobe",
        ]),
      ],
    },
    {
      categoryId: "CAT-003",
      categoryName: "Dining",
      status: "Active",
      updatedAt: "08 Apr 2026",
      products: [
        makeProduct("PRD-005", "Dining Tables", productImages.dining, 24999, 8, [
          "Four Seater Table",
          "Six Seater Table",
          "Marble Dining Set",
        ]),
        makeProduct("PRD-006", "Chairs", productImages.chairs, 6999, 28, [
          "Upholstered Chair",
          "Wooden Chair",
          "Foldable Dining Chair",
        ]),
      ],
    },
  ]);

  const banners = normalizeBanners([
    {
      bannerId: "BNR-001",
      banner:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80",
      title: "Summer Furniture Sale",
      branch: "Ahmedabad",
      status: "Active",
    },
    {
      bannerId: "BNR-002",
      banner:
        "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=80",
      title: "Premium Sofa Collection",
      branch: "Surat",
      status: "Active",
    },
    {
      bannerId: "BNR-003",
      banner:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
      title: "Bedroom Makeover Week",
      branch: "Vadodara",
      status: "Inactive",
    },
  ]);

  const payments = normalizeRows([
    ["FRN-1001", "Oak Lounge Sofa", 1, 42999, 2500, "UPI"],
    ["FRN-1002", "Walnut Coffee Table", 2, 15998, 1200, "Credit Card"],
    ["FRN-1003", "Queen Storage Bed", 1, 55999, 4000, "Net Banking"],
    ["FRN-1004", "Ergo Study Chair", 3, 23997, 1800, "Debit Card"],
    ["FRN-1005", "Marble Dining Set", 1, 78999, 6500, "UPI"],
  ].map(([productId, productName, quantity, amount, discount, paymentMode], index) => ({
    productId,
    productName,
    quantity,
    amount,
    discount,
    paymentMode,
    totalAmount: amount - discount,
    paymentStatus: index % 3 === 0 ? "Pending" : "Paid",
    pendingAmount: index % 3 === 0 ? amount - discount : 0,
  })));

  const orders = normalizeRows([
    ["ORD-5001", "Aarav Mehta", "Oak Lounge Sofa", "Home Delivery", "Pending"],
    ["ORD-5002", "Isha Sharma", "Walnut Coffee Table", "Store Pickup", "Delivered"],
    ["ORD-5003", "Kabir Singh", "Queen Storage Bed", "Home Delivery", "In Transit"],
    ["ORD-5004", "Meera Nair", "Ergo Study Chair", "Express Delivery", "Processing"],
    ["ORD-5005", "Rohan Patel", "Marble Dining Set", "Home Delivery", "Delivered"],
  ].map(([orderId, personName, productName, deliveryMode, status]) => ({
    orderId,
    personName,
    productName,
    deliveryMode,
    status,
  })));

  return { banners, categories, orders, payments };
};

let db = createSeedData();

const loadData = async () => {
  try {
    const file = await readFile(dataFile, "utf8");
    const parsed = JSON.parse(file);

    db = {
      ...createSeedData(),
      ...parsed,
      banners: normalizeBanners(parsed.banners ?? []),
      categories: normalizeCategories(parsed.categories ?? []),
      orders: normalizeRows(parsed.orders ?? []),
      payments: normalizeRows(parsed.payments ?? []),
    };
  } catch {
    await saveData();
  }
};

const saveData = async () => {
  await mkdir(dataDir, { recursive: true });
  await writeFile(dataFile, JSON.stringify(db, null, 2));
};

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ message: "Furna backend is running" });
});

app.post("/api/auth/login", (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");

  if (!email || password.length < 8) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const user = {
    email,
    name: email.split("@")[0] || "Furna Admin",
    role: "admin",
  };
  const token = jwt.sign(user, process.env.JWT_SECRET || "furna-dev-secret", {
    expiresIn: "7d",
  });

  return res.json({ user, token });
});

app.get("/api/banners", (req, res) => {
  res.json(db.banners);
});

app.post("/api/banners", async (req, res) => {
  const title = String(req.body.title || "").trim();
  const branch = String(req.body.branch || "").trim();

  if (!title || !branch) {
    return res.status(400).json({ message: "Title and branch are required." });
  }

  const banner = {
    bannerId: nextId(
      "BNR",
      db.banners.map((item) => item.bannerId),
    ),
    banner: String(req.body.banner || "").trim() || defaultImage,
    title,
    branch,
    status: req.body.status === "Inactive" ? "Inactive" : "Active",
  };

  db.banners = normalizeBanners([...db.banners, banner]);
  await saveData();
  return res.status(201).json(banner);
});

app.patch("/api/banners/:bannerId/status", async (req, res) => {
  let updatedBanner = null;

  db.banners = normalizeBanners(
    db.banners.map((banner) => {
      if (banner.bannerId !== req.params.bannerId) {
        return banner;
      }

      updatedBanner = {
        ...banner,
        status: banner.status === "Active" ? "Inactive" : "Active",
      };
      return updatedBanner;
    }),
  );

  if (!updatedBanner) {
    return res.status(404).json({ message: "Banner not found." });
  }

  await saveData();
  return res.json(updatedBanner);
});

app.get("/api/categories", (req, res) => {
  res.json(db.categories);
});

app.post("/api/categories", async (req, res) => {
  const categoryName = String(req.body.categoryName || "").trim();

  if (!categoryName) {
    return res.status(400).json({ message: "Category name is required." });
  }

  const category = {
    categoryId: nextId(
      "CAT",
      db.categories.map((item) => item.categoryId),
    ),
    categoryName,
    status: req.body.status || "Active",
    updatedAt: todayLabel(),
    products: [],
  };

  db.categories = normalizeCategories([...db.categories, category]);
  await saveData();
  return res.status(201).json(category);
});

app.post("/api/categories/:categoryId/products", async (req, res) => {
  const productName = String(req.body.productName || "").trim();
  const typeOfProduct = String(req.body.typeOfProduct || "").trim();

  if (!productName || !typeOfProduct) {
    return res
      .status(400)
      .json({ message: "Product name and product type are required." });
  }

  let createdProduct = null;
  const existingProductIds = db.categories.flatMap((category) =>
    category.products.map((product) => product.productId),
  );

  db.categories = normalizeCategories(
    db.categories.map((category) => {
      if (category.categoryId !== req.params.categoryId) {
        return category;
      }

      const productId = nextId("PRD", existingProductIds);
      const price = Number(req.body.price) || 0;
      const stock = Number(req.body.stock) || 0;

      createdProduct = {
        productId,
        productName,
        image: String(req.body.image || "").trim() || defaultImage,
        price,
        stock,
        productTypes: [
          {
            productId: `${productId}-01`,
            productName,
            typeOfProduct,
            brand: String(req.body.brand || "").trim() || "Furna Living",
            price,
            discount: String(req.body.discount || "").trim() || "0%",
            warranty: String(req.body.warranty || "").trim() || "1 Year",
          },
        ],
      };

      return {
        ...category,
        updatedAt: todayLabel(),
        products: [...category.products, createdProduct],
      };
    }),
  );

  if (!createdProduct) {
    return res.status(404).json({ message: "Category not found." });
  }

  await saveData();
  return res.status(201).json(createdProduct);
});

app.post(
  "/api/categories/:categoryId/products/:productId/types",
  async (req, res) => {
    const typeOfProduct = String(req.body.typeOfProduct || "").trim();

    if (!typeOfProduct) {
      return res.status(400).json({ message: "Product type is required." });
    }

    let createdType = null;

    db.categories = normalizeCategories(
      db.categories.map((category) => {
        if (category.categoryId !== req.params.categoryId) {
          return category;
        }

        return {
          ...category,
          updatedAt: todayLabel(),
          products: category.products.map((product) => {
            if (product.productId !== req.params.productId) {
              return product;
            }

            createdType = {
              productId: `${product.productId}-${String(
                product.productTypes.length + 1,
              ).padStart(2, "0")}`,
              productName: product.productName,
              typeOfProduct,
              brand: String(req.body.brand || "").trim() || "Furna Living",
              price: Number(req.body.price) || 0,
              discount: String(req.body.discount || "").trim() || "0%",
              warranty: String(req.body.warranty || "").trim() || "1 Year",
            };

            return {
              ...product,
              productTypes: [...product.productTypes, createdType],
            };
          }),
        };
      }),
    );

    if (!createdType) {
      return res.status(404).json({ message: "Product not found." });
    }

    await saveData();
    return res.status(201).json(createdType);
  },
);

app.get("/api/orders", (req, res) => {
  res.json(db.orders);
});

app.patch("/api/orders/:orderId/delivered", async (req, res) => {
  let updatedOrder = null;

  db.orders = normalizeRows(
    db.orders.map((order) => {
      if (order.orderId !== req.params.orderId) {
        return order;
      }

      updatedOrder = { ...order, status: "Delivered" };
      return updatedOrder;
    }),
  );

  if (!updatedOrder) {
    return res.status(404).json({ message: "Order not found." });
  }

  await saveData();
  return res.json(updatedOrder);
});

app.get("/api/payments", (req, res) => {
  res.json(db.payments);
});

app.patch("/api/payments/:productId/paid", async (req, res) => {
  let updatedPayment = null;

  db.payments = normalizeRows(
    db.payments.map((payment) => {
      if (payment.productId !== req.params.productId) {
        return payment;
      }

      updatedPayment = { ...payment, paymentStatus: "Paid", pendingAmount: 0 };
      return updatedPayment;
    }),
  );

  if (!updatedPayment) {
    return res.status(404).json({ message: "Payment not found." });
  }

  await saveData();
  return res.json(updatedPayment);
});

app.patch("/api/payments/:productId/pending", async (req, res) => {
  let updatedPayment = null;

  db.payments = normalizeRows(
    db.payments.map((payment) => {
      if (payment.productId !== req.params.productId) {
        return payment;
      }

      updatedPayment = {
        ...payment,
        paymentStatus: "Pending",
        pendingAmount: payment.totalAmount,
      };
      return updatedPayment;
    }),
  );

  if (!updatedPayment) {
    return res.status(404).json({ message: "Payment not found." });
  }

  await saveData();
  return res.json(updatedPayment);
});

app.get("/api/cashback", (req, res) => {
  const cashbackRows = db.orders.map((order, index) => {
    const payment = db.payments[index] ?? {};

    return {
      srNo: index + 1,
      userId: `USR-${String(index + 1).padStart(4, "0")}`,
      username: order.personName,
      product: order.productName,
      productPrice: payment.amount ?? 0,
      discount: payment.discount ?? 0,
    };
  });

  res.json(cashbackRows);
});

app.get("/api/dashboard", (req, res) => {
  res.json({
    totalProducts: db.categories.reduce(
      (total, category) => total + category.products.length,
      0,
    ),
    activeOrders: db.orders.filter((order) => order.status !== "Delivered")
      .length,
    customers: db.orders.length,
  });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

await loadData();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
