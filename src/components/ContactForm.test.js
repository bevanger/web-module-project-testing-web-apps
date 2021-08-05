import React from 'react';
import {render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContactForm from './ContactForm';

test('renders without errors', ()=>{
    render(<ContactForm/>);
});

test('renders the contact form header', ()=> {
    render(<ContactForm/>);
    const header = screen.getByText(/contact form/i);
    expect(header).toHaveTextContent(/contact form/i);
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm/>);
    const firstNameInput = screen.getByLabelText(/first name*/i)
    userEvent.type(firstNameInput, "b")
    const errorMessage = await screen.findByText(/Error: firstname must have at least 5 characters./i);
    expect(errorMessage).toBeInTheDocument();
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm/>);
    const submitButton = screen.getByRole('button');
    userEvent.click(submitButton);

    await waitFor (() => {
        const firstNameError = screen.getByText(/Error: firstname must have at least 5 characters./i);
        const lastNameError = screen.getByText(/Error: lastname is a required field./i);
        const emailError = screen.getByText(/Error: email must be a valid email address./i);
        expect(firstNameError).toBeInTheDocument();
        expect(lastNameError).toBeInTheDocument();
        expect(emailError).toBeInTheDocument();
    });
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm/>)
    const firstNameInput = screen.getByLabelText(/first name*/i);
    userEvent.type(firstNameInput, "bailey");
    const lastNameInput = screen.getByLabelText(/last name*/i);
    userEvent.type(lastNameInput, "random");
    const submitButton = screen.getByRole('button');
    userEvent.click(submitButton);
    await waitFor (() => {
    const emailError = screen.getByText(/Error: email must be a valid email address./i);
    expect(emailError).toBeInTheDocument();
    });
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm/>)
    const emailInput = screen.getByLabelText(/email/i);
    userEvent.type(emailInput, "random@random");
    await waitFor (() => {
    const emailError = screen.getByText(/Error: email must be a valid email address./i);
    expect(emailError).toBeInTheDocument();
    });
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm/>)
    const firstNameInput = screen.getByLabelText(/first name*/i);
    userEvent.type(firstNameInput, "bailey");
    const emailInput = screen.getByLabelText(/email/i);
    userEvent.type(emailInput, "random@random.com");
    const submitButton = screen.getByRole('button');
    userEvent.click(submitButton);
    await waitFor (() => {
        const lastNameError = screen.getByText(/Error: lastname is a required field./i);
        expect(lastNameError).toBeInTheDocument();
    });
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm/>)
    const firstNameInput = screen.getByLabelText(/first name*/i);
    userEvent.type(firstNameInput, "bailey");
    const lastNameInput = screen.getByLabelText(/last name*/i);
    userEvent.type(lastNameInput, "evanger");
    const emailInput = screen.getByLabelText(/email*/i);
    userEvent.type(emailInput, "random@random.com");
    const submitButton = screen.getByRole('button');
    userEvent.click(submitButton);

    await waitFor (() => {
        const submittedFirstName = screen.getByText(/bailey/i);
        const submittedLastName = screen.getByText(/evanger/i)
        const submittedEmail = screen.getByText(/random@random.com/i);
        const submittedMessage = screen.queryByText(/Message:/i)
        expect(submittedFirstName).toBeInTheDocument();
        expect(submittedLastName).toBeInTheDocument();
        expect(submittedEmail).toBeInTheDocument();
        expect(submittedMessage).toBeNull();
        
    });
});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm/>)
    const firstNameInput = screen.getByLabelText(/first name*/i);
    userEvent.type(firstNameInput, "bailey");
    const lastNameInput = screen.getByLabelText(/last name*/i);
    userEvent.type(lastNameInput, "evanger");
    const emailInput = screen.getByLabelText(/email*/i);
    userEvent.type(emailInput, "random@random.com");
    const messageInput = screen.getByLabelText(/message/i)
    userEvent.type(messageInput, "this is a message");
    const submitButton = screen.getByRole('button');
    userEvent.click(submitButton);

    await waitFor (() => {
        const submittedFirstName = screen.getByText(/bailey/i);
        const submittedLastName = screen.getByText(/evanger/i);
        const submittedEmail = screen.getByText(/random@random.com/i);
        const submittedMessage = screen.getByTestId("messageDisplay");
        expect(submittedFirstName).toBeInTheDocument();
        expect(submittedLastName).toBeInTheDocument();
        expect(submittedEmail).toBeInTheDocument();
        expect(submittedMessage).toBeInTheDocument();
    });
});