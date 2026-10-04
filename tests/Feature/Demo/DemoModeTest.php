<?php

use App\Models\Config\SystemSetting;
use App\Models\Demo\DemoVisitor;
use App\Models\Users\User;
use Inertia\Testing\AssertableInertia as Assert;

function enableDemo(): void
{
    config([
        'demo.enabled' => true,
        'demo.leads_token' => 'chave-vendas',
        'demo.users' => [
            'admin' => 'admin@demo.test',
            'consultor' => 'consultor@demo.test',
            'cliente' => 'cliente@demo.test',
            'produtor' => 'produtor@demo.test',
        ],
    ]);
}

function demoUsers(): array
{
    return [
        'admin' => User::factory()->admin()->create(['email' => 'admin@demo.test']),
        'consultor' => User::factory()->consultor()->create(['email' => 'consultor@demo.test']),
        'cliente' => User::factory()->cliente()->create(['email' => 'cliente@demo.test']),
        'produtor' => User::factory()->produtor()->create(['email' => 'produtor@demo.test']),
    ];
}

function enterDemo($test, array $data = []): void
{
    $test->post(route('demo.access'), array_merge([
        'name' => 'Paula Interessada',
        'email' => 'paula@empresa.com',
        'consent' => true,
    ], $data));
}

describe('Modo demonstração desligado (padrão)', function () {

    it('keeps the regular password login and hides the demo props', function () {
        $this->get(route('login'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Auth/Authentication/Login')
                ->where('demo', null));
    });

    it('does not accept demo access or role switching', function () {
        $this->post(route('demo.access'), ['name' => 'X', 'email' => 'x@x.com', 'consent' => true])->assertNotFound();
        $this->get(route('demo.visitors.export', ['token' => 'qualquer']))->assertNotFound();
    });

    it('does not block changes', function () {
        $this->actingAs(User::factory()->admin()->create())
            ->post(route('admin.brand-identity.update'), ['name' => 'Nova Marca', 'color_primary' => '#112233', 'color_secondary' => '#445566'])
            ->assertSessionHasNoErrors()
            ->assertSessionMissing('warning');

        expect(SystemSetting::where('key', 'brand_name')->value('value'))->toBe('Nova Marca');
    });
});

describe('Modo demonstração ligado', function () {

    beforeEach(function () {
        enableDemo();
        $this->users = demoUsers();
    });

    it('shows the demo access page instead of the password login', function () {
        $this->get(route('login'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('Demo/Access'));
    });

    it('registers the visitor and enters as admin', function () {
        enterDemo($this);

        $this->assertAuthenticatedAs($this->users['admin']);
        $visitor = DemoVisitor::sole();
        expect($visitor->name)->toBe('Paula Interessada')
            ->and($visitor->email)->toBe('paula@empresa.com')
            ->and($visitor->visits)->toBe(1)
            ->and($visitor->roles_viewed)->toBe(['admin']);
    });

    it('accepts a phone instead of an e-mail and requires one of them plus consent', function () {
        $this->post(route('demo.access'), ['name' => 'Sem contato', 'consent' => true])
            ->assertSessionHasErrors(['email', 'phone']);
        $this->post(route('demo.access'), ['name' => 'Sem aceite', 'phone' => '(41) 99999-0000'])
            ->assertSessionHasErrors('consent');

        enterDemo($this, ['email' => null, 'phone' => '(41) 99999-0000']);

        expect(DemoVisitor::sole()->phone)->toBe('41999990000');
    });

    it('counts a returning visitor once', function () {
        enterDemo($this);
        $this->post(route('logout'));
        enterDemo($this, ['name' => 'Paula I.']);

        $visitor = DemoVisitor::sole();
        expect($visitor->visits)->toBe(2)->and($visitor->name)->toBe('Paula I.');
    });

    it('switches between the four roles', function (string $role) {
        enterDemo($this);

        $this->post(route('demo.switch', $role))->assertRedirect(route('dashboard'));

        $this->assertAuthenticatedAs($this->users[$role]);
        expect(DemoVisitor::sole()->roles_viewed)->toContain($role);
    })->with(['admin', 'consultor', 'cliente', 'produtor']);

    it('shares the demo props with the pages', function () {
        enterDemo($this);

        $this->get(route('admin.brand-identity.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('demo.enabled', true)
                ->where('demo.role', 'admin')
                ->where('demo.visitor.name', 'Paula Interessada')
                ->has('demo.roles', 4));
    });

    it('blocks creating, editing and deleting on the server', function () {
        enterDemo($this);

        $this->from(route('admin.brand-identity.index'))
            ->post(route('admin.brand-identity.update'), ['name' => 'Invasor', 'color_primary' => '#000000', 'color_secondary' => '#000000'])
            ->assertRedirect(route('admin.brand-identity.index'))
            ->assertSessionHas('warning');
        $this->delete(route('admin.brand-identity.logo.destroy'))->assertSessionHas('warning');
        $this->get(route('admin.concessionaria.create'))->assertRedirect()->assertSessionHas('warning');
        $this->postJson(route('admin.brand-identity.update'), [])->assertForbidden()->assertJson(['demo' => true]);

        expect(SystemSetting::where('key', 'brand_name')->exists())->toBeFalse();
    });

    it('still allows reading pages and counts page views', function () {
        enterDemo($this);

        $this->get(route('admin.brand-identity.index'))->assertOk();
        $this->get(route('admin.concessionaria.index'))->assertOk();

        expect(DemoVisitor::sole()->page_views)->toBe(2);
    });

    it('sends password flows to the demo access page', function () {
        $this->get(route('password.request'))->assertRedirect(route('login'));
    });

    it('exports visitors as CSV only with the sales token', function () {
        enterDemo($this);

        $this->get(route('demo.visitors.export', ['token' => 'errada']))->assertNotFound();

        $response = $this->get(route('demo.visitors.export', ['token' => 'chave-vendas']));
        $response->assertOk();
        expect($response->streamedContent())
            ->toContain('Nome;E-mail;Telefone')
            ->toContain('"Paula Interessada";paula@empresa.com');
    });
});
