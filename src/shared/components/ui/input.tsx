import * as React from 'react';
import { cn } from '@/shared/lib/utils';
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Field, FieldError, FieldLabel } from './field';
import { Button } from './button';
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from 'react-hook-form';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from './combobox';

export type InputSize = 'sm' | 'md' | 'lg' | 'xl';

// ─── Helpers ────────────────────────────────────────────────────────────────
function formatCPF(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 14);

  if (digits.length <= 11) {
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }

  return digits
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
}

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 10) {
    return digits
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d{1,4})$/, '$1-$2');
  }
  return digits
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d{1,4})$/, '$1-$2');
}

function formatCEP(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  return digits.replace(/(\d{5})(\d{1,3})$/, '$1-$2');
}

function formatDecimal(value: string): string {
  let cleaned = value.replace(',', '.');
  cleaned = cleaned.replace(/[^0-9.]/g, '');
  const parts = cleaned.split('.');
  if (parts.length > 2) cleaned = parts[0] + '.' + parts.slice(1).join('');
  return cleaned;
}

// ─── Tipos base ─────────────────────────────────────────────────────────────
interface ControlledProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
}
export interface InputControlledProps<T extends FieldValues>
  extends Omit<InputProps, 'name' | 'type'>, ControlledProps<T> {}

const sizeStyles: Record<InputSize, string> = {
  sm: 'h-7 px-2 text-xs',
  md: 'h-8 px-2.5 text-sm',
  lg: 'h-10 px-3 text-base',
  xl: 'h-12 px-3 text-base',
};

function RequiredFieldLabel({
  children,
  required,
  ...props
}: React.ComponentProps<typeof FieldLabel> & { required?: boolean }) {
  return (
    <FieldLabel {...props}>
      <span>{children}</span>
      {required && (
        <span className="text-destructive" aria-hidden="true">
          *
        </span>
      )}
    </FieldLabel>
  );
}

export interface InputProps extends React.ComponentProps<'input'> {
  sizeInput?: InputSize;
  iconPreffix?: React.ReactNode;
  iconSuffix?: React.ReactNode;
  message?: string;
  label?: string;
  orientation?: 'vertical' | 'horizontal' | 'responsive';
}

const Input = ({
  className,
  type,
  sizeInput = 'lg',
  iconPreffix,
  iconSuffix,
  message,
  label,
  name,
  required,
  orientation = 'vertical',
  ...props
}: InputProps) => {
  return (
    <Field data-invalid={!!message} orientation={orientation}>
      {label && (
        <RequiredFieldLabel htmlFor={name} required={required}>
          {label}
        </RequiredFieldLabel>
      )}
      <div className="relative flex items-center">
        {iconPreffix && (
          <span className="absolute left-2.5 flex items-center justify-center pointer-events-none text-muted-foreground  ">
            {iconPreffix}
          </span>
        )}
        <input
          id={name}
          name={name}
          type={type}
          aria-invalid={!!message}
          aria-required={required || undefined}
          className={cn(
            'w-full min-w-0 rounded-lg border border-input bg-transparent py-1 text-base transition-colors outline-none',
            'file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
            'placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
            'disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50',
            'aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20',
            'md:text-sm dark:bg-input/30 dark:disabled:bg-input/80',
            'dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40',
            sizeStyles[sizeInput],
            iconPreffix && 'pl-9',
            iconSuffix && 'pr-9',
            className
          )}
          {...props}
        />

        {iconSuffix && (
          <span className="absolute right-2.5 flex items-center justify-center ">
            {iconSuffix}
          </span>
        )}
      </div>

      {message && (
        <FieldError className="flex items-center gap-1 mt-1">
          <AlertCircle className="w-3 h-3" />
          {message}
        </FieldError>
      )}
    </Field>
  );
};

const InputPassword = ({ ...props }: InputProps) => {
  const [show, setShow] = React.useState(false);
  const EyeIcon = show ? EyeOff : Eye;
  return (
    <Input
      type={show ? 'text' : 'password'}
      iconSuffix={
        <button
          type="button"
          onClick={() => setShow((prev) => !prev)}
          className="hover:text-foreground transition-colors focus:outline-none flex items-center justify-center p-1 cursor-pointer"
        >
          <EyeIcon className="size-4" />
        </button>
      }
      {...props}
    />
  );
};

// ─── InputPhone ─────────────────────────────────────────────────────
function InputPhone<T extends FieldValues>({
  name,
  control,
  ...props
}: InputControlledProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const display = formatPhone(field.value ?? '');
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const raw = e.target.value.replace(/\D/g, '').slice(0, 11);
          field.onChange(raw);
        };

        return (
          <Input
            {...props}
            type="text"
            inputMode="tel"
            name={field.name}
            value={display}
            onChange={handleChange}
            onBlur={field.onBlur}
            ref={field.ref}
            message={props.message ?? fieldState.error?.message}
          />
        );
      }}
    />
  );
}

