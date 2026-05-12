import { create } from "zustand";
import { persist } from "zustand/middleware";

const productImages = {
  sofas:
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80",
  recliners:
    "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=900&q=80",
  tvUnits:
    "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&w=900&q=80",
  beds:
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
  wardrobes:
    "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=80",
  mattresses:
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=900&q=80",
  diningTables:
    "https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=900&q=80",
  chairs:
    "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=900&q=80",
  barStools:
    "https://images.unsplash.com/photo-1519947486511-46149fa0a254?auto=format&fit=crop&w=900&q=80",
  desks:
    "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=900&q=80",
  storage:
    "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=900&q=80",
  decor:
    "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=80",
};

const defaultProductImage =
  "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=80";

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

const normalizeProductTypes = (product) => ({
  ...product,
  productTypes: (product.productTypes ?? []).map((type, index) => {
    if (typeof type === "string") {
      return makeProductType(
        product.productId,
        product.productName,
        type,
        product.price,
        index,
      );
    }

    return type;
  }),
});

const normalizeCategories = (categoryRows) =>
  categoryRows.map((category, index) => {
    const products = category.products.map(normalizeProductTypes);

    return {
      ...category,
      products,
      srNo: index + 1,
      productCount: products.reduce((total, product) => total + product.stock, 0),
      productNames: products.map((product) => product.productName),
    };
  });

const getTodayLabel = () =>
  new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date());

const getNextId = (prefix, ids) => {
  const nextNumber =
    ids.reduce((highest, id) => {
      const value = Number(String(id).replace(`${prefix}-`, ""));
      return Number.isNaN(value) ? highest : Math.max(highest, value);
    }, 0) + 1;

  return `${prefix}-${String(nextNumber).padStart(3, "0")}`;
};

const normalizePrice = (price) => Number(price) || 0;
const normalizeStock = (stock) => Number(stock) || 0;

