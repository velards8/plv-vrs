import { Outlet } from "react-router-dom";
import TopNav from "../components/layout/TopNav";

export default function StudentLayout() {
  return (
    <>
      <TopNav />
      <main className="page"><Outlet /></main>
    </>
  );
}
