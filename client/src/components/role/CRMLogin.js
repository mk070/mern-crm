import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Building2, CircleUserRound, ChevronRight } from 'lucide-react';

const cardsData = [
  { 
    title: 'ADMIN',
    path: '/adminlogin',
    icon: CircleUserRound,
    description: 'Access administrative controls and manage system settings',
    bgGradient: 'from-indigo-600 to-teal-500'
  },
  { 
    title: 'EMPLOYEE',
    path: '/employeelogin',
    icon: Users,
    description: 'Login to your employee dashboard and manage your tasks',
    bgGradient: 'from-indigo-600 to-teal-500'
  }
];

export default function CRMLogin() {
  const navigate = useNavigate();
  const cardsRef = useRef([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Set initial state for cards
    cardsRef.current.forEach((card, index) => {
      if (card) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
      }
    });

    // Trigger entrance animations with a slight delay for visual appeal
    const timeout = setTimeout(() => {
      setIsLoaded(true);
      cardsRef.current.forEach((card, index) => {
        if (card) {
          setTimeout(() => {
            card.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, index * 200);
        }
      });
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  const handleCardClick = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter',sans-serif]">
      {/* Header with gradient accent */}
      <header className="bg-white shadow-sm relative">
        <div className="h-1 bg-gradient-to-r from-indigo-600 to-teal-500"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="bg-gradient-to-r from-indigo-600 to-teal-500 rounded-lg p-2">
                <Building2 className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="ml-3">
              <h1 className="text-2xl font-bold text-gray-800 font-['Poppins',sans-serif]">
                CRM<span className="text-indigo-600">Pro</span>
              </h1>
              <p className="text-xs text-gray-500">Enterprise Management Solution</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 font-['Poppins',sans-serif]">
            Welcome to <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-teal-500">CRM Pro</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Please select your role to access the dashboard
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {cardsData.map((card, index) => (
            <div
              key={card.title}
              ref={el => cardsRef.current[index] = el}
              className="group cursor-pointer"
              onClick={() => handleCardClick(card.path)}
              aria-label={`Login as ${card.title.toLowerCase()}`}
            >
              <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                {/* Gradient top border */}
                <div className={`h-1 bg-gradient-to-r ${card.bgGradient}`}></div>
                
                <div className="p-8">
                  <div className="flex flex-col items-center">
                    <div className="p-4 rounded-full mb-6 bg-indigo-100 group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-teal-500 transition-colors duration-300">
                      <card.icon className="h-10 w-10 text-indigo-600 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3 font-['Poppins',sans-serif]">
                      {card.title}
                    </h3>
                    <p className="text-gray-600 text-center mb-6">
                      {card.description}
                    </p>
                  </div>
                  
                  <div className="mt-2">
                    <button className="w-full py-3 px-4 flex items-center justify-center rounded-lg bg-gray-100 group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-teal-500 transition-all duration-300">
                      <span className="font-medium text-gray-700 group-hover:text-white transition-colors duration-300">
                        Login as {card.title.toLowerCase()}
                      </span>
                      <ChevronRight className="ml-2 h-4 w-4 text-gray-500 group-hover:text-white transition-colors duration-300 transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Status Cards */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'System Status', status: 'Online', color: 'bg-green-500' },
              { label: 'Last Update', status: 'Today', color: 'bg-blue-500' },
              { label: 'Security', status: 'Protected', color: 'bg-indigo-600' },
              { label: 'Support', status: '24/7', color: 'bg-teal-500' }
            ].map((item, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg shadow p-4 opacity-0 transform translate-y-4"
                ref={el => {
                  if (el && isLoaded) {
                    setTimeout(() => {
                      el.style.transition = 'all 0.5s ease-out';
                      el.style.opacity = '1';
                      el.style.transform = 'translateY(0)';
                    }, 600 + index * 100);
                  }
                }}
              >
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${item.color} mr-2`}></div>
                  <div>
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className="font-medium text-gray-800">{item.status}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center border-t border-gray-200 pt-8">
          <div className="flex justify-center space-x-6 mb-4">
            {['About', 'Support', 'Privacy', 'Terms'].map((item) => (
              <a key={item} href="#" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">
                {item}
              </a>
            ))}
          </div>
          <p className="text-gray-500 text-sm">
            © 2025 CRM Pro. All rights reserved.
          </p>
        </footer>
      </main>
    </div>
  );
}