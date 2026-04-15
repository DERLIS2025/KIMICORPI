import { Leaf, Facebook, Instagram, Phone, Mail, MapPin } from 'lucide-react';
import type { View } from '@/types';

interface FooterProps {
  onViewChange: (view: View) => void;
}

export function Footer({ onViewChange }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    productos: [
      { label: 'Césped natural', view: 'catalog', category: 'cesped' },
      { label: 'Riego automático', view: 'catalog', category: 'riego' },
      { label: 'Jardinería', view: 'catalog', category: 'plantas' },
      { label: 'Decoración', view: 'catalog', category: 'decoracion' },
    ],
    sitio: [
      { label: 'Inicio', view: 'home' },
      { label: 'Nosotros', view: 'home' },
      { label: 'Servicios', view: 'home' },
      { label: 'Contacto', view: 'home' },
    ],
  };

  return (
    <footer id="contacto" className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <button 
              onClick={() => onViewChange('home')}
              className="flex items-center gap-2 mb-4"
            >
              <div className="bg-green-600 p-2 rounded-lg">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-xl font-bold">CORPI</span>
                <span className="text-xs text-green-400 -mt-1">& Cía</span>
              </div>
            </button>
            <p className="text-gray-400 text-sm mb-6">
              Servicio de jardinería y empastado en Paraguay. Soluciones profesionales para transformar tu espacio exterior.
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com/corpi.jardin"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com/corpi_y_ciaa"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/595992588770"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg font-bold mb-4">Productos</h3>
            <ul className="space-y-2">
              {footerLinks.productos.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => onViewChange(link.view as View)}
                    className="text-gray-400 hover:text-green-400 transition-colors text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Site */}
          <div>
            <h3 className="text-lg font-bold mb-4">Sitio</h3>
            <ul className="space-y-2">
              {footerLinks.sitio.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => onViewChange(link.view as View)}
                    className="text-gray-400 hover:text-green-400 transition-colors text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-300">+595 992 588 770</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-300">info@corpicia.com</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-300">Asunción, Paraguay</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © {currentYear} Corpi & Cia. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
