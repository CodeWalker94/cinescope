import { Route, Routes } from "react-router-dom";

import App from "./App.jsx";
import PlanPage from "./components/Pick A Plan/PlanPage.jsx";
import SearchPage from "./Search Page/SearchPage.jsx";
import WatchList from "./WatchList/WatchList.jsx";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/plans" element={<PlanPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/watchlist" element={<WatchList />}/>
    </Routes>
  );
};

export default AppRouter;
