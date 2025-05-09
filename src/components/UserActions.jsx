export function UserActions({ onCreate, onDeleteAccount, onLogout }) {
  return (
    <div className="container-layout" style={{ display: "flex", gap: 16 }}>
      <md-filled-button className="button-styled" onClick={onCreate}>
        Cadastrar novo contato
      </md-filled-button>
      <md-outlined-button className="button-styled" onClick={onDeleteAccount}>
        Excluir minha conta
      </md-outlined-button>
      <md-filled-button className="button-styled" onClick={onLogout}>
        Sair
      </md-filled-button>
    </div>
  );
}
