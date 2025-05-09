import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { cpf } from "cpf-cnpj-validator";
import { searchCep } from "../services/viacep";
import { searchCoordinates } from "../services/geocode";
import { useAuth } from "../contexts/AuthContext";
import "@material/web/textfield/outlined-text-field";

const schema = yup.object().shape({
  name: yup.string().required("Nome é obrigatório"),
  cpf: yup
    .string()
    .required("CPF é obrigatório")
    .test("valid-cpf", "CPF inválido", (value) => {
      const raw = value?.replace(/\D/g, "");
      return cpf.isValid(raw || "");
    }),
  phone: yup
    .string()
    .required("Telefone é obrigatório")
    .matches(/^\(\d{2}\) \d{5}-\d{4}$/, "Telefone inválido"),
  zipCode: yup
    .string()
    .required("CEP é obrigatório")
    .matches(/^\d{5}-\d{3}$/, "CEP inválido"),
  street: yup.string().required("Rua é obrigatória"),
  number: yup
    .string()
    .required("Número é obrigatório")
    .matches(/^\d+$/, "Apenas números são permitidos"),
  complement: yup.string(),
  city: yup.string().required("Cidade é obrigatória"),
  state: yup.string().required("Estado é obrigatório"),
});

const ContactForm = forwardRef(
  ({ onSuccess, setShowContactForm, contactToEdit, form }, ref) => {
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

    // Expor função submitForm ao componente pai
    useImperativeHandle(ref, () => ({
      submitForm: () => handleSubmit(onSubmit)(),
    }));

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
        reset(form); // limpa o formulário se não estiver editando
      }
    }, [contactToEdit, reset, form]);

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
        const updatedContact = { ...contactToEdit, ...formData };
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
      <form style={{ display: "grid", gap: 16 }}>
        {error && <div style={{ color: "red" }}>{error}</div>}
        <md-outlined-text-field
          label="Nome"
          {...register("name")}
          error={!!errors.name}
          supportingText={errors.name?.message}
          required
        />
        <md-outlined-text-field
          label="CPF"
          value={watch("cpf")}
          onInput={(e) => {
            const raw = e.target.value.replace(/\D/g, "");
            const formatted = raw
              .replace(/(\d{3})(\d)/, "$1.$2")
              .replace(/(\d{3})(\d)/, "$1.$2")
              .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
            setValue("cpf", formatted);
          }}
          error={!!errors.cpf}
          supportingText={errors.cpf?.message}
          required
        />
        <md-outlined-text-field
          label="Telefone"
          value={watch("phone")}
          onInput={(e) => {
            const raw = e.target.value.replace(/\D/g, "");
            const formatted = raw
              .replace(/^(\d{2})(\d)/g, "($1) $2")
              .replace(/(\d{5})(\d)/, "$1-$2")
              .slice(0, 15);
            setValue("phone", formatted);
          }}
          error={!!errors.phone}
          supportingText={errors.phone?.message}
          required
        />
        <md-outlined-text-field
          label="CEP"
          value={watch("zipCode")}
          onInput={(e) => {
            const raw = e.target.value.replace(/\D/g, "");
            const formatted = raw.replace(/^(\d{5})(\d)/, "$1-$2").slice(0, 9);
            setValue("zipCode", formatted);
          }}
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
          value={watch("number")}
          onInput={(e) => {
            const onlyDigits = e.target.value.replace(/\D/g, "");
            setValue("number", onlyDigits);
          }}
          error={!!errors.number}
          supportingText={errors.number?.message}
          required
        />
        <md-outlined-text-field
          label="Complemento"
          {...register("complement")}
        />
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
      </form>
    );
  }
);

export default ContactForm;
