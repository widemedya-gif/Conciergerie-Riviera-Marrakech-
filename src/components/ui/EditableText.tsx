import React, { useState, useEffect, useRef } from "react";
import { useStore } from "@/src/store/useStore";
import { cn } from "@/src/lib/utils";

interface EditableTextProps {
  value: string;
  onChange?: (newValue: string) => void;
  as?: React.ElementType;
  className?: string;
  multiline?: boolean;
}

export const EditableText: React.FC<EditableTextProps> = ({
  value,
  onChange,
  as: Component = "span",
  className,
  multiline = false,
}) => {
  const isAdminMode = useStore((state) => state.isAdminMode);
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (onChange && currentValue !== value) {
      onChange(currentValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) {
      handleBlur();
    }
    if (e.key === "Escape") {
      setCurrentValue(value);
      setIsEditing(false);
    }
  };

  if (!isAdminMode) {
    return <Component className={className}>{value}</Component>;
  }

  if (isEditing) {
    const InputComponent = multiline ? "textarea" : "input";
    return (
      <InputComponent
        ref={inputRef as any}
        value={currentValue}
        onChange={(e) => setCurrentValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cn(
          "bg-luxury-gold/10 border border-luxury-gold rounded px-1 outline-none focus:ring-2 focus:ring-luxury-gold w-full",
          className
        )}
        style={{ minWidth: "100px" }}
      />
    );
  }

  return (
    <Component
      onClick={() => setIsEditing(true)}
      className={cn(
        "cursor-pointer hover:ring-2 hover:ring-luxury-gold/50 hover:bg-luxury-gold/5 rounded px-1 transition-all relative group",
        className
      )}
      title="Click to edit"
    >
      {currentValue}
      <span className="absolute -top-2 -right-2 bg-luxury-gold text-white text-[8px] px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
        EDIT
      </span>
    </Component>
  );
};
