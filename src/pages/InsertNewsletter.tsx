
import React from 'react';
import InsertNewsletterForm from '@/components/newsletters/InsertNewsletterForm';
import { useNewsletterForm } from '@/hooks/useNewsletterForm';
import SendNewsletterButton from '@/components/newsletters/SendNewsletterButton';

const InsertNewsletter = () => {
  const { formValues, handleChange, handleSubmit, isLoading, insertedArticleId } = useNewsletterForm();
  
  return (
    <div className="min-h-screen bg-supernova-gray py-12 px-8 text-supernova-black">
      <div className="container mx-auto max-w-4xl">
        {insertedArticleId ? (
          <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-md shadow">
            <div>
              <h2 className="text-xl font-semibold">Newsletter Created!</h2>
              <p className="text-gray-600">Your newsletter has been successfully inserted.</p>
            </div>
            <div className="flex space-x-4">
              <SendNewsletterButton 
                newsletterId={insertedArticleId} 
                newsletterTitle={formValues.title} 
              />
            </div>
          </div>
        ) : null}
        
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
