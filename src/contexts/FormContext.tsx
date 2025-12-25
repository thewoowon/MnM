import React, { createContext, useContext, useState, ReactNode } from 'react';

type Form = {
  diary?: string | undefined;
  value?: string | undefined;
};

type FormContextType = {
  form: Form | null;
  setForm: (form: Form) => void;
  resetForm: () => void;
};

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider = ({ children }: { children: ReactNode }) => {
  const [form, setFormState] = useState<Form | null>(null);

  const setForm = (form: Form) => {
    setFormState(form);
  };

  const resetForm = () => {
    setFormState(null);
  };

  return (
    <FormContext.Provider value={{ form, setForm, resetForm }}>
      {children}
    </FormContext.Provider>
  );
};

export const useForm = (): FormContextType => {
  const context = useContext(FormContext);
  if (!context) throw new Error('useForm must be used within a FormProvider');
  return context;
};
