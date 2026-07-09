/* eslint-disable react/prop-types */
export function DeleteSavedCartModal({ open, cartToken, isDeleting, onCancel, onConfirm }) {
  if (!open) return null;

  return (
    <div style={overlayStyle} role="presentation">
      <div
        aria-labelledby="delete-saved-cart-title"
        aria-modal="true"
        role="dialog"
        style={modalStyle}
      >
        <div style={headerStyle}>
          <s-heading id="delete-saved-cart-title">Delete saved cart</s-heading>
        </div>

        <div style={bodyStyle}>
          <s-stack direction="block" gap="base">
            <s-text>
              This will permanently delete saved cart {cartToken}. Customers with this link will no longer be able to restore the cart.
            </s-text>
            <s-text>This action cannot be undone.</s-text>
          </s-stack>
        </div>

        <div style={footerStyle}>
          <s-button onClick={onCancel} disabled={isDeleting}>Cancel</s-button>
          <s-button tone="critical" onClick={onConfirm} loading={isDeleting}>Delete saved cart</s-button>
        </div>
      </div>
    </div>
  );
}

const overlayStyle = {
  alignItems: "center",
  background: "rgba(31, 33, 36, 0.48)",
  bottom: 0,
  display: "flex",
  justifyContent: "center",
  left: 0,
  padding: 20,
  position: "fixed",
  right: 0,
  top: 0,
  zIndex: 9999,
};

const modalStyle = {
  background: "#fff",
  borderRadius: 8,
  boxShadow: "0 24px 40px rgba(0, 0, 0, 0.2)",
  maxWidth: 520,
  overflow: "hidden",
  width: "100%",
};

const headerStyle = {
  borderBottom: "1px solid #e3e3e3",
  padding: "16px 20px",
};

const bodyStyle = {
  padding: 20,
};

const footerStyle = {
  alignItems: "center",
  borderTop: "1px solid #e3e3e3",
  display: "flex",
  gap: 8,
  justifyContent: "flex-end",
  padding: "14px 20px",
};
