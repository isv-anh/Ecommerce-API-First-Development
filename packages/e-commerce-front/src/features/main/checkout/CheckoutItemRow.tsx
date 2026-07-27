"use client";

import { useEffect } from "react";
import {
  useGetProductVariantByIdSuspense,
  useGetProductByProductIdSuspense,
} from "@e-commerce/api-client/endpoints/product";
import Image from "next/image";

const formatPrice = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
};

export interface ResolvedCheckoutItem {
  productId: string;
  productVariantId: string;
  productName: string;
  variantName: string;
  price: number;
  quantity: number;
  thumbnail: string;
}

interface CheckoutItemRowProps {
  item: { productVariantId: string; quantity: number };
  onResolved: (item: ResolvedCheckoutItem) => void;
}

export const CheckoutItemRow = ({ item, onResolved }: CheckoutItemRowProps) => {
  const { data: variant } = useGetProductVariantByIdSuspense(
    item.productVariantId,
  );
  const { data: product } = useGetProductByProductIdSuspense(variant.productId);

  const attrLabel = variant.variantAttributes
    ? variant.variantAttributes
        .map((a: any) => `${a.attributeName}: ${a.attributeValue}`)
        .join(", ")
    : "";

  const imageUrl = variant.thumbnailUrl || product.thumbnailUrl || "";

  useEffect(() => {
    onResolved({
      productId: product.productId,
      productVariantId: item.productVariantId,
      productName: product.productName,
      variantName: attrLabel,
      price: variant.price,
      quantity: item.quantity,
      thumbnail: imageUrl,
    });
  }, [
    item.productVariantId,
    item.quantity,
    product.productId,
    product.productName,
    attrLabel,
    variant.price,
    imageUrl,
    onResolved,
  ]);

  return (
    <div className="flex items-center gap-3 py-2.5 hover:bg-slate-100/50 rounded-lg px-1 transition-colors">
      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.productName}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-[10px] text-slate-400 font-medium">
            N/A
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-slate-900 truncate">
          {product.productName}
        </h4>
        {attrLabel && (
          <p className="text-xs text-slate-500 truncate">{attrLabel}</p>
        )}
        <span className="inline-block mt-0.5 text-xs font-semibold px-2 py-0.5 rounded bg-slate-200/60 text-slate-700">
          x{item.quantity}
        </span>
      </div>

      <div className="text-right font-bold text-sm text-indigo-600">
        {formatPrice(variant.price * item.quantity)}
      </div>
    </div>
  );
};
