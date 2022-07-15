import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import ContactForm from "./ContactForm";

beforeEach(() => {
  render(<ContactForm />);
});

test("renders without errors", () => {});

test("renders the contact form header", () => {
  const formHeader = screen.queryByText(/contact form/i);
  expect(formHeader).toBeInTheDocument();
  expect(formHeader).toBeTruthy();
  expect(formHeader).toHaveTextContent(/contact form/i);
});

test("renders ONE error message if user enters less then 5 characters into firstname.", async () => {
  const firstNameInput = screen.getByLabelText(/First Name*/i);
  userEvent.type(firstNameInput, "mina");
  const firstNameError = await screen.findByText(
    /Error: firstName must have at least 5 characters./i
  );
  expect(firstNameError).toBeVisible();
});

test("renders THREE error messages if user enters no values into any fields.", async () => {
  const button = screen.getByRole("button");
  userEvent.click(button);
  const errorsArray = await screen.findAllByTestId("error");
  expect(errorsArray).toHaveLength(3);
});

test("renders ONE error message if user enters a valid first name and last name but no email.", async () => {
  const firstNameInput = screen.getByLabelText(/First Name*/i);
  userEvent.type(firstNameInput, "Michael");
  const lastNameInput = screen.getByLabelText(/Last Name*/i);
  userEvent.type(lastNameInput, "Smith");

  const button = screen.getByRole("button");
  userEvent.click(button);
  const errorsArray = await screen.findAllByTestId("error");
  expect(errorsArray).toHaveLength(1);
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
  const emailInput = screen.getByLabelText(/email*/i);
  userEvent.type(emailInput, "invalidemailaddress");

  const emailError = await screen.getByText("Error: email must be a valid email address.");
  expect(emailError).toBeInTheDocument();
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
  const firstNameInput = screen.getByLabelText(/First Name*/i);
  userEvent.type(firstNameInput, "Michael");
  const emailInput = screen.getByLabelText(/email*/i);
  userEvent.type(emailInput, "will@smith.com");

  const button = screen.getByRole("button");
  userEvent.click(button);

  const lastNameError = await screen.findByText(/Error: lastName is a required field./i);

  expect(lastNameError).toBeInTheDocument();
});

test("renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.", async () => {
  const firstNameInput = screen.getByLabelText(/First Name*/i);
  userEvent.type(firstNameInput, "Michael");
  const lastNameInput = screen.getByLabelText(/Last Name*/i);
  userEvent.type(lastNameInput, "Sams");
  const emailInput = screen.getByLabelText(/email*/i);
  userEvent.type(emailInput, "will@smith.com");
  const button = screen.getByRole("button");
  userEvent.click(button);

  const firstNameText = await screen.findByText(/Michael/i);
  const emailText = await screen.findByText(/will@smith.com/i);
  const lastNameText = await screen.findByText(/Sams/i);

  const messageElement = screen.queryByTestId("messageDisplay");
  expect(messageElement).not.toBeInTheDocument();
});

test("renders all fields text when all fields are submitted.", async () => {
  const firstNameInput = screen.getByLabelText(/First Name*/i);
  userEvent.type(firstNameInput, "Michael");

  const lastNameInput = screen.getByLabelText(/Last Name*/i);
  userEvent.type(lastNameInput, "Sams");

  const emailInput = screen.getByLabelText(/email*/i);
  userEvent.type(emailInput, "will@smith.com");

  const messageInput = screen.getByLabelText(/message*/i);
  userEvent.type(messageInput, "new Message");

  const button = screen.getByRole("button");
  userEvent.click(button);

  const firstNameText = await screen.findByText(/Michael/i);
  const emailText = await screen.findByText(/will@smith.com/i);
  const lastNameText = await screen.findByText(/Sams/i);
  const messageText = await screen.findByText(/new Message/i);
});
