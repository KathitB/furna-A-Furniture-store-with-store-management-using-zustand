import { create } from "zustand";
import { persist } from "zustand/middleware";

const paymentRows = [
  ["FRN-1001", "Oak Lounge Sofa", 1, 42999, 2500, "UPI"],
  ["FRN-1002", "Walnut Coffee Table", 2, 15998, 1200, "Credit Card"],
  ["FRN-1003", "Queen Storage Bed", 1, 55999, 4000, "Net Banking"],
  ["FRN-1004", "Ergo Study Chair", 3, 23997, 1800, "Debit Card"],
  ["FRN-1005", "Marble Dining Set", 1, 78999, 6500, "UPI"],
  ["FRN-1006", "Rattan Accent Chair", 2, 21998, 1500, "Cash"],
  ["FRN-1007", "Teak Bookshelf", 1, 18999, 1000, "Credit Card"],
  ["FRN-1008", "Velvet Recliner", 1, 34999, 2200, "UPI"],
  ["FRN-1009", "Glass Console Table", 1, 12999, 700, "Debit Card"],
  ["FRN-1010", "Four Door Wardrobe", 1, 61999, 5000, "Net Banking"],
  ["FRN-1011", "Fabric Sofa Cum Bed", 1, 39999, 3200, "Credit Card"],
  ["FRN-1012", "Round Dining Table", 1, 24999, 1600, "UPI"],
  ["FRN-1013", "Bedside Table Pair", 2, 11998, 900, "Cash"],
  ["FRN-1014", "Luxury TV Unit", 1, 29999, 2100, "Debit Card"],
  ["FRN-1015", "Compact Shoe Rack", 4, 15996, 1200, "UPI"],
  ["FRN-1016", "Rocking Chair", 1, 14999, 950, "Credit Card"],
  ["FRN-1017", "Outdoor Patio Set", 1, 45999, 3500, "Net Banking"],
  ["FRN-1018", "Kids Study Desk", 2, 17998, 1300, "UPI"],
  ["FRN-1019", "Premium Mattress", 1, 27999, 1900, "Debit Card"],
  ["FRN-1020", "Kitchen Bar Stool", 4, 19996, 1500, "Cash"],
  ["FRN-1021", "Leather Ottoman", 2, 13998, 800, "UPI"],
  ["FRN-1022", "Modern Sideboard", 1, 32999, 2600, "Credit Card"],
  ["FRN-1023", "Foldable Dining Chair", 6, 20994, 1400, "Debit Card"],
  ["FRN-1024", "Panel Headboard", 1, 9999, 500, "UPI"],
  ["FRN-1025", "L Shape Sectional", 1, 89999, 7500, "Net Banking"],
  ["FRN-1026", "Wall Mounted Shelf", 3, 8997, 600, "Cash"],
  ["FRN-1027", "Entryway Bench", 1, 11999, 750, "UPI"],
  ["FRN-1028", "Executive Office Desk", 1, 36999, 2800, "Credit Card"],
  ["FRN-1029", "Classic Armchair", 2, 25998, 1800, "Debit Card"],
  ["FRN-1030", "Minimal Nesting Table", 1, 7999, 400, "UPI"],
  ["FRN-1031", "King Hydraulic Bed", 1, 68999, 5500, "Net Banking"],
  ["FRN-1032", "Cane Room Divider", 1, 16999, 1000, "Cash"],
  ["FRN-1033", "Dresser With Mirror", 1, 22999, 1700, "Credit Card"],
  ["FRN-1034", "Modular Storage Cabinet", 2, 31998, 2400, "UPI"],
].map(
  (
    [productId, productName, quantity, amount, discount, paymentMode],
    index,
  ) => ({
    srNo: index + 1,
    productId,
    productName,
    quantity,
    amount,
    discount,
    paymentMode,
    totalAmount: amount - discount,
    paymentStatus:
      index % 7 === 0 ? "Pending" : index % 5 === 0 ? "Partial" : "Paid",
    pendingAmount:
      index % 7 === 0
        ? amount - discount
        : index % 5 === 0
          ? Math.round((amount - discount) * 0.4)
          : 0,
  }),
);

