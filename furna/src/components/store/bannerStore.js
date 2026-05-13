import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiRequest } from "../../api/api";
import backgroundBanner from "../../assets/background.jpeg";
import heroBanner from "../../assets/hero.png";
import storeBanner from "../../assets/banner_image.jpeg";

const defaultBannerImage = storeBanner;

const bannerRows = [
  [storeBanner, "Summer Furniture Sale", "Ahmedabad", "Active"],
  [heroBanner, "Premium Sofa Collection", "Surat", "Active"],
  [backgroundBanner, "Bedroom Makeover Week", "Vadodara", "Inactive"],
  [storeBanner, "Dining Festive Offers", "Rajkot", "Active"],
  [heroBanner, "Office Comfort Deals", "Mumbai", "Active"],
  [backgroundBanner, "Outdoor Living Specials", "Pune", "Inactive"],
  [storeBanner, "Storage Essentials", "Delhi", "Active"],
  [heroBanner, "Luxury Home Collection", "Bengaluru", "Active"],
  [backgroundBanner, "Compact Home Picks", "Hyderabad", "Inactive"],
  [storeBanner, "Weekend Recliner Deals", "Chennai", "Active"],
  [heroBanner, "Modern Decor Launch", "Jaipur", "Active"],
  [backgroundBanner, "Mattress Upgrade Offer", "Kolkata", "Inactive"],
].map(([banner, title, branch, status], index) => ({
  srNo: index + 1,
  bannerId: `BNR-${String(index + 1).padStart(3, "0")}`,
  banner,
  title,
  branch,
  status,
}));

const normalizeBanners = (banners) =>
  banners.map((banner, index) => ({
    ...banner,
    srNo: index + 1,
    bannerId: banner.bannerId || `BNR-${String(index + 1).padStart(3, "0")}`,
  }));

const getNextBannerId = (banners) => {
  const nextNumber =
    banners.reduce((highest, banner) => {
      const value = Number(String(banner.bannerId).replace("BNR-", ""));
      return Number.isNaN(value) ? highest : Math.max(highest, value);
    }, 0) + 1;

  return `BNR-${String(nextNumber).padStart(3, "0")}`;
};

export const useBannerStore = create(
  persist(
    (set) => ({
      banners: bannerRows,

      fetchBanners: async () => {
        const banners = await apiRequest("/banners");
        set({ banners: normalizeBanners(banners) });
      },

      addBanner: async ({ banner, title, branch, status }) => {
        try {
          const nextBanner = await apiRequest("/banners", {
            method: "POST",
            body: JSON.stringify({ banner, title, branch, status }),
          });

          set((state) => ({
            banners: normalizeBanners([...state.banners, nextBanner]),
          }));
        } catch {
          set((state) => {
            const nextBanner = {
              srNo: state.banners.length + 1,
              bannerId: getNextBannerId(state.banners),
              banner: banner.trim() || defaultBannerImage,
              title: title.trim(),
              branch: branch.trim(),
              status,
            };

            return {
              banners: normalizeBanners([...state.banners, nextBanner]),
            };
          });
        }
      },

      toggleBannerStatus: async (bannerId) => {
        try {
          const updatedBanner = await apiRequest(`/banners/${bannerId}/status`, {
            method: "PATCH",
          });

          set((state) => ({
            banners: state.banners.map((banner) =>
              banner.bannerId === bannerId ? updatedBanner : banner,
            ),
          }));
        } catch {
          set((state) => ({
            banners: state.banners.map((banner) =>
              banner.bannerId === bannerId
                ? {
                    ...banner,
                    status: banner.status === "Active" ? "Inactive" : "Active",
                  }
                : banner,
            ),
          }));
        }
      },
    }),
    {
      name: "furna-banner-data",
      version: 1,
      migrate: (persistedState) => ({
        ...persistedState,
        banners: normalizeBanners(persistedState.banners ?? bannerRows),
      }),
      partialize: (state) => ({
        banners: state.banners,
      }),
    },
  ),
);
