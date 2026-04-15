import { useState } from 'react';
import { Mail, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <section className="py-16 bg-green-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Recibí novedades
          </h2>
          
          <p className="text-green-100 mb-8">
            Suscribite para recibir ofertas, nuevos productos y recomendaciones para tu jardín directamente en tu correo.
          </p>

          {submitted ? (
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 text-white">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">¡Gracias por suscribirte!</h3>
              <p>Pronto recibirás nuestras novedades.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Ingresá tu correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white border-0 h-12 text-gray-900 placeholder:text-gray-500"
                required
              />
              <Button 
                type="submit"
                className="bg-green-900 hover:bg-green-800 text-white h-12 px-8"
              >
                Suscribirme
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
