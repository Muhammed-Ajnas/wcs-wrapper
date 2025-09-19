import { ProductAttributesPayload, WcsAttributeList } from "#schemas/wcsSchemas.js";

export const mapWcsToOrchestrator = (wcs: WcsAttributeList): ProductAttributesPayload => {
  return {
    attributes: (wcs.data ?? []).map((a) => ({ name: a.AttributeName, usage: a.Usage, value: a.Value })),
  };
};
