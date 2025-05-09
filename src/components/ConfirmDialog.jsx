import { useEffect, useRef } from "react";

export function ConfirmDialog({
  open,
  title,
  message,
  contactform,
  onConfirm,
  onCancel,
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      onCancel(); // Atualiza o estado `open` para `false`
    };

    dialog.addEventListener("close", handleClose);
    return () => {
      dialog.removeEventListener("close", handleClose);
    };
  }, [onCancel]);

  if (!open) return null;

  return (
    <md-dialog ref={dialogRef} style={{ width: "auto" }} open>
      <div slot="headline">{title}</div>
      <div slot="content">
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
