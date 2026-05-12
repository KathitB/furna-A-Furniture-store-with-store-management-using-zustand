import { useEffect, useState } from "react";
import furnitureLogo from "../assets/furniture-svgrepo-com.svg";
import styles from "./sidebar.module.scss";

const icons = {
  dashboard: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="2" fill="currentColor" />
      <rect x="14" y="3" width="7" height="7" rx="2" fill="currentColor" />
      <rect x="3" y="14" width="7" height="7" rx="2" fill="currentColor" />
      <rect x="14" y="14" width="7" height="7" rx="2" fill="currentColor" />
    </svg>
  ),
  sofa: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 11V8a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v3" stroke="currentColor" />
      <path
        d="M5 11h14a2 2 0 0 1 2 2v5H3v-5a2 2 0 0 1 2-2Z"
        stroke="currentColor"
      />
      <path d="M5 18v2M19 18v2" stroke="currentColor" strokeLinecap="round" />
    </svg>
  ),
  orders: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 7h14l-2 8H8L6 4H3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="20" r="1.5" stroke="currentColor" />
      <circle cx="18" cy="20" r="1.5" stroke="currentColor" />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="9" cy="8" r="3" stroke="currentColor" />
      <path
        d="M3.5 19a5.5 5.5 0 0 1 11 0"
        stroke="currentColor"
        strokeLinecap="round"
      />
      <path
        d="M16 11a3 3 0 0 1 3 3M17 5a3 3 0 0 1 0 6"
        stroke="currentColor"
        strokeLinecap="round"
      />
    </svg>
  ),
  category: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 6h7v7H4zM13 6h7v4h-7zM13 12h7v6h-7zM4 15h7v3H4z"
        stroke="currentColor"
        strokeLinejoin="round"
      />
    </svg>
  ),
  inventory: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9Z"
        stroke="currentColor"
        strokeLinejoin="round"
      />
      <path
        d="m4.5 8 7.5 4 7.5-4M12 12v8.5"
        stroke="currentColor"
        strokeLinecap="round"
      />
    </svg>
  ),
  promo: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 14V9l12-4v13L4 14Z"
        stroke="currentColor"
        strokeLinejoin="round"
      />
      <path
        d="M8 15.5 10 21M18 9h3M18 14h3"
        stroke="currentColor"
        strokeLinecap="round"
      />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 8.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Z"
        stroke="currentColor"
      />
      <path
        d="m19 13.5 1.5 1-2 3.5-1.7-.7a8 8 0 0 1-2 1.2L14.5 20h-5l-.3-1.5a8 8 0 0 1-2-1.2l-1.7.7-2-3.5 1.5-1a8 8 0 0 1 0-3L3.5 9.5l2-3.5 1.7.7a8 8 0 0 1 2-1.2L9.5 4h5l.3 1.5a8 8 0 0 1 2 1.2l1.7-.7 2 3.5-1.5 1a8 8 0 0 1 0 3Z"
        stroke="currentColor"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

const menuItems = [
  { label: "Dashboard", page: "dashboard", icon: icons.dashboard },
  { label: "Payment History", page: "payment-history", icon: icons.sofa },
  {
    label: "Orders",
    // page: "orders",
    icon: icons.orders,

    children: [
      { label: "Order List", page: "orders" },
      { label: "Cashback", page: "cashback" },
    ],
  },
  {
    label: "Admin Management",
    icon: icons.users,
    children: [
      { label: "Categories", page: "categories" },
      { label: "Banners", page: "banners" },
    ],
  },
  //   { label: "Inventory", icon: icons.inventory, expandable: true },
  //   { label: "Promotions", icon: icons.promo, expandable: true },
  //   { label: "Settings", icon: icons.settings, expandable: true },
];

export default function SideBar({ activePage, onNavigate, onLogout }) {
  const [expandedItems, setExpandedItems] = useState({
    Orders: false,
    Master: false,
  });

  useEffect(() => {
    const activeGroup = menuItems.find((item) =>
      item.children?.some((child) => child.page === activePage),
    );

    if (activeGroup) {
      setExpandedItems((prev) => ({
        ...prev,
        [activeGroup.label]: true,
      }));
    }
  }, [activePage]);

  const toggleMenu = (label) => {
    setExpandedItems((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <aside className={styles.sidebar} aria-label="Dashboard navigation">
      <div className={styles.brand}>
        <img className={styles.brandMark} src={furnitureLogo} alt="Furna" />
        <div className={styles.brandText}>
          <span className={styles.brandName}>Furna</span>
        </div>
      </div>

      <nav className={styles.nav}>
        {menuItems.map((item) => {
          const hasChildren = item.children?.length > 0;
          const isExpanded = Boolean(expandedItems[item.label]);

          return (
            <div key={item.label} className={styles.navGroup}>
              <button
                type="button"
                className={`${styles.navItem} ${
                  item.page === activePage ? styles.active : ""
                }`}
                onClick={() => {
                  if (item.page) {
                    onNavigate(item.page);
                  }

                  if (hasChildren) {
                    toggleMenu(item.label);
                  }
                }}
                aria-expanded={hasChildren ? isExpanded : undefined}
              >
                {item.icon}
                <span>{item.label}</span>
                {(hasChildren || item.expandable) && (
                  <span
                    className={`${styles.chevron} ${isExpanded ? styles.chevronOpen : ""}`}
                  />
                )}
              </button>

              {hasChildren && isExpanded && (
                <div className={styles.subMenu}>
                  {item.children.map((child) => (
                    <button
                      key={child.page}
                      type="button"
                      className={`${styles.subItem} ${
                        child.page === activePage ? styles.subItemActive : ""
                      }`}
                      onClick={() => onNavigate(child.page)}
                    >
                      {child.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <button type="button" className={styles.logout} onClick={onLogout}>
        Logout
      </button>
    </aside>
  );
}
