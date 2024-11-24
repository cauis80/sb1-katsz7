import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

interface BulkEmailImporterProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (emails: Array<{ email: string; name?: string }>) => void;
}

export default function BulkEmailImporter({
  isOpen,
  onClose,
  onImport,
}: BulkEmailImporterProps) {
  const [emails, setEmails] = React.useState<string>('');
  const [importedEmails, setImportedEmails] = React.useState<Array<{ email: string; name?: string }>>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text !== 'string') return;

      if (file.name.endsWith('.csv')) {
        Papa.parse(text, {
          complete: (results) => {
            const validEmails = results.data
              .filter((row: any) => row[0] && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row[0]))
              .map((row: any) => ({
                email: row[0],
                name: row[1] || undefined,
              }));
            setImportedEmails(validEmails);
          },
        });
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        const workbook = XLSX.read(text, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);
        
        const validEmails = data
          .filter((row: any) => row.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email))
          .map((row: any) => ({
            email: row.email,
            name: row.name || undefined,
          }));
        setImportedEmails(validEmails);
      }
    };

    if (file.name.endsWith('.csv')) {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
  });

  const handleManualInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEmails(e.target.value);
    const emailList = e.target.value
      .split(/[\n,;]/)
      .map(email => email.trim())
      .filter(email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      .map(email => ({ email }));
    setImportedEmails(emailList);
  };

  const handleImport = () => {
    onImport(importedEmails);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Importer des emails</h2>
            <button onClick={onClose}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Saisie manuelle
              </h3>
              <textarea
                value={emails}
                onChange={handleManualInput}
                placeholder="Entrez les adresses email (une par ligne ou séparées par des virgules)"
                rows={4}
                className="input"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-2 bg-white text-sm text-gray-500">ou</span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Importer un fichier
              </h3>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-500'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Glissez-déposez un fichier CSV ou Excel ici, ou cliquez pour sélectionner
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Formats acceptés : .csv, .xlsx, .xls
                </p>
              </div>
            </div>

            {importedEmails.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Emails importés ({importedEmails.length})
                </h3>
                <div className="bg-gray-50 p-3 rounded-lg max-h-40 overflow-y-auto">
                  <div className="space-y-1">
                    {importedEmails.map((item, index) => (
                      <div key={index} className="text-sm text-gray-600">
                        {item.name ? `${item.name} (${item.email})` : item.email}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary px-4 py-2"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleImport}
                className="btn btn-primary px-4 py-2"
                disabled={importedEmails.length === 0}
              >
                Importer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}