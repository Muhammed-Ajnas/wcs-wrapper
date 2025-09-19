import { ProductAttributesPayload, WcsAttributeList } from "#schemas/wcsSchemas.js";

export const mapWcsToOrchestrator = (wcs: WcsAttributeList): ProductAttributesPayload => {
  return {
    attributes: (wcs.data ?? []).map((a) => ({ name: a.attributeName, usage: a.usage, value: a.value })),
  };
};
