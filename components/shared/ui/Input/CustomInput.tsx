import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";

interface CustomInputProps<TFormValues extends FieldValues> {
  name: Path<TFormValues>;
  label: string;
  placeholder?: string;
  errorMessage: string | undefined;
  maxLength?: number;
  register: UseFormRegister<TFormValues>;
  registerOptions?: RegisterOptions<TFormValues, Path<TFormValues>>;
}

export function CustomInput<TFormValues extends FieldValues>({
  name,
  errorMessage,
  placeholder,
  label,
  maxLength,
  register,
  registerOptions,
}: CustomInputProps<TFormValues>) {
  return (
    <div className="relative grid gap-3">
      <Label htmlFor={name}>{label}</Label>
      <Input
        maxLength={maxLength}
        id={name}
        {...register(name, registerOptions)}
        placeholder={placeholder}
        className={errorMessage ? "border-red-600" : ""}
      />
      {errorMessage && <InputError message={errorMessage} />}
    </div>
  );
}

interface InputErrorProps {
  message?: string | null;
}

export function InputError({ message }: InputErrorProps) {
  if (!message) return null;

  return (
    <div className="absolute z-10 -bottom-10 left-0 w-full flex flex-col items-center">
      <div className="relative w-full">
        <div className="bg-red-600 text-white text-sm px-2 py-1 rounded shadow">
          {message}
        </div>

        <div
          className="absolute bottom-full left-4 -translate-x-1/2 translate-y-0.5 w-0 h-0
             border-l-6 border-l-transparent
             border-r-6 border-r-transparent
             border-b-6 border-b-red-600"
        />
      </div>
    </div>
  );
}
