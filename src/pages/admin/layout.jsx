import Footer from "@/Layout/Footer/Footer";
import Header from "@/Layout/Header/Header";
import TapTop from "@/Layout/Header/TapTop/TapTop";
import { SideBar } from "@/Layout/SideBar/SideBar";
import { useAppSelector } from "@/Redux/Hooks";
import Error404Container from "@/utils/Components/Other/Error/Error404";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RootLayout({ children }) {
  const { layout } = useAppSelector((state) => state.themeCustomizer);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (status && status === "authenticated") setAuthorized(true);
  }, [status]);

  return (
    <>
      {!authorized ? (
        <Error404Container />
      ) : (
        <>
          {" "}
          <div className={`page-wrapper ${layout}`} id="pageWrapper">
            <Header />
            <div className="page-body-wrapper">
              <SideBar />
              <div className="page-body">{children}</div>
              <Footer />
            </div>
          </div>
          {/* <ThemeCustomizer /> */}
          <ToastContainer />
          <TapTop />
        </>
      )}
    </>
  );
}
