// Função para recuperar todos os contatos do usuário atual
export const getUserContacts = (userId) => {
  const allContacts = JSON.parse(localStorage.getItem('contacts') || '[]');
  return allContacts.filter(contact => contact.userId === userId);
};

// Função para adicionar um novo contato
export const addContact = (userId, contactData) => {
  const allContacts = JSON.parse(localStorage.getItem('contacts') || '[]');
  
  const newContact = {
    id: crypto.randomUUID(),
    userId,
    ...contactData,
    createdAt: new Date().toISOString()
  };
  
  allContacts.push(newContact);
  localStorage.setItem('contacts', JSON.stringify(allContacts));
  
  return newContact;
};

// Função para editar um contato existente
export const updateContact = (contactId, contactData) => {
  const allContacts = JSON.parse(localStorage.getItem('contacts') || '[]');
  
  const updatedContacts = allContacts.map(contact => {
    if (contact.id === contactId) {
      return {
        ...contact,
        ...contactData,
        updatedAt: new Date().toISOString()
      };
    }
    return contact;
  });
  
  localStorage.setItem('contacts', JSON.stringify(updatedContacts));
  
  return updatedContacts.find(contact => contact.id === contactId);
};

// Função para remover um contato
export const deleteContact = (contactId) => {
  const allContacts = JSON.parse(localStorage.getItem('contacts') || '[]');
  
  const filteredContacts = allContacts.filter(contact => contact.id !== contactId);
  localStorage.setItem('contacts', JSON.stringify(filteredContacts));
  
  return true;
};

// Função para obter um contato específico
export const getContact = (contactId) => {
  const allContacts = JSON.parse(localStorage.getItem('contacts') || '[]');
  return allContacts.find(contact => contact.id === contactId) || null;
};