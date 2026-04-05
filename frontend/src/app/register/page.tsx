import RegisterForm from "@/src/components/auth/RegisterForm";
import styles from "./page.module.css";

const Page = () => {
  return (
    <div className={styles.page}>
      <div className={styles.blob1} />
      <div className={styles.blob2} />
      <div className={styles.content}>
        <RegisterForm />
      </div>
    </div>
  );
};

export default Page;