// ─── InputCPF ─────────────────────────────────────────────────────
function InputCPF<T extends FieldValues>({
  name,
  control,
  ...props
}: InputControlledProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const display = formatCPF(field.value ?? '');
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const raw = e.target.value.replace(/\D/g, '').slice(0, 14);
          field.onChange(raw);
        };
        return (
          <Input
            {...props}
            type="text"
            inputMode="numeric"
            name={field.name}
            value={display}
            onChange={handleChange}
            onBlur={field.onBlur}
            ref={field.ref}
            message={props.message ?? fieldState.error?.message}
          />
        );
      }}
    />
  );
}

type InputSelectOption = { value: string; label: string };

type InputSelectPagination = {
  page: number;
  totalPages: number;
  totalRecords?: number;
  loading?: boolean;
  onPrevious: () => void;
  onNext: () => void;
};

function InputSelect<T extends FieldValues>({
  name,
  control,
  message,
  contentPortalContainer,
  emptyMessage = 'Nenhum item encontrado.',
  onSelectOption,
  onSearchChange,
  pagination,
  selectedOption,
  ...props
}: InputControlledProps<T> & {
  options: InputSelectOption[];
  contentPortalContainer?: React.ComponentProps<
    typeof ComboboxContent
  >['portalContainer'];
  emptyMessage?: string;
  onSelectOption?: (option: InputSelectOption | null) => void;
  onSearchChange?: (value: string) => void;
  pagination?: InputSelectPagination;
  serverSideSearch?: boolean;
  selectedOption?: InputSelectOption | null;
}) {
  return (
    <Field className="relative">
      <RequiredFieldLabel htmlFor={name} required={props.required}>
        {props.label}
      </RequiredFieldLabel>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Combobox
            items={props.options}
            filter={props.serverSideSearch ? null : undefined}
            value={
              selectedOption ??
              props.options.find((r) => String(r.value) === String(field.value)) ??
              null
            }
            onValueChange={(item: any) => {
              field.onChange(item?.value || '');
              onSelectOption?.(item ?? null);
            }}
            onInputValueChange={(value: string, eventDetails: any) => {
              if (
                eventDetails.reason === 'input-change' ||
                eventDetails.reason === 'input-clear'
              ) {
                onSearchChange?.(value);
              }
            }}
            itemToStringValue={(item: any) => item?.label || ''}
          >
            <ComboboxInput
              disabled={props.disabled}
              showClear
              placeholder={props.placeholder}
              aria-required={props.required || undefined}
            />
            <ComboboxContent portalContainer={contentPortalContainer}>
              <ComboboxEmpty>
                {pagination?.loading ? 'Carregando...' : emptyMessage}
              </ComboboxEmpty>
              <ComboboxList>
                {(item: any) => (
                  <ComboboxItem key={item.value} value={item}>
                    {item.label}
                  </ComboboxItem>
                )}
              </ComboboxList>
              {pagination && (
                <div
                  className="flex items-center justify-between gap-2 border-t px-2 py-1.5"
                  onMouseDown={(event) => event.preventDefault()}
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={(event) => {
                      event.stopPropagation();
                      pagination.onPrevious();
                    }}
                    disabled={pagination.loading || pagination.page <= 0}
                    aria-label="Pagina anterior"
                  >
                    <ChevronLeft />
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    Pagina{' '}
                    {pagination.totalPages === 0 ? 0 : pagination.page + 1} de{' '}
                    {pagination.totalPages || 0}
                    {pagination.totalRecords !== undefined
                      ? ` (${pagination.totalRecords})`
                      : ''}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={(event) => {
                      event.stopPropagation();
                      pagination.onNext();
                    }}
                    disabled={
                      pagination.loading ||
                      pagination.totalPages === 0 ||
                      pagination.page >= pagination.totalPages - 1
                    }
                    aria-label="Proxima pagina"
                  >
                    <ChevronRight />
                  </Button>
                </div>
              )}
            </ComboboxContent>
          </Combobox>
        )}
      />

      {message && (
        <FieldError className="flex items-center gap-1 mt-1">
          <AlertCircle className="w-3 h-3" />
          {message}
        </FieldError>
      )}
    </Field>
  );
}

// ─── InputCEP ─────────────────────────────────────────────────────
function InputCEP<T extends FieldValues>({
  name,
  control,
  ...props
}: InputControlledProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const display = formatCEP(field.value ?? '');
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const raw = e.target.value.replace(/\D/g, '').slice(0, 8);
          field.onChange(raw);
        };

        return (
          <Input
            {...props}
            type="text"
            inputMode="numeric"
            name={field.name}
            value={display}
            onChange={handleChange}
            onBlur={field.onBlur}
            ref={field.ref}
            message={props.message ?? fieldState.error?.message}
          />
        );
      }}
    />
  );
}

// ─── InputDecimal ─────────────────────────────────────────────────────
function InputDecimal<T extends FieldValues>({
  name,
  control,
  ...props
}: InputControlledProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const display = field.value ?? '';
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const raw = formatDecimal(e.target.value);
          field.onChange(raw);
        };

        return (
          <Input
            {...props}
            type="text"
            inputMode="decimal"
            name={field.name}
            value={display}
            onChange={handleChange}
            onBlur={field.onBlur}
            ref={field.ref}
            message={props.message}
          />
        );
      }}
    />
  );
}

export {
  Input,
  InputPassword,
  InputPhone,
  InputCPF,
  InputCEP,
  InputDecimal,
  InputSelect,
};