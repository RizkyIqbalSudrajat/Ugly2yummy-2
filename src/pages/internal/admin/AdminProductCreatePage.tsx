import React from 'react';
import { AdminProductForm } from '../../../components/internal/AdminProductForm';

export const AdminProductCreatePage: React.FC = () => {
  return <AdminProductForm isEdit={false} />;
};
