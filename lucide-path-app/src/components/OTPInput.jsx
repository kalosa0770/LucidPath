import React, { useEffect, useRef } from "react";

/**
 * OTPInput - small, reusable per-digit OTP input component
 * Props:
 *  - length (number) - how many digits
 *  - value (string) - current otp value
 *  - onChange (fn)  - called with new otp string
 */
const OTPInput = ({ length = 6, value = "", onChange = () => {}, onComplete = () => {}, autoFocus = false }) => {
  // create ref for each input
  const inputsRef = useRef(Array.from({ length }, () => React.createRef()));

  // keep a local representation as array
  useEffect(() => {
    // ensure value length doesn't exceed length
    if (value.length > length) onChange(value.slice(0, length));
  }, [value, length, onChange]);

  const focusInput = (index) => {
    const ref = inputsRef.current[index];
    if (ref && ref.current) ref.current.focus();
  };

  const handleChange = (e, index) => {
    const raw = e.target.value || "";
    // only digits
    const filtered = raw.replace(/[^0-9]/g, "");
    if (!filtered) return;

    // if user typed/pasted multiple digits, split them
    const chars = filtered.split("");
    const current = value.split("");

    for (let i = 0; i < chars.length && index + i < length; i++) {
      current[index + i] = chars[i];
    }

    const newVal = current.slice(0, length).join("");
    onChange(newVal);

    // if filled, call onComplete
    if (newVal.length === length) {
      try { onComplete(newVal); } catch { /* ignore */ }
    }

    // move focus to next empty
    const nextIndex = Math.min(length - 1, index + chars.length);
    focusInput(nextIndex);
  };

  const handleKeyDown = (e, index) => {
    const key = e.key;

    if (key === "Backspace") {
      const current = value.split("");
      if (current[index]) {
        // delete current char
        current[index] = "";
        onChange(current.join(""));
        // keep focus
      } else {
        // move to previous
        if (index > 0) {
          focusInput(index - 1);
        }
      }
      return;
    }

    if (key === "ArrowLeft" && index > 0) {
      focusInput(index - 1);
      return;
    }

    if (key === "ArrowRight" && index < length - 1) {
      focusInput(index + 1);
      return;
    }
  };

  const handlePaste = (e, index) => {
    e.preventDefault();
    const paste = (e.clipboardData || window.clipboardData).getData("text");
    const filtered = paste.replace(/[^0-9]/g, "");
    if (!filtered) return;

    const current = value.split("");
    for (let i = 0; i < filtered.length && index + i < length; i++) {
      current[index + i] = filtered[i];
    }

    const newVal = current.slice(0, length).join("");
    onChange(newVal);
    if (newVal.length === length) {
      try { onComplete(newVal); } catch { /* ignore */ }
    }
  };

  // ensure autofocus to first input
  useEffect(() => {
    if (autoFocus && inputsRef.current[0] && inputsRef.current[0].current) {
      inputsRef.current[0].current.focus();
    }
  }, [autoFocus]);

  const characters = value.split("");

  return (
    <div className="flex gap-3 justify-center">
      {Array.from({ length }, (_, i) => (
        <input
          key={i}
          ref={inputsRef.current[i]}
          value={characters[i] || ""}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onPaste={(e) => handlePaste(e, i)}
          inputMode="numeric"
          maxLength={1}
          className="w-12 h-12 text-xl text-center bg-transparent text-white border-0 border-b-2 border-gray-600 focus:border-gold focus:outline-none transition"
          aria-label={`otp-digit-${i + 1}`}
        />
      ))}
    </div>
  );
};

export default OTPInput;
