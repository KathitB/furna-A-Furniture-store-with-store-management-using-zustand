import { useMemo, useState } from "react";
import { useOrderPaymentStore } from "../store/orderPaymentStore";
import PageShell from "./PageShell";
import styles from "./Orders.module.scss";

const pageSizeOptions = [10, 20, 30];

export default function Orders({ user }) {
  const orderRows = useOrderPaymentStore((state) => state.orderRows);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(orderRows.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const visibleRows = useMemo(
    () => orderRows.slice(startIndex, startIndex + pageSize),
    [orderRows, pageSize, startIndex],
  );

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setCurrentPage(1);
  };

  return (
    <div className={styles.ordersPage}>
      <PageShell
        kicker="Orders"
        title="Manage furniture orders"
        userName={user?.name}
        stats={[
          ["New Orders", "18"],
          ["In Transit", "7"],
          ["Delivered", "42"],
        ]}
      />

      <section className={styles.tablePanel}>
        <div className={styles.tableToolbar}>
          <h2>Order Records</h2>
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
                <th>Order ID</th>
                <th>Order Person Name</th>
                <th>Order Product Name</th>
                <th>Mode of Delivery</th>
                <th>Order Status</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row) => (
                <tr key={row.orderId}>
                  <td>{row.srNo}</td>
                  <td>{row.orderId}</td>
                  <td>{row.personName}</td>
                  <td>{row.productName}</td>
                  <td>{row.deliveryMode}</td>
                  <td>
                    <span className={styles.status}>{row.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.paginationBar}>
          <span>
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + pageSize, orderRows.length)} of{" "}
            {orderRows.length} entries
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
