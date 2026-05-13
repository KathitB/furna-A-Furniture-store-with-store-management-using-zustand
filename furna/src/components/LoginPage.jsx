import { useState } from "react";
import styles from "./loginpage.module.scss";
import furnitureLogo from "../assets/furniture-svgrepo-com.svg";
import eyeOpen from "../assets/eye-open.svg";
import eyeClose from "../assets/eye-close.svg";
import { useAuthsStore } from "./store/authStore";

export default function LoginPage() {
  const loginWithCredentials = useAuthsStore(
    (state) => state.loginWithCredentials,
  );
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setMessage("");
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = {};
    const emailValue = form.email.trim();

    if (!emailValue) {
      nextErrors.email = "Please enter your email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!form.password.trim()) {
      nextErrors.password = "Please enter your password.";
    } else if (form.password.trim().length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setMessage("Please fix the highlighted fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      await loginWithCredentials(emailValue, form.password);
      setMessage("Welcome back to Furna.");
    } catch (error) {
      setMessage(error.message || "Unable to log in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <section className={styles.loginHero}>
        <div className={styles.brand}>
          {/* <img className={styles.brandMark} src={furnitureLogo} alt="Furna" /> */}
          <span className={styles.brandText}>Furna</span>
        </div>
        {/* <h1>Furna App</h1> */}
        <p>Design your home the way you want.</p>
      </section>

      <section className={styles.loginCard} aria-label="Login form">
        <div className={styles.cardIcon}>
          <img src={furnitureLogo} alt="Furna" />
        </div>
        <p className={styles.cardCopy}>Enter your login details below.</p>
        <form className={styles.loginForm} onSubmit={handleSubmit}>
          <label className={styles.field}>
            <span>
              Email <span className={styles.requiredStar}>*</span>
            </span>
            <input
              name="email"
              type="email"
              placeholder="Enter Email"
              value={form.email}
              onChange={handleChange}
              className={error.email ? styles.inputError : ""}
              required
            />
            {error.email && (
              <span className={styles.errorText}>{error.email}</span>
            )}
          </label>
          <label className={styles.field}>
            <span>
              Password <span className={styles.requiredStar}>*</span>
            </span>
            <div className={styles.passwordField}>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                value={form.password}
                onChange={handleChange}
                className={error.password ? styles.inputError : ""}
                required
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <img
                  src={showPassword ? eyeClose : eyeOpen}
                  alt=""
                  aria-hidden="true"
                />
              </button>
            </div>
            {error.password && (
              <span className={styles.errorText}>{error.password}</span>
            )}
          </label>
          {message && (
            <p
              className={
                error.email || error.password
                  ? styles.formError
                  : styles.formMessage
              }
            >
              {message}
            </p>
          )}
          <button
            type="submit"
            className={styles.loginButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Log in"}
          </button>
        </form>
      </section>
    </div>
  );
}
