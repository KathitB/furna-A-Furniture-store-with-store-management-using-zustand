import { useMemo, useState } from "react";
import { useOrderPaymentStore } from "../store/orderPaymentStore";
import PageShell from "./PageShell";
import styles from "./PaymentHistory.module.scss";

const pageSizeOptions = [10, 20, 30];

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export default function PaymentHistory({ user }) {
  const paymentRows = useOrderPaymentStore((state) => state.paymentRows);
  const markPaymentPaid = useOrderPaymentStore(
    (state) => state.markPaymentPaid,
  );
  const markPaymentPending = useOrderPaymentStore(
    (state) => state.markPaymentPending,
  );
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(paymentRows.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const visibleRows = useMemo(
    () => paymentRows.slice(startIndex, startIndex + pageSize),
    [paymentRows, pageSize, startIndex],
  );

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setCurrentPage(1);
  };

  return (
    <div className={styles.paymentPage}>
      <PageShell
        kicker="Payment History"
        title="Track customer payments"
        userName={user?.name}
        stats={[
          ["Completed Payments", "86"],
          ["Pending Payments", "9"],
          ["Refunds", "3"],
        ]}
      />

      <section className={styles.tablePanel}>
        <div className={styles.tableToolbar}>
          <h2>Payment Records</h2>
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
                <th>Product ID</th>
                <th>Product Name</th>
                <th>Product Quantity</th>
                <th>Product Amount</th>
                <th>Discount</th>
                <th>Mode of Payment</th>
                <th>Total Amount</th>
                <th>Payment Status</th>
                <th>Pending Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row) => (
                <tr key={row.productId}>
                  <td>{row.srNo}</td>
                  <td>{row.productId}</td>
                  <td>{row.productName}</td>
                  <td>{row.quantity}</td>
                  <td>{formatCurrency(row.amount)}</td>
                  <td>{formatCurrency(row.discount)}</td>
                  <td>{row.paymentMode}</td>
                  <td>{formatCurrency(row.totalAmount)}</td>
                  <td>
                    <span
                      className={`${styles.status} ${
                        row.paymentStatus === "Paid" ? styles.statusPaid : ""
                      } ${
                        row.paymentStatus === "Partial"
                          ? styles.statusPartial
                          : ""
                      }`}
                    >
                      {row.paymentStatus}
                    </span>
                  </td>
                  <td>{formatCurrency(row.pendingAmount)}</td>
                  <td className={styles.actionstatus}>
                    <button
                      type="button"
                      className={styles.actionButton}
                      onClick={() => markPaymentPaid(row.productId)}
                      disabled={row.paymentStatus === "Paid"}
                    >
                      Mark Paid
                    </button>

                    <button
                      type="button"
                      className={styles.actionButton2}
                      onClick={() => markPaymentPending(row.productId)}
                      disabled={row.paymentStatus === "Pending"}
                    >
                      Mark Pending
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
            {Math.min(startIndex + pageSize, paymentRows.length)} of{" "}
            {paymentRows.length} entries
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
