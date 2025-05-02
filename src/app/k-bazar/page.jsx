"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronRight, BarChart2, Package, Clock, Users, Database, PieChart, Menu, X, ArrowRight } from "lucide-react"
import Footer from "../../../components/Footer"

export default function KiranaBazaarSoftware() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      title: "Customer Point System",
      description: "Enables a customer points system with redeemable rewards for enhanced loyalty and engagement.",
      icon: <Users className="w-6 h-6" />,
    },
    {
      title: "GST & Non-GST Transactions",
      description: "Supports both GST and non-GST purchase and sales transactions within a single interface.",
      icon: <BarChart2 className="w-6 h-6" />,
    },
    {
      title: "Single Interface for Outstanding",
      description: "Consolidates outstanding balances for both suppliers and customers into a single interface.",
      icon: <Database className="w-6 h-6" />,
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
                K-Bazaar Billing
              </span>
              <br />
              Software
            </motion.h1>

            <motion.p variants={fadeIn} className="text-gray-300 text-lg md:text-xl">
              A solid solution to solve various problems in your grocery business!
            </motion.p>

            <motion.p variants={fadeIn} className="text-gray-400">
              Now your focus will be fully on customer service and business growth, because Kirana Bazaar software is the answer to your every management problem.
            </motion.p>

            <motion.div variants={fadeIn} className="flex gap-4 mt-4">
              <button className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-3 rounded-full font-medium flex items-center gap-2 hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300">
                Get Started <ArrowRight className="w-4 h-4" />
              </button>
              <button 
  onClick={() => window.open('https://www.youtube.com/watch?v=cgPNFA8y_U0', '_blank')}
  className="border border-emerald-500/30 px-6 py-3 rounded-full font-medium hover:bg-emerald-500/10 transition-all duration-300"
>
  Product Demo
</button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-white/70 rounded-2xl blur-xl"></div>
         <div className="relative bg-gradient-to-tr from-gray-900 to-gray-800 p-2 rounded-2xl border border-gray-700/50">
                      <Image
                        src="/k-bb.png?height=800&width=800"
                        alt="Shetkari Krushi Software Interface"
                        width={800}
                        height={600}
                        className="rounded-xl w-full h-auto"
                      />
                    </div>
            <div className="absolute -bottom-5 -right-5 bg-black/80 backdrop-blur-sm border border-emerald-500/20 rounded-lg p-3 shadow-xl">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-sm font-medium">Trusted by Grocery Businesses</span>
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
              1000+
            </h3>
            <p className="text-gray-400 mt-2">Grocery Stores</p>
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
              Kirana Bazaar software simplifies grocery business management with powerful tools
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
                  src="/tax.png?height=600&width=800"
                  alt="Kirana Bazaar Software Dashboard"
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
                  <h3 className="text-xl font-bold">Powering Grocery Businesses</h3>
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
              Benefits of{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                K-Bazaar
              </span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Comprehensive tools designed specifically for grocery business management
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
              { title: "Fast Barcode Billing", desc: "Very easy and fast barcode billing interface for quick transactions" },
              { title: "Multi-Location Stock", desc: "Manage different stock locations (purchase at godown & sales from shop)" },
              { title: "Counter & Employee Management", desc: "Separate counter and employee management for streamlined operations" },
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
              Grocery Business?
            </span>
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Streamline your grocery operations with Kirana Bazaar software and focus on growth
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-4 rounded-full font-medium flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300">
              Get Started Now <ChevronRight className="w-5 h-5" />
            </button>
           
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <Footer/>
    </div>
  )
}