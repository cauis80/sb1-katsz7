import React from 'react';
import { X, Building2, MapPin, Phone, Mail, User } from 'lucide-react';
import type { Company } from '../../types';

const STATUS_COLORS = {
  active: 'bg-green-50 text-green-700',
  inactive: 'bg-red-50 text-red-700',
};

const STATUS_LABELS = {
  active: 'Actif',
  inactive: 'Inactif',
};

interface CompanyDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company;
}

export default function CompanyDetailsModal({
  isOpen,
  onClose,
  company,
}: CompanyDetailsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {company.name}
              </h2>
              <span
                className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  STATUS_COLORS[company.status]
                }`}
              >
                {STATUS_LABELS[company.status]}
              </span>
            </div>
            <button onClick={onClose}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Entreprise</p>
                  <p className="text-sm text-gray-600">{company.name}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Adresse</p>
                  <p className="text-sm text-gray-600">{company.address}</p>
                  <p className="text-sm text-gray-600">
                    {company.postalCode} {company.city}
                  </p>
                  <p className="text-sm text-gray-600">{company.country}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Contact</p>
                  <p className="text-sm text-gray-600">{company.contactName}</p>
                  <p className="text-sm text-gray-600">{company.contactRole}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Téléphone</p>
                  <p className="text-sm text-gray-600">{company.phone}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Email</p>
                  <p className="text-sm text-gray-600">{company.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}