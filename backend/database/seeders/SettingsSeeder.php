<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

/** Seeds sensible defaults for every settings group so the admin Settings pages never load empty/blank on first boot. */
class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        Setting::setMany('website', [
            'siteName' => 'Verrière',
            'logoUrl' => null,
            'faviconUrl' => null,
            'footerText' => 'Considered luxury, made to last.',
            'contactEmail' => 'hello@verriere.test',
            'contactPhone' => '+92 300 1234567',
            'contactAddress' => 'Karachi, Pakistan',
            'copyrightText' => '© '.date('Y').' Verrière. All rights reserved.',
            'socialLinks' => [
                ['platform' => 'instagram', 'url' => 'https://instagram.com'],
                ['platform' => 'facebook', 'url' => 'https://facebook.com'],
                ['platform' => 'youtube', 'url' => 'https://youtube.com'],
            ],
        ]);

        Setting::setMany('whatsapp', [
            'number' => '923001234567',
            'defaultMessage' => "Hi! I'd like to know more about your collections.",
            'floatingButtonEnabled' => true,
            'orderButtonEnabled' => true,
            'enabled' => true,
        ]);

        Setting::setMany('seo', [
            'defaultTitle' => 'Verrière — Considered luxury, made to last',
            'defaultDescription' => 'A premium fashion destination for considered, contemporary luxury.',
            'keywords' => ['luxury fashion', 'pakistani designer wear', 'lawn', 'khaddar'],
            'ogImageUrl' => null,
            'twitterCard' => 'summary_large_image',
            'robotsIndexable' => true,
            'sitemapEnabled' => true,
        ]);

        Setting::setMany('homepage', [
            'showFeaturedCollections' => true,
            'showNewArrivals' => true,
            'showSale' => true,
            'showNewsletter' => true,
            'showInstagram' => true,
            'instagramHandle' => '@verriere',
        ]);

        Setting::setMany('marquee', [
            'speed' => 40,
            'direction' => 'left',
            'pauseOnHover' => true,
            'mobileSwipeEnabled' => true,
        ]);

        Setting::setMany('sale', [
            'bannerHeadline' => 'Up to 30% off select edits',
            'bannerSubtext' => 'A considered edit of past-season pieces, reduced while they last.',
            'defaultPercentage' => 25,
            'timerEnabled' => false,
            'timerEndsAt' => null,
        ]);
    }
}
