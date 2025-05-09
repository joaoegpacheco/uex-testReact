export function DeleteAccountDialog({
  open,
  onClose,
  onConfirm,
  password,
  onPasswordChange,
  passwordError,
}) {
  if (!open) return null;

  return (
    <md-dialog open noCloseOnOutsideClick>
      <div slot="headline">Deseja excluir sua conta?</div>
      <div slot="content" method="dialog">
        <p>Digite sua senha para confirmar a exclusão da conta.</p>
        <md-outlined-text-field
          type="password"
          label="Senha"
          style={{ width: "100%" }}
          value={password}
          onInput={(e) => onPasswordChange(e.target.value)}
          error={!!passwordError}
          supporting-text={passwordError}
        />
      </div>
      <div slot="actions">
        <md-outlined-button onClick={onClose}>Cancelar</md-outlined-button>
        <md-filled-button onClick={onConfirm}>Excluir</md-filled-button>
      </div>
    </md-dialog>
  );
}
