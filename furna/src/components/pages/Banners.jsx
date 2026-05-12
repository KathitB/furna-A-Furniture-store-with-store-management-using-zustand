import { useMemo, useState } from "react";
import backgroundBanner from "../../assets/background.jpeg";
import heroBanner from "../../assets/hero.png";
import storeBanner from "../../assets/banner_image.jpeg";
import PageShell from "./PageShell";
import styles from "./Banners.module.scss";

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
  // bannerId: `BNR-${String(index + 1).padStart(3, "0")}`,
  banner,
  title,
  branch,
  status,
}));

const pageSizeOptions = [10, 20, 30];

export default function Banners({ user }) {
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(bannerRows.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const visibleRows = useMemo(
    () => bannerRows.slice(startIndex, startIndex + pageSize),
    [pageSize, startIndex],
  );

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setCurrentPage(1);
  };

  return (
    <div className={styles.bannersPage}>
      <PageShell
        kicker="Banners"
        title="Manage store banners"
        userName={user?.name}
        stats={[
          ["Live Banners", "8"],
          ["Scheduled", "2"],
          ["Drafts", "2"],
        ]}
      />

      <section className={styles.tablePanel}>
        <div className={styles.tableToolbar}>
          <h2>Banner Records</h2>
          <label>
            Show
            <select value={pageSize} onChange={handlePageSizeChange}>
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            entries
          </label>
        </div>

        <div className={styles.tableScroll}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Sr. No</th>
                {/* <th>Banner ID</th> */}
                <th>Banner</th>
                <th>Title</th>
                <th>Branch</th>
                <th>Banner Status</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row) => (
                <tr key={row.bannerId}>
                  <td>{row.srNo}</td>
                  {/* <td>{row.bannerId}</td> */}
                  <td>
                    <img
                      className={styles.bannerImage}
                      src={row.banner}
                      alt={row.title}
                    />
                  </td>
                  <td>{row.title}</td>
                  <td>{row.branch}</td>
                  <td>
                    <span
                      className={`${styles.status} ${
                        row.status === "Inactive" ? styles.statusInactive : ""
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.paginationBar}>
          <span>
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + pageSize, bannerRows.length)} of{" "}
            {bannerRows.length} entries
          </span>

          <div className={styles.paginationActions}>
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <strong>
              {currentPage} / {totalPages}
            </strong>
            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) => Math.min(page + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
