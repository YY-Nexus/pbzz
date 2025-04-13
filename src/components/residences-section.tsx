import type React from "react"

interface Residence {
  id: number
  name: string
  location: string
  image: string
  price: number
  bedrooms: number
  bathrooms: number
  squareFootage: number
  description: string
}

interface ResidencesSectionProps {
  residences: Residence[]
}

const ResidencesSection: React.FC<ResidencesSectionProps> = ({ residences }) => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Featured Residences</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {residences.map((residence) => (
            <div key={residence.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={residence.image || "/placeholder.svg"}
                alt={residence.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{residence.name}</h3>
                <p className="text-gray-600 mb-2">{residence.location}</p>
                <p className="text-gray-700 font-bold">${residence.price.toLocaleString()}</p>
                <div className="flex items-center mt-4">
                  <span className="text-gray-500 mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 inline-block"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9 2a1 1 0 00-.894.553L7.382 4H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-3.382l-.724-1.447A1 1 0 0011 2H9z" />
                    </svg>
                    {residence.bedrooms} Beds
                  </span>
                  <span className="text-gray-500 mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 inline-block"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zM3 5h14a1 1 0 011 1v8a1 1 0 01-1 1H3a1 1 0 01-1-1V6a1 1 0 011-1z" />
                    </svg>
                    {residence.bathrooms} Baths
                  </span>
                  <span className="text-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 inline-block"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.984.825l.158.316c.465.93.777 1.916.908 2.907a1 1 0 01-.242 1.026l-.158.316a1 1 0 01-.984.825H3a1 1 0 01-1-1V3zM12 3a1 1 0 011-1h2.153a1 1 0 01.984.825l.158.316c.465.93.777 1.916.908 2.907a1 1 0 01-.242 1.026l-.158.316a1 1 0 01-.984.825H13a1 1 0 01-1-1V3zM3 5h10a2 2 0 00-2 2v6a2 2 0 002 2H3V5zm10 10a1 1 0 012 0h3a1 1 0 110 2h-3a1 1 0 01-2 0v-2zm-10 0a1 1 0 012 0h3a1 1 0 110 2h-3a1 1 0 01-2 0v-2z" />
                    </svg>
                    {residence.squareFootage} Sq Ft
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ResidencesSection
