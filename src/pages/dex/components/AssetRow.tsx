import { Form } from "react-bootstrap";
import { Asset } from "../../../store/api/dexApiTypes";

export interface AssetRowProps {
  style: object;
  asset: Asset;
  changeSelected: any;
  balances: any;
  register: any;
}

export const AssetRow = ({
  style,
  asset,
  changeSelected,
  balances,
  register,
}: AssetRowProps) => {
  return (
    asset && (
      <Form.Label
        className={"d-flex align-items-center hover rounded-8 px-2 py-3"}
        data-bs-dismiss="modal"
        style={style}
      >
        <input
          type="checkbox"
          style={{ display: "none" }}
          {...register(asset.contract_address, {
            onChange: () => changeSelected(asset.contract_address),
          })}
        />
        <img
          loading="lazy"
          className="token-form__img rounded-circle"
          src={asset.image_url}
          width={40}
          height={40}
          alt={asset.symbol}
          onError={(e) =>
            (e.currentTarget.src =
              "/static/assets/images/token/default-token-image.png")
          }
        />
        <div className="ms-3 me-3 w-100">
          <div className="d-flex justify-content-between">
            <div className="token-form__symbol fw-500">
              {asset.symbol}{" "}
              <span className="text-muted">
                {asset.is_community && "Community"}
              </span>
            </div>
            <div>{balances[asset.contract_address]?.toString()}</div>
          </div>
          <div className="token-form__name fs-12 color-grey">
            <span
              className="long-text-hidden d-inline-block"
              style={{ maxWidth: "300px" }}
            >
              {asset.display_name}
            </span>{" "}
            <a
              href={"https://tonviewer.com/" + asset.contract_address}
              target="_blank"
              rel="noreferrer"
            >
              <i className="fa-solid fa-up-right-from-square ms-1"></i>
            </a>
          </div>
        </div>
        <i className="fa-solid fa-angle-right me-2 color-grey" />
      </Form.Label>
    )
  );
};
