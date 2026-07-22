<?php

namespace App\Services;

use App\Models\Product;
use App\Models\ProductImage;
use App\Support\CloudinaryUploader;
use Illuminate\Http\UploadedFile;
use Illuminate\Validation\ValidationException;

class ProductImageService
{
    public function upload(Product $product, UploadedFile $file, bool $isFeatured = false): ProductImage
    {
        $uploaded = CloudinaryUploader::upload($file, 'products/'.$product->id);

        $nextPosition = (int) $product->images()->max('position') + 1;
        $isFirstImage = $product->images()->doesntExist();

        $image = $product->images()->create([
            'url' => $uploaded['url'],
            'public_id' => $uploaded['public_id'],
            'position' => $nextPosition,
            'is_featured' => $isFeatured || $isFirstImage,
        ]);

        if ($image->is_featured) {
            $this->setFeatured($product, $image);
        }

        return $image;
    }

    public function delete(Product $product, ProductImage $image): void
    {
        if ($product->images()->count() <= 1) {
            throw ValidationException::withMessages([
                'image' => 'A product must have at least one image. Upload a replacement before deleting the last one.',
            ]);
        }

        if ($image->public_id) {
            CloudinaryUploader::delete($image->public_id);
        }

        $wasFeatured = $image->is_featured;
        $image->delete();

        if ($wasFeatured) {
            $next = $product->images()->orderBy('position')->first();
            if ($next) {
                $this->setFeatured($product, $next);
            }
        }
    }

    public function setFeatured(Product $product, ProductImage $image): void
    {
        $product->images()->update(['is_featured' => false]);
        $image->update(['is_featured' => true]);
    }

    public function reorder(Product $product, array $items): void
    {
        $ownedImageIds = $product->images()->pluck('id')->all();

        foreach ($items as $item) {
            if (! in_array($item['id'], $ownedImageIds, true)) {
                continue;
            }
            ProductImage::whereKey($item['id'])->update(['position' => $item['position']]);
        }
    }

    public function deleteAllForProduct(Product $product): void
    {
        foreach ($product->load('images')->images as $image) {
            if ($image->public_id) {
                CloudinaryUploader::delete($image->public_id);
            }
        }
    }
}