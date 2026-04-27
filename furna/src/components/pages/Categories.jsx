import { useMemo, useState } from "react";
import PageShell from "./PageShell";
import styles from "./Categories.module.scss";

const categoryRows = [
  ["CAT-001", "Living Room", 36, "Sofas, Recliners, TV Units", "Active", "12 Apr 2026"],
  ["CAT-002", "Bedroom", 28, "Beds, Wardrobes, Mattresses", "Active", "10 Apr 2026"],
  ["CAT-003", "Dining", 19, "Dining Tables, Chairs, Bar Stools", "Active", "08 Apr 2026"],
  ["CAT-004", "Office", 24, "Desks, Study Chairs, Bookshelves", "Active", "06 Apr 2026"],
  ["CAT-005", "Outdoor", 12, "Patio Sets, Benches, Swings", "Active", "04 Apr 2026"],
  ["CAT-006", "Storage", 31, "Cabinets, Shoe Racks, Sideboards", "Active", "02 Apr 2026"],
  ["CAT-007", "Decor", 17, "Shelves, Mirrors, Room Dividers", "Draft", "28 Mar 2026"],
  ["CAT-008", "Kids Furniture", 14, "Kids Desks, Bunk Beds, Toy Storage", "Active", "25 Mar 2026"],
  ["CAT-009", "Entryway", 9, "Console Tables, Benches, Coat Racks", "Inactive", "20 Mar 2026"],
  ["CAT-010", "Premium Collection", 22, "Luxury Sofas, Marble Sets, King Beds", "Active", "18 Mar 2026"],
  ["CAT-011", "Compact Homes", 16, "Foldable Chairs, Nesting Tables, Sofa Beds", "Active", "14 Mar 2026"],
  ["CAT-012", "Accessories", 11, "Headboards, Ottomans, Wall Shelves", "Draft", "11 Mar 2026"],
].map(([categoryId, categoryName, productCount, products, status, updatedAt], index) => ({
  srNo: index + 1,
  categoryId,
  categoryName,
  productCount,
  products,
  status,
  updatedAt,
}));

const pageSizeOptions = [10, 20, 30];

export default function Categories({ user }) {
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(categoryRows.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const visibleRows = useMemo(
    () => categoryRows.slice(startIndex, startIndex + pageSize),
    [pageSize, startIndex],
  );

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setCurrentPage(1);
  };

  return (
    <div className={styles.categoriesPage}>
      <PageShell
        kicker="Categories"
        title="Organize product categories"
        userName={user?.name}
        stats={[
          ["Total Categories", categoryRows.length],
          ["Active Categories", "9"],
          ["Total Products", "239"],
        ]}
      />

      <section className={styles.tablePanel}>
        <div className={styles.tableToolbar}>
          <h2>Category Records</h2>
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
                <th>Category ID</th>
                <th>Category Name</th>
                <th>Category Products</th>
                <th>Featured Products</th>
                <th>Status</th>
                <th>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row) => (
                <tr key={row.categoryId}>
                  <td>{row.srNo}</td>
                  <td>{row.categoryId}</td>
                  <td>{row.categoryName}</td>
                  <td>{row.productCount}</td>
                  <td>{row.products}</td>
                  <td>
                    <span className={styles.status}>{row.status}</span>
                  </td>
                  <td>{row.updatedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.paginationBar}>
          <span>
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + pageSize, categoryRows.length)} of{" "}
            {categoryRows.length} entries
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
