import { useRef } from "react";
import { Form, InputGroup, Modal } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FixedSizeList } from "react-window";
import { useAssets } from "../../../../hooks/useAssets";
import { useBalances } from "../../../../hooks/useBalances";
import { useGetAllPoolsPairsQuery } from "../../../../store/api/dexApiSlice";
import { Asset, PoolPair } from "../../../../store/api/dexApiTypes";
import { AssetRow } from "../AssetRow";

export type TokenModalProps = {
  setCurrentAssetKey: (x: string) => void;
  otherCurrentAssetKey: string;
  setOtherAssetKey?: (x: string) => void;
  isFromModal?: boolean;
  modalId: string;
};

export function SelectAssetModal({
  setCurrentAssetKey,
  setOtherAssetKey,
  otherCurrentAssetKey,
  isFromModal = false,
  modalId,
}: TokenModalProps) {
  const { t } = useTranslation();

  const { register, watch, setValue } = useForm({ mode: "onChange" });

  const { data: poolsPairs } = useGetAllPoolsPairsQuery(undefined, {
    selectFromResult: ({ data }) => ({ data: data ?? null }),
  });

  const { assets } = useAssets();
  const balances = useBalances();

  const search = useRef("");
  search.current = watch("search", "value");

  const poolsPairsMap = new Map<string, Map<string, PoolPair>>();
  for (const poolPair of poolsPairs || []) {
    if (!poolsPairsMap.has(poolPair.token0_address)) {
      poolsPairsMap.set(poolPair.token0_address, new Map());
    }
    if (!poolsPairsMap.has(poolPair.token1_address)) {
      poolsPairsMap.set(poolPair.token1_address, new Map());
    }
    poolsPairsMap.get(poolPair.token0_address)?.set(poolPair.token1_address, poolPair);
    poolsPairsMap.get(poolPair.token1_address)?.set(poolPair.token0_address, poolPair);
  }

  const displayAssets: Asset[] = [];

  for (const asset_key in assets) {
    const asset = assets[asset_key];
    if (!isFromModal && asset.contract_address === otherCurrentAssetKey) {
      continue;
    }

    if (
      (isFromModal ||
        (poolsPairsMap.has(asset_key) && isFromModal) ||
        poolsPairsMap.get(asset_key)?.has(otherCurrentAssetKey)) &&
      (!search.current ||
        asset.display_name?.toLowerCase().includes(search.current.toLowerCase()) ||
        asset.symbol.toLowerCase().includes(search.current.toLowerCase()) ||
        asset.contract_address.toLowerCase().includes(search.current.toLowerCase()))
    ) {
      displayAssets.push(asset);
    }
  }

  displayAssets.sort((a, b) => {
    return a.symbol === "TON" ? -1 : b.symbol === "TON" ? 1 : a.symbol?.localeCompare(b.symbol);
  });

  const changeSelected = async (assetContractAddress: string) => {
    setCurrentAssetKey(assetContractAddress);
    setValue("search", "");
    if (
      isFromModal &&
      setOtherAssetKey &&
      !poolsPairsMap.get(assetContractAddress)?.has(otherCurrentAssetKey)
    ) {
      for (const asset of displayAssets) {
        if (
          poolsPairsMap.get(assetContractAddress)?.has(asset.contract_address) &&
          asset.contract_address !== assetContractAddress
        ) {
          setOtherAssetKey(asset.contract_address);
          break;
        }
      }
    }
  };

  const Row = ({ data, index, style }: any) => {
    return (
      <AssetRow
        style={style}
        key={index}
        asset={data[index]}
        changeSelected={changeSelected}
        balances={balances}
        register={register}
      />
    );
  };

  return (
    <div className="modal fade mobile-modal-bottom" id={modalId} tabIndex={-1} aria-hidden="true">
      <Modal.Dialog centered contentClassName="p-2">
        <Modal.Header data-bs-dismiss="modal" aria-label="Close" closeButton>
          <Modal.Title>{t("tokenSelect.selectToken")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <InputGroup className="mb-3">
              <InputGroup.Text className="text-muted px-2">
                <i className="fa-solid fa-magnifying-glass fa-lg" />
              </InputGroup.Text>
              <Form.Control
                type="search"
                className="form-control"
                placeholder={t("tokenSelect.searchPlaceholder")}
                autoComplete="off"
                {...register("search", {})}
              />
            </InputGroup>
            <div
              className="token-form__list overflow-auto"
              style={{ minHeight: "100px", maxHeight: "408px" }}
            >
              {assets ? (
                <FixedSizeList
                  className="overflow-auto"
                  height={400}
                  width="100%"
                  itemSize={60}
                  itemCount={displayAssets.length}
                  itemData={displayAssets}
                >
                  {Row}
                </FixedSizeList>
              ) : (
                <div className="d-flex justify-content-center align-items-center mt-auto mb-auto">
                  <Spinner className="m-auto" animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              )}
            </div>
          </Form>
        </Modal.Body>
      </Modal.Dialog>
    </div>
  );
}
