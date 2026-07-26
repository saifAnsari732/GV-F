"use client";
import React, { useState } from 'react';
import EnquiryModal from './EnquiryModal';
import { FaRocket, FaArrowRight } from 'react-icons/fa';

const EnrollButton = ({ className, variant, text = "Enroll Now — Free!" }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {variant === 'footer' ? (
        <button onClick={() => setIsOpen(true)} className={className}>
           <FaArrowRight className="text-[10px] text-red-500" /> {text}
        </button>
      ) : (
        <button onClick={() => setIsOpen(true)} className={className}>
          <FaRocket /> {text}
        </button>
      )}
      <EnquiryModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default EnrollButton;
