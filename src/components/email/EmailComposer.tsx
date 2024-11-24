import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { sendEmail, emailTemplates } from '../../lib/email';

const emailSchema = z.object({
  subject: z.string().min(1, 'Le sujet est requis'),
  message: z.string().min(1, 'Le message est requis'),
});

type EmailForm = z.infer<typeof emailSchema>;

interface EmailComposerProps {
  isOpen: boolean;
  onClose: () => void;
  recipients: Array<{ email: string; name: string }>;
  onSuccess?: () => void;
  defaultSubject?: string;
  defaultMessage?: string;
}

export default function EmailComposer({
  isOpen,
  onClose,
  recipients,
  onSuccess,
  defaultSubject = '',
  defaultMessage = '',
}: EmailComposerProps) {
  const [isSending, setIsSending] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      subject: defaultSubject,
      message: defaultMessage,
    },
  });

  const onSubmit = async (data: EmailForm) => {
    setIsSending(true);
    try {
      const result = await sendEmail({
        to: recipients.map(r => r.email),
        subject: data.subject,
        html: emailTemplates.customMessage(data.subject, data.message),
      });

      if (result.success) {
        onSuccess?.();
        onClose();
      } else {
        alert('Erreur lors de l\'envoi de l\'email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Erreur lors de l\'envoi de l\'email');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = textarea.value;
      textarea.value = value.substring(0, start) + '\n' + value.substring(end);
      textarea.selectionStart = textarea.selectionEnd = start + 1;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Composer un email</h2>
            <button onClick={onClose}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Destinataires</h3>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex flex-wrap gap-2">
                {recipients.map((recipient, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                  >
                    {recipient.name} ({recipient.email})
                  </span>
                ))}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Sujet
              </label>
              <input
                type="text"
                {...register('subject')}
                className="input mt-1"
              />
              {errors.subject && (
                <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                {...register('message')}
                rows={8}
                className="input mt-1 whitespace-pre-wrap"
                onKeyDown={handleKeyDown}
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary px-4 py-2"
                disabled={isSending}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn btn-primary px-4 py-2"
                disabled={isSending}
              >
                {isSending ? 'Envoi en cours...' : 'Envoyer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}