import { ChangeEvent } from 'react';
import { phoneRegex } from './PhoneNumberRegex';

interface FormRegulatorProps<T> {
  e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>;
  setFormValues: React.Dispatch<React.SetStateAction<T | undefined>>;
  formValues: T | undefined;
  clearErrorMessages?: () => void;
}

/**
 *
 * @param e is the event handler
 * @param setFormValues is the function to set the form values state
 * @param formValues is the state object
 * @param errorMsgStateFunction is the function to set the state
 */
export function onFormValueChange<T>({
  e,
  setFormValues,
  formValues,
  clearErrorMessages,
}: FormRegulatorProps<T>) {
  const { name, value } = e.target;

  // Validate phone number to accept only digits
  if (name === 'contactPhone' && phoneRegex(value)) {
    // If alphabetic characters are entered, handle the error here
    return;
  }

  setFormValues({ ...(formValues as T), [name]: value });

  clearErrorMessages && clearErrorMessages();
}
