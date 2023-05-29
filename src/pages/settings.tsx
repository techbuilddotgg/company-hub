import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SaveCompanySchema } from '@shared/validators/company.schemes';

const Settings = () => {
  const form = useForm({
    resolver: zodResolver(SaveCompanySchema),
    defaultValues: {
      name: '',
      logo: '',
    },
  });
  return;
};

export default Settings;
