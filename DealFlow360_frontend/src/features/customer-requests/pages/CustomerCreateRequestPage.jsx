import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '../../../components/ui/PageHeader/PageHeader';
import { Button } from '../../../components/ui/Button/Button';
import { useToast } from '../../../components/feedback/Toast';
import { CustomerRequestForm } from '../components/CustomerRequestForm';
import { useCustomerRequest } from '../hooks/useCustomerRequest';
import { productService } from '../../products/services/productService';

export const CustomerCreateRequestPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { createRequest, saving } = useCustomerRequest();

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      try {
        const response = await productService.getProducts({ pageSize: 100, status: 'ACTIVE' });
        setProducts(response.data || []);
      } catch (err) {
        console.warn('[CustomerCreateRequestPage] Master products unavailable for selection.');
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  const handleSubmit = async (formData) => {
    const isSubmit = formData.isSubmit;
    const result = await createRequest(formData, isSubmit);
    if (result.success) {
      toast.success(
        isSubmit
          ? `Requirement request "${result.data.title}" submitted to sales workflow!`
          : `Requirement request "${result.data.title}" saved as draft.`
      );
      navigate(`/customer/requests/${result.data.id || result.data.requestId}`);
    } else {
      toast.error(result.error || 'Failed to create requirement request.');
    }
  };

  return (
    <div className="space-y-6 text-left max-w-4xl">
      <PageHeader
        title="Submit Commercial Requirement Request"
        description="Specify product attributes, required unit volume, and delivery specs for commercial evaluation."
        actions={
          <Button
            variant="outline"
            leftIcon={ArrowLeft}
            onClick={() => navigate('/customer/requests')}
          >
            Back to Requests
          </Button>
        }
      />

      <CustomerRequestForm
        products={products}
        onSubmit={handleSubmit}
        isSubmitting={saving}
        isEdit={false}
        onCancel={() => navigate('/customer/requests')}
      />
    </div>
  );
};

export default CustomerCreateRequestPage;