const orderRows = [
  ["ORD-5001", "Aarav Mehta", "Oak Lounge Sofa", "Home Delivery", "Pending"],
  [
    "ORD-5002",
    "Isha Sharma",
    "Walnut Coffee Table",
    "Store Pickup",
    "Delivered",
  ],
  [
    "ORD-5003",
    "Kabir Singh",
    "Queen Storage Bed",
    "Home Delivery",
    "In Transit",
  ],
  [
    "ORD-5004",
    "Meera Nair",
    "Ergo Study Chair",
    "Express Delivery",
    "Processing",
  ],
  [
    "ORD-5005",
    "Rohan Patel",
    "Marble Dining Set",
    "Home Delivery",
    "Delivered",
  ],
  [
    "ORD-5006",
    "Ananya Rao",
    "Rattan Accent Chair",
    "Store Pickup",
    "Cancelled",
  ],
  ["ORD-5007", "Vivaan Shah", "Teak Bookshelf", "Home Delivery", "Pending"],
  [
    "ORD-5008",
    "Tara Kapoor",
    "Velvet Recliner",
    "Express Delivery",
    "In Transit",
  ],
  [
    "ORD-5009",
    "Neil Verma",
    "Glass Console Table",
    "Home Delivery",
    "Delivered",
  ],
  [
    "ORD-5010",
    "Diya Menon",
    "Four Door Wardrobe",
    "Home Delivery",
    "Processing",
  ],
  [
    "ORD-5011",
    "Arjun Reddy",
    "Fabric Sofa Cum Bed",
    "Express Delivery",
    "Pending",
  ],
  [
    "ORD-5012",
    "Kiara Joshi",
    "Round Dining Table",
    "Store Pickup",
    "Delivered",
  ],
  [
    "ORD-5013",
    "Reyansh Das",
    "Bedside Table Pair",
    "Home Delivery",
    "In Transit",
  ],
  ["ORD-5014", "Saanvi Jain", "Luxury TV Unit", "Home Delivery", "Processing"],
  ["ORD-5015", "Aditya Bose", "Compact Shoe Rack", "Store Pickup", "Delivered"],
  ["ORD-5016", "Myra Iyer", "Rocking Chair", "Express Delivery", "Pending"],
  [
    "ORD-5017",
    "Krish Malhotra",
    "Outdoor Patio Set",
    "Home Delivery",
    "In Transit",
  ],
  [
    "ORD-5018",
    "Aanya Kulkarni",
    "Kids Study Desk",
    "Home Delivery",
    "Delivered",
  ],
  [
    "ORD-5019",
    "Yash Gupta",
    "Premium Mattress",
    "Express Delivery",
    "Processing",
  ],
  ["ORD-5020", "Sara Khan", "Kitchen Bar Stool", "Store Pickup", "Cancelled"],
  ["ORD-5021", "Dev Chawla", "Leather Ottoman", "Home Delivery", "Delivered"],
  ["ORD-5022", "Naina Roy", "Modern Sideboard", "Express Delivery", "Pending"],
  [
    "ORD-5023",
    "Om Prakash",
    "Foldable Dining Chair",
    "Home Delivery",
    "Processing",
  ],
  ["ORD-5024", "Avni Bhat", "Panel Headboard", "Store Pickup", "Delivered"],
  [
    "ORD-5025",
    "Aryan Sethi",
    "L Shape Sectional",
    "Home Delivery",
    "In Transit",
  ],
  ["ORD-5026", "Riya Thomas", "Wall Mounted Shelf", "Home Delivery", "Pending"],
  [
    "ORD-5027",
    "Mihir Saxena",
    "Entryway Bench",
    "Express Delivery",
    "Delivered",
  ],
  [
    "ORD-5028",
    "Leela Pillai",
    "Executive Office Desk",
    "Home Delivery",
    "Processing",
  ],
  ["ORD-5029", "Kunal Anand", "Classic Armchair", "Store Pickup", "Delivered"],
  [
    "ORD-5030",
    "Pihu Agarwal",
    "Minimal Nesting Table",
    "Home Delivery",
    "Cancelled",
  ],
].map(([orderId, personName, productName, deliveryMode, status], index) => ({
  srNo: index + 1,
  orderId,
  personName,
  productName,
  deliveryMode,
  status,
}));

export const useOrderPaymentStore = create(
  persist(
    (set) => ({
      paymentRows,
      orderRows,

      markPaymentPaid: (productId) =>
        set((state) => ({
          paymentRows: state.paymentRows.map((row) =>
            row.productId === productId
              ? {
                  ...row,
                  paymentStatus: "Paid",
                  pendingAmount: 0,
                }
              : row,
          ),
        })),

      markPaymentPending: (productId) =>
        set((state) => ({
          paymentRows: state.paymentRows.map((row) =>
            row.productId === productId
              ? {
                  ...row,
                  paymentStatus: "Pending",
                  pendingAmount: row.amount,
                }
              : row,
          ),
        })),

      markOrderDelivered: (orderId) =>
        set((state) => ({
          orderRows: state.orderRows.map((row) =>
            row.orderId === orderId
              ? {
                  ...row,
                  status: "Delivered",
                }
              : row,
          ),
        })),
    }),

    {
      name: "furna-order-payment-data",
      partialize: (state) => ({
        paymentRows: state.paymentRows,
        orderRows: state.orderRows,
      }),
    },
  ),
);
