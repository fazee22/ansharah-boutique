<?php

namespace App\Services;

use App\Models\Slide;
use App\Support\CloudinaryUploader;
use Illuminate\Http\UploadedFile;

class SlideService
{
    public function upload(string $type, UploadedFile $file, array $attributes = []): Slide
    {
        $uploaded = CloudinaryUploader::upload($file, "slides/{$type}");

        $nextPosition = (int) Slide::type($type)->max('position') + 1;

        return Slide::create([
            'type' => $type,
            'title' => $attributes['title'] ?? null,
            'subtitle' => $attributes['subtitle'] ?? null,
            'link_url' => $attributes['link_url'] ?? null,
            'cta_label' => $attributes['cta_label'] ?? null,
            'image_url' => $uploaded['url'],
            'image_public_id' => $uploaded['public_id'],
            'position' => $nextPosition,
            'is_active' => true,
        ]);
    }

    public function update(Slide $slide, array $attributes): Slide
    {
        $slide->update($attributes);

        return $slide->fresh();
    }

    public function delete(Slide $slide): void
    {
        if ($slide->image_public_id) {
            CloudinaryUploader::delete($slide->image_public_id);
        }
        $slide->delete();
    }

    public function toggleActive(Slide $slide): Slide
    {
        $slide->update(['is_active' => ! $slide->is_active]);

        return $slide->fresh();
    }

    public function reorder(string $type, array $items): void
    {
        $ownedIds = Slide::type($type)->pluck('id')->all();

        foreach ($items as $item) {
            if (! in_array($item['id'], $ownedIds, true)) {
                continue;
            }
            Slide::whereKey($item['id'])->update(['position' => $item['position']]);
        }
    }
}