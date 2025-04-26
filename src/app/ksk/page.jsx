"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronRight, BarChart2, Package, Clock, Users, Database, PieChart, Menu, X, ArrowRight } from "lucide-react"

export default function ShetkariKrushiSoftware() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      title: "Efficient Stock Management",
      description: "Sales as per upcoming expiry of stock. Single view for outstanding.",
      icon: <Database className="w-6 h-6" />,
    },
    {
      title: "Flexible Pricing and Sales",
      description: "Multiple Sales Rate (MRP/Cash/Credit/Wholesale). Crop selection for Bill & useful reports.",
      icon: <BarChart2 className="w-6 h-6" />,
    },
    {
      title: "Seamless Inventory Tracking",
      description: "Real-time inventory updates. Low stock alerts and automated reordering.",
      icon: <Package className="w-6 h-6" />,
    },
    {
      title: "Comprehensive Reporting",
      description: "Detailed analytics and insights. Export reports in multiple formats.",
      icon: <PieChart className="w-6 h-6" />,
    },
  ]

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4 md:px-12 lg:px-24">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="relative w-10 h-10 md:w-12 md:h-12">
              <div className="absolute inset-0 bg-emerald-500 rounded-full opacity-20 animate-pulse"></div>
              <Image
                src="/placeholder.svg?height=48&width=48"
                alt="SoulSoft Logo"
                width={48}
                height={48}
                className="relative z-10"
              />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
              SoulSoft
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {["Home", "About Us", "Services", "POS Products", "Career", "Blog", "Contact"].map((item) => (
              <Link key={item} href="#" className="text-gray-300 hover:text-emerald-400 transition-colors duration-300">
                {item}
              </Link>
            ))}
          </div>

          <button className="md:hidden text-gray-300" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden mt-4 py-4 flex flex-col gap-4"
          >
            {["Home", "About Us", "Services", "POS Products", "Career", "Blog", "Contact"].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-gray-300 hover:text-emerald-400 transition-colors duration-300 py-2"
              >
                {item}
              </Link>
            ))}
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 px-6 md:px-12 lg:px-24">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-900/20 to-black/80"></div>
          <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-500/10 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-teal-500/10 rounded-full filter blur-3xl"></div>
        </div>

        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex flex-col gap-6">
            <motion.h1 variants={fadeIn} className="text-4xl md:text-5xl lg:text-6xl font-bold">
              <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                Shetkari Krushi
              </span>
              <br />
              Software
            </motion.h1>

            <motion.p variants={fadeIn} className="text-gray-300 text-lg md:text-xl">
              Use Krishi Seva Kendra accounting in a minute, anywhere and anytime.
            </motion.p>

            <motion.p variants={fadeIn} className="text-gray-400">
              Very easy and useful farmer Krishi Billing Software for billing of Krishi Seva Kendras (Serving 1500+
              Krishi Seva Kendras)
            </motion.p>

            <motion.div variants={fadeIn} className="flex gap-4 mt-4">
              <button className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-3 rounded-full font-medium flex items-center gap-2 hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300">
                Get Started <ArrowRight className="w-4 h-4" />
              </button>
              <button className="border border-emerald-500/30 px-6 py-3 rounded-full font-medium hover:bg-emerald-500/10 transition-all duration-300">
                Learn More
              </button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 rounded-2xl blur-xl"></div>
            <div className="relative bg-gradient-to-tr from-gray-900 to-gray-800 p-2 rounded-2xl border border-gray-700/50">
              <Image
                src="/placeholder.svg?height=600&width=800"
                alt="Shetkari Krushi Software Interface"
                width={800}
                height={600}
                className="rounded-xl w-full h-auto"
              />
            </div>
            <div className="absolute -bottom-5 -right-5 bg-black/80 backdrop-blur-sm border border-emerald-500/20 rounded-lg p-3 shadow-xl">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-sm font-medium">1500+ Active Users</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 md:px-12 lg:px-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black to-gray-900"></div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
              1500+
            </h3>
            <p className="text-gray-400 mt-2">Krishi Seva Kendras</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
              60s
            </h3>
            <p className="text-gray-400 mt-2">Quick Setup</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
              <Database className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
              100%
            </h3>
            <p className="text-gray-400 mt-2">Data Security</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
              <BarChart2 className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
              24/7
            </h3>
            <p className="text-gray-400 mt-2">Support Available</p>
          </div>
        </motion.div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 md:px-12 lg:px-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black"></div>
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                Works?
              </span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our powerful agricultural management software simplifies operations for Krishi Seva Kendras
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 rounded-2xl blur-xl"></div>
              <div className="relative overflow-hidden rounded-2xl border border-gray-700/50">
                <Image
                  src="/placeholder.svg?height=600&width=800"
                  alt="Shetkari Krushi Software Dashboard"
                  width={800}
                  height={600}
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-sm font-medium text-emerald-400">Live Dashboard</span>
                  </div>
                  <h3 className="text-xl font-bold">Powering 1500+ Agri Centers</h3>
                  <p className="text-gray-300 text-sm">with Seamless Billing & Inventory Management</p>
                </div>
              </div>
            </motion.div>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`p-6 rounded-xl transition-all duration-300 ${
                    activeFeature === index
                      ? "bg-gradient-to-r from-emerald-900/50 to-teal-900/50 border border-emerald-500/30"
                      : "bg-gray-800/30 border border-gray-700/30 hover:bg-gray-800/50"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-lg ${
                        activeFeature === index ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-700/50 text-gray-300"
                      }`}
                    >
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                      <p className="text-gray-400">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 md:px-12 lg:px-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black to-gray-900"></div>
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                Features
              </span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Comprehensive tools designed specifically for agricultural business management
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={staggerContainer}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              { title: "Sales Management", desc: "Track all sales transactions with detailed customer information" },
              { title: "Inventory Control", desc: "Manage stock levels with expiry tracking and low stock alerts" },
              { title: "Customer Database", desc: "Maintain comprehensive customer profiles and purchase history" },
              { title: "Financial Reporting", desc: "Generate detailed financial reports and statements" },
              {
                title: "Multi-location Support",
                desc: "Manage multiple Krishi Seva Kendra locations from one dashboard",
              },
              { title: "Offline Capability", desc: "Continue operations even without internet connectivity" },
              { title: "Mobile Accessibility", desc: "Access your data from any device, anywhere, anytime" },
              { title: "Data Security", desc: "Enterprise-grade security to protect your valuable business data" },
              { title: "Easy Integration", desc: "Seamlessly connect with other business tools and systems" },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 rounded-xl p-6 hover:bg-gray-800/50 hover:border-emerald-500/20 transition-all duration-300"
              >
                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-emerald-400 font-bold">{index + 1}</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 md:px-12 lg:px-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black"></div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-4xl mx-auto bg-gradient-to-r from-emerald-900/40 to-teal-900/40 backdrop-blur-sm border border-emerald-500/30 rounded-2xl p-8 md:p-12 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
              Agricultural Business?
            </span>
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join 1500+ Krishi Seva Kendras already using our software to streamline their operations and boost
            productivity
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-4 rounded-full font-medium flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300">
              Get Started Now <ChevronRight className="w-5 h-5" />
            </button>
            <button className="border border-emerald-500/30 px-8 py-4 rounded-full font-medium hover:bg-emerald-500/10 transition-all duration-300">
              Request Demo
            </button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 md:px-12 lg:px-24 border-t border-gray-800">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-emerald-500 rounded-full opacity-20 animate-pulse"></div>
                <Image
                  src="/placeholder.svg?height=40&width=40"
                  alt="SoulSoft Logo"
                  width={40}
                  height={40}
                  className="relative z-10"
                />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                SoulSoft
              </span>
            </div>
            <p className="text-gray-400 mb-4">
              Empowering agricultural businesses with innovative software solutions since 2005.
            </p>
            <div className="flex gap-4">
              {["Facebook", "Twitter", "LinkedIn", "Instagram"].map((social) => (
                <Link
                  key={social}
                  href="#"
                  className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-emerald-500/20 transition-colors duration-300"
                >
                  <span className="sr-only">{social}</span>
                  <div className="w-4 h-4 bg-gray-400 mask-image"></div>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {["Home", "About Us", "Services", "Products", "Career", "Blog", "Contact"].map((link) => (
                <li key={link}>
                  <Link href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Products</h3>
            <ul className="space-y-2">
              {["Shetkari Krushi Software", "POS System", "Inventory Management", "Financial Tools", "Mobile App"].map(
                (product) => (
                  <li key={product}>
                    <Link href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300">
                      {product}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-400">
              <li>SoulSoft Infotech</li>
              <li>123 Tech Park, Pune</li>
              <li>Maharashtra, India</li>
              <li>contact@soulsoft.in</li>
              <li>+91 1234567890</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} SoulSoft Infotech. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
