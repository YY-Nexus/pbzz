import Image from "next/image"

import pengpeng1 from "../../public/images/pengpeng/pengpeng1.jpg"
import pengpeng2 from "../../public/images/pengpeng/pengpeng2.jpg"
import pengpeng3 from "../../public/images/pengpeng/pengpeng3.jpg"
import pengpeng4 from "../../public/images/pengpeng/pengpeng4.jpg"
import pengpeng5 from "../../public/images/pengpeng/pengpeng5.jpg"
import pengpeng6 from "../../public/images/pengpeng/pengpeng6.jpg"

import lady1 from "../../public/images/lady/lady1.jpg"
import lady2 from "../../public/images/lady/lady2.jpg"
import lady3 from "../../public/images/lady/lady3.jpg"
import lady4 from "../../public/images/lady/lady4.jpg"
import lady5 from "../../public/images/lady/lady5.jpg"
import lady6 from "../../public/images/lady/lady6.jpg"
import lady7 from "../../public/images/lady/lady7.jpg"
import lady8 from "../../public/images/lady/lady8.jpg"

const pengpengImages = [pengpeng1, pengpeng2, pengpeng3, pengpeng4, pengpeng5, pengpeng6]

const ladyImages = [lady1, lady2, lady3, lady4, lady5, lady6, lady7, lady8]

const GallerySection = () => {
  // const allHorizontalImages = [...pengpengImages, ...ladyImages];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Gallery</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pengpengImages.map((image, index) => (
            <div key={index} className="relative rounded-lg overflow-hidden shadow-md">
              <Image
                src={image || "/placeholder.svg"}
                alt={`Pengpeng ${index + 1}`}
                width={500}
                height={300}
                className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
          {ladyImages.map((image, index) => (
            <div key={index} className="relative rounded-lg overflow-hidden shadow-md">
              <Image
                src={image || "/placeholder.svg"}
                alt={`Lady ${index + 1}`}
                width={500}
                height={300}
                className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default GallerySection
