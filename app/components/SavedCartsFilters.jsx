/* eslint-disable react/prop-types */
import { useCallback, useEffect, useRef, useState } from "react";
import { useSubmit } from "react-router";

export function SavedCartsFilters({ query = "" }) {
  const [queryValue, setQueryValue] = useState(query);
  const formRef = useRef(null);
  const submit = useSubmit();
  const firstRender = useRef(true);

  useEffect(() => {
    setQueryValue(query);
  }, [query]);

  const submitFilters = useCallback(
    ({ replace = true } = {}) => {
      if (formRef.current) {
        submit(formRef.current, { method: "get", replace });
      }
    },
    [submit],
  );

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    const timeout = setTimeout(() => {
      submitFilters({ replace: true });
    }, 350);

    return () => clearTimeout(timeout);
  }, [queryValue, submitFilters]);

  const handleSubmit = (event) => {
    event.preventDefault();
    submitFilters({ replace: false });
  };

  const handleClear = () => {
    setQueryValue("");
  };

  return (
    <form ref={formRef} method="get" onSubmit={handleSubmit} role="search" style={filterBarStyle}>
      <div style={searchWrapStyle}>
        <input
          aria-label="Search saved carts"
          name="q"
          onChange={(event) => setQueryValue(event.target.value)}
          placeholder="Search saved carts"
          style={searchInputStyle}
          type="search"
          value={queryValue}
        />
        {queryValue ? (
          <button
            aria-label="Clear search"
            onClick={handleClear}
            style={clearButtonStyle}
            type="button"
          >
            x
          </button>
        ) : null}
      </div>
    </form>
  );
}

const filterBarStyle = {
  display: "grid",
  gridTemplateColumns: "minmax(260px, 1fr)",
};

const searchWrapStyle = {
  alignItems: "center",
  background: "#fff",
  border: "1px solid #8a8a8a",
  borderRadius: 8,
  display: "grid",
  gridTemplateColumns: "1fr auto",
  minHeight: 36,
  overflow: "hidden",
};

const searchInputStyle = {
  border: 0,
  boxSizing: "border-box",
  fontSize: 14,
  minHeight: 34,
  outline: "none",
  padding: "7px 10px",
  width: "100%",
};

const clearButtonStyle = {
  alignItems: "center",
  background: "transparent",
  border: 0,
  color: "#616161",
  cursor: "pointer",
  display: "inline-flex",
  fontSize: 18,
  height: 34,
  justifyContent: "center",
  lineHeight: 1,
  padding: "0 10px",
};
