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
  FormDescription,
} from '@/components/ui/form';
import { InputField } from '@/components/ui/input';
import { v4 as uuidv4 } from 'uuid';
import { useTranslations } from 'next-intl';
import { Checkbox } from '@/components/ui/checkbox';

export default function SignupForm({
  onClose,
}: {
  onClose: (userInfo: Record<string, string>) => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const tSignupForm = useTranslations('SignupForm');

  const signupSchema = z.object({
    firstname: z.string().min(1, tSignupForm('firstNameRequired')),
    lastname: z.string().min(1, tSignupForm('lastNameRequired')),
    email: z.string().email(tSignupForm('invalidEmail')),
    privacyPolicy: z.boolean().refine((val) => val === true, {
      message: tSignupForm('privacyPolicyRequired'),
    }),
  });
  type SignupFormValues = z.infer<typeof signupSchema>;
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstname: '',
      lastname: '',
      email: '',
      privacyPolicy: false,
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
      document.cookie = `${key}=${value}; path=/; max-age=604800; SameSite=Strict; Secure`;
    });
    onClose(userInfo);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-dark/50">
      <div className="w-full max-w-md rounded-lg bg-accent p-8 shadow-xl">
        <h2 className="mb-6 text-center text-2xl font-bold text-primary-dark">
          {tSignupForm('title')}
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="firstname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary-dark">{tSignupForm('firstName')}</FormLabel>
                  <FormControl>
                    <InputField
                      {...field}
                      className="w-full border-primary-light/30 bg-accent text-primary-dark placeholder:text-primary-medium/70 focus:border-primary-medium focus:ring-primary-medium"
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
                  <FormLabel className="text-primary-dark">{tSignupForm('lastName')}</FormLabel>
                  <FormControl>
                    <InputField
                      {...field}
                      className="w-full border-primary-light/30 bg-accent text-primary-dark placeholder:text-primary-medium/70 focus:border-primary-medium focus:ring-primary-medium"
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
                  <FormLabel className="text-primary-dark">{tSignupForm('email')}</FormLabel>
                  <FormControl>
                    <InputField
                      {...field}
                      type="email"
                      className="w-full border-primary-light/30 bg-accent text-primary-dark placeholder:text-primary-medium/70 focus:border-primary-medium focus:ring-primary-medium"
                    />
                  </FormControl>
                  <FormMessage className="text-destructive" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="privacyPolicy"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm text-primary-dark">
                      {tSignupForm('privacyPolicyLabel')}{' '}
                      <a
                        href="/privacy-policy"
                        className="text-primary-medium underline hover:text-primary-dark"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {tSignupForm('privacyPolicyLink')}
                      </a>
                    </FormLabel>
                    <FormMessage className="text-destructive" />
                  </div>
                </FormItem>
              )}
            />
            <div className="flex gap-4">
              <Button
                type="submit"
                className="flex-1 bg-primary-medium text-accent transition-colors hover:bg-primary-dark"
                disabled={isSubmitting}
              >
                {isSubmitting ? tSignupForm('submitting') : tSignupForm('submit')}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
