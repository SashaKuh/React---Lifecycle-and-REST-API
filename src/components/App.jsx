import React, { Component } from 'react';
import { nanoid } from 'nanoid';
import PropTypes from 'prop-types';
import { ContactForm } from './ContactForm';
import { Section } from './Section';
import { ContactFilter } from './ContactFilter';
import { ContactList } from './ContactList';

export class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  componentDidMount() {
    const contacts = localStorage.getItem('contacts');
    if (contacts !== null) {
      this.setState({ contacts: JSON.parse(contacts) });
    }
  }

  componentDidUpdate(_, prevState) {
    if (prevState.contacts !== this.state.contacts) {
      localStorage.setItem('contacts', JSON.stringify(this.state.contacts));
    }
  }

  onSubmitForm = (contact) => {
    if (this.state.contacts.some((el) => el.number === contact.number)) {
      alert(
        `This number (${
          contact.number
        }) is already in the contact list, recorded as ${
          this.state.contacts.find((el) => el.number === contact.number).name
        }`
      );
      return;
    }

    const newContact = { ...contact, id: 'id-' + nanoid() };

    this.setState((prevState) => ({
      contacts: [...prevState.contacts, newContact],
    }));
  };

  onChange = (filter) => {
    this.setState({ filter: filter.toLowerCase() });
  };

  onDelete = (id) => {
    this.setState((prevState) => ({
      contacts: prevState.contacts.filter((e) => e.id !== id),
    }));
  };

  render() {
    return (
      <>
        <Section title={'Phonebook'}>
          <ContactForm onSubmit={this.onSubmitForm} />
        </Section>
        <Section title={'Contacts'}>
          <ContactFilter onChange={this.onChange} />
          {this.state.contacts.length ? (
            <ContactList
              contacts={this.state.contacts.filter((el) =>
                el.name.toLowerCase().includes(this.state.filter)
              )}
              onDelete={this.onDelete}
            />
          ) : (
            <p>No contacts</p>
          )}
        </Section>
      </>
    );
  }
}

App.propTypes = {
  contacts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      number: PropTypes.string.isRequired,
    })
  ),
};
