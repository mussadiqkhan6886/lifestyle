export interface VariantInput {
    id?: number | string;
    label: string;
    sku?: string;
    stock: number | string;
    price: number | string;
    onSale?: boolean | string;
    salePrice?: number | string | null;
    existingImages?: string[];
    imageIndices?: number[] | number;
    imageNames?: string[];
}

export interface orderVariantMap extends VariantInput {
    images: string[]
        product: {
          id: number,
          name: string,
          slug: string
        }
      }

export interface UploadedFileRef {
    file: Express.Multer.File;
    index: number;
    url: string;
}