import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { cpf } from "cpf-cnpj-validator";
import { useJsApiLoader } from "@react-google-maps/api";

import { useAuth } from "../contexts/AuthContext";
import {
  getUserContacts,
  addContact,
  deleteContact,
  updateContact,
} from "../services/contactService";
import { searchCoordinates } from "../services/geocode";

import ContactForm from "../components/ContactForm";
import { Map } from "../components/Map";
import { UserActions } from "../components/UserActions";
import { ContactFilterBar } from "../components/ContactFilterBar";
import { ContactList } from "../components/ContactList";
import { ConfirmDialog } from "../components/ConfirmDialog";

import "@material/web/textfield/outlined-text-field";
import "@material/web/button/filled-button";
import "@material/web/button/outlined-button";
import "@material/web/iconbutton/icon-button";
import "@material/web/icon/icon";
import "@material/web/select/outlined-select.js";
import "@material/web/select/select-option.js";
import "@material/web/dialog/dialog.js";

export default function HomePage() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const contactFormRef = useRef(null);

  const initialFormState = {
    name: "",
    cpf: "",
    phone: "",
    street: "",
    number: "",
    complement: "",
    city: "",
    state: "",
    zipCode: "",
    latitude: "",
    longitude: "",
  };

  const [contacts, setContacts] = useState([]);
  const [filter, setFilter] = useState("");
  const [form, setForm] = useState(initialFormState);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showContactForm, setShowContactForm] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" ou "desc"

  // Carrega os contatos do usuário logado
  const loadContacts = () => {
    let data = getUserContacts(currentUser.id);

    // Filtra contatos inválidos
    const validContacts = data.filter((contact) => {
      return (
        contact &&
        typeof contact === "object" &&
        typeof contact.name === "string" &&
        typeof contact.cpf === "string"
      );
    });

    if (validContacts.length !== data.length) {
      console.warn("Contatos inválidos foram ignorados.");
    }

    setContacts(validContacts);
  };

  // Carrega os contatos ao iniciar a página
  useEffect(() => {
    if (currentUser) {
      // Carrega contatos se tudo estiver certo
      loadContacts();
    }
    if (!currentUser) {
      // Redirecionar para o login se não estiver autenticado
      navigate("/login");
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  // Obtém coordenadas de latitude/longitude a partir de um endereço
  const getCoordinates = async () => {
    const address = `${form.street}, ${form.number}, ${form.city}, ${form.state}`;
    return await searchCoordinates(address);
  };

  // Adiciona um novo contato ao localStorage após validações
  const handleAddContact = async (e) => {
    e.preventDefault();

    if (!cpf.isValid(form.cpf)) return alert("CPF inválido!");

    const coords = await getCoordinates();
    if (!coords) return alert("Erro ao obter localização.");

    const updatedContact = {
      ...form,
      latitude: coords.lat,
      longitude: coords.lng,
    };

    if (form.id) {
      // Modo de edição
      updateContact(currentUser.id, updatedContact);
    } else {
      // Modo de criação
      if (contacts.find((c) => c.cpf === form.cpf))
        return alert("CPF já cadastrado.");

      updatedContact.id = crypto.randomUUID();
      addContact(currentUser.id, updatedContact);
    }

    loadContacts();
    setForm(initialFormState);
    setShowContactForm(false);
  };

  const confirmDeleteContact = () => {
    if (contactToDelete !== null) {
      // Exclui o contato do localStorage, passando o índice (id)
      deleteContact(currentUser.id, contactToDelete);

      // Recarrega os contatos após a exclusão
      loadContacts();
      setContactToDelete(null);
    }
  };

  // Edita um contato por ID
  const handleEditContact = (contactId) => {
    const contactToEdit = contacts.find((c) => c.id === contactId);
    if (!contactToEdit) return;

    // Abre o formulário preenchido
    setForm({
      name: contactToEdit.name,
      cpf: contactToEdit.cpf,
      phone: contactToEdit.phone,
      cep: contactToEdit.cep,
      street: contactToEdit.street,
      number: contactToEdit.number,
      complement: contactToEdit.complement,
      city: contactToEdit.city,
      state: contactToEdit.state,
      latitude: contactToEdit.latitude,
      longitude: contactToEdit.longitude,
      id: contactToEdit.id, // importante para atualizar
    });

    setEditingContact(contactToEdit);
    setShowContactForm(true);
  };

  // Exclui permanentemente a conta do usuário após validação de senha
  const handleAccountDeletion = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const current = users.find((u) => u.email === currentUser.email);

    if (!current || current.password !== passwordInput) {
      setPasswordError("Senha incorreta");
      return;
    }

    const updatedUsers = users.filter((u) => u.email !== currentUser.email);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.removeItem("contacts");

    logout();
    navigate("/login"); // Redireciona para tela de login
  };

  // Carrega a API do Google Maps
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
  });

  // Filtra os contatos de acordo com a busca por nome ou CPF e ordenação
  const filteredContacts = contacts
    .filter(
      (c) =>
        c.name?.toLowerCase().includes(filter.toLowerCase()) ||
        c.cpf?.includes(filter)
    )
    .sort((a, b) => {
      const nameA = (a.name || "").toLowerCase();
      const nameB = (b.name || "").toLowerCase();
      return sortOrder === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });

  const handleCreateNewContact = () => {
    setEditingContact(false); // garante que não está em modo de edição
    setForm(initialFormState); // limpa os campos do formulário
    setShowContactForm(true); // abre o modal
  };

  return (
    <div className="main-layout">
      {/* Modal de confirmação de exclusão da conta do usuário */}
      <ConfirmDialog
        open={showDeleteDialog}
        message="Digite sua senha para confirmar a exclusão da conta."
        title="Deseja excluir sua conta?"
        contactform={
          <md-outlined-text-field
            type="password"
            label="Senha"
            style={{ width: "100%" }}
            value={passwordInput}
            onInput={(e) => setPasswordInput(e.target.value)}
            error={!!passwordError}
            supporting-text={passwordError}
          />
        }
        onConfirm={handleAccountDeletion}
        onCancel={() => {
          setShowDeleteDialog(false);
        }}
      />

      <h2>Bem-vindo, {currentUser?.email}</h2>
      {/* Ações do usuário */}
      <UserActions
        onCreate={handleCreateNewContact}
        onDeleteAccount={() => setShowDeleteDialog(true)}
        onLogout={logout}
      />

      {/* Formulário de criação e edição de contato */}
      <ConfirmDialog
        open={showContactForm}
        cancel={() => {
          setShowContactForm(false);
        }}
        closed={() => {
          setShowContactForm(false);
        }}
        title={
          editingContact ? "Edite seu contato" : "Cadastre um novo contato"
        }
        contactform={
          <ContactForm
            ref={contactFormRef}
            form={form}
            setForm={setForm}
            contactToEdit={editingContact}
            handleAddContato={handleAddContact}
            setShowContactForm={setShowContactForm}
            setEditingContact={setEditingContact}
            onSuccess={() => {
              loadContacts();
              setEditingContact(null); // limpa após salvar
            }}
          />
        }
        onConfirm={() => contactFormRef.current?.submitForm()}
        onCancel={() => {
          setShowContactForm(false);
          setEditingContact(false);
          setForm(initialFormState); // limpa os campos
        }}
      />

      <h3>Contatos</h3>
      {/* Filtros */}
      <ContactFilterBar
        filter={filter}
        setFilter={setFilter}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />

      {/* Lista de contatos cadastrados */}
      <ContactList
        contacts={filteredContacts}
        onSelect={setSelectedLocation}
        onEdit={handleEditContact}
        onDelete={setContactToDelete}
      />

      {/* Modal de exclusão do contato */}
      <ConfirmDialog
        open={contactToDelete !== null}
        title="Excluir contato"
        message="Deseja realmente excluir este contato?"
        onConfirm={confirmDeleteContact}
        onCancel={() => setContactToDelete(null)}
      />

      {/* Renderiza o mapa se for clicado em algum contato */}
      {selectedLocation && isLoaded && (
        <Map latitude={selectedLocation.lat} longitude={selectedLocation.lng} />
      )}
    </div>
  );
}
