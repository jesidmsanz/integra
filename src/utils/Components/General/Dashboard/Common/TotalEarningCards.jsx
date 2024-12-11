import React from "react";
import { Card, CardBody, Col, Row } from "reactstrap";
import Chart from "react-apexcharts";
import { TotalEarningCardsData } from "@/Data/General/Dashboard/DashboardData";
import { ThanLastWeek } from "@/Constant/constant";

export const TotalEarningCards = ({ colClass }) => {
  return (
    <Row>
      {TotalEarningCardsData.map((item) => (
        <Col xs="12" lg="12" className={`${colClass} box-col-12`} key={item.id}>
          <Card className="total-earning">
            <CardBody className={item.id === 2 ? "pb-0" : ""}>
              <Row>
                <Col sm="7" className="box-col-7">
                  <div className="d-flex">
                    <h3 className="font-primary">{item.title}</h3>
                  </div>
                  <h5>
                    {"$"}
                    {item.rate}
                  </h5>
                  <span>
                    {"+ "}
                    {item.lastWeek}
                    {"%"} {ThanLastWeek}
                  </span>
                </Col>
                <Col sm="5" className="box-col-5 p-0">
                  <div id="income-chart">
                    <Chart
                      type={item.chart.type}
                      options={item.chart}
                      series={item.chart.series}
                      height={100}
                    />
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      ))}
    </Row>
  );
};
