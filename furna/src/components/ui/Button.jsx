import classNames from "./button.module.scss";

export default function Button({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  disabled = false,
  onClick,
}) {
  const classes = [
    classNames.button,
    classNames[variant],
    classNames[size],
    fullWidth ? classNames.fullWidth : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