const categories = [
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
      makeProduct("PRD-003", "TV Units", productImages.tvUnits, 29999, 12, [
        "Wall Mounted Unit",
        "Floor Console",
        "Storage TV Cabinet",
      ]),
    ],
  },
  {
    categoryId: "CAT-002",
    categoryName: "Bedroom",
    status: "Active",
    updatedAt: "10 Apr 2026",
    products: [
      makeProduct("PRD-004", "Beds", productImages.beds, 55999, 16, [
        "Queen Storage Bed",
        "King Hydraulic Bed",
        "Platform Bed",
      ]),
      makeProduct("PRD-005", "Wardrobes", productImages.wardrobes, 61999, 11, [
        "Two Door Wardrobe",
        "Sliding Wardrobe",
        "Four Door Wardrobe",
      ]),
      makeProduct("PRD-006", "Mattresses", productImages.mattresses, 27999, 22, [
        "Memory Foam",
        "Orthopedic",
        "Pocket Spring",
      ]),
    ],
  },
  {
    categoryId: "CAT-003",
    categoryName: "Dining",
    status: "Active",
    updatedAt: "08 Apr 2026",
    products: [
      makeProduct("PRD-007", "Dining Tables", productImages.diningTables, 24999, 8, [
        "Four Seater Table",
        "Six Seater Table",
        "Marble Dining Set",
      ]),
      makeProduct("PRD-008", "Chairs", productImages.chairs, 6999, 28, [
        "Upholstered Chair",
        "Wooden Chair",
        "Foldable Dining Chair",
      ]),
      makeProduct("PRD-009", "Bar Stools", productImages.barStools, 4999, 20, [
        "Low Back Stool",
        "Adjustable Stool",
        "Kitchen Bar Stool",
      ]),
    ],
  },
  {
    categoryId: "CAT-004",
    categoryName: "Office",
    status: "Active",
    updatedAt: "06 Apr 2026",
    products: [
      makeProduct("PRD-010", "Desks", productImages.desks, 36999, 10, [
        "Executive Office Desk",
        "Study Desk",
        "Compact Work Desk",
      ]),
      makeProduct("PRD-011", "Study Chairs", productImages.chairs, 7999, 17, [
        "Ergo Study Chair",
        "Mesh Chair",
        "Task Chair",
      ]),
      makeProduct("PRD-012", "Bookshelves", productImages.storage, 18999, 14, [
        "Open Bookshelf",
        "Ladder Shelf",
        "Teak Bookshelf",
      ]),
    ],
  },
  {
    categoryId: "CAT-005",
    categoryName: "Outdoor",
    status: "Active",
    updatedAt: "04 Apr 2026",
    products: [
      makeProduct("PRD-013", "Patio Sets", productImages.diningTables, 45999, 6, [
        "Outdoor Patio Set",
        "Balcony Table Set",
        "Garden Lounge Set",
      ]),
      makeProduct("PRD-014", "Benches", productImages.storage, 11999, 13, [
        "Entryway Bench",
        "Garden Bench",
        "Storage Bench",
      ]),
      makeProduct("PRD-015", "Swings", productImages.recliners, 14999, 7, [
        "Single Swing",
        "Double Swing",
        "Hanging Chair",
      ]),
    ],
  },
  {
    categoryId: "CAT-006",
    categoryName: "Storage",
    status: "Active",
    updatedAt: "02 Apr 2026",
    products: [
      makeProduct("PRD-016", "Cabinets", productImages.storage, 31998, 15, [
        "Modular Storage Cabinet",
        "Display Cabinet",
        "Utility Cabinet",
      ]),
      makeProduct("PRD-017", "Shoe Racks", productImages.storage, 3999, 26, [
        "Compact Shoe Rack",
        "Closed Shoe Cabinet",
        "Bench Shoe Rack",
      ]),
      makeProduct("PRD-018", "Sideboards", productImages.tvUnits, 32999, 9, [
        "Modern Sideboard",
        "Buffet Sideboard",
        "Console Sideboard",
      ]),
    ],
  },
  {
    categoryId: "CAT-007",
    categoryName: "Decor",
    status: "Draft",
    updatedAt: "28 Mar 2026",
    products: [
      makeProduct("PRD-019", "Shelves", productImages.decor, 2999, 24, [
        "Wall Mounted Shelf",
        "Floating Shelf",
        "Corner Shelf",
      ]),
      makeProduct("PRD-020", "Mirrors", productImages.decor, 8999, 12, [
        "Full Length Mirror",
        "Round Mirror",
        "Dresser Mirror",
      ]),
      makeProduct("PRD-021", "Room Dividers", productImages.decor, 16999, 5, [
        "Cane Room Divider",
        "Panel Divider",
        "Folding Divider",
      ]),
    ],
  },
  {
    categoryId: "CAT-008",
    categoryName: "Kids Furniture",
    status: "Active",
    updatedAt: "25 Mar 2026",
    products: [
      makeProduct("PRD-022", "Kids Desks", productImages.desks, 8999, 18, [
        "Kids Study Desk",
        "Activity Table",
        "Adjustable Desk",
      ]),
      makeProduct("PRD-023", "Bunk Beds", productImages.beds, 38999, 7, [
        "Twin Bunk Bed",
        "Storage Bunk Bed",
        "Loft Bed",
      ]),
      makeProduct("PRD-024", "Toy Storage", productImages.storage, 6999, 19, [
        "Toy Chest",
        "Storage Cubes",
        "Book and Toy Rack",
      ]),
    ],
  },
  {
    categoryId: "CAT-009",
    categoryName: "Entryway",
    status: "Inactive",
    updatedAt: "20 Mar 2026",
    products: [
      makeProduct("PRD-025", "Console Tables", productImages.tvUnits, 12999, 8, [
        "Glass Console Table",
        "Wooden Console",
        "Slim Entry Table",
      ]),
      makeProduct("PRD-026", "Benches", productImages.storage, 11999, 11, [
        "Entryway Bench",
        "Shoe Bench",
        "Cushioned Bench",
      ]),
      makeProduct("PRD-027", "Coat Racks", productImages.decor, 4999, 14, [
        "Standing Coat Rack",
        "Wall Hook Rack",
        "Hall Tree",
      ]),
    ],
  },
  {
    categoryId: "CAT-010",
    categoryName: "Premium Collection",
    status: "Active",
    updatedAt: "18 Mar 2026",
    products: [
      makeProduct("PRD-028", "Luxury Sofas", productImages.sofas, 89999, 4, [
        "Velvet Sectional",
        "Leather Sofa",
        "Premium Lounge Sofa",
      ]),
      makeProduct("PRD-029", "Marble Sets", productImages.diningTables, 78999, 5, [
        "Marble Dining Set",
        "Marble Coffee Set",
        "Marble Console Set",
      ]),
      makeProduct("PRD-030", "King Beds", productImages.beds, 68999, 6, [
        "King Hydraulic Bed",
        "Upholstered King Bed",
        "Panel King Bed",
      ]),
    ],
  },
  {
    categoryId: "CAT-011",
    categoryName: "Compact Homes",
    status: "Active",
    updatedAt: "14 Mar 2026",
    products: [
      makeProduct("PRD-031", "Foldable Chairs", productImages.chairs, 3499, 21, [
        "Foldable Dining Chair",
        "Outdoor Folding Chair",
        "Compact Study Chair",
      ]),
      makeProduct("PRD-032", "Nesting Tables", productImages.diningTables, 7999, 15, [
        "Minimal Nesting Table",
        "Round Nesting Table",
        "Two Piece Table Set",
      ]),
      makeProduct("PRD-033", "Sofa Beds", productImages.sofas, 39999, 9, [
        "Fabric Sofa Cum Bed",
        "Compact Sofa Bed",
        "Pull Out Sofa Bed",
      ]),
    ],
  },
  {
    categoryId: "CAT-012",
    categoryName: "Accessories",
    status: "Draft",
    updatedAt: "11 Mar 2026",
    products: [
      makeProduct("PRD-034", "Headboards", productImages.beds, 9999, 12, [
        "Panel Headboard",
        "Upholstered Headboard",
        "Wall Mounted Headboard",
      ]),
      makeProduct("PRD-035", "Ottomans", productImages.recliners, 6999, 18, [
        "Leather Ottoman",
        "Storage Ottoman",
        "Round Ottoman",
      ]),
      makeProduct("PRD-036", "Wall Shelves", productImages.decor, 2999, 25, [
        "Wall Mounted Shelf",
        "Box Shelf",
        "Display Shelf",
      ]),
    ],
  },
];

