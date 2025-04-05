
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { interestOptions } from './newsletterOptions';
import { UseFormReturn } from 'react-hook-form';
import { NewsletterFormValues } from '@/schemas/newsletterSchema';

type InterestsSectionProps = {
  form: UseFormReturn<NewsletterFormValues>;
};

const InterestsSection: React.FC<InterestsSectionProps> = ({ form }) => {
  return (
    <div className="space-y-2">
      <FormLabel className="text-sm font-medium text-white/80">Investment Interests</FormLabel>
      <div className="grid grid-cols-2 gap-2">
        {interestOptions.map((interest) => (
          <FormField
            key={interest.id}
            control={form.control}
            name="interests"
            render={({ field }) => (
              <FormItem key={interest.id} className="flex items-center space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value?.includes(interest.id)}
                    onCheckedChange={(checked) => {
                      const currentValues = field.value || [];
                      const newValues = checked
                        ? [...currentValues, interest.id]
                        : currentValues.filter((value) => value !== interest.id);
                      field.onChange(newValues);
                    }}
                    className="border-supernova-gold/50 data-[state=checked]:bg-supernova-gold data-[state=checked]:text-black"
                  />
                </FormControl>
                <FormLabel className="text-sm text-white/80">{interest.label}</FormLabel>
              </FormItem>
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default InterestsSection;
