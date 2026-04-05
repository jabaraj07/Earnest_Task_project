import LoginForm from "@/src/components/auth/LoginForm";
import styles from "./page.module.css";

const Page = () => {
  return (
    <div className={styles.page}>
      <div className={styles.blob1} />
      <div className={styles.blob2} />
      <div className={styles.content}>
        <LoginForm />
      </div>
    </div>
  );
};

export default Page;