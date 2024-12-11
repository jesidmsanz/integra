import { HelloRamirez, ImagePath, ViewProfile } from "@/Constant/constant";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Card, CardBody, Col } from "reactstrap";

export default function WelcomeCard() {
  return (
    <Col xs="12" className="box-col-6 col-xl-50">
      <Card className="welcome-card">
        <CardBody>
          <div className="d-flex">
            <div className="flex-grow-1">
              <h1 className="m-0">{HelloRamirez}</h1>
              <p>{"Welcome back! Let's start from where you left."}</p>
              <Link className="btn" href="/users/user_profile">
                {ViewProfile}
              </Link>
            </div>
            <div className="flex-shrink-0">
              <Image
                priority
                width={164}
                height={161}
                src={`${ImagePath}/dashboard/welcome.png`}
                alt=""
              />
            </div>
          </div>
        </CardBody>
      </Card>
    </Col>
  );
}
