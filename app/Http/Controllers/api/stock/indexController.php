<?php

namespace App\Http\Controllers\api\stock;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Stock;
use App\Models\Product;
use App\Models\Customer;
use Illuminate\Support\Facades\Log;
class indexController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $user = request()->user();
        $stocks = Stock::where('userId',$user->id)->with('customer')->with('product')->get();
        return response()->json([
            'success'=>true,
            'data'=>$stocks
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $user = request()->user();
        $products = Product::where('userId',$user->id)->get();
        $stockTypes = [['id'=>Stock::ENTRY,'name'=>'Giriş'],['id'=>Stock::OUT,'name'=>'Çıkış']];
        return response()->json([
            'success'=>true,
            'products'=>$products,
            'stockTypes'=>$stockTypes
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $user = request()->user();
        $all = $request->all(); 
        $all['userId'] = $user->id;
        $create = Stock::create($all);
        if($create){
            if($all['isStock']){
                if($all['stockType'] == Stock::ENTRY){
                    Product::where('userId',$user->id)->where('id',$all['productId'])->increment('stock',$all['quantity']);
                }
                if($all['stockType'] == Stock::OUT){
                    Product::where('userId',$user->id)->where('id',$all['productId'])->decrement('stock',$all['quantity']);
                }
            }
            return response()->json(['success'=>true,'message'=>'Stok işlemi eklendi.']);   
        }
        else 
        {
            return response()->json(['success'=>false,'message'=>'İşlem Tamamlanamadı']);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $user = request()->user();
        $control = Stock::where('id',$id)->where('userId',$user->id)->count();
        if($control == 0){ return response()->json(['success'=>true,'message'=>'Stok size ait degil']);}
        $data = Stock::where('id',$id)->first();
        $accounts = Customer::where('userId',$user->id)->where('customerType',$data->stockType)->get();
        $products = Product::where('userId',$user->id)->get();
        $stockTypes = [['id'=>Stock::ENTRY,'name'=>'Giriş'],['id'=>Stock::OUT,'name'=>'Çıkış']];
        return response()->json([
            'success'=>true,
            'products'=>$products,
            'stockTypes'=>$stockTypes,
            'accounts'=>$accounts,
            'data'=>$data
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $user = request()->user();
        $all = $request->all(); 
        $control = Stock::where('id',$id)->where('userId',$user->id)->count();
        if($control == 0){ return response()->json(['success'=>true,'message'=>'Stok size ait degil']);}
        $data = Stock::where('id',$id)->first();
     
        if($all['isStock']){
            if($all['quantity'] != $data->quantity){
            if($all['stockType'] == Stock::ENTRY){
                if($all['quantity'] < $data->quantity){
                    $variable = $data->quantity - $all['quantity'];
                    Product::where('userId',$user->id)->where('id',$all['productId'])->decrement('stock',$variable);
                }
                else 
                {
                    $variable = $all['quantity'] - $data->quantity;
                    Product::where('userId',$user->id)->where('id',$all['productId'])->increment('stock',$variable);
                }
          
            }
            if($all['stockType'] == Stock::OUT){
                if($all['quantity'] < $data->quantity){
                    $variable = $data->quantity - $all['quantity'];
                    Product::where('userId',$user->id)->where('id',$all['productId'])->increment('stock',$variable);
                }
                else 
                {
                    $variable = $all['quantity'] - $data->quantity;
                    Product::where('userId',$user->id)->where('id',$all['productId'])->decrement('stock',$variable);
                }

            }
            }
        }
        else 
        {
            Product::where('userId',$user->id)->where('id',$all['productId'])->decrement('stock',$data->quantity);
        }
        unset($all['_method']);
        $update = Stock::where('id',$id)->update($all);
        if($update){
            return response()->json(['success'=>true,'message'=>'İşlem Düzenlendi']);   
        }
        else 
        {
            return response()->json(['success'=>false,'message'=>'İşlem Tamamlanamadı']);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $user = request()->user();
        $control = Stock::where('id',$id)->where('userId',$user->id)->count();
        if($control == 0){ return response()->json(['success'=>true,'message'=>'Stok size ait degil']);}
        $data = Stock::where('id',$id)->first();
        if($data->isStock){
            if($data->stockType == Stock::ENTRY){
                Product::where('id',$data->productId)->decrement('stock',$data->quantity);
            }
            else 
            {
                Product::where('id',$data->productId)->increment('stock',$data->quantity);
            }
        }
        Stock::where('id',$id)->delete();
        return response()->json([
            'success'=>true,
            'message'=>'İşlem Başarı ile gerçekleşti'
        ]);
        
    }

    public function getCustomer(Request $request){
        $user = request()->user();
        $customers = Customer::where('customerType',$request->stockType)->get();
        return response()->json([
            'success'=>true,
            'customers'=>$customers
        ]);
    }
}
