import { useMemo, useState } from "react";
import { useOrderPaymentStore } from "../store/orderPaymentStore";
import PageShell from "./PageShell";
import styles from "./Cashback.module.scss";

const pageSizeOptions = [10, 20, 30];

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

export default function Cashback({ user }) {
  const paymentRows = useOrderPaymentStore((state) => state.paymentRows);
  const orderRows = useOrderPaymentStore((state) => state.orderRows);
  const cashbackRows = useMemo(
    () =>
      orderRows.map((order, index) => {
        const payment = paymentRows[index] ?? {};

        return {
          srNo: index + 1,
          userId: `USR-${String(index + 1).padStart(4, "0")}`,
          username: order.personName,
          product: order.productName,
          productPrice: payment.amount ?? 0,
          discount: payment.discount ?? 0,
        };
      }),
    [orderRows, paymentRows],
  );
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(cashbackRows.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const visibleRows = useMemo(
    () => cashbackRows.slice(startIndex, startIndex + pageSize),
    [cashbackRows, pageSize, startIndex],
  );

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setCurrentPage(1);
  };

  return (
    <div className={styles.cashbackPage}>
      <PageShell
        kicker="Cashback"
        title="Cashback rewards"
        userName={user?.name}
        stats={[
          ["Active Rewards", cashbackRows.length],
          ["Pending Approval", "5"],
          ["Total Paid", formatCurrency(42000)],
        ]}
      />

      <section className={styles.tablePanel}>
        <div className={styles.tableToolbar}>
          <h2>Cashback Records</h2>
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
                <th>User ID</th>
                <th>Username</th>
                <th>Product</th>
                <th>Product Price</th>
                <th>Discount Percentage</th>
                <th>CashBack</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row) => (
                <tr key={row.userId}>
                  <td>{row.srNo}</td>
                  <td>{row.userId}</td>
                  <td>{row.username}</td>
                  <td>{row.product}</td>
                  <td>{formatCurrency(row.productPrice)}</td>
                  {/* <td>{formatCurrency(row.discount)}</td> */}
                  {/* <td>{(row.discount / row.productPrice) * 100}</td> */}
                  <td>
                    {row.productPrice
                      ? ((row.discount / row.productPrice) * 100).toFixed(2) +
                        "%"
                      : "0.00%"}
                  </td>
                  <td>{formatCurrency(row.discount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.paginationBar}>
          <span>
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + pageSize, cashbackRows.length)} of{" "}
            {cashbackRows.length} entries
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
