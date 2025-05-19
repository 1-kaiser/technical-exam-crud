<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class CustomerController extends Controller
{
    private $elasticSearch_url;

    public function __construct()
    {   
        $this->elasticSearch_url = env('ELASTICSEARCH_URL', 'http://searcher:9200/customers/_doc');
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->query('search');
        $query = Customer::query();

        // Search filter
        if ($search) {
            
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%$search%")
                ->orWhere('last_name', 'like', "%$search%")
                ->orWhere('email', 'like', "%$search%");
            });
        }

        return response()->json($query->paginate(10));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:customers,email',
            'contact_number' => 'nullable|string|max:20',
        ]);

        $customer = Customer::create($validated);

        $this->syncToES($customer);

        return response()->json($customer, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Customer $customer)
    {
        return response()->json($customer);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Customer $customer)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:customers,email,' . $customer->id,
            'contact_number' => 'nullable|string|max:20',
        ]);

        $customer->update($validated);

        $this->syncToES($customer);

        return response()->json($customer);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Customer $customer)
    {
        $customer->delete();

        $this->deleteFromES($customer->id);

        return response()->json(null, 204);
    }

    private function syncToES(Customer $customer) {
        Http::put("{$this->elasticSearch_url}/{$customer->id}", $customer->toArray());
    }

    private function deleteFromES($id) {
        Http::delete("{$this->elasticSearch_url}/{$id}");
    }
}
