import React from 'react';
import { BarChart3, Download } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Rapports</h1>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 flex items-center gap-2">
          <Download className="w-4 h-4" />
          Exporter
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-center h-48">
            <BarChart3 className="w-12 h-12 text-gray-400" />
          </div>
          <p className="text-gray-500 text-center">Page en construction</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-center h-48">
            <BarChart3 className="w-12 h-12 text-gray-400" />
          </div>
          <p className="text-gray-500 text-center">Page en construction</p>
        </div>
      </div>
    </div>
  );
}