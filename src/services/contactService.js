// Função para recuperar todos os contatos do usuário atual
export function getUserContacts(userId) {
  const allContacts = JSON.parse(localStorage.getItem("contacts") || "{}");

  const userContacts = allContacts[userId];

  // Remove tudo se os contatos estiverem corrompidos
  if (import.meta.env.DEV && !Array.isArray(userContacts)) {
    console.warn("Contatos corrompidos detectados. Limpando localStorage.");
    localStorage.removeItem("contacts");
    return [];
  }

  return userContacts || [];
}


// Função para adicionar um novo contato
export const addContact = (userId, newContact) => {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex === -1) return;

  users[userIndex].contacts = users[userIndex].contacts || [];
  newContact.id = crypto.randomUUID(); // se ainda não tiver ID
  users[userIndex].contacts.push(newContact);

  localStorage.setItem("users", JSON.stringify(users));
};

// Função para editar um contato existente
export const updateContact = (userId, updatedContact) => {
  // Recupera os usuários do localStorage
  const users = JSON.parse(localStorage.getItem("users")) || [];

  // Encontra o usuário pelo ID
  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex === -1) return; // Caso o usuário não seja encontrado

  // Atualiza o contato no array de contatos
  const contactIndex = users[userIndex].contacts.findIndex(
    (contact) => contact.id === updatedContact.id
  );

  if (contactIndex !== -1) {
    users[userIndex].contacts[contactIndex] = updatedContact;

    // Salva novamente no localStorage
    localStorage.setItem("users", JSON.stringify(users));
  }
};

// Função para remover um contato
export const deleteContact = (userId, contactId) => {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const userIndex = users.findIndex((u) => u.id === userId);
  if (userIndex === -1) return;

  users[userIndex].contacts = users[userIndex].contacts.filter(
    (c) => c.id !== contactId
  );

  localStorage.setItem("users", JSON.stringify(users));
};

// Função para obter um contato específico
export const getContact = (userId) => {
  // Recupera os usuários do localStorage
  const users = JSON.parse(localStorage.getItem("users")) || [];

  // Encontra o usuário pelo ID
  const user = users.find((u) => u.id === userId);

  // Adiciona um id baseado no índice de cada contato
  return user
    ? user.contacts.map((contact, index) => ({ ...contact, id: index }))
    : [];
};
