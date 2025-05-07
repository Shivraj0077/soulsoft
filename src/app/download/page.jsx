"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"


export default function SoftwareGallery() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isLoaded, setIsLoaded] = useState(false)
  const [hoveredItem, setHoveredItem] = useState(null)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const softwareItems = [
    {
      id: 1,
      name: "SQL Server",
      version: "2019",
      bitVersion: "32bit",
      category: "database",
      imageUrl: "/sql server.png?height=120&width=120",
      downloadUrl: "https://drive.google.com/file/d/1XHZaHyuVQe0_SAh03PAtfQc0vZFXQkRh/view",
    },
    {
      id: 2,
      name: "SQL Server",
      version: "2019",
      bitVersion: "64bit",
      category: "database",
      imageUrl: "/sql server.png?height=160&width=140",
      downloadUrl: "#https://drive.google.com/file/d/1heRpPYBnYnRlGqMBFRKn1oZFV9_Ez14L/view",
    },
    {
      id: 3,
      name: "Crystal Report",
      version: "13.0",
      bitVersion: "32bit",
      category: "reporting",
      imageUrl: "/crystal.png?height=120&width=120",
      downloadUrl: "https://drive.google.com/file/d/1r3nyCEOdlf60hAEzOAUGKpDUMnsrjj-O/view",
    },
    {
      id: 4,
      name: "Crystal Report",
      version: "13.0",
      bitVersion: "64bit",
      category: "reporting",
      imageUrl: "/crystal.png?height=120&width=120",
      downloadUrl: "https://drive.google.com/file/d/1lMA6HAxshN1ykvgnRgtVYQrsmz_o3xyC/view",
    },
    {
      id: 5,
      name: "ultraviewer",
      version: "22.01",
      bitVersion: "both",
      category: "utility",
      imageUrl: "/ultraviewer.webp?height=120&width=120",
      downloadUrl: "https://www.ultraviewer.net/en/download.html",
    },
    {
      id: 6,
      name: "WinRAR",
     
      version: "6.11",
      bitVersion: "both",
      category: "utility",
      imageUrl: "/winrar.webp?height=120&width=120",
      downloadUrl: "https://www.win-rar.com/start.html?&L=0",
    },
    {
      id: 7,
      name: "Google Translate",
     
      version: "Latest",
      bitVersion: "both",
      category: "utility",
      imageUrl: "/translate.png?height=120&width=120",
      downloadUrl: "https://drive.google.com/file/d/1oFt2HzPYqM900jcoIq84sWprcRJfQIhb/view",
    },
    {
      id: 8,
      name: "7-Zip",
     
      version: "Latest",
      bitVersion: "both",
      category: "utility",
      imageUrl: "/7zip.png?height=120&width=120",
      downloadUrl: "https://www.ultraviewer.net/en/download.html",
    },
    {
      id: 9,
      name: "unicode font" ,
      version: "Latest",
      bitVersion: "both",
      category: "utility",
      imageUrl: "/unicode.png?height=120&width=120",
      downloadUrl: "https://drive.google.com/file/d/1hvVeb2gaBFTva17Zy3_MM2CtLhtsS5Oq/view",
    },
    {
      id: 10,
      name: "barcode font" ,
      
      version: "Latest",
      bitVersion: "both",
      category: "utility",
      imageUrl: "/barcode.png?height=120&width=120",
      downloadUrl: "https://drive.google.com/file/d/1PkQMlCRAHM9Yf93U_pUXk60gtmh3wZjX/view",
    },
  ]

  const categories = ["all", ...new Set(softwareItems.map((item) => item.category))]

  const filteredItems =
    selectedCategory === "all" ? softwareItems : softwareItems.filter((item) => item.category === selectedCategory)

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : -20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
            Software Download Center
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Click on any software to download the required version for your system
          </p>
        </motion.div>

       

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.9 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.2 },
              }}
              onHoverStart={() => setHoveredItem(item.id)}
              onHoverEnd={() => setHoveredItem(null)}
            >
              <Card className="bg-gray-900 border-gray-800 overflow-hidden h-full flex flex-col">
                <CardHeader className="relative p-0">
                  <div className="relative w-full pt-[100%]">
                    <div className="absolute inset-0 flex items-center justify-center p-6">
                      <img
                        src={item.imageUrl || "/placeholder.svg"}
                        alt={item.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    {item.bitVersion !== "both" && (
                      <div className="absolute top-0 right-0">
                        <div className="w-20 h-10 bg-red-600 rotate-45 transform origin-top-right">
                          <span className="absolute bottom-1 right-1 text-white text-s font-bold rotate-[-45deg] transform">
                            {item.bitVersion}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-grow p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <Badge variant="outline" className="ml-2">
                      v{item.version}
                    </Badge>
                  </div>
                  <p className="text-gray-400 text-sm">{item.description}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="default"
                          className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 transition-all duration-300 text-white"
                          onClick={() => window.open(item.downloadUrl, "_blank")}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Download {item.name} {item.bitVersion}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardFooter>

                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent opacity-0 pointer-events-none"
                  animate={{
                    opacity: hoveredItem === item.id ? 0.6 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
