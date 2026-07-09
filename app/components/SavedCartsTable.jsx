/* eslint-disable react/prop-types */
import { Link } from "react-router";
import { moneyFromCents } from "../utils/money";

export function SavedCartsTable({ carts, currency = "USD" }) {
  return (
    <s-section>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={thStyle}>Saved cart</th>
            <th style={thStyle}>Customer</th>
            <th style={thStyle}>Region</th>
            {/* <th style={thStyle}>Recovery status</th> */}
            <th style={{ ...thStyle, textAlign: "right" }}>Total</th>
            <th style={thStyle}>Created</th>
          </tr>
        </thead>
        <tbody>
          {carts.map((cart) => (
            <tr key={cart.id}>
              <td style={tdStyle}><Link to={`/app/saved-carts/${cart.token}`}>{cart.token}</Link></td>
              <td style={tdStyle}>{cart.customerName || cart.customerEmail || "-"}</td>
              <td style={tdStyle}>{cart.region || "-"}</td>
              {/* <td style={tdStyle}><s-badge tone={cart.status === "Recovered" ? "success" : "info"}>{cart.status}</s-badge></td> */}
              <td style={{ ...tdStyle, textAlign: "right" }}>{moneyFromCents(cart.total, currency)}</td>
              <td style={tdStyle}>{new Date(cart.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {!carts.length && <s-box padding="base"><s-text>No saved carts found.</s-text></s-box>}
    </s-section>
  );
}

const thStyle = {
  borderBottom: "1px solid #ddd",
  padding: "10px 8px",
  textAlign: "left",
  fontSize: "12px",
  fontWeight: 600,
};

const tdStyle = {
  borderBottom: "1px solid #eee",
  padding: "12px 8px",
  verticalAlign: "top",
};
