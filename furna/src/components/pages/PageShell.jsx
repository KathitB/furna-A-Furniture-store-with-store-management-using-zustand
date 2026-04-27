import styles from "./PageShell.module.scss";

export default function PageShell({ kicker, title, userName, stats }) {
  return (
    <div className={styles.appshell}>
      <div className={styles.header}>
        <div>
          <p className={styles.kicker}>{kicker}</p>
          <h1>{title}</h1>
        </div>
        <span className={styles.userBadge}>{userName || "Admin"}</span>
      </div>

      <div className={styles.statsGrid}>
        {stats.map(([label, value]) => (
          <article key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </article>
        ))}
      </div>
    </div>
  );
}
