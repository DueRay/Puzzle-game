import React from 'react';

export const Input = (field) => (
  <div>
      <input {...field.input} type={field.type}/>
  </div>
);