const categoryRows = normalizeCategories(categories);

export const useProductCategoriesStore = create(
  persist(
    (set) => ({
      categories: categoryRows,

      addCategory: ({ categoryName, status }) =>
        set((state) => {
          const nextCategory = {
            categoryId: getNextId(
              "CAT",
              state.categories.map((category) => category.categoryId),
            ),
            categoryName: categoryName.trim(),
            status,
            updatedAt: getTodayLabel(),
            products: [],
          };

          return {
            categories: normalizeCategories([...state.categories, nextCategory]),
          };
        }),

      addProduct: (categoryId, product) =>
        set((state) => ({
          categories: normalizeCategories(
            state.categories.map((category) => {
              if (category.categoryId !== categoryId) {
                return category;
              }

              const existingProductIds = state.categories.flatMap((row) =>
                row.products.map((item) => item.productId),
              );
              const productId = getNextId("PRD", existingProductIds);
              const price = normalizePrice(product.price);
              const stock = normalizeStock(product.stock);
              const productName = product.productName.trim();

              return {
                ...category,
                updatedAt: getTodayLabel(),
                products: [
                  ...category.products,
                  {
                    productId,
                    productName,
                    image: product.image.trim() || defaultProductImage,
                    price,
                    stock,
                    productTypes: [
                      {
                        productId: `${productId}-01`,
                        productName,
                        typeOfProduct: product.typeOfProduct.trim(),
                        brand: product.brand.trim() || "Furna Living",
                        price,
                        discount: product.discount.trim() || "0%",
                        warranty: product.warranty.trim() || "1 Year",
                      },
                    ],
                  },
                ],
              };
            }),
          ),
        })),

      addProductType: (categoryId, productId, productType) =>
        set((state) => ({
          categories: normalizeCategories(
            state.categories.map((category) => {
              if (category.categoryId !== categoryId) {
                return category;
              }

              return {
                ...category,
                updatedAt: getTodayLabel(),
                products: category.products.map((product) => {
                  if (product.productId !== productId) {
                    return product;
                  }

                  const typeId = `${product.productId}-${String(
                    product.productTypes.length + 1,
                  ).padStart(2, "0")}`;

                  return {
                    ...product,
                    productTypes: [
                      ...product.productTypes,
                      {
                        productId: typeId,
                        productName: product.productName,
                        typeOfProduct: productType.typeOfProduct.trim(),
                        brand: productType.brand.trim() || "Furna Living",
                        price: normalizePrice(productType.price),
                        discount: productType.discount.trim() || "0%",
                        warranty: productType.warranty.trim() || "1 Year",
                      },
                    ],
                  };
                }),
              };
            }),
          ),
        })),
    }),
    {
      name: "furna-product-categories-data",
      version: 2,
      migrate: (persistedState) => ({
        ...persistedState,
        categories: normalizeCategories(persistedState.categories ?? categories),
      }),
      partialize: (state) => ({
        categories: state.categories,
      }),
    },
  ),
);
