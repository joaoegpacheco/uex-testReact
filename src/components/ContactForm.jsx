import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { cpf } from "cpf-cnpj-validator";
import { searchCep } from "../services/viacep";
import { searchCoordinates } from "../services/geocode";
import { useAuth } from "../contexts/AuthContext";
import "@material/web/textfield/outlined-text-field";
import "@material/web/button/filled-button";
import "@material/web/button/outlined-button";

const schema = yup.object().shape({
  name: yup.string().required("Nome é obrigatório"),
  cpf: yup
    .string()
    .required("CPF é obrigatório")
    .test("valid-cpf", "CPF inválido", (value) => {
      if (!value) return false;
      return cpf.isValid(value);
    }),
  phone: yup.string().required("Telefone é obrigatório"),
  zipCode: yup
    .string()
    .required("CEP é obrigatório")
    .matches(/^\d{8}$/, "CEP deve conter 8 dígitos"),
  street: yup.string().required("Rua é obrigatória"),
  number: yup.string().required("Número é obrigatório"),
  complement: yup.string(),
  city: yup.string().required("Cidade é obrigatória"),
  state: yup.string().required("Estado é obrigatório"),
});

export default function ContactForm({
  onSuccess,
  setShowContactForm,
  contactToEdit,
  setEditingContact,
}) {
  const { currentUser } = useAuth();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      cpf: "",
      phone: "",
      zipCode: "",
      street: "",
      number: "",
      complement: "",
      city: "",
      state: "",
    },
  });

  const zipCode = watch("zipCode");

  useEffect(() => {
    const fetchCepData = async () => {
      if (zipCode.length === 8) {
        try {
          const data = await searchCep(zipCode);
          if (!data.erro) {
            setValue("street", data.logradouro);
            setValue("city", data.localidade);
            setValue("state", data.uf);
          }
        } catch {
          setError("Erro ao buscar o CEP.");
        }
      }
    };

    fetchCepData();
  }, [zipCode, setValue]);

  // Preenche o formulário ao editar
  useEffect(() => {
    if (contactToEdit) {
      reset({
        name: contactToEdit.name || "",
        cpf: contactToEdit.cpf || "",
        phone: contactToEdit.phone || "",
        zipCode: contactToEdit.zipCode || "",
        street: contactToEdit.street || "",
        number: contactToEdit.number || "",
        complement: contactToEdit.complement || "",
        city: contactToEdit.city || "",
        state: contactToEdit.state || "",
      });
    } else {
      reset(); // limpa o formulário se não estiver editando
    }
  }, [contactToEdit, reset]);

  const onSubmit = async (formData) => {
    // Obter lista de usuários
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = users.findIndex((u) => u.id === currentUser.id);

    if (userIndex === -1) {
      return setError("Usuário não encontrado.");
    }

    const user = users[userIndex];

    // Obtem coordenadas
    const fullAddress = `${formData.street}, ${formData.number}, ${formData.city}, ${formData.state}`;
    const coords = await searchCoordinates(fullAddress);
    formData.latitude = coords.lat;
    formData.longitude = coords.lng;

    // Edita contato a partir do ID
    if (contactToEdit) {
      const updatedContact = {
        ...contactToEdit,
        ...formData,
      };
      const contactIndex = user.contacts.findIndex(
        (c) => c.id === contactToEdit.id
      );
      user.contacts[contactIndex] = updatedContact;
    } else {
      if (user.contacts?.some((c) => c.cpf === formData.cpf)) {
        return setError("Contato com esse CPF já existe.");
      }
      // Adicionar contato com ID
      user.contacts = [
        ...(user.contacts || []),
        {
          // Gera ID único para o novo contato
          id: crypto.randomUUID(),
          ...formData,
        },
      ];
    }

    users[userIndex] = user;
    // Salvar no localStorage
    localStorage.setItem("users", JSON.stringify(users));

    // Limpar o formulário
    reset();

    // Sucesso
    onSuccess();
    setShowContactForm(false);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ display: "grid", gap: 16, padding: 16 }}
    >
      <md-outlined-text-field
        label="Nome"
        {...register("name")}
        error={!!errors.name}
        supportingText={errors.name?.message}
        required
      />
      <md-outlined-text-field
        label="CPF"
        {...register("cpf")}
        error={!!errors.cpf}
        supportingText={errors.cpf?.message}
        required
      />
      <md-outlined-text-field
        label="Telefone"
        {...register("phone")}
        error={!!errors.phone}
        supportingText={errors.phone?.message}
        required
      />
      <md-outlined-text-field
        label="CEP"
        {...register("zipCode")}
        error={!!errors.zipCode}
        supportingText={errors.zipCode?.message}
        required
      />
      <md-outlined-text-field
        label="Rua"
        {...register("street")}
        error={!!errors.street}
        supportingText={errors.street?.message}
        required
      />
      <md-outlined-text-field
        label="Número"
        {...register("number")}
        error={!!errors.number}
        supportingText={errors.number?.message}
        required
      />
      <md-outlined-text-field label="Complemento" {...register("complement")} />
      <md-outlined-text-field
        label="Cidade"
        {...register("city")}
        error={!!errors.city}
        supportingText={errors.city?.message}
        required
      />
      <md-outlined-text-field
        label="Estado"
        {...register("state")}
        error={!!errors.state}
        supportingText={errors.state?.message}
        required
      />

      {error && <div style={{ color: "red" }}>{error}</div>}
      <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
        <md-outlined-button
          style={{ width: "100%" }}
          onClick={() => {
            setShowContactForm(false);
            setEditingContact(false);
          }}
        >
          Cancelar
        </md-outlined-button>
        <md-filled-button style={{ width: "100%" }} type="submit">
          Salvar
        </md-filled-button>
      </div>
    </form>
  );
}
