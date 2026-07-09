/* eslint-disable react/prop-types */
import { moneyFromCents } from "../utils/money";

export function SavedCartSummary({ cart, currency = "USD" }) {
  return (
    <s-section heading="Summary">
      <s-stack direction="block" gap="base">
        <SummaryRow label="Subtotal" value={moneyFromCents(cart.subtotal, currency)} />
        <SummaryRow label="Total" value={moneyFromCents(cart.total, currency)} emphasized />
        <SummaryRow label="Created" value={new Date(cart.createdAt).toLocaleString()} />
        {/* <SummaryRow label="Recovered order" value={cart.recoveredOrderId || "-"} /> */}
      </s-stack>
    </s-section>
  );
}

function SummaryRow({ label, value, emphasized = false }) {
  return (
    <s-stack direction="inline" justifyContent="space-between" gap="base">
      <s-text>{label}</s-text>
      <s-text>{emphasized ? <strong>{value}</strong> : value}</s-text>
    </s-stack>
  );
}



