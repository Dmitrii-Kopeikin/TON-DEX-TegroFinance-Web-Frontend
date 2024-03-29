import { useSelector } from "react-redux";
import { useGetAssetsQuery } from "../store/api/dexApiSlice";
import { selectSettings } from "../store/features/dexSlice";

export const useAssets = () => {
  const dexSettings = useSelector(selectSettings);

  const { data: assets } = useGetAssetsQuery({
    exclude_deprecated: dexSettings.excludeDeprecatedAssets,
    exclude_community: dexSettings.excludeCommunityAssets,
  }, {
    selectFromResult: ({data}) => ({data: data ?? null}),
  });

  return {
    assets,
  };
};
