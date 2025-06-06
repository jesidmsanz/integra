import { Button, Card, CardBody, Col, Input } from "reactstrap";
import {
  ClipboardOnTextAreas,
  Copy,
  Cut,
  CutCopyFromTextarea,
} from "@/Constant/constant";
import { useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { CommonCardHeader } from "@/Components/General/Widgets/Common/CommonCardHeader";

const ClipboardOnTextarea = () => {
  const clipBoardTextParagraph =
    "A web designer must always enhance their work since creating websites is a creative effort. Therefore, a web designer must be more imaginative to produce exceptional results. Blogs about web design assist web designers in learning about new technologies, offer lessons, news, direction for a freebie, and much more. These blogs allow web designers to stay creative and improve their abilities. Therefore, advice from web design blogs is required to improve your business.";
  const [clipBoardValues, setClipBoardValues] = useState({
    value: clipBoardTextParagraph,
    copied: false,
  });

  return (
    <Col sm="12" md="6">
      <Card>
        <CommonCardHeader title={ClipboardOnTextAreas} headClass="pb-0" />
        <CardBody>
          <div className="clipboaard-container">
            <p className="card-description">{CutCopyFromTextarea}</p>
            <Input
              type="textarea"
              className="custom-scrollbar"
              rows={1}
              spellCheck="false"
              value={clipBoardValues.value}
              onChange={({ target: { value } }) =>
                setClipBoardValues({ value, copied: false })
              }
            />
            <div className="mt-3 text-end">
              <CopyToClipboard
                text={clipBoardValues.value}
                onCopy={(value) => setClipBoardValues({ value, copied: true })}
              >
                <Button className="btn-clipboard me-2" color="warning">
                  <i className="fa fa-copy"></i> {Copy}
                </Button>
              </CopyToClipboard>
              <CopyToClipboard
                text={clipBoardValues.value}
                onCopy={() => setClipBoardValues({ copied: true, value: "" })}
              >
                <Button className="btn-clipboard-cut" color="success">
                  <i className="fa fa-cut"></i> {Cut}
                </Button>
              </CopyToClipboard>
            </div>
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};

export default ClipboardOnTextarea;
