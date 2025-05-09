export function ContactFilterBar({
  filter,
  setFilter,
  sortOrder,
  setSortOrder,
}) {
  return (
    <div style={{ display: "flex", gap: 20, width: "100%" }}>
      <md-outlined-text-field
        label="Nome ou CPF"
        value={filter}
        oninput={(e) => setFilter(e.target.value)}
        style={{ width: "100%" }}
      />
      <md-outlined-select
        label="Ordenar por"
        value={sortOrder}
        onchange={(e) => setSortOrder(e.target.value)}
      >
        <md-select-option value="asc" selected={sortOrder === "asc"}>
          <div slot="headline">Nome (A-Z)</div>
        </md-select-option>
        <md-select-option value="desc" selected={sortOrder === "desc"}>
          <div slot="headline">Nome (Z-A)</div>
        </md-select-option>
      </md-outlined-select>
    </div>
  );
}
