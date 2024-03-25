import { Button, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";

export function CheckModal(props: any) {
  const { t, i18n } = useTranslation();

  return (
    <Modal
      show={props.toggleShow}
      onHide={props.toggleClose}
      centered
      className="mobile-modal-bottom"
      contentClassName="p-2"
    >
      <Modal.Body className="text-center py-5">
        <i className="fa-light fa-circle-info fa-4x mb-4 color-blue" />
        <h2 className="card-title fs-24 fw-500 mb-2 position-relative">
          {t("checkModal.title")}
        </h2>
        <p className="color-grey fs-16 mb-0">{t("checkModal.desc")}</p>
        <Button
          variant="icon position-absolute top-0 end-0 m-1"
          onClick={props.toggleClose}
        >
          <i className="fa-solid fa-xmark" />
        </Button>
      </Modal.Body>
    </Modal>
  );
}
