"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Truck,
  Shield,
  Headphones,
  ArrowRight,
  ShieldCheck,
  Award,
  Leaf,
  Stethoscope,
  Factory,
  FlaskConical,
  Droplets,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { PageLoader } from "@/components/ui/loader";
import { getProducts } from "@/utils/api";
const AWS = process.env.NEXT_PUBLIC_AWS_URL;

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const data = await getProducts({ limit: 8 });
        setFeaturedProducts(data || []);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  if (isLoading) return <PageLoader />;

  return (
    <div className="pt-16">
      {/* Hero: full-bleed background image, no overlay, no text */}
      <section className="relative h-[70vh] sm:h-[80vh] lg:h-screen w-full">
        <Image
          src={AWS + "/" + "pch-hero-main.png"}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover hidden md:block"
        />
        <Image
          src={AWS + "/" + "Untitled+(Instagram+Post+(45))+(1).png"}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover md:hidden block"
        />
        <span className="sr-only">
          Hero image of Ayurvedic herbs and traditional preparation
        </span>
      </section>

      {/* Trust strip */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-primary" />
              <p className="text-sm md:text-base text-gray-700">
                AYUSH Licensed Manufacturer
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Award className="h-6 w-6 text-primary" />
              <p className="text-sm md:text-base text-gray-700">
                GMP Compliant Facilities
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Leaf className="h-6 w-6 text-primary" />
              <p className="text-sm md:text-base text-gray-700">
                Rare, Carefully Sourced Herbs
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Stethoscope className="h-6 w-6 text-primary" />
              <p className="text-sm md:text-base text-gray-700">
                Clinical Heritage Since 1928
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Value proposition */}
      <section className="py-20 bg-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-6">
              Timeless <span className="gradient-text">Ayurvedic Remedies</span>
              , crafted for modern lives.
            </h1>
            <p className="text-xl text-gray-700">
              Born in 1928 under the guidance of Hakim Shri Ulfat Rai Jain, our
              formulations carry the quiet wisdom of tradition. Each bottle is a
              promise: purity you can trust, results you can feel, care that
              endures.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: ShoppingBag,
                title: "Thoughtfully Curated",
                desc: "A focused range of remedies designed to meet everyday wellness needs with precision.",
              },
              {
                icon: Truck,
                title: "Fast, Reliable Delivery",
                desc: "Trackable shipments that bring care to your door—swiftly and safely.",
              },
              {
                icon: Shield,
                title: "Safe & Transparent",
                desc: "Clear labels, honest sourcing, and meticulous standards at every step.",
              },
              {
                icon: Headphones,
                title: "Care, Not Just Support",
                desc: "Real people, ready to help you choose the right remedy for you.",
              },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="p-6 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors shadow-sm"
              >
                <f.icon className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {f.title}
                </h3>
                <p className="text-gray-600">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured / Best-sellers */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold gradient-text mb-4">
              Our Originals
            </h2>
            <p className="text-lg text-gray-600">
              Carefully crafted blends trusted and loved by our community.
            </p>
          </motion.div>

          {featuredProducts.length > 0 ? (
            <>
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                {featuredProducts.slice(0, 8).map((product, index) => (
                  <motion.div
                    key={product._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                className="text-center mt-12"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Link href="/products">
                  <Button variant="secondary" size="lg" className="group">
                    View All Products
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </motion.div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No featured products available at the moment.
              </p>
              <Link href="/products" className="mt-4 inline-block">
                <Button>Browse All Products</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Story / Heritage */}
      <section className="py-20 bg-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Our Story
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Phoolchand Herbals began in 1928, guided by the renowned Hakim
              Shri Ulfat Rai Jain and a simple promise: to honor the body’s
              intelligence with authentic Ayurvedic care. From consultancy rooms
              to manufacturing floors, we grew by holding fast to the same
              values—honesty in sourcing, patience in preparation, and
              compassion in care. Many who had almost given up found relief
              here; their faith continues to shape our work today.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative aspect-square w-full h-full"
          >
            <Image
              src={AWS + "/phoolchandherbals-our-story.jpg"}
              alt="Herbal preparation"
              fill
              className="object-contain rounded-3xl overflow-hidden"
            />
          </motion.div>
        </div>
      </section>

      {/* How we craft */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold gradient-text mb-4">
              Crafted with Care
            </h2>
            <p className="text-lg text-gray-600">
              From leaf to label, every step respects tradition and science.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Leaf,
                title: "Sourcing Rare Botanicals",
                desc: "We choose precious herbs and medicinal plants with care and traceability.",
              },
              {
                icon: FlaskConical,
                title: "Slow, Precise Preparation",
                desc: "Traditional methods meet modern hygiene to preserve potency and purity.",
              },
              {
                icon: Factory,
                title: "GMP-Compliant Manufacturing",
                desc: "Every batch is produced under rigorous, documented standards.",
              },
            ].map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="p-6 rounded-2xl bg-gray-50 shadow-sm"
              >
                <s.icon className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {s.title}
                </h3>
                <p className="text-gray-600">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-primary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Certifications & Assurance
            </h2>
            <p className="text-gray-600 mt-2">
              AYUSH license • GMP for Ayurveda, Siddha & Unani
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white shadow-sm border">
              <div className="flex items-start gap-4">
                <ShieldCheck className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    AYUSH (Manufacture & Sale)
                  </h3>
                  <p className="text-gray-600">
                    Licensed to manufacture and sell Ayurvedic & Unani
                    medicines.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-white shadow-sm border">
              <div className="flex items-start gap-4">
                <Award className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    G.M.P. (Good Manufacturing Practice)
                  </h3>
                  <p className="text-gray-600">
                    Facilities and processes that uphold safety, quality, and
                    consistency.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold gradient-text mb-4">
              What People Say
            </h2>
            <p className="text-lg text-gray-600">
              Quiet words from those who chose holistic care.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              `“The oil eased my knee within days—gentle yet sure.”`,
              `“Honest labels, helpful guidance, and remedies that feel right.”`,
              `“A touch of tradition that fits my routine—simple, effective, reassuring.”`,
            ].map((q, i) => (
              <motion.blockquote
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="p-6 rounded-2xl bg-gray-50 shadow-sm text-gray-700 leading-relaxed"
              >
                <Quote className="h-6 w-6 mb-3" />
                {q}
              </motion.blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-primary/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Questions, Answered
            </h2>
            <p className="text-gray-600">Clear guidance for calm decisions.</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Are your products safe for daily use?",
                a: "Yes. Our formulations are created under expert guidance, combining traditional Ayurvedic wisdom with modern safety and hygiene standards. Please follow the dosage and directions on the label.",
              },
              {
                q: "Do you ship across India?",
                a: "Absolutely. We deliver to most pincodes across India using trusted, trackable courier partners for safe and timely delivery.",
              },
              {
                q: "Are you AYUSH and GMP certified?",
                a: "Yes. We operate GMP-compliant facilities and hold AYUSH licenses for Ayurveda, Siddha, and Unani products.",
              },
              {
                q: "How long does delivery usually take?",
                a: "Most orders are dispatched within 24–48 hours. Depending on your location, delivery usually takes 3–7 working days.",
              },
              {
                q: "Do you offer returns or exchanges?",
                a: "Yes. If you receive a damaged, defective, or incorrect product, please contact our support team within 7 days of delivery for a hassle-free replacement or refund.",
              },
              {
                q: "Can I consult an expert before buying?",
                a: "Of course. We provide access to Ayurvedic experts who can guide you on choosing the right products for your needs. Reach out through our support page to book a consultation.",
              },
            ].map((item, i) => (
              <details
                key={i}
                className="group bg-white border rounded-2xl p-5 shadow-sm"
              >
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="font-medium text-gray-900">{item.q}</span>
                  <span className="text-primary group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-gray-600">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold gradient-text mb-6">
              Begin Your Routine
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Choose a remedy that meets you where you are. Gentle, grounded,
              and effective.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button size="lg" className="group">
                  Explore Products
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="secondary" size="lg">
                  Contact
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer note */}
      <section className="py-10 bg-gray-50 text-center text-sm text-gray-500">
        <p>
          This website does not provide medical advice. Consult a qualified
          practitioner for personalized guidance.
        </p>
      </section>
    </div>
  );
}
