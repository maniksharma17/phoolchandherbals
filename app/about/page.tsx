'use client';

import { motion } from 'framer-motion';
import { Heart, Award, Users, Leaf, Shield, Truck } from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: 'Customer First',
      description: 'We prioritize our customers\' satisfaction and strive to exceed expectations in every interaction.'
    },
    {
      icon: Award,
      title: 'Quality Assured',
      description: 'Every product is carefully selected and tested to meet our high standards of quality and reliability.'
    },
    {
      icon: Users,
      title: 'Community Focused',
      description: 'We support local artisans and sustainable practices to build stronger communities.'
    },
    {
      icon: Leaf,
      title: 'Eco-Friendly',
      description: 'Committed to environmental responsibility through sustainable sourcing and packaging.'
    }
  ];

  const features = [
    {
      icon: Shield,
      title: 'Secure Shopping',
      description: 'Your data and payments are protected with industry-standard security measures.'
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Quick and reliable shipping with real-time tracking for all orders.'
    }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 abstract-bg"></div>
        
        {/* Abstract shapes */}
        <motion.div
          className="absolute top-20 right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold gradient-text mb-8">
              About ModernStore
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 mb-12">
              We're passionate about bringing you premium products that enhance your modern lifestyle. 
              Our carefully curated collection represents quality, innovation, and sustainability.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold gradient-text mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600 text-lg">
                <p>
                  ModernStore was founded with a simple vision: to create a shopping experience 
                  that combines the convenience of modern e-commerce with the personal touch of 
                  traditional retail.
                </p>
                <p>
                  We started as a small team of passionate individuals who believed that quality 
                  products should be accessible to everyone. Today, we've grown into a trusted 
                  platform that serves thousands of customers across the country.
                </p>
                <p>
                  Our commitment to excellence drives us to continuously improve our services, 
                  expand our product range, and build lasting relationships with our customers 
                  and partners.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-gray-100 rounded-3xl flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-4xl font-bold gradient-text mb-4">2024</div>
                  <p className="text-gray-600 text-lg">Founded with passion</p>
                  <div className="mt-8 space-y-4">
                    <div className="text-2xl font-bold text-primary">10,000+</div>
                    <p className="text-gray-600">Happy Customers</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold gradient-text mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                className="text-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold gradient-text mb-4">
              Why Choose Us
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the difference with our premium service
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="flex items-start gap-6 p-8 bg-gray-50 rounded-2xl"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-gray-900" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 abstract-bg">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold gradient-text mb-6">
              Our Mission
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              To revolutionize online shopping by providing an exceptional experience that combines 
              quality products, outstanding service, and innovative technology. We aim to be the 
              trusted partner in our customers' journey towards a better lifestyle.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}