import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import adminApi from '../../services/adminApi';
import toast from 'react-hot-toast';

const initialForm = {
  name: '',
  description: '',
  price: '',
  category: 'Electronics',
  stock: 0,
  featured: false
};

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(Boolean(id));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;

    const loadProduct = async () => {
      try {
        const { data } =
          await adminApi.getProduct(id);

        const product =
          data.product || data;

        setForm({
          name: product.name || '',
          description:
            product.description || '',
          price: product.price ?? '',
          category:
            product.category ||
            'Electronics',
          stock: product.stock ?? 0,
          featured:
            Boolean(product.featured)
        });

        setPreview(product.image || '');
      } catch (error) {
        console.error(error);

        toast.error(
          error.response?.data?.error ||
            'Failed to load product'
        );
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value
    }));
  };

  const handleImageChange = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error(
        'Please select a valid image'
      );

      event.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(
        'Image must be smaller than 5MB'
      );

      event.target.value = '';
      return;
    }

    setImageFile(file);

    const objectUrl =
      URL.createObjectURL(file);

    setPreview(objectUrl);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!id && !imageFile) {
      toast.error(
        'Please select a product image'
      );
      return;
    }

    if (!form.name.trim()) {
      toast.error(
        'Product name is required'
      );
      return;
    }

    if (!form.description.trim()) {
      toast.error(
        'Product description is required'
      );
      return;
    }

    if (
      form.price === '' ||
      Number(form.price) < 0
    ) {
      toast.error(
        'Please enter a valid price'
      );
      return;
    }

    if (
      form.stock === '' ||
      Number(form.stock) < 0
    ) {
      toast.error(
        'Please enter a valid stock'
      );
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append(
        'name',
        form.name.trim()
      );

      formData.append(
        'description',
        form.description.trim()
      );

      formData.append(
        'price',
        String(form.price)
      );

      formData.append(
        'category',
        form.category
      );

      formData.append(
        'stock',
        String(form.stock)
      );

      formData.append(
        'featured',
        String(form.featured)
      );

      if (imageFile) {
        formData.append(
          'image',
          imageFile
        );
      }

      if (id) {
        await adminApi.updateProduct(
          id,
          formData
        );
      } else {
        await adminApi.createProduct(
          formData
        );
      }

      toast.success(
        id
          ? 'Product updated successfully'
          : 'Product created successfully'
      );

      navigate('/admin/products');
    } catch (error) {
      console.error(
        'Product save error:',
        error
      );

      toast.error(
        error.response?.data?.error ||
          'Failed to save product'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        Loading product...
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Catalog control
        </p>

        <h2 className="text-3xl font-display">
          {id
            ? 'Edit Product'
            : 'Add Product'}
        </h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-5 rounded-[14px] border border-[var(--color-border)] bg-surface p-6 shadow-sm sm:grid-cols-2"
      >
        <label className="sm:col-span-2">
          <span className="mb-1 block">
            Product Name
          </span>

          <input
            type="text"
            required
            value={form.name}
            onChange={(event) =>
              updateField(
                'name',
                event.target.value
              )
            }
            className="admin-input"
            placeholder="Enter product name"
          />
        </label>

        <label className="sm:col-span-2">
          <span className="mb-1 block">
            Description
          </span>

          <textarea
            required
            value={form.description}
            onChange={(event) =>
              updateField(
                'description',
                event.target.value
              )
            }
            className="admin-input min-h-28"
            placeholder="Enter product description"
          />
        </label>

        <label>
          <span className="mb-1 block">
            Price
          </span>

          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={form.price}
            onChange={(event) =>
              updateField(
                'price',
                event.target.value
              )
            }
            className="admin-input"
            placeholder="0.00"
          />
        </label>

        <label>
          <span className="mb-1 block">
            Category
          </span>

          <select
            value={form.category}
            onChange={(event) =>
              updateField(
                'category',
                event.target.value
              )
            }
            className="admin-input"
          >
            <option value="Electronics">
              Electronics
            </option>

            <option value="Clothing">
              Clothing
            </option>

            <option value="Books">
              Books
            </option>

            <option value="Home">
              Home
            </option>

            <option value="Beauty">
              Beauty
            </option>

            <option value="Sports">
              Sports
            </option>

            <option value="Shoes">
              Shoes
            </option>

            <option value="Ceiling Fan">
              Ceiling Fan
            </option>

            <option value="Other">
              Other
            </option>
          </select>
        </label>

        <label className="sm:col-span-2">
          <span className="mb-1 block">
            Product Image
          </span>

          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            onChange={handleImageChange}
            className="admin-input"
          />

          <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
            JPG, JPEG, PNG, WEBP or GIF.
            Maximum size: 5MB.
          </p>

          {preview && (
            <div className="mt-4">
              <img
                src={preview}
                alt="Product preview"
                className="h-40 w-40 rounded-lg border object-cover"
              />
            </div>
          )}
        </label>

        <label>
          <span className="mb-1 block">
            Stock
          </span>

          <input
            type="number"
            required
            min="0"
            value={form.stock}
            onChange={(event) =>
              updateField(
                'stock',
                event.target.value
              )
            }
            className="admin-input"
          />
        </label>

        <label className="flex items-center gap-2 self-end">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(event) =>
              updateField(
                'featured',
                event.target.checked
              )
            }
          />

          <span>Featured Product</span>
        </label>

        <div className="flex gap-3 sm:col-span-2">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary disabled:opacity-50"
          >
            {saving
              ? 'Saving...'
              : id
                ? 'Save Changes'
                : 'Create Product'}
          </button>

          <button
            type="button"
            disabled={saving}
            onClick={() =>
              navigate('/admin/products')
            }
            className="rounded-lg border px-4 py-2 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}