import React, { Fragment } from "react";
import {
  Container,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Row,
  Button,
} from "reactstrap";
import { toast } from "react-toastify";
import { useAppSelector } from "@/Redux/Hooks";
import ConfigDB from "@/Config/ThemeConfig";
import { PropsTypeProp } from "@/Types/ThemeCustomizerTypes";
import { Cancel, Configuration } from "@/Constant/constant";

const ConfigurationClass = ({ toggle, modal }) => {
  const { layout } = useAppSelector((state) => state.themeCustomizer);

  const handleThemeCopy = () => {
    toast.success("Code Copied to clipboard !", {
      position: "bottom-right",
      autoClose: 3000,
      closeOnClick: true,
      theme: "light",
    });
  };

  const configDB = ConfigDB.data;
  return (
    <Fragment>
      <Modal
        isOpen={modal}
        toggle={toggle}
        className="modal-body"
        centered={true}
      >
        <ModalHeader toggle={toggle}>{Configuration}</ModalHeader>
        <ModalBody>
          <Container fluid={true} className="bd-example-row">
            <Row>
              <p>
                {
                  "To replace our design with your desired theme. Please do configuration as mention"
                }{" "}
              </p>
              <p>
                {" "}
                <b> {"Path : src > config > ThemeConfig.ts "}</b>{" "}
              </p>
            </Row>
            <pre>
              <code>
                <div> {"export class ConfigDB "}&#123;</div>
                <div> {"static data"} = &#123;</div>
                <div> {"settings"}&#58; &#123;</div>
                <div>
                  {" "}
                  {"layout_type"}&#58; &apos;{configDB.settings.layout_type}
                  &apos;,
                </div>

                <div> {"sidebar"}&#58; &#123;</div>
                <div>
                  {" "}
                  {"type"}&#58; &apos;{layout}&apos;,
                </div>
                <div> &#125;,</div>
                <div> &#125;,</div>
                <div> {"color"}&#58; &#123;</div>
                <div>
                  {" "}
                  {"primary_color"}&#58; &apos;{configDB.color.primary_color}
                  &apos;,{" "}
                </div>
                <div>
                  {" "}
                  {"secondary_color"}&#58; &apos;
                  {configDB.color.secondary_color}&apos;,{" "}
                </div>
                <div>
                  {" "}
                  {"mix_background_layout"}&#58; &apos;
                  {configDB.color.mix_background_layout}&apos;,{" "}
                </div>
                <div> &#125;,</div>
                <div> &#125;</div>
                <div> &#125;</div>
              </code>
            </pre>
          </Container>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            {Cancel}
          </Button>
        </ModalFooter>
      </Modal>
    </Fragment>
  );
};

export default ConfigurationClass;
