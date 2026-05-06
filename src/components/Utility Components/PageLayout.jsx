import { motion } from "framer-motion";

const PageLayout = ({ children }) => {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.3 } }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
    >
      {children}
    </motion.main>
  );
};

export default PageLayout;
