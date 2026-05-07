'use client';




import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, MessageSquare, Shield, Clock } from 'lucide-react';




const contactSchema = z.object({
  name: z.string().min(2, 'Nom trop court'),
  email: z.string().email('Email invalide'),
  subject: z.enum(['support', 'billing', 'privacy', 'partnership', 'other'], {
    errorMap: () => ({ message: 'Choisissez un sujet' }),
  }),
  message: z.string().min(20, 'Message trop court (20 caractères minimum)').max(2000, 'Message trop long'),
  gdpr: z.boolean().refine((v) => v === true, { message: 'Consentement requis' }),
});




type ContactFormData = z.infer<typeof contactSchema>;




const SUBJECTS = [
  { value: 'support', label: '🛠️ Support technique' },
  { value: 'billing', label: '💳 Facturation / abonnement' },
  { value: 'privacy', label: '🔒 Protection des données (RGPD)' },
  { value: 'partnership', label: '🤝 Partenariat / presse' },
  { value: 'other', label: '💬 Autre' },
];




export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);




  const {
    register,
    handleSubmit,
