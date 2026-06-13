<?php

namespace App\Http\Controllers\Admin\Produtor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Produtor\UpdateProducerFeeRuleRequest;
use App\Models\Produtor\ProducerProfile;
use App\Services\Produtor\StoreProducerFeeRuleService;

class ProducerFeeRuleController extends Controller
{
    public function __construct(
        private StoreProducerFeeRuleService $service,
    ) {}

    public function update(UpdateProducerFeeRuleRequest $request, ProducerProfile $producerProfile)
    {
        $this->service->handle(
            $producerProfile,
            (float) $request->validated('fee_percent'),
            now()->toDateTimeString(),
            null,
            $request->validated('notes'),
        );

        return back()->with('success', 'Taxa de administração atualizada com sucesso.');
    }
}
