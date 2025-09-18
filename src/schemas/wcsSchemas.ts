import * as z from "zod";

export interface Attribute {
  name: string;
  usage: AttributeUsage;
  value: string;
}

export const AttributeUsageEnum = z.enum(["defining", "descriptive"]);
export type AttributeUsage = z.infer<typeof AttributeUsageEnum>;

export interface ProductAttributesPayload {
  attributes: Attribute[];
}

export const WcsAttributeSchema = z.object({
  attributeName: z.string().nonempty(),
  usage: AttributeUsageEnum,
  value: z.string().nonempty(),
});

export const WcsAttributeListSchema = z.object({
  data: z.array(WcsAttributeSchema).optional(),
  message: z.string().nonempty(),
  status: z.string().nonempty(),
});

export type WcsAttribute = z.infer<typeof WcsAttributeSchema>;
export type WcsAttributeList = z.infer<typeof WcsAttributeListSchema>;
