import Handlebars from "handlebars";
import type { LineItem } from "../types/invoice";

const currencyFormatter = (locale: string, currency: string = 'USD') => {
  const formatter = new Intl.NumberFormat(locale, {
    // style: "currency",
    currency: currency,
  });

  return (value: number) => {
    return `${currency} ${formatter.format(value)}`
  };
};

export const setupHandlebars = () => {
  const format = currencyFormatter('en-US')

  Handlebars.registerHelper("formatCurrency", (value) => {
    return format(value);
  });
  Handlebars.registerHelper("multiply", (a, b) => {
    return (a * b).toFixed(2);
  });
  Handlebars.registerHelper("calculateTotal", (items: LineItem[]) => {
    const total = items.reduce((acc, item) => acc + item.quantity * item.price, 0);
    return format(total);
  });
  // Helper to preserve newlines in addresses
  Handlebars.registerHelper("breaklines", (text) => {
    text = Handlebars.Utils.escapeExpression(text);
    text = text.replace(/(\r\n|\n|\r)/gm, "<br>");
    return new Handlebars.SafeString(text);
  });
};
