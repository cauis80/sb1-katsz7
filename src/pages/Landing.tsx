import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Typewriter from 'typewriter-effect';
import {
  BookOpen,
  Calendar,
  Users,
  BarChart3,
  MessageSquare,
  Award,
  Briefcase,
  GraduationCap,
  Target,
  Zap,
  CheckCircle,
  Building2,
  Clock,
  Heart,
} from 'lucide-react';

const features = [
  { 
    name: 'Catalogue complet',
    description: 'Gérez votre catalogue de formations en toute simplicité',
    icon: BookOpen 
  },
  { 
    name: 'Planning intelligent',
    description: 'Planifiez et organisez vos sessions efficacement',
    icon: Calendar 
  },
  { 
    name: 'Gestion des inscriptions',
    description: 'Suivez les inscriptions et les participants',
    icon: Users 
  },
  { 
    name: 'Rapports détaillés',
    description: 'Analysez vos données avec des rapports complets',
    icon: BarChart3 
  },
  { 
    name: 'Évaluations intégrées',
    description: 'Collectez les retours et améliorez vos formations',
    icon: MessageSquare 
  },
  { 
    name: 'Certifications',
    description: 'Gérez les attestations et certifications',
    icon: Award 
  },
];

const benefits = [
  {
    title: 'Pour les entreprises',
    icon: Building2,
    items: [
      'Suivi des formations des employés',
      'Gestion du budget formation',
      'Rapports de progression',
      'Planification simplifiée'
    ]
  },
  {
    title: 'Pour les formateurs',
    icon: GraduationCap,
    items: [
      'Gestion du planning',
      'Suivi des participants',
      'Matériel pédagogique',
      'Évaluations automatisées'
    ]
  },
  {
    title: 'Pour les participants',
    icon: Users,
    items: [
      'Inscription en ligne',
      'Accès aux supports',
      'Suivi de progression',
      'Certificats numériques'
    ]
  }
];

const stats = [
  { value: '98%', label: 'Satisfaction client', icon: Heart },
  { value: '2000+', label: 'Formations réalisées', icon: Target },
  { value: '24/7', label: 'Support disponible', icon: Clock },
  { value: '15min', label: 'Temps de réponse moyen', icon: Zap },
];

export default function Landing() {
  return (
    <div className="bg-white">
      <header className="fixed w-full bg-white shadow-sm z-50">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-primary-600">FormationPro</div>
            <Link
              to="/login"
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Connexion
            </Link>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="pt-32 pb-20 px-6 bg-gradient-to-b from-gray-50 to-white"
        >
          <div className="container mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Gérez vos formations professionnelles{' '}
              <span className="text-primary-600">
                <Typewriter
                  options={{
                    strings: ['efficacement', 'simplement', 'intelligemment'],
                    autoStart: true,
                    loop: true,
                  }}
                />
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Une plateforme complète pour planifier, organiser et suivre vos
              formations professionnelles en toute simplicité.
            </p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex justify-center gap-4"
            >
              <Link
                to="/login"
                className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-lg font-medium"
              >
                Commencer maintenant
              </Link>
            </motion.div>
          </div>
        </motion.section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Fonctionnalités principales
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <feature.icon className="w-12 h-12 text-primary-600 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.name}
                  </h3>
                  <p className="text-gray-600 text-center">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Une solution pour tous
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
                >
                  <div className="flex items-center mb-4">
                    <benefit.icon className="w-8 h-8 text-primary-600 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-900">
                      {benefit.title}
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    {benefit.items.map((item, itemIndex) => (
                      <motion.li
                        key={itemIndex}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: itemIndex * 0.1 }}
                        className="flex items-start"
                      >
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600">{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-primary-600 text-white">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-4">
                    <stat.icon className="w-8 h-8" />
                  </div>
                  <div className="text-4xl font-bold mb-2">{stat.value}</div>
                  <div className="text-primary-100">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Prêt à transformer votre gestion de formation ?
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Rejoignez les entreprises qui font confiance à FormationPro pour gérer leurs formations professionnelles.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-lg font-medium"
              >
                Commencer gratuitement
                <Briefcase className="ml-2 w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-500 mb-4">
              FormationPro
            </div>
            <p className="text-gray-400">
              © 2024 FormationPro. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}