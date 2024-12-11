"use client";
import { Error4 } from "@/Data/Pages/PagesSvgIcons";
import { useRouter } from "next/navigation";
import { Button, Col, Container } from "reactstrap";

const Error404Container = () => {
  const BackToHomePage = "BACK TO HOME PAGE";
  const router = useRouter();

  return (
    <div className="page-wrapper compact-wrapper" id="pageWrapper">
      <div className="error-wrapper">
        <Container>
          <div className="svg-wrraper">
            <Error4 />
          </div>
          <Col md="8" className="offset-md-2">
            <h3>Página no encontrada</h3>
            <p className="sub-content">
              {
                "Parece que estás intentando acceder a una página que no está disponible. Esto puede deberse a que no has iniciado sesión o que la página ha sido movida o no existe."
              }
            </p>
            <Button
              tag="a"
              color="primary"
              onClick={() => router.push("/auth/login")}
            >
              Haz clic aquí para iniciar sesión
            </Button>
          </Col>
        </Container>
      </div>
    </div>
  );
};

export default Error404Container;
