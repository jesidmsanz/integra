import { Col, Table } from "reactstrap";
import CurrentCartTableBody from "./CurrentCartTableBody";
import CurrentCartTableFooter from "./CurrentCartTableFooter";
import CurrentCartTableHead from "./CurrentCartTableHead";
import { CurrentCartHeading } from "@/Constant/constant";

const CurrentCart = () => {
  return (
    <Col xl="4">
      <div className="shipping-info">
        <h5>{CurrentCartHeading}</h5>
        <div className="overflow-auto custom-scrollbar">
          <Table striped>
            <CurrentCartTableHead />
            <CurrentCartTableBody />
            <CurrentCartTableFooter />
          </Table>
        </div>
      </div>
    </Col>
  );
};

export default CurrentCart;
