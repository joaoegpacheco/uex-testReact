export function ConfirmDialog({ open, title, message, contactform, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <md-dialog style={{ width: "auto" }} open noCloseOnOutsideClick>
      <div slot="headline">{title}</div>
      <div slot="content" method="dialog">
        <p>{message}</p>
        {contactform}
      </div>
      <div slot="actions">
        <md-outlined-button onClick={onCancel}>Cancelar</md-outlined-button>
        <md-filled-button onClick={onConfirm}>Confirmar</md-filled-button>
      </div>
    </md-dialog>
  );
}
