import Footer from "@/Layout/Footer/Footer";
import Header from "@/Layout/Header/Header";
import TapTop from "@/Layout/Header/TapTop/TapTop";
import { SideBar } from "@/Layout/SideBar/SideBar";
import { useAppSelector } from "@/Redux/Hooks";
import Error404Container from "@/utils/Components/Other/Error/Error404";
import { usePermissions } from "@/utils/hooks/usePermissions";
import { getRequiredPermissions } from "@/utils/constants/permissionsMap";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RootLayout({ children }) {
  const { layout } = useAppSelector((state) => state.themeCustomizer);
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { hasAnyPermission } = usePermissions();
  const [authorized, setAuthorized] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      setAuthorized(true);
      
      // Verificar permisos para la ruta actual (excepto dashboard)
      if (pathname && pathname !== "/admin/dashboard") {
        const requiredPermissions = getRequiredPermissions(pathname);
        
        // Si la ruta requiere permisos, verificar que el usuario los tenga
        if (requiredPermissions.length > 0) {
          const userHasAccess = hasAnyPermission(requiredPermissions);
          
          if (!userHasAccess) {
            // Redirigir al dashboard básico si no tiene permisos
            console.warn(`⚠️ Acceso denegado a ${pathname}. Redirigiendo al dashboard.`);
            router.push("/admin/dashboard");
            return;
          }
        }
      }
      
      setHasChecked(true);
    } else if (status === "unauthenticated") {
      setAuthorized(false);
      router.push("/auth/login");
    }
  }, [status, pathname, session, hasAnyPermission, router]);

  // Si no está autenticado, mostrar error 404
  if (!authorized) {
    return <Error404Container />;
  }

  // Esperar a que se verifique antes de renderizar
  if (!hasChecked && status === "authenticated") {
    return null; // O un spinner de carga
  }

  return (
    <>
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
  );
}
