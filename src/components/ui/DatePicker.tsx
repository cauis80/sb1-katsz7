import React, { forwardRef } from 'react';
import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker';
import { Calendar } from 'lucide-react';
import { format, parse } from 'date-fns';
import { fr } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';

interface DatePickerProps extends Omit<ReactDatePickerProps, 'onChange'> {
  error?: string;
  onChange: (value: string) => void;
  value: string;
}

const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ error, onChange, value, ...props }, ref) => {
    const date = value ? parse(value, 'dd/MM/yyyy', new Date()) : null;

    const handleChange = (date: Date | null) => {
      onChange(date ? format(date, 'dd/MM/yyyy') : '');
    };

    return (
      <div className="relative">
        <ReactDatePicker
          selected={date}
          onChange={handleChange}
          dateFormat="dd/MM/yyyy"
          locale={fr}
          className={`input pl-10 w-full ${error ? 'border-red-500' : ''}`}
          ref={ref}
          {...props}
        />
        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

DatePicker.displayName = 'DatePicker';

export default DatePicker;