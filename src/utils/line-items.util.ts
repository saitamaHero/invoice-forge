import { nanoid } from "nanoid";
import type { LineItem } from "../types/invoice";


/**
 * LineItems options for creating a new LineItem.
 *
 * @export
 * @typedef {LineItemOptions}
 */
export type LineItemOptions = Partial<LineItem> & {
  idLength?: number;
};

const newLineItemDefaults: LineItemOptions = {
  description: "",
  quantity: 1,
  price: 0,
  idLength: 8,
};


/**
 * Creates a new LineItem with default values, overridden by any provided options.
 *
 * @param {LineItemOptions} [options={}] 
 * @returns {LineItem} 
 */
export const newLineItem = (options: LineItemOptions = {}): LineItem => {
  const opts = { ...newLineItemDefaults, ...options };

  return {
    description: opts.description!,
    quantity: opts.quantity!,
    price: opts.price!,
    id: nanoid(opts.idLength!),
  };
};
