<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HomeTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_see_the_welcome_page()
    {
        $response = $this->get('/');

        $response->assertOk();
    }

    public function test_authenticated_users_are_redirected_to_suppliers()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->get('/');

        $response->assertRedirect(route('suppliers.index'));
    }
}
