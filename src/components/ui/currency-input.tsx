import * as React from "react";
import { useState, useEffect } from "react";
import { Input } from "./input";
import { cn } from "@/lib/utils";

export interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
    value?: number;
    onChange?: (value: number) => void;
    prefix?: string;
}

export const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
    ({ value, onChange, prefix = "Rp", className, onBlur, ...props }, ref) => {
        const [displayValue, setDisplayValue] = useState("");

        // Update display value when external value changes
        useEffect(() => {
            if (value === undefined || value === null) {
                setDisplayValue("");
                return;
            }

            // If the number is 0 and we haven't typed anything, maybe show empty or "0"
            if (value === 0 && !displayValue) {
                setDisplayValue("");
            } else {
                setDisplayValue(new Intl.NumberFormat("id-ID").format(value));
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [value]);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            let rawString = e.target.value.replace(/[^0-9]/g, ""); // Allow only digits
            rawString = rawString.replace(/^0+/, ""); // Remove leading zeros

            if (rawString === "") {
                setDisplayValue("");
                onChange?.(0);
                return;
            }

            const numValue = parseInt(rawString, 10);
            setDisplayValue(new Intl.NumberFormat("id-ID").format(numValue));
            onChange?.(numValue);
        };

        const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
            if (displayValue === "") {
                onChange?.(0);
            }
            onBlur?.(e);
        };

        return (
            <div className="relative">
                {prefix && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm select-none">
                        {prefix}
                    </span>
                )}
                <Input
                    {...props}
                    ref={ref}
                    type="text"
                    className={cn(prefix ? "pl-9" : "", className)}
                    value={displayValue}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
            </div>
        );
    }
);

CurrencyInput.displayName = "CurrencyInput";
