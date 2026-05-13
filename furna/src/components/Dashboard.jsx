import { useEffect, useMemo, useState } from "react";
import Banners from "./pages/Banners";
import Cashback from "./pages/Cashback";
import Categories from "./pages/Categories";
import DashboardHome from "./pages/DashboardHome";
import Orders from "./pages/Orders";
import PaymentHistory from "./pages/PaymentHistory";
import SideBar from "./SideBar";
import styles from "./dashboard.module.scss";
import { useBannerStore } from "./store/bannerStore";
import { useOrderPaymentStore } from "./store/orderPaymentStore";
import { useProductCategoriesStore } from "./store/productCategoriesStore";

const pages = {
  dashboard: DashboardHome,
  "payment-history": PaymentHistory,
  orders: Orders,
  cashback: Cashback,
  categories: Categories,
  banners: Banners,
};

const pagePaths = {
  dashboard: "/dashboard",
  "payment-history": "/payment-history",
  orders: "/orders",
  cashback: "/cashback",
  categories: "/categories",
  banners: "/banners",
};

const getPageFromPath = () => {
  const page = window.location.pathname.split("/")[1] || "dashboard";
  return pages[page] ? page : "dashboard";
};

export default function Dashboard({ user, onLogout }) {
  const [activePage, setActivePage] = useState(getPageFromPath);
  const fetchBanners = useBannerStore((state) => state.fetchBanners);
  const fetchCategories = useProductCategoriesStore(
    (state) => state.fetchCategories,
  );
  const fetchOrderPayments = useOrderPaymentStore(
    (state) => state.fetchOrderPayments,
  );
  const ActivePage = useMemo(
    () => pages[activePage] ?? DashboardHome,
    [activePage],
  );

  useEffect(() => {
    Promise.allSettled([
      fetchBanners(),
      fetchCategories(),
      fetchOrderPayments(),
    ]);
  }, [fetchBanners, fetchCategories, fetchOrderPayments]);

  useEffect(() => {
    const handlePopState = () => {
      setActivePage(getPageFromPath());
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleNavigate = (page) => {
    const nextPage = pages[page] ? page : "dashboard";
    const nextPath = pagePaths[nextPage];

    setActivePage(nextPage);

    if (window.location.pathname !== nextPath) {
      window.history.pushState(null, "", nextPath);
    }
  };

  return (
    <main className={styles.dashboardPage}>
      <SideBar
        activePage={activePage}
        onNavigate={handleNavigate}
        onLogout={onLogout}
      />

      <section className={styles.content}>
        <ActivePage user={user} />
      </section>
    </main>
  );
}
