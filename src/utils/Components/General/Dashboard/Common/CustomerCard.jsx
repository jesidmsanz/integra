import SVG from "@/CommonComponent/SVG/Svg";
import { SinceLastWeek } from "@/Constant/constant";
import React from "react";
import { Card, CardBody } from "reactstrap";

export const CustomerCard = ({ data }) => {
  return (
    <>
      {data.map((item) => (
        <div className={item.divClass} key={item.id}>
          <Card className="since">
            <CardBody className={item.bodyClass}>
              <div
                className={`customer-card d-flex b-l-${item.color} border-2`}
              >
                <div className="ms-3">
                  <h3 className="mt-1">{item.title}</h3>
                  <h5 className="mt-1">{item.rate}</h5>
                </div>
                <div className={`dashboard-user bg-light-${item.color}`}>
                  <span></span>
                  <SVG iconId={item.icon} />
                </div>
              </div>
              <div className="customer mt-2">
                <span className="me-1">
                  <SVG iconId={item.id === 3 ? "arrow-down" : "arrow-up"} />
                </span>
                <span
                  className={`font-${
                    item.id === 3 ? "danger" : "success"
                  } me-2`}
                >
                  {"+ "}
                  {item.percent}
                  {"%"}
                </span>
                <span>{SinceLastWeek}</span>
              </div>
            </CardBody>
          </Card>
        </div>
      ))}
    </>
  );
};
