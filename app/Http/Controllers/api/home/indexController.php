<?php

namespace App\Http\Controllers\api\home;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Category;
use App\Models\Stock;
class indexController extends Controller
{
    public function index(Request $request){
        $user = request()->user();
        $totalCustomer = Customer::where('userId',$user->id)->count();
        $totalProduct  = Product::where('userId',$user->id)->count();
        $totalCategory = Product::where('userId',$user->id)->count();
        $totalStock = Stock::where('userId',$user->id)->count();
        $total = [
            'product'=>$totalProduct,
            'category'=>$totalCategory,
            'stock'=>$totalStock,
            'customer'=>$totalCustomer
        ];

        $availableProduct = Product::where('userId',$user->id)->where('stock','>',0)->count();
        $unavailableProduct = Product::where('userId',$user->id)->where('stock',0)->count();

        $stock = [
            'available'=>$availableProduct,
            'unavailable'=>$unavailableProduct
        ];

        $chartStock = Product::where('userId',$user->id)->orderBy('stock','desc')->limit(6)->select(['id','modelCode','stock'])->get(); 

        $returnArray = [];
        for($i = 5;$i>=0;$i--){
            $date = date("Y-m-d",strtotime("- ".$i." Day",time()));
            $returnArray[] = ['date'=>$date,'count'=>Stock::where('userId',$user->id)->where('date',$date)->sum('quantity')];
        
        }

        return response()->json([
            'success'=>true,
            'total'=>$total,
            'stock'=>$stock,
            'chartStock' => $chartStock,
            'stockTransaction'=>$returnArray
        ]);
    }
}
