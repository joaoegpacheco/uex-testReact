import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import "@material/web/textfield/outlined-text-field";
import "@material/web/button/filled-button";

export function AuthForm({ title, fields, schema, onSubmit, error, footer }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  return (
    <form
      className="main-layout"
      onSubmit={handleSubmit(onSubmit)}
      style={{
        gap: "16px",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <h2>{title}</h2>

      <div className="div-form">
        {fields.map((field) => (
          <md-outlined-text-field
            key={field.name}
            label={field.label}
            type={field.type}
            {...register(field.name)}
            error={!!errors[field.name]}
            supporting-text={errors[field.name]?.message}
          />
        ))}

        {error && <div style={{ color: "red" }}>{error}</div>}

        <md-filled-button type="submit">{title}</md-filled-button>
        {footer}
      </div>
    </form>
  );
}
