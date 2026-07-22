<?php

namespace Database\Seeders;

use App\Models\Slide;
use Illuminate\Database\Seeder;

class SlideSeeder extends Seeder
{
    public function run(): void
    {
        $heroSlides = [
            ['title' => 'New Season, Considered', 'subtitle' => 'Hand-finished silhouettes in rare fabrics.', 'cta_label' => 'Shop Now'],
            ['title' => 'The Winter Edit', 'subtitle' => 'Khaddar, karandi, and marina — built to last.', 'cta_label' => 'Explore Collection'],
            ['title' => 'The Shawl Edit', 'subtitle' => 'One layer, endlessly worn.', 'cta_label' => 'Shop Now'],
        ];

        foreach ($heroSlides as $index => $slide) {
            Slide::create([
                'type' => 'hero',
                'title' => $slide['title'],
                'subtitle' => $slide['subtitle'],
                'image_url' => "https://picsum.photos/seed/hero-{$index}/1600/900",
                'link_url' => '/collections',
                'cta_label' => $slide['cta_label'],
                'position' => $index,
                'is_active' => true,
            ]);
        }

        foreach (range(1, 8) as $index) {
            Slide::create([
                'type' => 'marquee',
                'title' => "Category Spotlight {$index}",
                'image_url' => "https://picsum.photos/seed/marquee-{$index}/600/800",
                'link_url' => '/collections',
                'position' => $index,
                'is_active' => true,
            ]);
        }
    }
}
