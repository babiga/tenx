export type ServiceRoute = "corporate" | "private" | "wedding" | "vip";

export type StaticService = {
  key: "corporate" | "private" | "weddings" | "vip";
  route: ServiceRoute;
  image: string;
  seedTier: {
    description: string;
    pricePerGuest: number;
    features: string[];
    isVIP: boolean;
    sortOrder: number;
  };
};

export const staticServiceData: StaticService[] = [
  {
    key: "corporate",
    route: "corporate",
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2070&auto=format&fit=crop",
    seedTier: {
      description: "Reliable full-service catering for corporate functions.",
      pricePerGuest: 95000,
      features: ["2 appetizers", "1 main course", "Standard service staff"],
      isVIP: false,
      sortOrder: 1,
    },
  },
  {
    key: "private",
    route: "private",
    image: "https://images.unsplash.com/photo-1530062845289-9109b2c9c868?q=80&w=2072&auto=format&fit=crop",
    seedTier: {
      description: "Tailored private-event dining with elevated presentation.",
      pricePerGuest: 145000,
      features: ["3 appetizers", "2 mains", "Dessert", "Dedicated supervisor"],
      isVIP: false,
      sortOrder: 2,
    },
  },
  {
    key: "weddings",
    route: "wedding",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop",
    seedTier: {
      description: "Wedding-focused service designed around ceremony flow.",
      pricePerGuest: 165000,
      features: ["Welcome drinks", "3 appetizers", "2 mains", "Dessert table"],
      isVIP: false,
      sortOrder: 3,
    },
  },
  {
    key: "vip",
    route: "vip",
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2074&auto=format&fit=crop",
    seedTier: {
      description: "VIP experience with chef-led custom menu.",
      pricePerGuest: 185000,
      features: [
        "Welcome drinks",
        "4 appetizers",
        "2 mains",
        "Premium dessert table",
        "Chef on-site",
      ],
      isVIP: true,
      sortOrder: 4,
    },
  },
];
