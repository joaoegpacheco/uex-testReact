import { useState, useEffect } from "react";
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
import "@material/web/textfield/outlined-text-field";
import "@material/web/button/filled-button";
import "@material/web/iconbutton/icon-button";
import "@material/web/icon/icon";
import "@material/web/select/outlined-select.js";
import "@material/web/select/select-option.js";

export default function HomePage() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const [contacts, setContacts] = useState([]);
  const [filter, setFilter] = useState("");
  const [form, setForm] = useState({
    name: "",
    cpf: "",
    phone: "",
    cep: "",
    street: "",
    number: "",
    complement: "",
    city: "",
    state: "",
    latitude: "",
    longitude: "",
  });
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showContactForm, setShowContactForm] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" ou "desc"

  // Carrega os contatos do usuário logado
  const loadContacts = () => {
    const data = getUserContacts(currentUser.id);
    console.log("Contatos carregados:", data);
    setContacts(data);
  };

  // Carrega os contatos ao iniciar a página
  useEffect(() => {
    if (currentUser) {
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
    setForm({
      name: "",
      cpf: "",
      phone: "",
      cep: "",
      street: "",
      number: "",
      complement: "",
      city: "",
      state: "",
      latitude: "",
      longitude: "",
      id: undefined,
    });
    setShowContactForm(false);
  };

  // Exclui um contato por ID
  const handleDeleteContact = (contactId) => {
    if (confirm("Deseja realmente excluir este contato?")) {
      // Exclui o contato do localStorage, passando o índice (id)
      deleteContact(currentUser.id, contactId);

      // Recarrega os contatos após a exclusão
      loadContacts();
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
        "" ||
        c.cpf?.includes(filter) ||
        ""
    )
    .sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return sortOrder === "asc"
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });

  return (
    <div style={{ padding: 24 }}>
      {/* Modal de confirmação de exclusão de conta */}
      {showDeleteDialog && (
        <md-dialog open>
          <div slot="headline">Excluir conta</div>
          <div slot="content">
            <p>Digite sua senha para confirmar a exclusão da conta.</p>
            <md-outlined-text-field
              type="password"
              label="Senha"
              value={passwordInput}
              onInput={(e) => setPasswordInput(e.target.value)}
              error={!!passwordError}
              supporting-text={passwordError}
            />
          </div>
          <div slot="actions">
            <md-text-button onClick={() => setShowDeleteDialog(false)}>
              Cancelar
            </md-text-button>
            <md-filled-button onClick={handleAccountDeletion}>
              Excluir
            </md-filled-button>
          </div>
        </md-dialog>
      )}

      <h2>Bem-vindo, {currentUser?.email}</h2>
      <md-filled-button onClick={() => setShowDeleteDialog(true)}>
        Excluir minha conta
      </md-filled-button>
      <md-filled-button onClick={logout}>Sair</md-filled-button>

      <h3>Adicionar Contato</h3>
      <md-filled-button onClick={() => setShowContactForm(true)}>
        Cadastrar Novo Contato
      </md-filled-button>

      {/* Formulário de criação e edição de contato */}
      {showContactForm && (
        <ContactForm
          form={form}
          setForm={setForm}
          contactToEdit={editingContact}
          handleAddContato={handleAddContact}
          setShowContactForm={setShowContactForm}
          onSuccess={() => {
            loadContacts();
            setEditingContact(null); // limpa após salvar
          }}
        />
      )}

      <h3>Contatos</h3>
      <div style={{ display: "flex", flexDirection: "row", gap: 20 }}>
        <md-outlined-text-field
          label="Buscar por nome ou CPF"
          value={filter}
          oninput={(e) => setFilter(e.target.value)}
          style={{ width: "150px" }}
        />
        <md-outlined-select
          label="Ordenar por"
          value={sortOrder}
          onchange={(e) => setSortOrder(e.target.value)}
          style={{ width: "100px", marginLeft: "16px" }}
        >
          <md-select-option value="asc" selected={sortOrder === "asc"}>
            <div slot="headline">Nome (A-Z)</div>
          </md-select-option>
          <md-select-option value="desc" selected={sortOrder === "desc"}>
            <div slot="headline">Nome (Z-A)</div>
          </md-select-option>
        </md-outlined-select>
      </div>

      <ul style={{ marginTop: 20, padding: 0 }}>
        {filteredContacts.map((c) => (
          <li
            key={c.id}
            style={{
              display: "flex",
              flexDirection: "column",
              marginBottom: 10,
              cursor: "pointer",
            }}
            onClick={() =>
              setSelectedLocation({
                lat: parseFloat(c.latitude),
                lng: parseFloat(c.longitude),
              })
            }
          >
            <strong>{c.name}</strong> {c.cpf} / {c.phone} <br />
            {c.street}, {c.number}, {c.city} - {c.state} <br />
            <div style={{ display: "flex", gap: 10, margin: 5 }}>
              <md-filled-button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditContact(c.id);
                }}
              >
                editar
              </md-filled-button>
              <md-filled-button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteContact(c.id);
                }}
              >
                deletar
              </md-filled-button>
            </div>
          </li>
        ))}
      </ul>

      {selectedLocation && isLoaded && (
        <div style={{ display: "flex", marginTop: 24 }}>
          <div style={{ flex: 1 }}>
            <h4>
              {
                filteredContacts.find(
                  (c) =>
                    c.latitude === selectedLocation.lat &&
                    c.longitude === selectedLocation.lng
                )?.name
              }
            </h4>

            <span>{`Latitude: ${selectedLocation.lat}, Longitude: ${selectedLocation.lng}`}</span>
          </div>

          <div style={{ flex: 1, height: "400px" }}>
            <Map
              latitude={selectedLocation.lat}
              longitude={selectedLocation.lng}
            />
          </div>
        </div>
      )}
    </div>
  );
}
