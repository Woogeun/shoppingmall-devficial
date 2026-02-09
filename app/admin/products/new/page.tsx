import { ProductForm } from "../ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">상품 등록</h1>
      <ProductForm />
    </div>
  );
}
