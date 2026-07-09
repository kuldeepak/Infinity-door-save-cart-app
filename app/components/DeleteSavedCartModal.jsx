/* eslint-disable react/prop-types */
export function DeleteSavedCartModal({ open, cartToken, isDeleting, onCancel, onConfirm }) {
  if (!open) return null;

  return (
    <div aria-modal="true" role="dialog" style={backdropStyle}>
      <div style={modalStyle}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>Delete saved cart</h2>
        </div>
        <div style={bodyStyle}>
          <p style={paragraphStyle}>
            This will permanently delete saved cart <strong>{cartToken}</strong>. Customers with this link will no longer be able to restore the cart.
          </p>
          <p style={paragraphStyle}>This action cannot be undone.</p>
        </div>
        <div style={footerStyle}>
          <button disabled={isDeleting} onClick={onCancel} style={secondaryButtonStyle} type="button">
            Cancel
          </button>
          <button disabled={isDeleting} onClick={onConfirm} style={primaryButtonStyle} type="button">
            {isDeleting ? "Deleting..." : "Delete saved cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

const backdropStyle = {
  alignItems: "center",
  background: "rgba(0, 0, 0, 0.38)",
  bottom: 0,
  display: "flex",
  justifyContent: "center",
  left: 0,
  padding: 20,
  position: "fixed",
  right: 0,
  top: 0,
  zIndex: 999,
};

const modalStyle = {
  background: "#fff",
  borderRadius: 8,
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.24)",
  maxWidth: 560,
  overflow: "hidden",
  width: "100%",
};

const headerStyle = {
  borderBottom: "1px solid #e3e3e3",
  padding: "16px 20px",
};

const titleStyle = {
  color: "#202223",
  fontSize: 18,
  fontWeight: 650,
  lineHeight: 1.3,
  margin: 0,
};

const bodyStyle = {
  display: "grid",
  gap: 12,
  padding: 20,
};

const paragraphStyle = {
  color: "#303030",
  fontSize: 14,
  lineHeight: 1.5,
  margin: 0,
};

const footerStyle = {
  alignItems: "center",
  background: "#f7f7f7",
  borderTop: "1px solid #e3e3e3",
  display: "flex",
  gap: 8,
  justifyContent: "flex-end",
  padding: "14px 20px",
};

const secondaryButtonStyle = {
  background: "#fff",
  border: "1px solid #8a8a8a",
  borderRadius: 8,
  color: "#303030",
  cursor: "pointer",
  fontSize: 14,
  fontWeight: 600,
  minHeight: 32,
  padding: "6px 12px",
};

const primaryButtonStyle = {
  background: "#d72c0d",
  border: "1px solid #d72c0d",
  borderRadius: 8,
  color: "#fff",
  cursor: "pointer",
  fontSize: 14,
  fontWeight: 600,
  minHeight: 32,
  padding: "6px 12px",
};
