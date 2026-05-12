import { useMemo, useState } from "react";
import { useBannerStore } from "../store/bannerStore";
import PageShell from "./PageShell";
import styles from "./Banners.module.scss";

const pageSizeOptions = [10, 20, 30];

const bannerInitialValues = {
  banner: "",
  title: "",
  branch: "",
  status: "Active",
};

export default function Banners({ user }) {
  const bannerRows = useBannerStore((state) => state.banners);
  const addBanner = useBannerStore((state) => state.addBanner);
  const toggleBannerStatus = useBannerStore(
    (state) => state.toggleBannerStatus,
  );
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bannerForm, setBannerForm] = useState(bannerInitialValues);
  const totalPages = Math.ceil(bannerRows.length / pageSize);
  const activeBanners = bannerRows.filter(
    (banner) => banner.status === "Active",
  ).length;
  const inactiveBanners = bannerRows.filter(
    (banner) => banner.status === "Inactive",
  ).length;
  const startIndex = (currentPage - 1) * pageSize;
  const visibleRows = useMemo(
    () => bannerRows.slice(startIndex, startIndex + pageSize),
    [bannerRows, pageSize, startIndex],
  );

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setCurrentPage(1);
  };

  const handleBannerFormChange = (event) => {
    const { name, value } = event.target;
    setBannerForm((form) => ({ ...form, [name]: value }));
  };

  const handleAddBanner = (event) => {
    event.preventDefault();

    if (!bannerForm.title.trim() || !bannerForm.branch.trim()) {
      return;
    }

    addBanner(bannerForm);
    setBannerForm(bannerInitialValues);
    setIsModalOpen(false);
  };

  return (
    <div className={styles.bannersPage}>
      <PageShell
        kicker="Banners"
        title="Manage store banners"
        userName={user?.name}
        stats={[
          ["Live Banners", activeBanners],
          ["Inactive", inactiveBanners],
          ["Total Banners", bannerRows.length],
        ]}
      />

      <section className={styles.tablePanel}>
        <div className={styles.tableToolbar}>
          <h2>Banner Records</h2>
          <div className={styles.toolbarActions}>
            <button type="button" onClick={() => setIsModalOpen(true)}>
              Add Banner
            </button>
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
        </div>

        <div className={styles.tableScroll}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Sr. No</th>
                <th>Banner ID</th>
                <th>Banner</th>
                <th>Title</th>
                <th>Branch</th>
                <th>Banner Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row) => (
                <tr key={row.bannerId}>
                  <td>{row.srNo}</td>
                  <td>{row.bannerId}</td>
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
                  <td>
                    <button
                      type="button"
                      className={styles.actionButton}
                      onClick={() => toggleBannerStatus(row.bannerId)}
                    >
                      Make {row.status === "Active" ? "Inactive" : "Active"}
                    </button>
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

      {isModalOpen && (
        <div className={styles.modalBackdrop} role="presentation">
          <div className={styles.modal} role="dialog" aria-modal="true">
            <form onSubmit={handleAddBanner}>
              <div className={styles.modalHeader}>
                <h2>Add Banner</h2>
                <button type="button" onClick={() => setIsModalOpen(false)}>
                  Close
                </button>
              </div>

              <label>
                Banner Image URL
                <input
                  name="banner"
                  value={bannerForm.banner}
                  onChange={handleBannerFormChange}
                  placeholder="Optional"
                />
              </label>

              <label>
                Title
                <input
                  name="title"
                  value={bannerForm.title}
                  onChange={handleBannerFormChange}
                  required
                />
              </label>

              <label>
                Branch
                <input
                  name="branch"
                  value={bannerForm.branch}
                  onChange={handleBannerFormChange}
                  required
                />
              </label>

              <label>
                Status
                <select
                  name="status"
                  value={bannerForm.status}
                  onChange={handleBannerFormChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </label>

              <div className={styles.modalActions}>
                <button type="button" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit">Create Banner</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
