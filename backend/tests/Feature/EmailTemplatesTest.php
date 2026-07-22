<?php

use App\Mail\NewsletterMail;
use App\Mail\OrderConfirmationMail;
use App\Mail\PasswordResetMail;
use App\Mail\ShippingUpdateMail;
use App\Mail\WelcomeMail;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;

it('renders the order confirmation email', function () {
    $order = Order::factory()->has(OrderItem::factory()->count(2), 'items')->create();

    $html = (new OrderConfirmationMail($order))->render();

    expect($html)->toContain($order->order_number);
});

it('renders the shipping update email', function () {
    $order = Order::factory()->create();

    $html = (new ShippingUpdateMail($order, 'Shipped', 'Dispatched via TCS.'))->render();

    expect($html)->toContain('Shipped')->toContain('Dispatched via TCS.');
});

it('renders the password reset email', function () {
    $user = User::factory()->create();

    $html = (new PasswordResetMail($user, 'https://example.test/reset/token123'))->render();

    expect($html)->toContain('https://example.test/reset/token123');
});

it('renders the welcome email', function () {
    $user = User::factory()->create();

    $html = (new WelcomeMail($user))->render();

    expect($html)->toContain($user->name);
});

it('renders the newsletter email', function () {
    $html = (new NewsletterMail('New Season, Considered', '<p>Shop the winter edit.</p>', ctaUrl: 'https://example.test', ctaLabel: 'Shop Now'))->render();

    expect($html)->toContain('New Season, Considered')->toContain('Shop the winter edit.');
});
