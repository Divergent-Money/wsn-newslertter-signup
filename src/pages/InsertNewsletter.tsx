
import React from 'react';
import InsertNewsletterForm from '@/components/newsletters/InsertNewsletterForm';
import { useNewsletterForm } from '@/hooks/useNewsletterForm';

const InsertNewsletter = () => {
  const { formValues, handleChange, handleSubmit, isLoading } = useNewsletterForm();
  
  return (
    <div className="min-h-screen bg-supernova-gray py-12 px-8 text-supernova-black">
      <div className="container mx-auto max-w-4xl">
        <InsertNewsletterForm
          formValues={formValues}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default InsertNewsletter;
