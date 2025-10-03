'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { sendContactMessage } from '@/utils/api';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ContactForm>();

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);
    
    try {
      await sendContactMessage(data);
      setIsSubmitted(true);
      reset();
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      content: 'support@modernstore.com',
      description: 'Send us an email anytime'
    },
    {
      icon: Phone,
      title: 'Call Us',
      content: '+91 98765 43210',
      description: 'Mon-Fri 9am-6pm IST'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      content: '123 Business Street\nMumbai, Maharashtra 400001',
      description: 'Our main office'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      content: 'Mon-Fri: 9:00 AM - 6:00 PM\nSat: 10:00 AM - 4:00 PM',
      description: 'We are closed on Sundays'
    }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 abstract-bg"></div>
        
        {/* Abstract shapes */}
        <motion.div
          className="absolute top-20 left-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold gradient-text mb-8">
              Get in Touch
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 max-w-2xl mx-auto">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <motion.div
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold gradient-text mb-6">
                Send us a Message
              </h2>

              {isSubmitted && (
                <motion.div
                  className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-2 text-green-700">
                    <Send className="h-5 w-5" />
                    <span className="font-medium">Message sent successfully!</span>
                  </div>
                  <p className="text-green-600 text-sm mt-1">
                    We'll get back to you within 24 hours.
                  </p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                  label="Full Name"
                  {...register('name', { required: 'Name is required' })}
                  error={errors.name?.message}
                />

                <Input
                  label="Email Address"
                  type="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Invalid email address'
                    }
                  })}
                  error={errors.email?.message}
                />

                <Input
                  label="Subject"
                  {...register('subject', { required: 'Subject is required' })}
                  error={errors.subject?.message}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    {...register('message', { required: 'Message is required' })}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  loading={isSubmitting}
                  className="w-full"
                  size="lg"
                >
                  Send Message
                  <Send className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div>
                <h2 className="text-2xl font-bold gradient-text mb-6">
                  Contact Information
                </h2>
                <p className="text-gray-600 text-lg mb-8">
                  Have a question or need support? We're here to help! Reach out to us 
                  through any of the following channels.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.title}
                    className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <info.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {info.title}
                        </h3>
                        <div className="text-gray-600 mb-1 whitespace-pre-line">
                          {info.content}
                        </div>
                        <p className="text-sm text-gray-500">
                          {info.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* FAQ Section */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Frequently Asked Questions
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium text-gray-900">How long does shipping take?</p>
                    <p className="text-gray-600">Most orders are delivered within 3-5 business days.</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">What's your return policy?</p>
                    <p className="text-gray-600">We offer a 30-day return policy for unused items.</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Do you ship internationally?</p>
                    <p className="text-gray-600">Currently, we only ship within India.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}