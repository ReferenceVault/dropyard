// Mock data for frontend-only demo

export interface MockItem {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  condition: string;
  category: string;
  emoji: string;
  description: string;
  zone: string;
  distance: string;
  sellerName: string;
  addedAt: string;
  trending?: boolean;
  walkingDistance?: boolean;
  pickupSlots: string[];
  movingSale?: boolean;
  saleDate?: string;
}

export interface MockMovingSale {
  id: string;
  sellerName: string;
  zone: string;
  zoneName: string;
  saleDate: string;
  itemCount: number;
  items: MockItem[];
}

export const MOCK_ITEMS: MockItem[] = [
  {
    id: "i1",
    title: "Sectional Sofa",
    price: 450,
    originalPrice: 899,
    condition: "Excellent",
    category: "Furniture",
    emoji: "🛋️",
    description: "L-shaped sectional in great condition. Light grey fabric.",
    zone: "K1A",
    distance: "1 km",
    sellerName: "Jane D.",
    addedAt: "2h ago",
    trending: true,
    walkingDistance: true,
    pickupSlots: ["Sat 10am-12pm", "Sat 2pm-4pm", "Sun 10am-12pm"],
  },
  {
    id: "i2",
    title: "iPhone 13",
    price: 320,
    condition: "Like New",
    category: "Electronics",
    emoji: "📱",
    description: "128GB, midnight. Comes with case.",
    zone: "K1N",
    distance: "2 km",
    sellerName: "Mike T.",
    addedAt: "4h ago",
    trending: true,
    walkingDistance: true,
    pickupSlots: ["Sat 2pm-4pm", "Sun 2pm-4pm"],
  },
  {
    id: "i3",
    title: "Mountain Bike",
    price: 180,
    condition: "Good",
    category: "Sports",
    emoji: "🚲",
    description: "26\" Trek. Minor wear, rides great.",
    zone: "K1Z",
    distance: "5 km",
    sellerName: "Sarah M.",
    addedAt: "1d ago",
    walkingDistance: false,
    pickupSlots: ["Sun 10am-12pm", "Sun 2pm-4pm"],
  },
  {
    id: "i4",
    title: "Vintage Wooden Table",
    price: 120,
    condition: "Good",
    category: "Furniture",
    emoji: "🪑",
    description: "Solid oak dining table, seats 6.",
    zone: "K2P",
    distance: "1 km",
    sellerName: "Alex K.",
    addedAt: "30m ago",
    trending: true,
    walkingDistance: true,
    pickupSlots: ["Sat 10am-12pm", "Sat 2pm-4pm", "Sun 10am-12pm"],
  },
  {
    id: "i5",
    title: "Nintendo Switch",
    price: 250,
    originalPrice: 399,
    condition: "Excellent",
    category: "Electronics",
    emoji: "🎮",
    description: "OLED model with 3 games included.",
    zone: "K1H",
    distance: "5 km",
    sellerName: "Jordan L.",
    addedAt: "3h ago",
    trending: true,
    pickupSlots: ["Sat 2pm-4pm"],
  },
  {
    id: "i6",
    title: "Bookshelf",
    price: 45,
    condition: "Fair",
    category: "Furniture",
    emoji: "📚",
    description: "5-tier IKEA Kallax, white.",
    zone: "K1A",
    distance: "1 km",
    sellerName: "Chris R.",
    addedAt: "5m ago",
    walkingDistance: true,
    pickupSlots: ["Today 4pm-6pm", "Sat 10am-12pm"],
  },
  {
    id: "i7",
    title: "Queen Bed Frame",
    price: 150,
    condition: "Excellent",
    category: "Furniture",
    emoji: "🛏️",
    description: "Solid wood, no box spring needed.",
    zone: "K1A",
    distance: "1 km",
    sellerName: "The Patel Family",
    addedAt: "1d ago",
    movingSale: true,
    saleDate: "Mar 22-23",
    pickupSlots: ["Sat 9am-5pm", "Sun 9am-3pm"],
  },
  {
    id: "i8",
    title: "Dining Set (Table + 6 Chairs)",
    price: 350,
    originalPrice: 800,
    condition: "Good",
    category: "Furniture",
    emoji: "🍽️",
    description: "Cherry wood dining table with 6 upholstered chairs.",
    zone: "K2P",
    distance: "1 km",
    sellerName: "The Patel Family",
    addedAt: "1d ago",
    movingSale: true,
    saleDate: "Mar 22-23",
    trending: true,
    pickupSlots: ["Sat 9am-5pm", "Sun 9am-3pm"],
  },
];

export const MOCK_MOVING_SALES: MockMovingSale[] = [
  {
    id: "ms1",
    sellerName: "The Patel Family",
    zone: "K1A",
    zoneName: "Downtown Ottawa",
    saleDate: "Mar 22-23, 2025",
    itemCount: 24,
    items: [
      MOCK_ITEMS.find((i) => i.id === "i7")!,
      MOCK_ITEMS.find((i) => i.id === "i8")!,
    ],
  },
  {
    id: "ms2",
    sellerName: "Sarah & Tom",
    zone: "K1Z",
    zoneName: "Westboro",
    saleDate: "Mar 29-30, 2025",
    itemCount: 18,
    items: [
      { ...MOCK_ITEMS[2], movingSale: true, saleDate: "Mar 29-30" },
      { ...MOCK_ITEMS[3], movingSale: true, saleDate: "Mar 29-30" },
    ],
  },
];
