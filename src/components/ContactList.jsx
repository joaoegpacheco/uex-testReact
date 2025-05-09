export function ContactList({ contacts, onSelect, onEdit, onDelete }) {
  if (!contacts.length) {
    return (
      <p style={{ textAlign: "center" }}>
        Você ainda não possui contatos cadastrados 😭
      </p>
    );
  }

  return (
    <ul style={{ marginTop: 20, padding: 0 }}>
      {contacts.map((c) => (
        <li
          key={c.id}
          style={{
            display: "flex",
            flexDirection: "column",
            marginBottom: 10,
            cursor: "pointer",
            border: "1px solid gray",
            borderRadius: 5,
            padding: 10,
          }}
          onClick={() =>
            onSelect({
              lat: parseFloat(c.latitude),
              lng: parseFloat(c.longitude),
            })
          }
        >
          <strong>{c.name}</strong> <br />
          CPF: {c.cpf} <br />
          Telefone: {c.phone} <br />
          Endereço: {c.street}, {c.number} {c.complement.length > 0 && "- "+c.complement} <br />
          Cidade: {c.city} <br />
          Estado: {c.state} <br />
          CEP: {c.zipCode} <br />
          <div
            style={{
              display: "flex",
              gap: 10,
              marginTop: 15,
              justifyContent: "end",
            }}
          >
            <md-filled-button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(c.id);
              }}
            >
              editar
            </md-filled-button>
            <md-filled-button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(c.id);
              }}
            >
              deletar
            </md-filled-button>
          </div>
        </li>
      ))}
    </ul>
  );
}
