'use client';

import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { InputField } from '@/components/ui/input';
import { v4 as uuidv4 } from 'uuid';

const signupSchema = z.object({
  firstname: z.string().min(1, 'First name is required'),
  lastname: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupForm({
  onClose,
}: {
  onClose: (userInfo: Record<string, string>) => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstname: '',
      lastname: '',
      email: '',
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    setIsSubmitting(true);
    const userId = uuidv4();
    const userInfo = {
      userId,
      userFirstName: data.firstname,
      userLastName: data.lastname,
      userEmail: data.email,
    };
    Object.entries(userInfo).forEach(([key, value]) => {
      document.cookie = `${key}=${value}; path=/; max-age=31536000; SameSite=Strict; Secure`;
    });
    onClose(userInfo);
    setIsSubmitting(false);
  };

  return (
    <div className="bg-primary-dark/50 fixed inset-0 z-50 flex items-center justify-center">
      <div className="w-full max-w-md rounded-lg bg-accent p-8 shadow-xl">
        <h2 className="text-primary-dark mb-6 text-center text-2xl font-bold">Sign Up</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="firstname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary-dark">First Name</FormLabel>
                  <FormControl>
                    <InputField
                      {...field}
                      className="border-primary-light/30 text-primary-dark placeholder:text-primary-medium/70 focus:border-primary-medium focus:ring-primary-medium w-full bg-accent"
                    />
                  </FormControl>
                  <FormMessage className="text-destructive" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary-dark">Last Name</FormLabel>
                  <FormControl>
                    <InputField
                      {...field}
                      className="border-primary-light/30 text-primary-dark placeholder:text-primary-medium/70 focus:border-primary-medium focus:ring-primary-medium w-full bg-accent"
                    />
                  </FormControl>
                  <FormMessage className="text-destructive" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary-dark">Email</FormLabel>
                  <FormControl>
                    <InputField
                      {...field}
                      type="email"
                      className="border-primary-light/30 text-primary-dark placeholder:text-primary-medium/70 focus:border-primary-medium focus:ring-primary-medium w-full bg-accent"
                    />
                  </FormControl>
                  <FormMessage className="text-destructive" />
                </FormItem>
              )}
            />
        <div className="flex gap-4">
  <Button 
    type="button" 
    variant="outline"
    onClick={() => onClose({})}
    className="flex-1 border border-primary-light/30 bg-accent text-primary-dark transition-colors hover:bg-primary-light/10"
    disabled={isSubmitting}
  >
    Cancel
  </Button>
  <Button 
    type="submit" 
    className="flex-1 bg-primary-medium text-accent transition-colors hover:bg-primary-dark" 
    disabled={isSubmitting}
  >
    {isSubmitting ? 'Submitting...' : 'Sign Up'}
  </Button>
</div>
          </form>
        </Form>
      </div>
    </div>
  );
}
