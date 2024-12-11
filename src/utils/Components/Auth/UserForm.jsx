import {
  EmailAddressLogIn,
  ForgotPassword,
  Href,
  Password,
  RememberPassword,
  SignIn,
  SignInToAccount,
} from "@/Constant/constant";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import imageOne from "/public/assets/images/logo/logo-1.svg";
import imageTwo from "/public/assets/images/logo/logo-1.svg";
import Image from "next/image";
import { signIn } from "next-auth/react";

export const UserForm = () => {
  const [show, setShow] = useState(false);
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const router = useRouter();

  const formSubmitHandle = async (e) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });
    if (!result.error) {
      router.push("/admin/empleados");
    }
  };

  return (
    <div>
      <div className="login-main">
        <div>
          <Link className="logo" href="/admin/dashboard">
            <Image
              priority
              width={120}
              height={38}
              className="img-fluid for-light"
              src={imageOne}
              alt="login page"
            />
            <Image
              priority
              width={120}
              height={38}
              className="img-fluid for-dark"
              src={imageTwo}
              alt="login page"
            />
          </Link>
        </div>
        <Form
          className="theme-form"
          onSubmit={(event) => formSubmitHandle(event)}
        >
          {/* <h4>{SignInToAccount}</h4>
          <p>Digite su usuario y contraseña para ingresar al administrador</p> */}
          <FormGroup>
            <Label className="col-form-label">{EmailAddressLogIn}</Label>
            <Input
              type="username"
              defaultValue={username}
              onChange={(event) => setUserName(event.target.value)}
              placeholder="Email"
            />
          </FormGroup>
          <FormGroup>
            <Label className="col-form-label">{Password}</Label>
            <div className="position-relative">
              <Input
                type={show ? "text" : "password"}
                defaultValue={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Contraseña"
              />
              <div className="show-hide" onClick={() => setShow(!show)}>
                <span className="show"> </span>
              </div>
            </div>
          </FormGroup>
          <FormGroup className="form-group mb-0">
            {/* <div className="checkbox p-0">
              <Input id="checkbox1" type="checkbox" />
              <Label className="text-muted" htmlFor="checkbox1">
                {RememberPassword}
              </Label>
            </div> */}
            <div className="text-end mt-3">
              <Button type="submit" color="primary" block>
                {SignIn}
              </Button>
            </div>
            {/* <Link className="link" href={Href}>
              {ForgotPassword}?
            </Link> */}
          </FormGroup>
        </Form>
      </div>
    </div>
  );
};
